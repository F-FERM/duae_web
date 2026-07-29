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
  Type,
  AlignLeft,
  ImageIcon,
  ImagePlus,
  Loader2,
  UploadCloud,
  Calendar,
  Users,
  Award,
  Image as ImageIcon2,
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

export interface AboutHeroResponse {
  breadcrumbLabel: string;
  breadcrumbLink: string;
  currentPage: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  bgImage: string;
  foundedYear: string;
  teamSize: number;
  experienceYears: number;
  isActive: boolean;
}

interface AboutHero extends AboutHeroResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM: AboutHeroResponse = {
  breadcrumbLabel: "Home",
  breadcrumbLink: "/",
  currentPage: "About Us",
  badge: "",
  title: "",
  description: "",
  image: "",
  bgImage: "",
  foundedYear: "",
  teamSize: 0,
  experienceYears: 0,
  isActive: true,
};

export default function AboutHeroPage() {
  const [aboutData, setAboutData] = useState<AboutHero | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AboutHeroResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // upload state
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // delete state
  const [deleteTarget, setDeleteTarget] = useState<AboutHero | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ================= FETCH DATA =================

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/about-hero");
      
      // Handle both array and single object responses
      let data = null;
      if (Array.isArray(res.data)) {
        data = res.data.length > 0 ? res.data[0] : null;
      } else if (res.data && typeof res.data === 'object') {
        data = res.data;
      }
      
      setAboutData(data);
      
      // If data exists, pre-fill the form with it
      if (data) {
        setForm({
          breadcrumbLabel: data.breadcrumbLabel || "Home",
          breadcrumbLink: data.breadcrumbLink || "/",
          currentPage: data.currentPage || "About Us",
          badge: data.badge || "",
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          bgImage: data.bgImage || "",
          foundedYear: data.foundedYear || "",
          teamSize: data.teamSize || 0,
          experienceYears: data.experienceYears || 0,
          isActive: data.isActive ?? true,
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load about hero data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // ================= MODAL HELPERS =================

  const openCreateModal = () => {
    // If data exists, we're updating, else creating new
    if (aboutData) {
      // For update, pre-fill with existing data
      setForm({
        breadcrumbLabel: aboutData.breadcrumbLabel || "Home",
        breadcrumbLink: aboutData.breadcrumbLink || "/",
        currentPage: aboutData.currentPage || "About Us",
        badge: aboutData.badge || "",
        title: aboutData.title || "",
        description: aboutData.description || "",
        image: aboutData.image || "",
        bgImage: aboutData.bgImage || "",
        foundedYear: aboutData.foundedYear || "",
        teamSize: aboutData.teamSize || 0,
        experienceYears: aboutData.experienceYears || 0,
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploading || uploadingBg) return;
    setModalOpen(false);
    // Reset form to current data or empty
    if (aboutData) {
      setForm({
        breadcrumbLabel: aboutData.breadcrumbLabel || "Home",
        breadcrumbLink: aboutData.breadcrumbLink || "/",
        currentPage: aboutData.currentPage || "About Us",
        badge: aboutData.badge || "",
        title: aboutData.title || "",
        description: aboutData.description || "",
        image: aboutData.image || "",
        bgImage: aboutData.bgImage || "",
        foundedYear: aboutData.foundedYear || "",
        teamSize: aboutData.teamSize || 0,
        experienceYears: aboutData.experienceYears || 0,
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  };

  // ================= SUBMIT (CREATE / UPDATE) =================

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      return toast.error("Title and description are required");
    }

    try {
      setSubmitting(true);

      if (aboutData && aboutData._id) {
        // UPDATE - PATCH to /about-hero/{id}
        await api.patch(`/about-hero`, form);
        toast.success("About hero updated");
      } else {
        // CREATE - POST to /about-hero
        await api.post("/about-hero", form);
        toast.success("About hero created");
      }

      closeModal();
      fetchAboutData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (aboutData ? "Failed to update about hero" : "Failed to create about hero")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= QUICK TOGGLE ACTIVE =================

  const toggleActive = async (data: AboutHero) => {
    try {
      setTogglingId(data._id);
      await api.patch(`/about-hero/${data._id}`, {
        isActive: !data.isActive,
      });
      setAboutData((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
      toast.success(!data.isActive ? "About hero activated" : "About hero deactivated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleBgFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBg(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, bgImage: result.url }));
      toast.success("Background image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload background image");
    } finally {
      setUploadingBg(false);
      if (bgFileInputRef.current) bgFileInputRef.current.value = "";
    }
  };

  // ================= DELETE =================

  const confirmDelete = (data: AboutHero) => setDeleteTarget(data);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/about-hero`);
      setAboutData(null);
      setForm(EMPTY_FORM);
      toast.success("About hero deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete about hero");
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

      {/* ================= HEADER ================= */}

      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            About Hero Section
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the hero section content for the About page.
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
          {aboutData ? "Edit Content" : "Create About Hero"}
        </Button>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : !aboutData ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No about hero content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create your about hero section to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-3">
            <Card
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

                md:col-span-2
                lg:col-span-2
              "
            >
              {/* IMAGE */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1E4D8] xs:h-[200px] xs:aspect-auto sm:h-[240px] lg:h-[280px]">
                {aboutData.image ? (
                  <Image
                    src={aboutData.image}
                    alt={aboutData.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-[26px] w-[26px] text-[#C2410C]/40 sm:h-[28px] sm:w-[28px]" />
                  </div>
                )}

                <div className="absolute left-[10px] top-[10px] flex items-center gap-[6px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:left-[12px] sm:top-[12px] sm:px-[10px] sm:py-[5px] sm:text-[11px]">
                  <GripVertical className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]" />
                  About Hero
                </div>

                <button
                  onClick={() => toggleActive(aboutData)}
                  disabled={togglingId === aboutData._id}
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
                      aboutData.isActive
                        ? "bg-[#16A34A]/90 text-white"
                        : "bg-black/40 text-white/80"
                    }
                  `}
                >
                  {togglingId === aboutData._id
                    ? "..."
                    : aboutData.isActive
                    ? "Active"
                    : "Inactive"}
                </button>

                {/* BG Image indicator */}
                {aboutData.bgImage && (
                  <div className="absolute bottom-[10px] left-[10px] flex items-center gap-[6px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-[12px] sm:left-[12px] sm:px-[10px] sm:py-[5px] sm:text-[11px]">
                    <ImageIcon2 className="h-[11px] w-[11px] sm:h-[12px] sm:w-[12px]" />
                    Has BG Image
                  </div>
                )}
              </div>

              <CardContent className="p-[16px] sm:p-[18px] lg:p-[20px]">
                <div className="flex flex-wrap items-center gap-[6px]">
                  {aboutData.badge && (
                    <span className="text-[10px] font-medium uppercase tracking-[0.6px] text-[#C2410C] sm:text-[11px]">
                      {aboutData.badge}
                    </span>
                  )}
                  {aboutData.breadcrumbLabel && (
                    <>
                      <span className="text-[10px] text-[#999] sm:text-[11px]">•</span>
                      <span className="text-[10px] text-[#999] sm:text-[11px]">
                        {aboutData.breadcrumbLabel} / {aboutData.currentPage || "About Us"}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="mt-[4px] line-clamp-2 text-[16px] font-semibold text-[#111111] sm:text-[17px] lg:text-[18px]">
                  {aboutData.title}
                </h3>

                <p className="mt-[8px] line-clamp-3 text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                  {aboutData.description}
                </p>

                <div className="mt-[12px] flex flex-wrap items-center gap-[12px] sm:mt-[14px]">
                  {aboutData.foundedYear && (
                    <div className="flex items-center gap-[4px] text-[11px] text-[#666] sm:text-[12px]">
                      <Calendar className="h-[12px] w-[12px] text-[#EA580C]" />
                      Founded {aboutData.foundedYear}
                    </div>
                  )}
                  {aboutData.teamSize > 0 && (
                    <div className="flex items-center gap-[4px] text-[11px] text-[#666] sm:text-[12px]">
                      <Users className="h-[12px] w-[12px] text-[#EA580C]" />
                      {aboutData.teamSize}+ Team
                    </div>
                  )}
                  {aboutData.experienceYears > 0 && (
                    <div className="flex items-center gap-[4px] text-[11px] text-[#666] sm:text-[12px]">
                      <Award className="h-[12px] w-[12px] text-[#EA580C]" />
                      {aboutData.experienceYears}+ Years
                    </div>
                  )}
                </div>

                <div className="mt-[12px] flex shrink-0 items-center justify-end gap-[8px] sm:mt-[14px]">
                  <Button
                    onClick={openCreateModal}
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
                    onClick={() => confirmDelete(aboutData)}
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
                  {aboutData ? "Edit About Hero" : "Add New About Hero"}
                </h2>

                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                {/* BREADCRUMB */}
                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2 sm:gap-[14px]">
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Breadcrumb Label
                    </Label>
                    <Input
                      value={form.breadcrumbLabel}
                      onChange={(e) =>
                        setForm({ ...form, breadcrumbLabel: e.target.value })
                      }
                      placeholder="Home"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Breadcrumb Link
                    </Label>
                    <Input
                      value={form.breadcrumbLink}
                      onChange={(e) =>
                        setForm({ ...form, breadcrumbLink: e.target.value })
                      }
                      placeholder="/"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                {/* CURRENT PAGE */}
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Current Page
                  </Label>
                  <Input
                    value={form.currentPage}
                    onChange={(e) =>
                      setForm({ ...form, currentPage: e.target.value })
                    }
                    placeholder="About Us"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                {/* BADGE */}
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Badge
                  </Label>
                  <Input
                    value={form.badge}
                    onChange={(e) =>
                      setForm({ ...form, badge: e.target.value })
                    }
                    placeholder="ABOUT WOOD WORLD DECOR LLC"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

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
                    placeholder="Trusted Joinery, Fit-Out & Renovation Experts..."
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
                    placeholder="Write a detailed description of your company..."
                    rows={6}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>

                {/* MAIN IMAGE UPLOAD */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ImageIcon className="h-[13px] w-[13px]" /> Hero Image
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
                          alt="Hero preview"
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

                  <Input
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="Or paste an image URL"
                    className="mt-[8px] h-[40px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30 sm:h-[42px]"
                  />
                </div>

                {/* BACKGROUND IMAGE UPLOAD */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ImageIcon2 className="h-[13px] w-[13px]" /> Background Image
                  </Label>

                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBgFileSelected}
                  />

                  <div
                    onClick={() =>
                      !uploadingBg && bgFileInputRef.current?.click()
                    }
                    className={`
                      relative flex h-[140px] w-full cursor-pointer
                      items-center justify-center overflow-hidden
                      rounded-[14px] border border-dashed
                      border-[#E4C9B4] bg-[#FFF9F4]
                      transition-colors
                      hover:bg-[#FFF4EC]
                      sm:h-[160px]
                      ${uploadingBg ? "pointer-events-none opacity-70" : ""}
                    `}
                  >
                    {form.bgImage ? (
                      <>
                        <Image
                          src={form.bgImage}
                          alt="Background preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
                          <span className="flex items-center gap-[6px] text-[13px] font-medium text-white">
                            <ImagePlus className="h-[14px] w-[14px]" />
                            Change background
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-[6px] text-[#C2410C]">
                        <UploadCloud className="h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]" />
                        <span className="text-[12px] font-medium sm:text-[13px]">
                          Click to upload background image
                        </span>
                        <span className="text-[10px] text-[#A6A6A6] sm:text-[11px]">
                          PNG, JPG up to a few MB
                        </span>
                      </div>
                    )}

                    {uploadingBg && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C] sm:h-[22px] sm:w-[22px]" />
                      </div>
                    )}
                  </div>

                  <Input
                    value={form.bgImage}
                    onChange={(e) =>
                      setForm({ ...form, bgImage: e.target.value })
                    }
                    placeholder="Or paste a background image URL"
                    className="mt-[8px] h-[40px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30 sm:h-[42px]"
                  />
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-3 sm:gap-[14px]">
                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Calendar className="h-[13px] w-[13px]" /> Founded Year
                    </Label>
                    <Input
                      value={form.foundedYear}
                      onChange={(e) =>
                        setForm({ ...form, foundedYear: e.target.value })
                      }
                      placeholder="2015"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Users className="h-[13px] w-[13px]" /> Team Size
                    </Label>
                    <Input
                      type="number"
                      value={form.teamSize || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          teamSize: Number(e.target.value),
                        })
                      }
                      placeholder="100"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Award className="h-[13px] w-[13px]" /> Experience Years
                    </Label>
                    <Input
                      type="number"
                      value={form.experienceYears || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          experienceYears: Number(e.target.value),
                        })
                      }
                      placeholder="10"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                </div>

                {/* ACTIVE */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] bg-white px-[14px] py-[12px]">
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

                {/* ACTIONS */}
                <div className="flex flex-col-reverse gap-[10px] pt-[8px] sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting || uploading || uploadingBg}
                    className="h-[46px] rounded-[14px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[48px] sm:w-[120px]"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || uploading || uploadingBg}
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
                    {aboutData ? "Save Changes" : "Create"}
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
                Delete about hero content?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                “{deleteTarget.title}” will be permanently removed. This can't be undone.
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