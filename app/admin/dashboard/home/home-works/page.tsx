"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  AlignLeft,
  GripVertical,
  ImageIcon,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Type,
  UploadCloud,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { fileUpload } from "@/app/api/admin/upload/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type WorkCategory = "joinery" | "fit-out" | "renovation" | "turnkey";

interface WorkImage {
  _id?: string;
  url: string;
  title: string;
  description: string;
  category: WorkCategory;
  order: number;
}

interface WorksPayload {
  introText: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  featuredTitle: string;
  featuredDescription: string;
  featuredImage: string;
  featuredCategory: WorkCategory;
  images: WorkImage[];
  isActive: boolean;
}

interface Work extends WorksPayload {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

type CreateWorksPayload = WorksPayload[] | { works: WorksPayload[] };

const CATEGORY_OPTIONS: WorkCategory[] = [
  "joinery",
  "fit-out",
  "renovation",
  "turnkey",
];

const EMPTY_IMAGE: WorkImage = {
  url: "",
  title: "",
  description: "",
  category: "joinery",
  order: 0,
};

const EMPTY_FORM: WorksPayload = {
  introText: "",
  title: "Our Works",
  buttonText: "View Our Works",
  buttonLink: "/our-works",
  featuredTitle: "",
  featuredDescription: "",
  featuredImage: "",
  featuredCategory: "joinery",
  images: [],
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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

function parseWorksList(data: unknown): Work[] {
  if (Array.isArray(data)) {
    return data as Work[];
  }
  if (
    data &&
    typeof data === "object" &&
    "works" in data &&
    Array.isArray((data as { works: Work[] }).works)
  ) {
    return (data as { works: Work[] }).works;
  }
  if (data && typeof data === "object" && "title" in data) {
    return [data as Work];
  }
  return [];
}

function mapWorkToForm(work: Work): WorksPayload {
  return {
    introText: work.introText || "",
    title: work.title || "Our Works",
    buttonText: work.buttonText || "View Our Works",
    buttonLink: work.buttonLink || "/our-works",
    featuredTitle: work.featuredTitle || "",
    featuredDescription: work.featuredDescription || "",
    featuredImage: work.featuredImage || "",
    featuredCategory: work.featuredCategory || "joinery",
    images: [...(work.images || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    isActive: work.isActive ?? true,
  };
}

export default function HomeWorksAdminPage() {
  const [worksList, setWorksList] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WorksPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showImageForm, setShowImageForm] = useState(false);
  const [imageDraft, setImageDraft] = useState<WorkImage>(EMPTY_IMAGE);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const fetchHomeWorks = async () => {
    try {
      setLoading(true);
      const res = await api.get<CreateWorksPayload | Work>("/home-works");
      setWorksList(parseWorksList(res.data));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to load home works sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeWorks();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (work: Work) => {
    setEditingId(work._id ?? null);
    setForm(mapWorkToForm(work));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingFeatured || uploadingGalleryIndex !== null) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowImageForm(false);
    setEditingImageIndex(null);
    setImageDraft(EMPTY_IMAGE);
  };

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFeatured(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, featuredImage: result.url }));
      toast.success("Featured image uploaded");
    } catch (err: unknown) {
      const message =
        err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
          ? String(err.response.data.message)
          : "Failed to upload featured image";
      toast.error(message);
    } finally {
      setUploadingFeatured(false);
      if (featuredInputRef.current) featuredInputRef.current.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryIndex(editingImageIndex ?? -1);
      const result = await fileUpload(file);
      setImageDraft((prev) => ({ ...prev, url: result.url }));
      toast.success("Gallery image uploaded");
    } catch {
      toast.error("Failed to upload gallery image");
    } finally {
      setUploadingGalleryIndex(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const openAddImage = () => {
    setImageDraft({ ...EMPTY_IMAGE, order: form.images.length });
    setEditingImageIndex(null);
    setShowImageForm(true);
  };

  const openEditImage = (index: number) => {
    setImageDraft(form.images[index]);
    setEditingImageIndex(index);
    setShowImageForm(true);
  };

  const cancelImageForm = () => {
    setShowImageForm(false);
    setEditingImageIndex(null);
    setImageDraft(EMPTY_IMAGE);
  };

  const saveImageDraft = () => {
    if (!imageDraft.title.trim() || !imageDraft.description.trim() || !imageDraft.url) {
      toast.error("Gallery image title, description, and image are required");
      return;
    }

    setForm((prev) => {
      const images = [...prev.images];
      if (editingImageIndex !== null) {
        images[editingImageIndex] = imageDraft;
      } else {
        images.push(imageDraft);
      }
      return {
        ...prev,
        images: images.map((img, index) => ({ ...img, order: index })),
      };
    });
    cancelImageForm();
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i })),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.introText.trim()) {
      return toast.error("Title and intro text are required");
    }
    if (!form.featuredTitle.trim() || !form.featuredDescription.trim()) {
      return toast.error("Featured work title and description are required");
    }
    if (!form.featuredImage.trim()) {
      return toast.error("Featured image is required");
    }

    try {
      setSubmitting(true);

      const {  ...restForm } = form;
      const payload = {
        ...restForm,
        images: form.images.map(({ _id, createdAt, updatedAt, ...rest }: any) => rest),
      };

      if (editingId) {
        try {
          await api.patch(`/home-works`, payload);
        } catch {
          await api.patch("/home-works", payload);
        }
        toast.success("Home works section updated");
      } else {
        await api.post("/home-works", payload);
        toast.success("Home works section created");
      }

      closeModal();
      fetchHomeWorks();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(
          err,
          editingId ? "Failed to update home works section" : "Failed to create home works section"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (work: Work) => {
    if (!work._id) {
      try {
        await api.patch("/home-works", { isActive: !work.isActive });
        setWorksList((prev) =>
          prev.map((item) =>
            item.title === work.title ? { ...item, isActive: !item.isActive } : item
          )
        );
        toast.success(!work.isActive ? "Section activated" : "Section deactivated");
      } catch {
        toast.error("Failed to update status");
      }
      return;
    }

    try {
      setTogglingId(work._id);
      try {
        await api.patch(`/home-works/${work._id}`, { isActive: !work.isActive });
      } catch {
        await api.patch("/home-works", { isActive: !work.isActive });
      }
      setWorksList((prev) =>
        prev.map((item) =>
          item._id === work._id ? { ...item, isActive: !item.isActive } : item
        )
      );
      toast.success(!work.isActive ? "Section activated" : "Section deactivated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id ?? "singleton");
      if (deleteTarget._id) {
        try {
          await api.delete(`/home-works/${deleteTarget._id}`);
        } catch {
          await api.delete("/home-works");
        }
      } else {
        await api.delete("/home-works");
      }
      setWorksList((prev) =>
        prev.filter((item) =>
          deleteTarget._id ? item._id !== deleteTarget._id : item.title !== deleteTarget.title
        )
      );
      setDeleteTarget(null);
      toast.success("Home works section deleted");
    } catch {
      toast.error("Failed to delete home works section");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111111",
            color: "#fff",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#EA580C", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#DC2626", secondary: "#fff" },
          },
        }}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Home Works Section
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the Our Works section on the home page and works gallery.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Works Section
        </Button>
      </div>

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : worksList.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No home works content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage featured work and gallery images.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {worksList.map((work, index) => (
              <Card
                key={work._id || `${work.title}-${index}`}
                className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]"
              >
                <div className="relative h-[220px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[240px]">
                  {work.featuredImage ? (
                    <Image
                      src={resolveImage(work.featuredImage)}
                      alt={work.featuredTitle}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-[26px] w-[26px] text-[#C2410C]/40" />
                    </div>
                  )}

                  <div className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full bg-black/50 px-[10px] py-[5px] text-[11px] font-medium text-white backdrop-blur-sm">
                    <GripVertical className="h-[12px] w-[12px]" />
                    {work.featuredCategory}
                  </div>

                  <button
                    onClick={() => toggleActive(work)}
                    disabled={togglingId === work._id}
                    className={`absolute right-[12px] top-[12px] rounded-full px-[10px] py-[5px] text-[11px] font-medium backdrop-blur-sm transition-colors ${work.isActive
                        ? "bg-[#16A34A]/90 text-white"
                        : "bg-black/40 text-white/80"
                      }`}
                  >
                    {togglingId === work._id
                      ? "..."
                      : work.isActive
                        ? "Active"
                        : "Inactive"}
                  </button>
                </div>

                <CardContent className="p-[16px] sm:p-[20px]">
                  <h3 className="text-[18px] font-semibold text-[#111111]">{work.title}</h3>
                  <p className="mt-[8px] line-clamp-2 text-[13px] leading-[1.6] text-[#666666]">
                    {work.introText}
                  </p>
                  <p className="mt-[8px] text-[11px] text-[#999]">
                    {work.images?.length || 0} gallery images
                  </p>

                  <div className="mt-[12px] rounded-[12px] bg-[#FFF8F3] p-[12px]">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#C2410C]">
                      Featured
                    </p>
                    <p className="mt-[4px] text-[14px] font-semibold text-[#111111]">
                      {work.featuredTitle}
                    </p>
                  </div>

                  <div className="mt-[14px] flex gap-2">
                    <Button
                      onClick={() => openEditModal(work)}
                      variant="outline"
                      className="h-[36px] flex-1 gap-[6px] rounded-[10px] border-[#E4C9B4] text-[13px] font-medium text-[#C2410C] hover:bg-[#FFF4EC]"
                    >
                      <Pencil className="h-[13px] w-[13px]" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(work)}
                      variant="outline"
                      className="h-[36px] w-[36px] rounded-[10px] border-[#F3D0D0] p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[4px] sm:items-center sm:p-[20px]"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[640px] sm:rounded-[28px] sm:p-[32px] md:max-w-[720px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {editingId ? "Edit Home Works" : "Create Home Works"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Section Title
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Our Works"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <AlignLeft className="h-[13px] w-[13px]" /> Intro Text
                  </Label>
                  <Textarea
                    value={form.introText}
                    onChange={(e) => setForm({ ...form, introText: e.target.value })}
                    placeholder="With over 10 years of experience..."
                    rows={4}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>

                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Button Text
                    </Label>
                    <Input
                      value={form.buttonText}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Button Link
                    </Label>
                    <Input
                      value={form.buttonLink}
                      onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#F0D9C8] bg-[#FFF8F3] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                    Featured Work
                  </h3>

                  <div className="mt-[12px] space-y-[12px]">
                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Featured Title
                      </Label>
                      <Input
                        value={form.featuredTitle}
                        onChange={(e) =>
                          setForm({ ...form, featuredTitle: e.target.value })
                        }
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>

                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Featured Description
                      </Label>
                      <Textarea
                        value={form.featuredDescription}
                        onChange={(e) =>
                          setForm({ ...form, featuredDescription: e.target.value })
                        }
                        rows={3}
                        className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>

                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Featured Category
                      </Label>
                      <select
                        value={form.featuredCategory}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            featuredCategory: e.target.value as WorkCategory,
                          })
                        }
                        className="h-[46px] w-full rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] text-[14px] outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]/30 sm:h-[48px]"
                      >
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                        <ImagePlus className="h-[13px] w-[13px]" /> Featured Image
                      </Label>
                      {form.featuredImage && (
                        <div className="relative mb-[10px] h-[140px] w-full overflow-hidden rounded-[12px] bg-[#F1E4D8] sm:h-[160px]">
                          <Image
                            src={resolveImage(form.featuredImage)}
                            alt="Featured preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}
                      <input
                        ref={featuredInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => featuredInputRef.current?.click()}
                        disabled={uploadingFeatured}
                        className="h-[44px] w-full gap-[8px] rounded-[12px] border-[#E4C9B4] bg-white text-[13px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] sm:w-auto sm:px-[16px]"
                      >
                        {uploadingFeatured ? (
                          <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        ) : (
                          <UploadCloud className="h-[14px] w-[14px]" />
                        )}
                        {form.featuredImage ? "Replace Featured Image" : "Upload Featured Image"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Gallery Images
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddImage}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Image
                    </Button>
                  </div>

                  {showImageForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#F0D9C8] bg-[#FFF8F3] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingImageIndex !== null ? "Edit Gallery Image" : "New Gallery Image"}
                      </h4>

                      <Input
                        value={imageDraft.title}
                        onChange={(e) =>
                          setImageDraft((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Image title"
                        className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <Textarea
                        value={imageDraft.description}
                        onChange={(e) =>
                          setImageDraft((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Image description"
                        rows={3}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <select
                        value={imageDraft.category}
                        onChange={(e) =>
                          setImageDraft((prev) => ({
                            ...prev,
                            category: e.target.value as WorkCategory,
                          }))
                        }
                        className="h-[44px] w-full rounded-[10px] border border-[#E4E4E4] bg-white px-[12px] text-[13px] outline-none focus:border-[#EA580C]"
                      >
                        {CATEGORY_OPTIONS.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>

                      {imageDraft.url && (
                        <div className="relative h-[120px] w-full overflow-hidden rounded-[10px] bg-[#F1E4D8]">
                          <Image
                            src={resolveImage(imageDraft.url)}
                            alt="Gallery preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      )}

                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={uploadingGalleryIndex !== null}
                          className="h-[40px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white text-[13px] text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                        >
                          {uploadingGalleryIndex !== null ? (
                            <Loader2 className="h-[14px] w-[14px] animate-spin" />
                          ) : (
                            <UploadCloud className="h-[14px] w-[14px]" />
                          )}
                          Upload Image
                        </Button>

                        <Button
                          type="button"
                          onClick={saveImageDraft}
                          className="h-[40px] rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                        >
                          {editingImageIndex !== null ? "Save Image" : "Add Image"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelImageForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.images.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No gallery images yet. Add your first image above.
                      </p>
                    )}

                    {form.images.map((image, index) => (
                      <div
                        key={image._id || `${image.url}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="relative h-[80px] w-full shrink-0 overflow-hidden rounded-[10px] bg-[#F1E4D8] sm:h-[72px] sm:w-[96px]">
                          {image.url ? (
                            <Image
                              src={resolveImage(image.url)}
                              alt={image.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-[#C2410C]">
                            {image.category}
                          </p>
                          <p className="truncate text-[13px] font-semibold text-[#111111]">
                            {image.title}
                          </p>
                          <p className="line-clamp-2 text-[12px] text-[#666666]">
                            {image.description}
                          </p>
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditImage(index)}
                            className="h-[34px] rounded-[8px] border-[#E4C9B4] px-[10px] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeImage(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this section on the website
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, isActive: checked })
                    }
                  />
                </div>

                <div className="flex flex-col gap-[10px] pt-[4px] xs:flex-row xs:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting}
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white px-[18px] text-[14px] text-[#666666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || uploadingFeatured}
                    className="h-[46px] rounded-[12px] bg-[#EA580C] px-[22px] text-[14px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Section"
                    ) : (
                      "Create Section"
                    )}
                  </Button>
                </div>
              </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => !deletingId && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Delete Home Works Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.title}&quot; and its gallery images.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  {deletingId ? "Deleting..." : "Delete Section"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
