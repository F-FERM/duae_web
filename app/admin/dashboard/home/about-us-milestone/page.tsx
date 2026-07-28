"use client";

import { useEffect, useState } from "react";
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
  Trophy,
  Newspaper,
  Leaf,
  Star,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
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

export interface MilestoneItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutUsResponse {
  title: string;
  description: string;
  image: string;
  imageTwo: string;
  buttonText: string;
  buttonLink: string;
  foundedYear: string;
  foundedMonth: string;
  yearsOfExcellence: number;
  teamSize: number;
  milestonesTitle: string;
  milestonesImageOne: string;
  milestonesImageTwo: string;
  milestonesSubtitle: string;
  milestones: MilestoneItem[];
  isActive: boolean;
}

interface AboutUs extends AboutUsResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_MILESTONE: MilestoneItem = {
  title: "",
  description: "",
  icon: "fa-solid fa-star",
  order: 0,
};

const EMPTY_FORM: AboutUsResponse = {
  title: "",
  description: "",
  image: "",
  imageTwo: "",
  buttonText: "VIEW MORE",
  buttonLink: "/about",
  foundedYear: "",
  foundedMonth: "",
  yearsOfExcellence: 0,
  teamSize: 0,
  milestonesTitle: "Our Milestones",
  milestonesImageOne: "",
  milestonesImageTwo: "",
  milestonesSubtitle: "",
  milestones: [],
  isActive: true,
};

export default function AboutUsPage() {
  const [aboutData, setAboutData] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AboutUsResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadingImageTwo, setUploadingImageTwo] = useState(false);
  const [uploadingMilestoneImageOne, setUploadingMilestoneImageOne] = useState(false);
  const [uploadingMilestoneImageTwo, setUploadingMilestoneImageTwo] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AboutUs | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Milestone modal
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestoneIndex, setEditingMilestoneIndex] = useState<number | null>(null);
  const [tempMilestone, setTempMilestone] = useState<MilestoneItem>(EMPTY_MILESTONE);

  // Collapse states
  const [basicExpanded, setBasicExpanded] = useState(true);
  const [milestonesExpanded, setMilestonesExpanded] = useState(true);

  // ================= FETCH DATA =================

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/home-about");

      let data = null;
      if (Array.isArray(res.data)) {
        data = res.data.length > 0 ? res.data[0] : null;
      } else if (res.data && typeof res.data === 'object') {
        data = res.data;
      }

      setAboutData(data);

      if (data) {
        setForm({
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          imageTwo: data.imageTwo || "",
          buttonText: data.buttonText || "VIEW MORE",
          buttonLink: data.buttonLink || "/about",
          foundedYear: data.foundedYear || "",
          foundedMonth: data.foundedMonth || "",
          yearsOfExcellence: data.yearsOfExcellence || 0,
          teamSize: data.teamSize || 0,
          milestonesTitle: data.milestonesTitle || "Our Milestones",
          milestonesImageOne: data.milestonesImageOne || "",
          milestonesImageTwo: data.milestonesImageTwo || "",
          milestonesSubtitle: data.milestonesSubtitle || "",
          milestones: data.milestones || [],
          isActive: data.isActive ?? true,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load about us data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // ================= MODAL HELPERS =================

  const openCreateModal = () => {
    if (aboutData) {
      setForm({
        title: aboutData.title || "",
        description: aboutData.description || "",
        image: aboutData.image || "",
        imageTwo: aboutData.imageTwo || "",
        buttonText: aboutData.buttonText || "VIEW MORE",
        buttonLink: aboutData.buttonLink || "/about",
        foundedYear: aboutData.foundedYear || "",
        foundedMonth: aboutData.foundedMonth || "",
        yearsOfExcellence: aboutData.yearsOfExcellence || 0,
        teamSize: aboutData.teamSize || 0,
        milestonesTitle: aboutData.milestonesTitle || "Our Milestones",
        milestonesImageOne: aboutData.milestonesImageOne || "",
        milestonesImageTwo: aboutData.milestonesImageTwo || "",
        milestonesSubtitle: aboutData.milestonesSubtitle || "",
        milestones: aboutData.milestones || [],
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploading || uploadingImageTwo || uploadingMilestoneImageOne || uploadingMilestoneImageTwo) return;
    setModalOpen(false);
    if (aboutData) {
      setForm({
        title: aboutData.title || "",
        description: aboutData.description || "",
        image: aboutData.image || "",
        imageTwo: aboutData.imageTwo || "",
        buttonText: aboutData.buttonText || "VIEW MORE",
        buttonLink: aboutData.buttonLink || "/about",
        foundedYear: aboutData.foundedYear || "",
        foundedMonth: aboutData.foundedMonth || "",
        yearsOfExcellence: aboutData.yearsOfExcellence || 0,
        teamSize: aboutData.teamSize || 0,
        milestonesTitle: aboutData.milestonesTitle || "Our Milestones",
        milestonesImageOne: aboutData.milestonesImageOne || "",
        milestonesImageTwo: aboutData.milestonesImageTwo || "",
        milestonesSubtitle: aboutData.milestonesSubtitle || "",
        milestones: aboutData.milestones || [],
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      return toast.error("Title and description are required");
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        milestones: form.milestones
          .map(({ _id, createdAt, updatedAt, ...rest }) => rest)
          .sort((a, b) => a.order - b.order),
      };

      if (aboutData && aboutData._id) {
        await api.patch(`/home-about`, payload);
        toast.success("About us updated");
      } else {
        await api.post("/home-about", payload);
        toast.success("About us created");
      }

      closeModal();
      fetchAboutData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
        (aboutData ? "Failed to update about us" : "Failed to create about us")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= TOGGLE ACTIVE =================

  const toggleActive = async (data: AboutUs) => {
    try {
      setTogglingId(data._id);
      await api.patch(`/about-us/${data._id}`, {
        isActive: !data.isActive,
      });
      setAboutData((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
      toast.success(!data.isActive ? "About us activated" : "About us deactivated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof AboutUsResponse | 'milestonesImageOne' | 'milestonesImageTwo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadField = field as string;
      if (uploadField === 'milestonesImageOne') setUploadingMilestoneImageOne(true);
      else if (uploadField === 'milestonesImageTwo') setUploadingMilestoneImageTwo(true);
      else setUploading(true);

      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, [field]: result.url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      setUploadingImageTwo(false);
      setUploadingMilestoneImageOne(false);
      setUploadingMilestoneImageTwo(false);
      e.target.value = "";
    }
  };

  // ================= DELETE =================

  const confirmDelete = (data: AboutUs) => setDeleteTarget(data);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/about-us/${deleteTarget._id}`);
      setAboutData(null);
      setForm(EMPTY_FORM);
      toast.success("About us deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete about us");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= MILESTONE CRUD =================

  const openMilestoneModal = (index?: number) => {
    if (index !== undefined) {
      setEditingMilestoneIndex(index);
      setTempMilestone({ ...form.milestones[index] });
    } else {
      setEditingMilestoneIndex(null);
      setTempMilestone({ ...EMPTY_MILESTONE, order: form.milestones.length });
    }
    setMilestoneModalOpen(true);
  };

  const closeMilestoneModal = () => {
    setMilestoneModalOpen(false);
    setEditingMilestoneIndex(null);
    setTempMilestone(EMPTY_MILESTONE);
  };

  const saveMilestone = () => {
    if (!tempMilestone.title || !tempMilestone.description) {
      return toast.error("Title and description are required");
    }

    const milestones = [...form.milestones];
    if (editingMilestoneIndex !== null) {
      milestones[editingMilestoneIndex] = tempMilestone;
    } else {
      milestones.push(tempMilestone);
    }
    setForm({ ...form, milestones });
    closeMilestoneModal();
  };

  const deleteMilestone = (index: number) => {
    const milestones = form.milestones.filter((_, i) => i !== index);
    setForm({ ...form, milestones });
  };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= form.milestones.length) return;

    const newMilestones = [...form.milestones];
    const [movedItem] = newMilestones.splice(index, 1);
    newMilestones.splice(newIndex, 0, movedItem);

    // Update order numbers
    const updatedMilestones = newMilestones.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setForm({ ...form, milestones: updatedMilestones });
  };

  // ================= RENDER HELPERS =================

  const renderImageUpload = (
    value: string,
    field: keyof AboutUsResponse | 'milestonesImageOne' | 'milestonesImageTwo',
    label: string,
    uploadingState: boolean
  ) => (
    <div>
      <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`upload-${field}`}
        onChange={(e) => handleImageUpload(e, field)}
      />
      <div
        onClick={() => !uploadingState && document.getElementById(`upload-${field}`)?.click()}
        className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploadingState ? "pointer-events-none opacity-70" : ""}
        `}
      >
        {value ? (
          <>
            <Image src={value} alt={label} fill unoptimized className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity hover:bg-black/40 hover:opacity-100">
              <span className="flex items-center gap-[6px] text-[13px] font-medium text-white">
                <ImagePlus className="h-[14px] w-[14px]" />
                Change
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-[4px] text-[#C2410C]">
            <UploadCloud className="h-[20px] w-[20px]" />
            <span className="text-[11px] font-medium">Upload image</span>
          </div>
        )}
        {uploadingState && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
          </div>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
        placeholder="Or paste image URL"
        className="mt-[4px] h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30"
      />
    </div>
  );

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

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            About Us
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage about us content, milestones, and company information.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          {aboutData ? "Edit Content" : "Create About Us"}
        </Button>
      </div>

      {/* CONTENT */}
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
                No about us content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create your about us content to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.15)] sm:rounded-[22px]">
            <CardContent className="p-[16px] sm:p-[24px] lg:p-[28px]">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-[12px] border-b border-[#E4C9B4]/30 pb-[16px]">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-[8px]">
                    <button
                      onClick={() => toggleActive(aboutData)}
                      disabled={togglingId === aboutData._id}
                      className={`
                        rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm transition-colors sm:text-[11px]
                        ${aboutData.isActive
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
                  </div>
                  <h3 className="mt-[4px] text-[17px] font-semibold text-[#111111] sm:text-[19px] lg:text-[21px] line-clamp-2">
                    {aboutData.title}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-[8px]">
                  <Button
                    onClick={openCreateModal}
                    variant="outline"
                    className="h-[34px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[10px] text-[12px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] sm:h-[36px] sm:px-[12px] sm:text-[13px]"
                  >
                    <Pencil className="h-[13px] w-[13px]" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => confirmDelete(aboutData)}
                    variant="outline"
                    className="h-[34px] w-[34px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[36px] sm:w-[36px]"
                  >
                    <Trash2 className="h-[14px] w-[14px]" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-[16px]">
                <p className="text-[13px] leading-[1.7] text-[#666666] sm:text-[14px] line-clamp-4">
                  {aboutData.description}
                </p>
              </div>

              {/* Stats */}
              <div className="mt-[16px] grid grid-cols-2 gap-[10px] sm:grid-cols-4">
                <div className="rounded-[10px] bg-[#FFF9F4] p-[12px] text-center">
                  <div className="text-[18px] font-bold text-[#EA580C] sm:text-[20px]">
                    {aboutData.foundedMonth} {aboutData.foundedYear}
                  </div>
                  <div className="text-[10px] text-[#666] sm:text-[11px]">Founded</div>
                </div>
                <div className="rounded-[10px] bg-[#FFF9F4] p-[12px] text-center">
                  <div className="text-[18px] font-bold text-[#EA580C] sm:text-[20px]">
                    {aboutData.yearsOfExcellence}+
                  </div>
                  <div className="text-[10px] text-[#666] sm:text-[11px]">Years of Excellence</div>
                </div>
                <div className="rounded-[10px] bg-[#FFF9F4] p-[12px] text-center">
                  <div className="text-[18px] font-bold text-[#EA580C] sm:text-[20px]">
                    {aboutData.teamSize}+
                  </div>
                  <div className="text-[10px] text-[#666] sm:text-[11px]">Team Members</div>
                </div>
                <div className="rounded-[10px] bg-[#FFF9F4] p-[12px] text-center">
                  <div className="text-[13px] font-medium text-[#EA580C] sm:text-[14px]">
                    {aboutData.buttonText}
                  </div>
                  <div className="text-[10px] text-[#666] sm:text-[11px]">{aboutData.buttonLink}</div>
                </div>
              </div>

              {/* Images */}
              <div className="mt-[16px] grid grid-cols-1 gap-[12px] sm:grid-cols-2">
                {aboutData.image && (
                  <div className="relative h-[120px] w-full overflow-hidden rounded-[12px] bg-[#F1E4D8] sm:h-[140px]">
                    <Image src={aboutData.image} alt="About Image 1" fill unoptimized className="object-cover" />
                    <div className="absolute bottom-[8px] left-[8px] rounded-full bg-black/50 px-[8px] py-[2px] text-[9px] text-white">Image 1</div>
                  </div>
                )}
                {aboutData.imageTwo && (
                  <div className="relative h-[120px] w-full overflow-hidden rounded-[12px] bg-[#F1E4D8] sm:h-[140px]">
                    <Image src={aboutData.imageTwo} alt="About Image 2" fill unoptimized className="object-cover" />
                    <div className="absolute bottom-[8px] left-[8px] rounded-full bg-black/50 px-[8px] py-[2px] text-[9px] text-white">Image 2</div>
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div className="mt-[20px]">
                <h4 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                  {aboutData.milestonesTitle}
                </h4>
                {aboutData.milestonesSubtitle && (
                  <p className="mt-[2px] text-[12px] text-[#666] sm:text-[13px]">
                    {aboutData.milestonesSubtitle}
                  </p>
                )}
                <div className="mt-[10px] grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                  {aboutData.milestones.slice(0, 4).map((milestone, index) => (
                    <div key={milestone._id || index} className="rounded-[10px] border border-[#E4E4E4] bg-white p-[12px]">
                      <div className="flex items-center gap-[8px]">
                        <span className="font-mono text-[10px] text-[#999]">#{milestone.order + 1}</span>
                        <h5 className="text-[12px] font-medium text-[#111111] sm:text-[13px]">{milestone.title}</h5>
                      </div>
                      <p className="mt-[4px] text-[11px] text-[#666] sm:text-[12px]">{milestone.description}</p>
                      <div className="mt-[4px] text-[10px] font-mono text-[#999]">{milestone.icon}</div>
                    </div>
                  ))}
                </div>
                {aboutData.milestones.length > 4 && (
                  <p className="mt-[8px] text-[12px] text-[#999]">
                    +{aboutData.milestones.length - 4} more milestones
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ================= MAIN MODAL ================= */}
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
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[600px] sm:rounded-[28px] sm:p-[32px] md:max-w-[650px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {aboutData ? "Edit About Us" : "Add New About Us"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                {/* BASIC INFO */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  <button
                    onClick={() => setBasicExpanded(!basicExpanded)}
                    className="flex w-full items-center justify-between"
                  >
                    <h4 className="text-[14px] font-semibold text-[#111111]">Basic Information</h4>
                    {basicExpanded ? (
                      <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                    ) : (
                      <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                    )}
                  </button>
                  {basicExpanded && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Title *
                        </Label>
                        <Input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="10+ Years of Excellence..."
                          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>

                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Description *
                        </Label>
                        <Textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Company description..."
                          rows={4}
                          className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-[10px]">
                        <div>
                          <Label className="mb-[6px] block text-[11px] font-medium text-[#2A2A2A]">
                            Button Text
                          </Label>
                          <Input
                            value={form.buttonText}
                            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                            placeholder="VIEW MORE"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                        <div>
                          <Label className="mb-[6px] block text-[11px] font-medium text-[#2A2A2A]">
                            Button Link
                          </Label>
                          <Input
                            value={form.buttonLink}
                            onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                            placeholder="/about"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-[10px]">
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px]">
                            <Switch
                              checked={form.isActive}
                              onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                            />
                            <Label className="text-[12px] font-medium text-[#2A2A2A]">Active</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* IMAGES */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  <h4 className="text-[14px] font-semibold text-[#111111]">Images</h4>
                  <div className="mt-[12px] space-y-[12px]">
                    {renderImageUpload(form.image, 'image', 'Main Image', uploading)}
                    {renderImageUpload(form.imageTwo, 'imageTwo', 'Image Two', uploadingImageTwo)}
                  </div>
                </div>

                {/* COMPANY STATS */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  <h4 className="text-[14px] font-semibold text-[#111111]">Company Stats</h4>
                  <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
                    <div>
                      <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                        Founded Month
                      </Label>
                      <Input
                        value={form.foundedMonth}
                        onChange={(e) => setForm({ ...form, foundedMonth: e.target.value })}
                        placeholder="February"
                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>
                    <div>
                      <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                        Founded Year
                      </Label>
                      <Input
                        value={form.foundedYear}
                        onChange={(e) => setForm({ ...form, foundedYear: e.target.value })}
                        placeholder="2015"
                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>
                    <div>
                      <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                        Years of Excellence
                      </Label>
                      <Input
                        type="number"
                        value={form.yearsOfExcellence}
                        onChange={(e) => setForm({ ...form, yearsOfExcellence: Number(e.target.value) })}
                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>
                    <div>
                      <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                        Team Size
                      </Label>
                      <Input
                        type="number"
                        value={form.teamSize}
                        onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) })}
                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>
                  </div>
                </div>

                {/* MILESTONES */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  <button
                    onClick={() => setMilestonesExpanded(!milestonesExpanded)}
                    className="flex w-full items-center justify-between"
                  >
                    <h4 className="text-[14px] font-semibold text-[#111111]">
                      Milestones ({form.milestones.length})
                    </h4>
                    {milestonesExpanded ? (
                      <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                    ) : (
                      <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                    )}
                  </button>
                  {milestonesExpanded && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Section Title
                        </Label>
                        <Input
                          value={form.milestonesTitle}
                          onChange={(e) => setForm({ ...form, milestonesTitle: e.target.value })}
                          placeholder="Our Milestones"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Subtitle
                        </Label>
                        <Input
                          value={form.milestonesSubtitle}
                          onChange={(e) => setForm({ ...form, milestonesSubtitle: e.target.value })}
                          placeholder="Recognized Among the Top Global Design Installations"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>

                      {renderImageUpload(
                        form.milestonesImageOne,
                        'milestonesImageOne',
                        'Milestones Image One',
                        uploadingMilestoneImageOne
                      )}
                      {renderImageUpload(
                        form.milestonesImageTwo,
                        'milestonesImageTwo',
                        'Milestones Image Two',
                        uploadingMilestoneImageTwo
                      )}

                      <div className="mt-[8px] space-y-[8px]">
                        {form.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between rounded-[8px] border border-[#E4E4E4] bg-white p-[10px]"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-[6px]">
                                <span className="text-[10px] font-medium text-[#999]">#{milestone.order + 1}</span>
                                <h5 className="text-[12px] font-medium text-[#111111]">{milestone.title}</h5>
                              </div>
                              <p className="mt-[2px] text-[11px] text-[#666] line-clamp-2">{milestone.description}</p>
                              <div className="mt-[2px] text-[9px] font-mono text-[#999]">{milestone.icon}</div>
                            </div>
                            <div className="flex shrink-0 gap-[4px] ml-[8px]">
                              <button
                                onClick={() => moveMilestone(index, 'up')}
                                disabled={index === 0}
                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="h-[12px] w-[12px]" />
                              </button>
                              <button
                                onClick={() => moveMilestone(index, 'down')}
                                disabled={index === form.milestones.length - 1}
                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="h-[12px] w-[12px]" />
                              </button>
                              <Button
                                onClick={() => openMilestoneModal(index)}
                                variant="ghost"
                                size="sm"
                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                              >
                                <Pencil className="h-[12px] w-[12px]" />
                              </Button>
                              <Button
                                onClick={() => deleteMilestone(index)}
                                variant="ghost"
                                size="sm"
                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#DC2626]"
                              >
                                <Trash2 className="h-[12px] w-[12px]" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={() => openMilestoneModal()}
                          variant="outline"
                          className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC]"
                        >
                          <Plus className="h-[14px] w-[14px]" />
                          Add Milestone
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col-reverse gap-[10px] pt-[8px] sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting || uploading || uploadingImageTwo || uploadingMilestoneImageOne || uploadingMilestoneImageTwo}
                    className="h-[46px] rounded-[14px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[48px] sm:w-[120px]"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || uploading || uploadingImageTwo || uploadingMilestoneImageOne || uploadingMilestoneImageTwo}
                    className="h-[46px] gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-[160px]"
                  >
                    {submitting && <Loader2 className="h-[16px] w-[16px] animate-spin" />}
                    {aboutData ? "Save Changes" : "Create"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MILESTONE MODAL ================= */}
      <AnimatePresence>
        {milestoneModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeMilestoneModal}
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
                  {editingMilestoneIndex !== null ? "Edit Milestone" : "Add Milestone"}
                </h3>
                <button
                  onClick={closeMilestoneModal}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-[16px] space-y-[12px]">
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Title *
                  </Label>
                  <Input
                    value={tempMilestone.title}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, title: e.target.value })}
                    placeholder="Featured on ArchDaily"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Description *
                  </Label>
                  <Textarea
                    value={tempMilestone.description}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, description: e.target.value })}
                    placeholder="Milestone description..."
                    rows={2}
                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Icon (Font Awesome class)
                  </Label>
                  <Input
                    value={tempMilestone.icon}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, icon: e.target.value })}
                    placeholder="fa-solid fa-newspaper"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white font-mono text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Order
                  </Label>
                  <Input
                    type="number"
                    value={tempMilestone.order}
                    onChange={(e) => setTempMilestone({ ...tempMilestone, order: Number(e.target.value) })}
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeMilestoneModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveMilestone}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingMilestoneIndex !== null ? "Update" : "Add"}
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
                Delete about us content?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                All content including milestones will be permanently removed. This can't be undone.
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
                  {deletingId && <Loader2 className="h-[15px] w-[15px] animate-spin" />}
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

// Add missing ChevronUp and ChevronDown icons
const ChevronUp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);