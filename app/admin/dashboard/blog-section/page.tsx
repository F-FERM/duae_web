"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  AlignLeft,
  Calendar,
  Clock,
  GripVertical,
  ImageIcon,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Tag,
  Trash2,
  Type,
  UploadCloud,
  User,
  X,
  Hash,
  ExternalLink,
  Link as LinkIcon,
  Globe,
  FileText,
  Layers,
  CircleDot,
} from "lucide-react";
import api from "@/lib/axios";
import { fileUpload } from "@/app/api/admin/upload/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type BlogContentType = "heading" | "subheading" | "paragraph" | "list" | "quote" | "image";

interface InlineLinkItem {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface BlogContent {
  id: string;
  type: BlogContentType;
  content: string;
  items: string[];
  isNumbered: boolean;
  level: number;
  inlineLinks: InlineLinkItem[];
}

interface Author {
  name: string;
  avatar: string;
  bio: string;
}

interface Seo {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

interface BlogPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContent[];
  image: string;
  detailImages: string[];
  date: string;
  category: string;
  tags: string[];
  relatedPosts: string[];
  author: Author;
  seo: Seo;
  isPublished: boolean;
  readTime: number;
  order: number;
}

interface Blog extends BlogPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORY_OPTIONS = [
  "Joinery",
  "Fit-Out",
  "Renovation",
  "Upholstery",
  "Turnkey",
  "Metal Works",
];

const CONTENT_TYPES: BlogContentType[] = [
  "heading",
  "subheading",
  "paragraph",
  "list",
  "quote",
  "image",
];

const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
];

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const EMPTY_CONTENT: BlogContent = {
  id: "",
  type: "paragraph",
  content: "",
  items: [],
  isNumbered: false,
  level: 2,
  inlineLinks: [],
};

const EMPTY_FORM: BlogPayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: [],
  image: "",
  detailImages: [],
  date: "",
  category: "Joinery",
  tags: [],
  relatedPosts: [],
  author: { name: "Wood World Decor", avatar: "", bio: "" },
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
  isPublished: true,
  readTime: 5,
  order: 0,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data
  ) {
    return String(err.response.data.message);
  }
  return fallback;
}

function withStableIds(content: BlogContent[] | undefined | null): BlogContent[] {
  if (!content) return [];
  return content.map((block) => ({
    ...block,
    id: block.id || makeId(),
    inlineLinks: block.inlineLinks || [],
  }));
}

function getLinkTypeIcon(type: string) {
  const found = LINK_TYPES.find((t) => t.value === type);
  if (found) {
    const IconComponent = found.icon;
    return <IconComponent className="h-3 w-3" />;
  }
  return <LinkIcon className="h-3 w-3" />;
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingDetail, setUploadingDetail] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [relatedInput, setRelatedInput] = useState("");
  const [listItemInput, setListItemInput] = useState("");
  const [showContentForm, setShowContentForm] = useState(false);
  const [contentDraft, setContentDraft] = useState<BlogContent>(EMPTY_CONTENT);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  // Inline link states for content block
  const [blockLinkText, setBlockLinkText] = useState("");
  const [blockLinkUrl, setBlockLinkUrl] = useState("");
  const [blockLinkType, setBlockLinkType] = useState("page");
  const [blockLinkNewTab, setBlockLinkNewTab] = useState(false);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const contentFormRef = useRef<HTMLDivElement>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<Blog[] | { data?: Blog[]; blogs?: Blog[]; items?: Blog[] }>("/blogs", { params: { limit: "100" } });
      const raw: Blog[] = Array.isArray(res.data)
        ? res.data
        : (res.data as { data?: Blog[]; blogs?: Blog[]; items?: Blog[] }).data ??
          (res.data as { data?: Blog[]; blogs?: Blog[]; items?: Blog[] }).blogs ??
          (res.data as { data?: Blog[]; blogs?: Blog[]; items?: Blog[] }).items ??
          [];
      const sorted = [...raw].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setBlogs(sorted);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to load blogs"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (showContentForm && contentFormRef.current) {
      contentFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showContentForm, editingContentId]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: blogs.length });
    setTagInput("");
    setKeywordInput("");
    setRelatedInput("");
    setModalOpen(true);
  };

  const openEditModal = async (id: string) => {
    setEditingId(id);
    setModalOpen(true);
    setFetchingBlog(true);

    try {
      const res = await api.get<Blog>(`/blogs/${id}`);
      const data = res.data;
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: withStableIds(data.content),
        image: data.image || "",
        detailImages: data.detailImages || [],
        date: data.date || "",
        category: data.category || "Joinery",
        tags: data.tags || [],
        relatedPosts: data.relatedPosts || [],
        author: data.author || EMPTY_FORM.author,
        seo: data.seo || EMPTY_FORM.seo,
        isPublished: data.isPublished ?? true,
        readTime: data.readTime ?? 5,
        order: data.order ?? 0,
      });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to load blog details"));
      setModalOpen(false);
    } finally {
      setFetchingBlog(false);
    }
  };

  const closeModal = () => {
    if (submitting || uploadingThumb || uploadingDetail || uploadingAvatar) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowContentForm(false);
    setEditingContentId(null);
    setContentDraft(EMPTY_CONTENT);
    setBlockLinkText("");
    setBlockLinkUrl("");
    setBlockLinkType("page");
    setBlockLinkNewTab(false);
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingThumb(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, image: result.url }));
      toast.success("Thumbnail uploaded");
    } catch {
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploadingThumb(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  };

  const handleDetailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      setUploadingDetail(true);
      const uploads = await Promise.all(
        Array.from(files).map((file) => fileUpload(file))
      );
      setForm((prev) => ({
        ...prev,
        detailImages: [...prev.detailImages, ...uploads.map((u) => u.url)],
      }));
      toast.success("Detail images uploaded");
    } catch {
      toast.error("Failed to upload detail images");
    } finally {
      setUploadingDetail(false);
      if (detailInputRef.current) detailInputRef.current.value = "";
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const result = await fileUpload(file);
      setForm((prev) => ({
        ...prev,
        author: { ...prev.author, avatar: result.url },
      }));
      toast.success("Author avatar uploaded");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (form.tags.includes(value)) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };

  const addKeyword = () => {
    const value = keywordInput.trim();
    if (!value) return;
    if (form.seo.keywords.includes(value)) return;
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords: [...prev.seo.keywords, value] },
    }));
    setKeywordInput("");
  };

  const addRelatedPost = () => {
    const value = relatedInput.trim();
    if (!value) return;
    if (form.relatedPosts.includes(value)) return;
    setForm((prev) => ({ ...prev, relatedPosts: [...prev.relatedPosts, value] }));
    setRelatedInput("");
  };

  const openAddContent = () => {
    setContentDraft({ ...EMPTY_CONTENT, id: makeId(), inlineLinks: [] });
    setEditingContentId(null);
    setListItemInput("");
    setBlockLinkText("");
    setBlockLinkUrl("");
    setBlockLinkType("page");
    setBlockLinkNewTab(false);
    setShowContentForm(true);
  };

  const openEditContent = (index: number) => {
    const block = form.content[index];
    const safeBlock = block.id ? { ...block, inlineLinks: block.inlineLinks || [] } : { ...block, id: makeId(), inlineLinks: block.inlineLinks || [] };
    setContentDraft(safeBlock);
    setEditingContentId(safeBlock.id);
    setListItemInput("");
    setBlockLinkText("");
    setBlockLinkUrl("");
    setBlockLinkType("page");
    setBlockLinkNewTab(false);
    setShowContentForm(true);
  };

  const saveContentDraft = () => {
    if (contentDraft.type === "list") {
      if (contentDraft.items.length === 0) {
        toast.error("Add at least one list item");
        return;
      }
    } else if (contentDraft.type === "image") {
      if (!contentDraft.content.trim()) {
        toast.error("Image URL is required");
        return;
      }
    } else if (!contentDraft.content.trim()) {
      toast.error("Content is required");
      return;
    }

    // Ensure inlineLinks are preserved
    const draftToSave = {
      ...contentDraft,
      inlineLinks: contentDraft.inlineLinks || [],
    };

    setForm((prev) => {
      const existingIndex = editingContentId
        ? prev.content.findIndex((b) => b.id === editingContentId)
        : -1;

      let newContent: BlogContent[];
      if (existingIndex !== -1) {
        newContent = prev.content.map((b, i) => 
          i === existingIndex ? draftToSave : b
        );
      } else {
        newContent = [...prev.content, draftToSave];
      }

      return { ...prev, content: newContent };
    });
    
    setShowContentForm(false);
    setEditingContentId(null);
    setContentDraft(EMPTY_CONTENT);
    setBlockLinkText("");
    setBlockLinkUrl("");
    setBlockLinkType("page");
    setBlockLinkNewTab(false);
    toast.success("Content block saved");
  };

  // FIXED: Inline link functions for content block - properly update contentDraft
  const addInlineLinkToBlock = () => {
    if (!blockLinkText.trim() || !blockLinkUrl.trim()) {
      toast.error("Text and URL are required");
      return;
    }

    // Check for duplicate text in this block
    const duplicate = contentDraft.inlineLinks.some(
      (link) => link.text.toLowerCase() === blockLinkText.trim().toLowerCase()
    );

    if (duplicate) {
      toast.error(`"${blockLinkText.trim()}" already has a link in this block`);
      return;
    }

    // CRITICAL FIX: Create a new array with the new link and update contentDraft
    const updatedLinks = [
      ...contentDraft.inlineLinks,
      {
        text: blockLinkText.trim(),
        url: blockLinkUrl.trim(),
        type: blockLinkType,
        openInNewTab: blockLinkNewTab,
        position: contentDraft.inlineLinks.length,
      },
    ];

    setContentDraft((prev) => ({
      ...prev,
      inlineLinks: updatedLinks,
    }));

    // Clear the input fields
    setBlockLinkText("");
    setBlockLinkUrl("");
    setBlockLinkType("page");
    setBlockLinkNewTab(false);
    toast.success(`Inline link added: "${blockLinkText.trim()}"`);
  };

  const removeInlineLinkFromBlock = (index: number) => {
    setContentDraft((prev) => ({
      ...prev,
      inlineLinks: prev.inlineLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.excerpt.trim()) {
      return toast.error("Title and excerpt are required");
    }
    if (!form.image.trim()) {
      return toast.error("Thumbnail image is required");
    }
    if (!form.date.trim()) {
      return toast.error("Publication date is required");
    }
    if (form.content.length === 0) {
      return toast.error("Add at least one content block");
    }

    // Ensure inlineLinks are preserved in the payload
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
      content: form.content.map((block) => ({
        type: block.type,
        content: block.content,
        items: block.items || [],
        isNumbered: block.isNumbered || false,
        level: block.level || 0,
        // CRITICAL: Preserve inlineLinks - make sure they are included
        inlineLinks: block.inlineLinks || [],
        id: block.id,
      })),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      setSubmitting(true);
      if (editingId) {
        await api.patch(`/blogs/${editingId}`, payload);
        toast.success("Blog updated");
      } else {
        await api.post("/blogs", payload);
        toast.success("Blog created");
      }
      closeModal();
      fetchBlogs();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(
          err,
          editingId ? "Failed to update blog" : "Failed to create blog"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const togglePublished = async (blog: Blog) => {
    try {
      setTogglingId(blog._id);
      await api.patch(`/blogs/${blog._id}`, { isPublished: !blog.isPublished });
      setBlogs((prev) =>
        prev.map((item) =>
          item._id === blog._id ? { ...item, isPublished: !item.isPublished } : item
        )
      );
      toast.success(!blog.isPublished ? "Blog published" : "Blog unpublished");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update publish status"));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/blogs/${deleteTarget._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("Blog deleted");
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete blog"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-4 py-6 sm:px-7 sm:py-9 md:px-9 lg:px-12 lg:py-12 2xl:px-16">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
            Blog Management
          </h1>
          <p className="mt-1.5 text-sm text-[#666666]">
            Create and manage blog posts for the website.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="h-11 w-full gap-2 rounded-[14px] bg-[#EA580C] text-white hover:bg-[#EA580C] sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <div className="mx-auto mt-6 max-w-[1600px] sm:mt-7 lg:mt-8">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#EA580C]" />
          </div>
        ) : blogs.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-2.5 p-12 text-center">
              <ImageIcon className="h-8 w-8 text-[#C2410C]/50" />
              <p className="text-[15px] font-medium text-[#333333]">No blogs yet</p>
              <p className="text-[13px] text-[#888888]">Create your first blog post to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="relative h-[180px] w-full bg-[#F1E4D8] sm:h-[200px]">
                  {blog.image ? (
                    <Image
                      src={resolveImage(blog.image)}
                      alt={blog.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-7 w-7 text-[#C2410C]/40" />
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    {blog.category}
                  </div>
                  <button
                    onClick={() => togglePublished(blog)}
                    disabled={togglingId === blog._id}
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${
                      blog.isPublished
                        ? "bg-[#16A34A]/90 text-white"
                        : "bg-black/40 text-white/80"
                    }`}
                  >
                    {togglingId === blog._id
                      ? "..."
                      : blog.isPublished
                        ? "Published"
                        : "Draft"}
                  </button>
                </div>

                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 text-[11px] text-[#888888]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {blog.readTime} min
                    </span>
                    {blog.content.some(b => b.inlineLinks && b.inlineLinks.length > 0) && (
                      <span className="flex items-center gap-1 text-[#EA580C]">
                        <Hash className="h-3 w-3" />
                        Links
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-[16px] font-semibold text-[#111111]">
                    {blog.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#666666]">
                    {blog.excerpt}
                  </p>
                  <p className="mt-2 text-[11px] text-[#999]">/{blog.slug}</p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => openEditModal(blog._id)}
                      variant="outline"
                      className="h-9 flex-1 gap-1.5 rounded-[10px] border-[#E4C9B4] text-[#C2410C] hover:bg-[#FFF4EC]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(blog)}
                      variant="outline"
                      className="h-9 w-9 rounded-[10px] border-[#F3D0D0] p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-5"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[94vh] w-full max-w-[820px] overflow-y-auto rounded-t-[24px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#111111] sm:text-2xl">
                  {editingId ? "Edit Blog" : "Create Blog"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {fetchingBlog ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#EA580C]" />
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  {/* Basic Info */}
                  <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                    <h3 className="text-sm font-semibold text-[#111111]">Basic Info</h3>
                    <div className="mt-3 space-y-3">
                      <Input
                        value={form.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title,
                            slug: editingId ? prev.slug : slugify(title),
                            seo: {
                              ...prev.seo,
                              metaTitle: prev.seo.metaTitle || title,
                            },
                          }));
                        }}
                        placeholder="Blog title"
                        className="h-11 rounded-[12px]"
                      />
                      <Input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        placeholder="url-slug"
                        className="h-11 rounded-[12px]"
                      />
                      <Textarea
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        placeholder="Short excerpt"
                        rows={3}
                        className="rounded-[12px]"
                      />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <Input
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          placeholder="05 Feb, 2026"
                          className="h-11 rounded-[12px]"
                        />
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="h-11 rounded-[12px] border border-[#E4E4E4] px-3 text-sm"
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          value={form.readTime}
                          onChange={(e) =>
                            setForm({ ...form, readTime: Number(e.target.value) })
                          }
                          placeholder="Read time"
                          className="h-11 rounded-[12px]"
                        />
                        <Input
                          type="number"
                          value={form.order}
                          onChange={(e) =>
                            setForm({ ...form, order: Number(e.target.value) })
                          }
                          placeholder="Order"
                          className="h-11 rounded-[12px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Blocks Section */}
                  <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[#111111]">Content Blocks</h3>
                      <Button
                        type="button"
                        onClick={openAddContent}
                        className="h-9 gap-1 rounded-[10px] bg-[#EA580C] text-xs text-white hover:bg-[#EA580C]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Block
                      </Button>
                    </div>

                    {showContentForm && (
                      <div
                        ref={contentFormRef}
                        className="mt-3 space-y-3 rounded-[12px] border-2 border-[#EA580C] bg-[#FFF8F3] p-3 shadow-sm"
                      >
                        <p className="text-xs font-medium text-[#C2410C]">
                          {editingContentId ? "Editing block" : "New block"}
                        </p>
                        <select
                          value={contentDraft.type}
                          onChange={(e) =>
                            setContentDraft((prev) => ({
                              ...prev,
                              type: e.target.value as BlogContentType,
                            }))
                          }
                          className="h-10 w-full rounded-[10px] border border-[#E4E4E4] px-3 text-sm"
                        >
                          {CONTENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        {(contentDraft.type === "heading" ||
                          contentDraft.type === "subheading") && (
                          <Input
                            type="number"
                            min={1}
                            max={4}
                            value={contentDraft.level}
                            onChange={(e) =>
                              setContentDraft((prev) => ({
                                ...prev,
                                level: Number(e.target.value),
                              }))
                            }
                            placeholder="Heading level (1-4)"
                            className="h-10 rounded-[10px]"
                          />
                        )}

                        {contentDraft.type === "image" ? (
                          <Input
                            value={contentDraft.content}
                            onChange={(e) =>
                              setContentDraft((prev) => ({
                                ...prev,
                                content: e.target.value,
                              }))
                            }
                            placeholder="Image URL"
                            className="h-10 rounded-[10px]"
                          />
                        ) : contentDraft.type !== "list" ? (
                          <Textarea
                            value={contentDraft.content}
                            onChange={(e) =>
                              setContentDraft((prev) => ({
                                ...prev,
                                content: e.target.value,
                              }))
                            }
                            placeholder="Block content"
                            rows={4}
                            className="rounded-[10px]"
                          />
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={listItemInput}
                                onChange={(e) => setListItemInput(e.target.value)}
                                placeholder="List item"
                                className="h-10 rounded-[10px]"
                              />
                              <Button
                                type="button"
                                onClick={() => {
                                  if (!listItemInput.trim()) return;
                                  setContentDraft((prev) => ({
                                    ...prev,
                                    items: [...prev.items, listItemInput.trim()],
                                  }));
                                  setListItemInput("");
                                }}
                                className="h-10 rounded-[10px] bg-[#EA580C] text-white hover:bg-[#EA580C]"
                              >
                                Add
                              </Button>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-[#666666]">
                              <input
                                type="checkbox"
                                checked={contentDraft.isNumbered}
                                onChange={(e) =>
                                  setContentDraft((prev) => ({
                                    ...prev,
                                    isNumbered: e.target.checked,
                                  }))
                                }
                              />
                              Numbered list
                            </label>
                            {contentDraft.items.map((item, index) => (
                              <div
                                key={`${item}-${index}`}
                                className="flex items-center justify-between rounded-[8px] bg-white px-3 py-2 text-sm"
                              >
                                <span>{item}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setContentDraft((prev) => ({
                                      ...prev,
                                      items: prev.items.filter((_, i) => i !== index),
                                    }))
                                  }
                                  className="text-[#DC2626]"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ================= INLINE LINKS FOR CONTENT BLOCK ================= */}
                        <div className="mt-3 border-t border-[#E4C9B4] pt-3">
                          <div className="flex items-center gap-[6px] mb-2">
                            <Label className="text-xs font-medium text-[#2A2A2A]">
                              <Hash className="inline h-3 w-3 mr-1" /> Inline Links for this block
                            </Label>
                            {contentDraft.inlineLinks && contentDraft.inlineLinks.length > 0 && (
                              <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
                                <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
                                {contentDraft.inlineLinks.length} link{contentDraft.inlineLinks.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-[10px] text-[#888888]">
                            Text within this block that will become clickable.
                          </p>

                          {/* Show existing inline links */}
                          {contentDraft.inlineLinks && contentDraft.inlineLinks.length > 0 && (
                            <div className="mb-2 space-y-1 max-h-[120px] overflow-y-auto">
                              {contentDraft.inlineLinks.map((link, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between rounded-[8px] bg-white px-3 py-2 text-xs border border-[#E4E4E4]"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-[#EA580C]">"{link.text}"</span>
                                    <span className="text-[#999]">→</span>
                                    <span className="text-[#666] truncate max-w-[120px]">{link.url}</span>
                                    {link.openInNewTab && (
                                      <span className="text-[9px] text-[#999] flex items-center gap-0.5">
                                        <ExternalLink className="h-2.5 w-2.5" /> new tab
                                      </span>
                                    )}
                                    <span className="text-[9px] text-[#999]">#{link.position}</span>
                                    {getLinkTypeIcon(link.type)}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeInlineLinkFromBlock(idx)}
                                    className="text-[#DC2626] hover:text-[#b91c1c]"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add inline link to block */}
                          <div className="grid grid-cols-1 gap-2 xs:grid-cols-4">
                            <div className="xs:col-span-1">
                              <Input
                                value={blockLinkText}
                                onChange={(e) => setBlockLinkText(e.target.value)}
                                placeholder="Text to link"
                                className="h-9 rounded-[8px] text-xs"
                              />
                            </div>
                            <div className="xs:col-span-1">
                              <Input
                                value={blockLinkUrl}
                                onChange={(e) => setBlockLinkUrl(e.target.value)}
                                placeholder="URL"
                                className="h-9 rounded-[8px] text-xs"
                              />
                            </div>
                            <div className="xs:col-span-1">
                              <select
                                value={blockLinkType}
                                onChange={(e) => setBlockLinkType(e.target.value)}
                                className="h-9 w-full rounded-[8px] border border-[#E4E4E4] px-2 text-xs bg-white"
                              >
                                {LINK_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="xs:col-span-1 flex gap-1">
                              <Button
                                type="button"
                                onClick={addInlineLinkToBlock}
                                className="h-9 flex-1 rounded-[8px] bg-[#EA580C] text-white hover:bg-[#EA580C] text-xs px-3"
                              >
                                <Plus className="h-3 w-3" /> Add
                              </Button>
                            </div>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Switch
                              checked={blockLinkNewTab}
                              onCheckedChange={setBlockLinkNewTab}
                              className="h-4 w-7"
                            />
                            <span className="text-[10px] text-[#666666]">Open in new tab</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                          <Button
                            type="button"
                            onClick={saveContentDraft}
                            className="h-9 rounded-[10px] bg-[#EA580C] text-white hover:bg-[#EA580C]"
                          >
                            Save Block
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowContentForm(false);
                              setEditingContentId(null);
                              setContentDraft(EMPTY_CONTENT);
                              setBlockLinkText("");
                              setBlockLinkUrl("");
                              setBlockLinkType("page");
                              setBlockLinkNewTab(false);
                            }}
                            className="h-9 rounded-[10px]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 space-y-2">
                      {form.content.length === 0 && (
                        <p className="text-xs text-[#888888]">No content blocks yet.</p>
                      )}
                      {form.content.map((block, index) => (
                        <div
                          key={block.id}
                          className={`flex items-start justify-between rounded-[10px] border bg-white p-3 transition-colors ${
                            showContentForm && editingContentId === block.id
                              ? "border-[#EA580C] ring-2 ring-[#EA580C]/30"
                              : "border-[#ECECEC]"
                          }`}
                        >
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-[#C2410C]">
                              {block.type}
                              {block.type === "heading" || block.type === "subheading"
                                ? ` • L${block.level}`
                                : ""}
                              {block.inlineLinks && block.inlineLinks.length > 0 && (
                                <span className="ml-2 text-[#EA580C]">
                                  • {block.inlineLinks.length} link{block.inlineLinks.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </p>
                            <p className="mt-1 line-clamp-2 text-sm text-[#333333]">
                              {block.type === "list"
                                ? block.items.join(", ")
                                : block.type === "image"
                                ? `[Image] ${block.content}`
                                : block.content}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => openEditContent(index)}
                              className="h-8 px-2 text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  content: prev.content.filter((_, i) => i !== index),
                                }));
                                if (editingContentId === block.id) {
                                  setShowContentForm(false);
                                  setEditingContentId(null);
                                  setContentDraft(EMPTY_CONTENT);
                                }
                                toast.success("Block removed");
                              }}
                              className="h-8 px-2 text-xs text-[#DC2626]"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                    <h3 className="text-sm font-semibold text-[#111111]">Media</h3>
                    <div className="mt-3 space-y-4">
                      <div>
                        <Label className="mb-2 flex items-center gap-1.5 text-sm">
                          <ImagePlus className="h-3.5 w-3.5" /> Thumbnail
                        </Label>
                        {form.image && (
                          <div className="relative mb-2 h-36 w-full overflow-hidden rounded-[12px] bg-[#F1E4D8]">
                            <Image
                              src={resolveImage(form.image)}
                              alt="Thumbnail"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        )}
                        <input
                          ref={thumbInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => thumbInputRef.current?.click()}
                          disabled={uploadingThumb}
                          className="h-10 gap-2 rounded-[10px] border-[#E4C9B4] text-[#C2410C]"
                        >
                          {uploadingThumb ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UploadCloud className="h-4 w-4" />
                          )}
                          Upload Thumbnail
                        </Button>
                      </div>

                      <div>
                        <Label className="mb-2 text-sm">Detail Images</Label>
                        {form.detailImages.length > 0 && (
                          <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {form.detailImages.map((img, index) => (
                              <div
                                key={`${img}-${index}`}
                                className="relative h-24 overflow-hidden rounded-[10px] bg-[#F1E4D8]"
                              >
                                <Image
                                  src={resolveImage(img)}
                                  alt={`Detail ${index + 1}`}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      detailImages: prev.detailImages.filter(
                                        (_, i) => i !== index
                                      ),
                                    }))
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <input
                          ref={detailInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleDetailUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => detailInputRef.current?.click()}
                          disabled={uploadingDetail}
                          className="h-10 gap-2 rounded-[10px] border-[#E4C9B4] text-[#C2410C]"
                        >
                          {uploadingDetail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UploadCloud className="h-4 w-4" />
                          )}
                          Upload Detail Images
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Author Section */}
                  <div className="rounded-[14px] border border-[#F0D9C8] bg-[#FFF8F3] p-4">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#111111]">
                      <User className="h-4 w-4" /> Author
                    </h3>
                    <div className="mt-3 space-y-3">
                      <Input
                        value={form.author.name}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            author: { ...prev.author, name: e.target.value },
                          }))
                        }
                        placeholder="Author name"
                        className="h-11 rounded-[12px] bg-white"
                      />
                      <Textarea
                        value={form.author.bio}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            author: { ...prev.author, bio: e.target.value },
                          }))
                        }
                        placeholder="Author bio"
                        rows={3}
                        className="rounded-[12px] bg-white"
                      />
                      {form.author.avatar && (
                        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#F1E4D8]">
                          <Image
                            src={resolveImage(form.author.avatar)}
                            alt="Author avatar"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="h-10 gap-2 rounded-[10px] border-[#E4C9B4] bg-white text-[#C2410C]"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UploadCloud className="h-4 w-4" />
                        )}
                        Upload Avatar
                      </Button>
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                    <h3 className="text-sm font-semibold text-[#111111]">SEO</h3>
                    <div className="mt-3 space-y-3">
                      <Input
                        value={form.seo.metaTitle}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, metaTitle: e.target.value },
                          }))
                        }
                        placeholder="Meta title"
                        className="h-11 rounded-[12px]"
                      />
                      <Textarea
                        value={form.seo.metaDescription}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            seo: { ...prev.seo, metaDescription: e.target.value },
                          }))
                        }
                        placeholder="Meta description"
                        rows={3}
                        className="rounded-[12px]"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="Add keyword"
                          className="h-10 rounded-[10px]"
                        />
                        <Button
                          type="button"
                          onClick={addKeyword}
                          className="h-10 rounded-[10px] bg-[#EA580C] text-white hover:bg-[#EA580C]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.seo.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="flex items-center gap-1 rounded-full bg-[#FFF4EC] px-3 py-1 text-xs text-[#C2410C]"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  seo: {
                                    ...prev.seo,
                                    keywords: prev.seo.keywords.filter((k) => k !== keyword),
                                  },
                                }))
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags & Related Posts */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[#111111]">
                        <Tag className="h-4 w-4" /> Tags
                      </h3>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tag"
                          className="h-10 rounded-[10px]"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          className="h-10 rounded-[10px] bg-[#EA580C] text-white hover:bg-[#EA580C]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.tags.map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 rounded-full bg-[#FFF4EC] px-3 py-1 text-xs text-[#C2410C]"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  tags: prev.tags.filter((t) => t !== tag),
                                }))
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[14px] border border-[#E4E4E4] p-4">
                      <h3 className="text-sm font-semibold text-[#111111]">Related Posts</h3>
                      <p className="mt-1 text-xs text-[#888888]">Add related blog slugs</p>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={relatedInput}
                          onChange={(e) => setRelatedInput(e.target.value)}
                          placeholder="blog-slug"
                          className="h-10 rounded-[10px]"
                        />
                        <Button
                          type="button"
                          onClick={addRelatedPost}
                          className="h-10 rounded-[10px] bg-[#EA580C] text-white hover:bg-[#EA580C]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.relatedPosts.map((slug) => (
                          <span
                            key={slug}
                            className="flex items-center gap-1 rounded-full bg-[#F4F1EA] px-3 py-1 text-xs text-[#666666]"
                          >
                            {slug}
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  relatedPosts: prev.relatedPosts.filter((s) => s !== slug),
                                }))
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Published Switch */}
                  <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">Published</p>
                      <p className="text-xs text-[#888888]">Show this blog on the website</p>
                    </div>
                    <Switch
                      checked={form.isPublished}
                      onCheckedChange={(checked) =>
                        setForm({ ...form, isPublished: checked })
                      }
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 xs:flex-row xs:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeModal}
                      disabled={submitting}
                      className="h-11 rounded-[12px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting || uploadingThumb || uploadingDetail || uploadingAvatar}
                      className="h-11 rounded-[12px] bg-[#EA580C] px-5 text-white hover:bg-[#EA580C]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingId ? (
                        "Update Blog"
                      ) : (
                        "Create Blog"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
            onClick={() => !deletingId && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-[#111111]">Delete Blog?</h3>
              <p className="mt-2 text-sm text-[#666666]">
                This will permanently delete &quot;{deleteTarget.title}&quot;.
              </p>
              <div className="mt-5 flex flex-col gap-2 xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!deletingId}
                  className="h-10 rounded-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-10 rounded-[10px] bg-[#DC2626] text-white hover:bg-[#DC2626]"
                >
                  {deletingId ? "Deleting..." : "Delete Blog"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}