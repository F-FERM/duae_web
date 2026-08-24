"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Link2,
  Type,
  AlignLeft,
  ImageIcon,
  ImagePlus,
  Loader2,
  UploadCloud,
  MessageCircle,
  Hash,
  Search,
  Sparkles,
  ExternalLink,
  Globe,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { fileUpload } from "@/app/api/admin/upload/upload";

// ================= TYPES =================

interface InlineLinkItem {
  _id?: string;
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

export interface LisHomeSlideResponse {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  wpButtonText: string;
  wpButtonLink: string;
  order: number;
  isActive: boolean;
  inlineLinks?: InlineLinkItem[];
}

interface HomeSlide extends LisHomeSlideResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_INLINE_LINK: InlineLinkItem = {
  text: "",
  url: "/",
  type: "page",
  openInNewTab: false,
  position: 0,
};

const EMPTY_FORM: LisHomeSlideResponse = {
  title: "",
  subtitle: "",
  description: "",
  image: "",
  buttonText: "",
  buttonLink: "",
  wpButtonText: "",
  wpButtonLink: "",
  order: 0,
  isActive: true,
  inlineLinks: [],
};

// Link type options
const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
];

// Common text suggestions for inline links
const COMMON_TEXT_SUGGESTIONS = [
  { label: "Dubai", url: "/locations/dubai" },
  { label: "UAE", url: "/locations/uae" },
  { label: "joinery", url: "/services/joinery" },
  { label: "fit-out", url: "/services/fitout-solutions" },
  { label: "metal works", url: "/services/metal-works" },
  { label: "renovation", url: "/services/renovation-services" },
  { label: "upholstery", url: "/services/upholstery" },
  { label: "bespoke", url: "/services/custom" },
  { label: "turnkey", url: "/services/turnkey-solutions" },
];

export default function HomeHeroSlidesPage() {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LisHomeSlideResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingSlide, setFetchingSlide] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // delete state
  const [deleteTarget, setDeleteTarget] = useState<HomeSlide | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Inline Links state
  const [editingInlineLinkIndex, setEditingInlineLinkIndex] = useState<
    number | null
  >(null);
  const [inlineLinkModalOpen, setInlineLinkModalOpen] = useState(false);
  const [tempInlineLink, setTempInlineLink] =
    useState<InlineLinkItem>(EMPTY_INLINE_LINK);
  const [inlineLinksExpanded, setInlineLinksExpanded] = useState(true);
  const [linkSearchTerm, setLinkSearchTerm] = useState("");

  // ================= FETCH ALL =================

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await api.get<HomeSlide[]>("/home-hero/slides");
      const sorted = [...res.data].sort((a, b) => a.order - b.order);
      setSlides(sorted);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load home slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ================= MODAL HELPERS =================

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: slides.length, inlineLinks: [] });
    setModalOpen(true);
  };

  const openEditModal = async (id: string) => {
    setEditingId(id);
    setModalOpen(true);
    setFetchingSlide(true);

    try {
      const res = await api.get<HomeSlide>(`/home-hero/slides/${id}`);
      const {
        title,
        subtitle,
        description,
        image,
        buttonText,
        buttonLink,
        wpButtonText,
        wpButtonLink,
        order,
        isActive,
        inlineLinks,
      } = res.data;
      setForm({
        title,
        subtitle,
        description,
        image,
        buttonText,
        buttonLink,
        wpButtonText: wpButtonText || "",
        wpButtonLink: wpButtonLink || "",
        order,
        isActive,
        inlineLinks: inlineLinks || [],
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load slide details");
      setModalOpen(false);
    } finally {
      setFetchingSlide(false);
    }
  };

  const closeModal = () => {
    if (submitting || uploading) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ================= SUBMIT (CREATE / UPDATE) =================

  const handleSubmit = async () => {
    if (!form.title || !form.subtitle || !form.description) {
      return toast.error("Title, subtitle and description are required");
    }

    try {
      setSubmitting(true);

      // Clean up inline links (remove _id)
      const payload = {
        ...form,
        inlineLinks: form.inlineLinks?.map(({ _id, ...rest }) => rest) || [],
      };

      if (editingId) {
        await api.patch(`/home-hero/slides/${editingId}`, payload);
        toast.success("Slide updated");
      } else {
        await api.post("/home-hero/slides", payload);
        toast.success("Slide created");
      }

      closeModal();
      fetchSlides();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (editingId ? "Failed to update slide" : "Failed to create slide")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= QUICK TOGGLE ACTIVE =================

  const toggleActive = async (slide: HomeSlide) => {
    try {
      setTogglingId(slide._id);
      await api.patch(`/home-hero/slides/${slide._id}`, {
        isActive: !slide.isActive,
      });
      setSlides((prev) =>
        prev.map((s) =>
          s._id === slide._id ? { ...s, isActive: !s.isActive } : s
        )
      );
      toast.success(!slide.isActive ? "Slide activated" : "Slide deactivated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, image: result.url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ================= DELETE =================

  const confirmDelete = (slide: HomeSlide) => setDeleteTarget(slide);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/home-hero/slides/${deleteTarget._id}`);
      setSlides((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Slide deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete slide");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= INLINE LINKS CRUD =================

  const openInlineLinkModal = (
    index?: number,
    suggestedText?: string,
    suggestedUrl?: string
  ) => {
    if (index !== undefined) {
      setEditingInlineLinkIndex(index);
      setTempInlineLink({ ...(form.inlineLinks?.[index] || EMPTY_INLINE_LINK) });
    } else {
      setEditingInlineLinkIndex(null);
      setTempInlineLink({
        ...EMPTY_INLINE_LINK,
        text: suggestedText || "",
        url: suggestedUrl || "/",
        position: form.inlineLinks?.length || 0,
      });
    }
    setInlineLinkModalOpen(true);
  };

  const closeInlineLinkModal = () => {
    setInlineLinkModalOpen(false);
    setEditingInlineLinkIndex(null);
    setTempInlineLink(EMPTY_INLINE_LINK);
  };

  const saveInlineLink = () => {
    if (!tempInlineLink.text || !tempInlineLink.url) {
      return toast.error("Text and URL are required");
    }

    const currentLinks = form.inlineLinks || [];
    
    // Check for duplicate text
    const duplicate = currentLinks.some(
      (link, index) =>
        link.text.toLowerCase() === tempInlineLink.text.toLowerCase() &&
        index !== editingInlineLinkIndex
    );

    if (duplicate) {
      return toast.error(
        `"${tempInlineLink.text}" already has an inline link. Please edit the existing one.`
      );
    }

    const inlineLinks = [...currentLinks];
    if (editingInlineLinkIndex !== null) {
      inlineLinks[editingInlineLinkIndex] = tempInlineLink;
    } else {
      inlineLinks.push(tempInlineLink);
    }
    setForm({ ...form, inlineLinks });
    closeInlineLinkModal();
    toast.success(
      editingInlineLinkIndex !== null
        ? "Inline link updated"
        : "Inline link added"
    );
  };

  const deleteInlineLink = (index: number) => {
    const inlineLinks = (form.inlineLinks || []).filter((_, i) => i !== index);
    setForm({ ...form, inlineLinks });
    toast.success("Inline link removed");
  };

  // Get link type icon
  const getLinkTypeIcon = (type: string) => {
    const found = LINK_TYPES.find((t) => t.value === type);
    if (found) {
      const IconComponent = found.icon;
      return <IconComponent className="h-[12px] w-[12px]" />;
    }
    return <Link2 className="h-[12px] w-[12px]" />;
  };

  // Filter inline links based on search
  const filteredInlineLinks = (form.inlineLinks || []).filter(
    (link) =>
      link.text.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(linkSearchTerm.toLowerCase())
  );

  // Get all text content for suggestions
  const getAllContentText = () => {
    return form.title + " " + form.subtitle + " " + form.description;
  };

  // Find suggested texts from content that might need links
  const getSuggestedTexts = () => {
    const content = getAllContentText().toLowerCase();
    const suggestions = [];
    const existingTexts = new Set(
      (form.inlineLinks || []).map((l) => l.text.toLowerCase())
    );

    for (const suggestion of COMMON_TEXT_SUGGESTIONS) {
      if (
        !existingTexts.has(suggestion.label.toLowerCase()) &&
        content.includes(suggestion.label.toLowerCase())
      ) {
        suggestions.push(suggestion);
      }
    }
    return suggestions;
  };

  const suggestedTexts = getSuggestedTexts();

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

      {/* ================= HEADER ================= */}

      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Home Hero Slides
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the rotating slides shown on your homepage hero section.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="
            flex
            h-[46px]
            w-full
            items-center
            justify-center
            gap-[8px]

            rounded-[14px]

            bg-[#EA580C]

            text-[14px]
            font-medium

            text-white

            hover:bg-[#EA580C]

            hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)]

            sm:h-[48px]

            sm:w-auto

            sm:px-[22px]

            sm:text-[15px]
          "
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Slide
        </Button>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : slides.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No slides yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Add your first hero slide to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-[16px] xs:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 2xl:grid-cols-4">
            {slides.map((slide) => (
              <Card
                key={slide._id}
                className="
                  group

                  overflow-hidden

                  rounded-[18px]

                  border
                  border-white/60

                  bg-white/80

                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]

                  backdrop-blur-[10px]

                  transition-all

                  duration-300

                  hover:shadow-[0_18px_50px_rgba(234,88,12,0.15)]

                  sm:rounded-[22px]
                "
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1E4D8] xs:h-[150px] xs:aspect-auto sm:h-[170px] lg:h-[180px]">
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      unoptimized
                      sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-[26px] w-[26px] text-[#C2410C]/40 sm:h-[28px] sm:w-[28px]" />
                    </div>
                  )}

                  <div className="absolute left-[10px] top-[10px] flex items-center gap-[6px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:left-[12px] sm:top-[12px] sm:px-[10px] sm:py-[5px] sm:text-[11px]">
                    <GripVertical className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]" />
                    Order {slide.order}
                  </div>

                  <button
                    onClick={() => toggleActive(slide)}
                    disabled={togglingId === slide._id}
                    className={`
                      absolute
                      right-[10px]
                      top-[10px]

                      rounded-full

                      px-[9px]
                      py-[4px]

                      text-[10px]
                      font-medium

                      backdrop-blur-sm

                      transition-colors

                      sm:right-[12px]

                      sm:top-[12px]

                      sm:px-[10px]

                      sm:py-[5px]

                      sm:text-[11px]

                      ${
                        slide.isActive
                          ? "bg-[#16A34A]/90 text-white"
                          : "bg-black/40 text-white/80"
                      }
                    `}
                  >
                    {togglingId === slide._id
                      ? "..."
                      : slide.isActive
                      ? "Active"
                      : "Inactive"}
                  </button>

                  {/* Inline Links indicator */}
                  {slide.inlineLinks && slide.inlineLinks.length > 0 && (
                    <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[6px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-[12px] sm:left-[12px] sm:px-[10px] sm:py-[5px] sm:text-[11px]">
                      <Hash className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]" />
                      {slide.inlineLinks.length} link(s)
                    </div>
                  )}
                </div>

                <CardContent className="p-[16px] sm:p-[18px] lg:p-[20px]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.6px] text-[#C2410C] sm:text-[11px]">
                    {slide.subtitle}
                  </p>

                  <h3 className="mt-[4px] line-clamp-1 text-[16px] font-semibold text-[#111111] sm:text-[17px] lg:text-[18px]">
                    {slide.title}
                  </h3>

                  <p className="mt-[8px] line-clamp-2 text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                    {slide.description}
                  </p>

                  <div className="mt-[12px] flex flex-wrap items-center gap-[6px] text-[11px] text-[#888888] sm:mt-[14px] sm:text-[12px]">
                    <div className="flex min-w-0 flex-1 items-center gap-[6px] truncate">
                      <Link2 className="h-[12px] w-[12px] shrink-0 sm:h-[13px] sm:w-[13px]" />
                      <span className="truncate">{slide.buttonLink}</span>
                    </div>
                    {slide.wpButtonLink && (
                      <div className="flex min-w-0 shrink-0 items-center gap-[5px] rounded-full bg-[#16A34A]/10 px-[8px] py-[2px] text-[#16A34A]">
                        <MessageCircle className="h-[11px] w-[11px] shrink-0" />
                        <span className="max-w-[90px] truncate">
                          {slide.wpButtonLink}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-[12px] flex shrink-0 items-center justify-end gap-[8px] sm:mt-[14px]">
                    <Button
                      onClick={() => openEditModal(slide._id)}
                      variant="outline"
                      className="
                        h-[34px]

                        flex-1

                        gap-[6px]

                        rounded-[10px]

                        border-[#E4C9B4]

                        bg-white

                        px-[10px]

                        text-[12px]
                        font-medium

                        text-[#C2410C]

                        hover:bg-[#FFF4EC]

                        hover:text-[#C2410C]

                        xs:flex-none

                        sm:h-[36px]

                        sm:px-[12px]

                        sm:text-[13px]
                      "
                    >
                      <Pencil className="h-[13px] w-[13px]" />
                      Edit
                    </Button>

                    <Button
                      onClick={() => confirmDelete(slide)}
                      variant="outline"
                      className="
                        h-[34px]
                        w-[34px]

                        shrink-0

                        rounded-[10px]

                        border-[#F3D0D0]

                        bg-white

                        p-0

                        text-[#DC2626]

                        hover:bg-[#FEF2F2]

                        hover:text-[#DC2626]

                        sm:h-[36px]

                        sm:w-[36px]
                      "
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

      {/* ================= CREATE / EDIT MODAL ================= */}

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
              className="
                relative

                max-h-[94vh]
                w-full

                overflow-y-auto

                rounded-t-[24px]

                bg-white

                p-[18px]

                shadow-[0_30px_80px_rgba(0,0,0,0.25)]

                xs:p-[22px]

                sm:max-h-[92vh]

                sm:max-w-[560px]

                sm:rounded-[28px]

                sm:p-[32px]

                md:max-w-[600px]
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {editingId ? "Edit Slide" : "Add New Slide"}
                </h2>

                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              {fetchingSlide ? (
                <div className="flex min-h-[220px] items-center justify-center sm:min-h-[240px]">
                  <Loader2 className="h-[24px] w-[24px] animate-spin text-[#EA580C] sm:h-[26px] sm:w-[26px]" />
                </div>
              ) : (
                <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                  {/* TITLE */}
                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Type className="h-[13px] w-[13px]" /> Title
                    </Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="WOOD WORLD DECOR LLC"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  {/* SUBTITLE */}
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Subtitle
                    </Label>
                    <Input
                      value={form.subtitle}
                      onChange={(e) =>
                        setForm({ ...form, subtitle: e.target.value })
                      }
                      placeholder="Leading Joinery Fitout Company in Dubai, UAE"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <AlignLeft className="h-[13px] w-[13px]" /> Description
                    </Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="We specialize in high-quality joinery and fit-out solutions..."
                      rows={3}
                      className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                    />
                  </div>

                  {/* IMAGE UPLOAD */}
                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <ImageIcon className="h-[13px] w-[13px]" /> Slide image
                    </Label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelected}
                    />

                    <div
                      onClick={() =>
                        !uploading && fileInputRef.current?.click()
                      }
                      className={`
                        relative flex h-[140px] w-full cursor-pointer
                        items-center justify-center overflow-hidden
                        rounded-[14px] border border-dashed
                        border-[#E4C9B4] bg-[#FFF9F4]
                        transition-colors
                        hover:bg-[#FFF4EC]
                        sm:h-[160px]
                        ${uploading ? "pointer-events-none opacity-70" : ""}
                      `}
                    >
                      {form.image ? (
                        <>
                          <Image
                            src={form.image}
                            alt="Slide preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
                            <span className="flex items-center gap-[6px] text-[13px] font-medium text-white">
                              <ImagePlus className="h-[14px] w-[14px]" />
                              Change image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-[6px] text-[#C2410C]">
                          <UploadCloud className="h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]" />
                          <span className="text-[12px] font-medium sm:text-[13px]">
                            Click to upload image
                          </span>
                          <span className="text-[10px] text-[#A6A6A6] sm:text-[11px]">
                            PNG, JPG up to a few MB
                          </span>
                        </div>
                      )}

                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C] sm:h-[22px] sm:w-[22px]" />
                        </div>
                      )}
                    </div>

                    {/* Fallback: paste a URL directly */}
                    <Input
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      placeholder="Or paste an image URL"
                      className="mt-[8px] h-[40px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30 sm:h-[42px]"
                    />
                  </div>

                  {/* BUTTON TEXT / LINK */}
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2 sm:gap-[14px]">
                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Button text
                      </Label>
                      <Input
                        value={form.buttonText}
                        onChange={(e) =>
                          setForm({ ...form, buttonText: e.target.value })
                        }
                        placeholder="TALK TO US"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>

                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Button link
                      </Label>
                      <Input
                        value={form.buttonLink}
                        onChange={(e) =>
                          setForm({ ...form, buttonLink: e.target.value })
                        }
                        placeholder="/contact"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>
                  </div>

                  {/* WHATSAPP BUTTON TEXT / LINK */}
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2 sm:gap-[14px]">
                    <div>
                      <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                        <MessageCircle className="h-[13px] w-[13px]" /> WhatsApp
                        button text
                      </Label>
                      <Input
                        value={form.wpButtonText}
                        onChange={(e) =>
                          setForm({ ...form, wpButtonText: e.target.value })
                        }
                        placeholder="WHATSAPP US"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>

                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        WhatsApp number
                      </Label>
                      <Input
                        value={form.wpButtonLink}
                        onChange={(e) =>
                          setForm({ ...form, wpButtonLink: e.target.value })
                        }
                        placeholder="+971501234567"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>
                  </div>

                  {/* ================= INLINE LINKS SECTION ================= */}
                  <hr className="border-[#E4E4E4]" />

                  <div>
                    <button
                      onClick={() => setInlineLinksExpanded(!inlineLinksExpanded)}
                      className="flex w-full items-center justify-between py-[4px]"
                    >
                      <div className="flex items-center gap-[6px]">
                        <Hash className="h-[14px] w-[14px] text-[#EA580C]" />
                        <Label className="text-[13px] font-medium text-[#2A2A2A] cursor-pointer">
                          Inline Links ({form.inlineLinks?.length || 0})
                        </Label>
                        <span className="text-[11px] font-normal text-[#888888]">
                          (text-based links within content)
                        </span>
                      </div>
                      {inlineLinksExpanded ? (
                        <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                      ) : (
                        <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                      )}
                    </button>

                    {inlineLinksExpanded && (
                      <div className="mt-[8px]">
                        {/* Suggestions Section */}
                        {suggestedTexts.length > 0 && (
                          <div className="mb-4 rounded-[10px] border border-[#E4C9B4] bg-[#FFF9F4] p-[12px]">
                            <div className="flex items-center gap-[6px] text-[12px] font-medium text-[#666666]">
                              <Sparkles className="h-[14px] w-[14px] text-[#EA580C]" />
                              <span>Suggested texts that might need links:</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {suggestedTexts.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  onClick={() =>
                                    openInlineLinkModal(
                                      undefined,
                                      suggestion.label,
                                      suggestion.url
                                    )
                                  }
                                  variant="outline"
                                  className="h-[28px] gap-[4px] rounded-full border-[#E4C9B4] px-3 text-[11px] text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                                >
                                  <Plus className="h-[10px] w-[10px]" />
                                  "{suggestion.label}"
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Search Bar */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#999]" />
                          <Input
                            placeholder="Search inline links..."
                            value={linkSearchTerm}
                            onChange={(e) => setLinkSearchTerm(e.target.value)}
                            className="h-[36px] pl-[34px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>

                        <div className="space-y-[8px] max-h-[200px] overflow-y-auto pr-[4px]">
                          {filteredInlineLinks.length === 0 ? (
                            <div className="rounded-[10px] border border-dashed border-[#E4E4E4] p-[16px] text-center">
                              <p className="text-[12px] text-[#888888]">
                                {linkSearchTerm
                                  ? "No matching inline links found"
                                  : "No inline links configured yet"}
                              </p>
                            </div>
                          ) : (
                            filteredInlineLinks.map((link, index) => (
                              <div
                                key={index}
                                className="flex items-start justify-between rounded-[10px] border border-[#E4E4E4] bg-white p-[10px]"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-[6px] flex-wrap">
                                    <span className="text-[9px] font-medium text-[#999]">
                                      #{link.position}
                                    </span>
                                    <div className="flex items-center gap-[4px] text-[9px] text-[#999]">
                                      {getLinkTypeIcon(link.type)}
                                      <span className="text-[7px] uppercase tracking-wider text-[#999]">
                                        {link.type}
                                      </span>
                                    </div>
                                    <span className="rounded bg-[#FFF4EC] px-1.5 py-0.5 text-[11px] font-medium text-[#EA580C] truncate max-w-[120px]">
                                      "{link.text}"
                                    </span>
                                  </div>
                                  <div className="mt-[2px] flex items-center gap-[6px] text-[10px] text-[#666666]">
                                    <span className="truncate">{link.url}</span>
                                    {link.openInNewTab && (
                                      <span className="flex items-center gap-[4px] text-[8px] text-[#999] shrink-0">
                                        <ExternalLink className="h-[8px] w-[8px]" />
                                        New tab
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex shrink-0 gap-[2px] ml-[8px]">
                                  <Button
                                    onClick={() => openInlineLinkModal(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                                  >
                                    <Pencil className="h-[11px] w-[11px]" />
                                  </Button>
                                  <Button
                                    onClick={() => deleteInlineLink(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#DC2626]"
                                  >
                                    <Trash2 className="h-[11px] w-[11px]" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <Button
                          onClick={() => openInlineLinkModal()}
                          variant="outline"
                          className="mt-3 h-[34px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[36px]"
                        >
                          <Plus className="h-[14px] w-[14px]" />
                          Add Inline Link
                        </Button>
                      </div>
                    )}
                  </div>

                  <hr className="border-[#E4E4E4]" />

                  {/* ORDER / ACTIVE */}
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2 sm:gap-[14px]">
                    <div>
                      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                        Display order
                      </Label>
                      <Input
                        type="number"
                        value={form.order}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            order: Number(e.target.value),
                          })
                        }
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] bg-white px-[14px]">
                      <Label className="text-[13px] font-medium text-[#2A2A2A]">
                        Active
                      </Label>
                      <Switch
                        checked={form.isActive}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, isActive: checked })
                        }
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-col-reverse gap-[10px] pt-[8px] sm:flex-row sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      disabled={submitting || uploading}
                      className="h-[46px] rounded-[14px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[48px] sm:w-[120px]"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={submitting || uploading}
                      className="
                        h-[46px]

                        gap-[8px]

                        rounded-[14px]

                        bg-[#EA580C]

                        text-[14px]
                        font-medium

                        text-white

                        hover:bg-[#EA580C]

                        hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)]

                        sm:h-[48px]

                        sm:w-[160px]
                      "
                    >
                      {submitting && (
                        <Loader2 className="h-[16px] w-[16px] animate-spin" />
                      )}
                      {editingId ? "Save Changes" : "Create Slide"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INLINE LINK MODAL ================= */}
      <AnimatePresence>
        {inlineLinkModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeInlineLinkModal}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] rounded-[20px] bg-white p-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:rounded-[22px] sm:p-[26px]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold text-[#111111] sm:text-[17px]">
                  {editingInlineLinkIndex !== null
                    ? "Edit Inline Link"
                    : "Add Inline Link"}
                </h3>
                <button
                  onClick={closeInlineLinkModal}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-[16px] space-y-[12px]">
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Text to Link *
                  </Label>
                  <Input
                    value={tempInlineLink.text}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        text: e.target.value,
                      })
                    }
                    placeholder="Dubai"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                  <p className="mt-[4px] text-[10px] text-[#888888]">
                    This text will become clickable in your content. Must match exactly.
                  </p>
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    URL *
                  </Label>
                  <Input
                    value={tempInlineLink.url}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        url: e.target.value,
                      })
                    }
                    placeholder="/locations/dubai"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Link Type
                  </Label>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {LINK_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = tempInlineLink.type === type.value;
                      return (
                        <Button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setTempInlineLink({
                              ...tempInlineLink,
                              type: type.value,
                            })
                          }
                          variant={isSelected ? "default" : "outline"}
                          className={`
                            h-[36px] gap-[6px] rounded-[10px] text-[11px] font-medium
                            ${
                              isSelected
                                ? "bg-[#EA580C] text-white hover:bg-[#EA580C]"
                                : "border-[#E4E4E4] text-[#666] hover:bg-[#FFF4EC]"
                            }
                          `}
                        >
                          <IconComponent className="h-[13px] w-[13px]" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-[12px] pt-[4px]">
                  <Switch
                    id="inlineOpenInNewTab"
                    checked={tempInlineLink.openInNewTab}
                    onCheckedChange={(checked) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        openInNewTab: checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="inlineOpenInNewTab"
                    className="text-[12px] font-medium text-[#2A2A2A]"
                  >
                    Open in new tab
                  </Label>
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Position
                  </Label>
                  <Input
                    type="number"
                    value={tempInlineLink.position}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        position: Number(e.target.value),
                      })
                    }
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                  <p className="mt-[4px] text-[10px] text-[#888888]">
                    Order of this link in the content (lower numbers appear first)
                  </p>
                </div>

                {/* Preview Section */}
                {tempInlineLink.text && tempInlineLink.url && (
                  <div className="rounded-[10px] border border-[#E4C9B4] bg-[#FFF9F4] p-[12px]">
                    <p className="text-[11px] font-medium text-[#666666]">
                      Preview:
                    </p>
                    <p className="mt-[4px] text-[13px] text-[#111111]">
                      ...{" "}
                      <span className="cursor-pointer font-semibold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-2 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41]">
                        {tempInlineLink.text}
                      </span>{" "}
                      ...
                    </p>
                    <p className="mt-[4px] text-[10px] text-[#888888]">
                      → {tempInlineLink.url}
                      {tempInlineLink.openInNewTab && " (opens in new tab)"}
                    </p>
                  </div>
                )}

                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeInlineLinkModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveInlineLink}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingInlineLinkIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DELETE CONFIRM MODAL ================= */}

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[16px] backdrop-blur-[4px] sm:p-[20px]"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-[20px] bg-white p-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:rounded-[22px] sm:p-[26px]"
            >
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#FEF2F2] sm:h-[44px] sm:w-[44px]">
                <Trash2 className="h-[19px] w-[19px] text-[#DC2626] sm:h-[20px] sm:w-[20px]" />
              </div>

              <h3 className="mt-[14px] text-[16px] font-semibold text-[#111111] sm:text-[17px]">
                Delete this slide?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                “{deleteTarget.title}” will be permanently removed from the
                homepage hero. This can't be undone.
              </p>

              <div className="mt-[18px] flex gap-[10px] sm:mt-[20px]">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={!!deletingId}
                  className="h-[44px] flex-1 rounded-[12px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[46px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[44px] flex-1 gap-[8px] rounded-[12px] bg-[#DC2626] text-[14px] font-medium text-white hover:bg-[#DC2626] sm:h-[46px]"
                >
                  {deletingId && (
                    <Loader2 className="h-[15px] w-[15px] animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}