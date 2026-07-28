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
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Heart,
  ThumbsUp,
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

interface ServiceItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ValueItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface WhyChooseUsItem {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutServicesResponse {
  servicesBadge: string;
  servicesTitle: string;
  servicesDescription: string;
  services: ServiceItem[];
  visionTitle: string;
  visionDescription: string;
  visionNumber: string;
  missionTitle: string;
  missionDescription: string;
  missionNumber: string;
  valuesTitle: string;
  valuesImageOne: string;
  valuesImageTwo: string;
  values: ValueItem[];
  whyChooseUsTitle: string;
  whyChooseUs: WhyChooseUsItem[];
  isActive: boolean;
}

interface AboutServices extends AboutServicesResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_SERVICE: ServiceItem = {
  title: "",
  description: "",
  icon: "fa-solid fa-cube",
  link: "/services/",
  order: 0,
};

const EMPTY_VALUE: ValueItem = {
  title: "",
  description: "",
  icon: "fa-solid fa-star",
  order: 0,
};

const EMPTY_WHY_CHOOSE: WhyChooseUsItem = {
  title: "",
  description: "",
  icon: "fa-solid fa-check",
  order: 0,
};

const EMPTY_FORM: AboutServicesResponse = {
  servicesBadge: "",
  servicesTitle: "",
  servicesDescription: "",
  services: [],
  visionTitle: "",
  visionDescription: "",
  visionNumber: "01",
  missionTitle: "",
  missionDescription: "",
  missionNumber: "02",
  valuesTitle: "",
  valuesImageOne: "",
  valuesImageTwo: "",
  values: [],
  whyChooseUsTitle: "",
  whyChooseUs: [],
  isActive: true,
};

export default function AboutServicesPage() {
  const [aboutData, setAboutData] = useState<AboutServices | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AboutServicesResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadingImageTwo, setUploadingImageTwo] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<AboutServices | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Nested array management
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);
  const [editingWhyChooseIndex, setEditingWhyChooseIndex] = useState<number | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [whyChooseModalOpen, setWhyChooseModalOpen] = useState(false);
  const [tempService, setTempService] = useState<ServiceItem>(EMPTY_SERVICE);
  const [tempValue, setTempValue] = useState<ValueItem>(EMPTY_VALUE);
  const [tempWhyChoose, setTempWhyChoose] = useState<WhyChooseUsItem>(EMPTY_WHY_CHOOSE);

  // Collapse states
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [valuesExpanded, setValuesExpanded] = useState(true);
  const [whyChooseExpanded, setWhyChooseExpanded] = useState(true);

  // ================= FETCH DATA =================

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/about-content");
      
      let data = null;
      if (Array.isArray(res.data)) {
        data = res.data.length > 0 ? res.data[0] : null;
      } else if (res.data && typeof res.data === 'object') {
        data = res.data;
      }
      
      setAboutData(data);
      
      if (data) {
        setForm({
          servicesBadge: data.servicesBadge || "",
          servicesTitle: data.servicesTitle || "",
          servicesDescription: data.servicesDescription || "",
          services: data.services || [],
          visionTitle: data.visionTitle || "",
          visionDescription: data.visionDescription || "",
          visionNumber: data.visionNumber || "01",
          missionTitle: data.missionTitle || "",
          missionDescription: data.missionDescription || "",
          missionNumber: data.missionNumber || "02",
          valuesTitle: data.valuesTitle || "",
          valuesImageOne: data.valuesImageOne || "",
          valuesImageTwo: data.valuesImageTwo || "",
          values: data.values || [],
          whyChooseUsTitle: data.whyChooseUsTitle || "",
          whyChooseUs: data.whyChooseUs || [],
          isActive: data.isActive ?? true,
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load about services data"
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
    if (aboutData) {
      setForm({
        servicesBadge: aboutData.servicesBadge || "",
        servicesTitle: aboutData.servicesTitle || "",
        servicesDescription: aboutData.servicesDescription || "",
        services: aboutData.services || [],
        visionTitle: aboutData.visionTitle || "",
        visionDescription: aboutData.visionDescription || "",
        visionNumber: aboutData.visionNumber || "01",
        missionTitle: aboutData.missionTitle || "",
        missionDescription: aboutData.missionDescription || "",
        missionNumber: aboutData.missionNumber || "02",
        valuesTitle: aboutData.valuesTitle || "",
        valuesImageOne: aboutData.valuesImageOne || "",
        valuesImageTwo: aboutData.valuesImageTwo || "",
        values: aboutData.values || [],
        whyChooseUsTitle: aboutData.whyChooseUsTitle || "",
        whyChooseUs: aboutData.whyChooseUs || [],
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploading || uploadingImageTwo) return;
    setModalOpen(false);
    if (aboutData) {
      setForm({
        servicesBadge: aboutData.servicesBadge || "",
        servicesTitle: aboutData.servicesTitle || "",
        servicesDescription: aboutData.servicesDescription || "",
        services: aboutData.services || [],
        visionTitle: aboutData.visionTitle || "",
        visionDescription: aboutData.visionDescription || "",
        visionNumber: aboutData.visionNumber || "01",
        missionTitle: aboutData.missionTitle || "",
        missionDescription: aboutData.missionDescription || "",
        missionNumber: aboutData.missionNumber || "02",
        valuesTitle: aboutData.valuesTitle || "",
        valuesImageOne: aboutData.valuesImageOne || "",
        valuesImageTwo: aboutData.valuesImageTwo || "",
        values: aboutData.values || [],
        whyChooseUsTitle: aboutData.whyChooseUsTitle || "",
        whyChooseUs: aboutData.whyChooseUs || [],
        isActive: aboutData.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async () => {
    if (!form.servicesTitle || !form.servicesDescription) {
      return toast.error("Services title and description are required");
    }

    try {
      setSubmitting(true);

      // Sort arrays by order before submitting
      const payload = {
        ...form,

        services: form.services.map(({ _id, createdAt, updatedAt, ...rest }) => rest),
        values: form.values.map(({ _id, createdAt, updatedAt, ...rest }) => rest),
        whyChooseUs: form.whyChooseUs.map(({ _id, createdAt, updatedAt, ...rest }) => rest),
      };

      if (aboutData && aboutData._id) {
        await api.patch(`/about-content`, payload);
        toast.success("About services updated");
      } else {
        await api.post("/about-content", payload);
        toast.success("About services created");
      }

      closeModal();
      fetchAboutData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (aboutData ? "Failed to update about services" : "Failed to create about services")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= TOGGLE ACTIVE =================

  const toggleActive = async (data: AboutServices) => {
    try {
      setTogglingId(data._id);
      await api.patch(`/about-content`, {
        isActive: !data.isActive,
      });
      setAboutData((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
      toast.success(!data.isActive ? "About services activated" : "About services deactivated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleImageOneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, valuesImageOne: result.url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleImageTwoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImageTwo(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, valuesImageTwo: result.url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImageTwo(false);
      e.target.value = "";
    }
  };

  // ================= DELETE =================

  const confirmDelete = (data: AboutServices) => setDeleteTarget(data);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/about-services/${deleteTarget._id}`);
      setAboutData(null);
      setForm(EMPTY_FORM);
      toast.success("About services deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete about services");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= NESTED ARRAY CRUD OPERATIONS =================

  // Services
  const openServiceModal = (index?: number) => {
    if (index !== undefined) {
      setEditingServiceIndex(index);
      setTempService({ ...form.services[index] });
    } else {
      setEditingServiceIndex(null);
      setTempService({ ...EMPTY_SERVICE, order: form.services.length });
    }
    setServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setServiceModalOpen(false);
    setEditingServiceIndex(null);
    setTempService(EMPTY_SERVICE);
  };

  const saveService = () => {
    if (!tempService.title || !tempService.description) {
      return toast.error("Title and description are required");
    }

    const services = [...form.services];
    if (editingServiceIndex !== null) {
      services[editingServiceIndex] = tempService;
    } else {
      services.push(tempService);
    }
    setForm({ ...form, services });
    closeServiceModal();
  };

  const deleteService = (index: number) => {
    const services = form.services.filter((_, i) => i !== index);
    setForm({ ...form, services });
  };

  // Values
  const openValueModal = (index?: number) => {
    if (index !== undefined) {
      setEditingValueIndex(index);
      setTempValue({ ...form.values[index] });
    } else {
      setEditingValueIndex(null);
      setTempValue({ ...EMPTY_VALUE, order: form.values.length });
    }
    setValueModalOpen(true);
  };

  const closeValueModal = () => {
    setValueModalOpen(false);
    setEditingValueIndex(null);
    setTempValue(EMPTY_VALUE);
  };

  const saveValue = () => {
    if (!tempValue.title || !tempValue.description) {
      return toast.error("Title and description are required");
    }

    const values = [...form.values];
    if (editingValueIndex !== null) {
      values[editingValueIndex] = tempValue;
    } else {
      values.push(tempValue);
    }
    setForm({ ...form, values });
    closeValueModal();
  };

  const deleteValue = (index: number) => {
    const values = form.values.filter((_, i) => i !== index);
    setForm({ ...form, values });
  };

  // Why Choose Us
  const openWhyChooseModal = (index?: number) => {
    if (index !== undefined) {
      setEditingWhyChooseIndex(index);
      setTempWhyChoose({ ...form.whyChooseUs[index] });
    } else {
      setEditingWhyChooseIndex(null);
      setTempWhyChoose({ ...EMPTY_WHY_CHOOSE, order: form.whyChooseUs.length });
    }
    setWhyChooseModalOpen(true);
  };

  const closeWhyChooseModal = () => {
    setWhyChooseModalOpen(false);
    setEditingWhyChooseIndex(null);
    setTempWhyChoose(EMPTY_WHY_CHOOSE);
  };

  const saveWhyChoose = () => {
    if (!tempWhyChoose.title || !tempWhyChoose.description) {
      return toast.error("Title and description are required");
    }

    const whyChooseUs = [...form.whyChooseUs];
    if (editingWhyChooseIndex !== null) {
      whyChooseUs[editingWhyChooseIndex] = tempWhyChoose;
    } else {
      whyChooseUs.push(tempWhyChoose);
    }
    setForm({ ...form, whyChooseUs });
    closeWhyChooseModal();
  };

  const deleteWhyChoose = (index: number) => {
    const whyChooseUs = form.whyChooseUs.filter((_, i) => i !== index);
    setForm({ ...form, whyChooseUs });
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

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            About Services Section
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage services, vision, mission, values, and why choose us content.
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
          {aboutData ? "Edit Content" : "Create About Services"}
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
              <Settings className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No about services content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create your about services section to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.15)] sm:rounded-[22px]">
            <CardContent className="p-[16px] sm:p-[24px] lg:p-[28px]">
              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-[12px] border-b border-[#E4C9B4]/30 pb-[16px]">
                <div>
                  <div className="flex flex-wrap items-center gap-[8px]">
                    {aboutData.servicesBadge && (
                      <span className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#C2410C] sm:text-[12px]">
                        {aboutData.servicesBadge}
                      </span>
                    )}
                    <button
                      onClick={() => toggleActive(aboutData)}
                      disabled={togglingId === aboutData._id}
                      className={`
                        rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm transition-colors sm:text-[11px]
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
                  </div>
                  <h3 className="mt-[4px] text-[18px] font-semibold text-[#111111] sm:text-[20px] lg:text-[22px]">
                    {aboutData.servicesTitle}
                  </h3>
                  <p className="mt-[4px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
                    {aboutData.servicesDescription}
                  </p>
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

              {/* Vision & Mission */}
              <div className="mt-[16px] grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                <div className="rounded-[12px] bg-[#FFF9F4] p-[14px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[24px] font-bold text-[#EA580C]">{aboutData.visionNumber}</span>
                    <h4 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      {aboutData.visionTitle}
                    </h4>
                  </div>
                  <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                    {aboutData.visionDescription}
                  </p>
                </div>
                <div className="rounded-[12px] bg-[#FFF9F4] p-[14px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[24px] font-bold text-[#EA580C]">{aboutData.missionNumber}</span>
                    <h4 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      {aboutData.missionTitle}
                    </h4>
                  </div>
                  <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                    {aboutData.missionDescription}
                  </p>
                </div>
              </div>

              {/* Services */}
              <div className="mt-[20px]">
                <button
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  className="flex w-full items-center justify-between py-[8px]"
                >
                  <h4 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                    Services ({form.services.length})
                  </h4>
                  {servicesExpanded ? (
                    <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                  ) : (
                    <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                  )}
                </button>
                {servicesExpanded && (
                  <div className="mt-[8px] space-y-[8px]">
                    {form.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded-[10px] border border-[#E4E4E4] bg-white p-[12px]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px]">
                            <span className="text-[10px] font-medium text-[#999]">
                              #{service.order}
                            </span>
                            <h5 className="text-[13px] font-medium text-[#111111] sm:text-[14px]">
                              {service.title}
                            </h5>
                          </div>
                          <p className="mt-[2px] text-[11px] text-[#666666] sm:text-[12px]">
                            {service.description}
                          </p>
                          <div className="mt-[4px] flex flex-wrap items-center gap-[8px] text-[10px] text-[#999] sm:text-[11px]">
                            <span className="font-mono">{service.icon}</span>
                            <span>•</span>
                            <span>{service.link}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-[4px]">
                          <Button
                            onClick={() => openServiceModal(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#EA580C]"
                          >
                            <Pencil className="h-[13px] w-[13px]" />
                          </Button>
                          <Button
                            onClick={() => deleteService(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#DC2626]"
                          >
                            <Trash2 className="h-[13px] w-[13px]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => openServiceModal()}
                      variant="outline"
                      className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[38px]"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Service
                    </Button>
                  </div>
                )}
              </div>

              {/* Values */}
              <div className="mt-[20px]">
                <button
                  onClick={() => setValuesExpanded(!valuesExpanded)}
                  className="flex w-full items-center justify-between py-[8px]"
                >
                  <h4 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                    Core Values ({form.values.length})
                  </h4>
                  {valuesExpanded ? (
                    <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                  ) : (
                    <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                  )}
                </button>
                {valuesExpanded && (
                  <div className="mt-[8px] space-y-[8px]">
                    {form.values.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded-[10px] border border-[#E4E4E4] bg-white p-[12px]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px]">
                            <span className="text-[10px] font-medium text-[#999]">
                              #{value.order}
                            </span>
                            <h5 className="text-[13px] font-medium text-[#111111] sm:text-[14px]">
                              {value.title}
                            </h5>
                          </div>
                          <p className="mt-[2px] text-[11px] text-[#666666] sm:text-[12px]">
                            {value.description}
                          </p>
                          <div className="mt-[4px] text-[10px] font-mono text-[#999] sm:text-[11px]">
                            {value.icon}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-[4px]">
                          <Button
                            onClick={() => openValueModal(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#EA580C]"
                          >
                            <Pencil className="h-[13px] w-[13px]" />
                          </Button>
                          <Button
                            onClick={() => deleteValue(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#DC2626]"
                          >
                            <Trash2 className="h-[13px] w-[13px]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => openValueModal()}
                      variant="outline"
                      className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[38px]"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Value
                    </Button>
                  </div>
                )}
              </div>

              {/* Why Choose Us */}
              <div className="mt-[20px]">
                <button
                  onClick={() => setWhyChooseExpanded(!whyChooseExpanded)}
                  className="flex w-full items-center justify-between py-[8px]"
                >
                  <h4 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                    Why Choose Us ({form.whyChooseUs.length})
                  </h4>
                  {whyChooseExpanded ? (
                    <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                  ) : (
                    <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                  )}
                </button>
                {whyChooseExpanded && (
                  <div className="mt-[8px] space-y-[8px]">
                    {form.whyChooseUs.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded-[10px] border border-[#E4E4E4] bg-white p-[12px]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-[8px]">
                            <span className="text-[10px] font-medium text-[#999]">
                              #{item.order}
                            </span>
                            <h5 className="text-[13px] font-medium text-[#111111] sm:text-[14px]">
                              {item.title}
                            </h5>
                          </div>
                          <p className="mt-[2px] text-[11px] text-[#666666] sm:text-[12px]">
                            {item.description}
                          </p>
                          <div className="mt-[4px] text-[10px] font-mono text-[#999] sm:text-[11px]">
                            {item.icon}
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-[4px]">
                          <Button
                            onClick={() => openWhyChooseModal(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#EA580C]"
                          >
                            <Pencil className="h-[13px] w-[13px]" />
                          </Button>
                          <Button
                            onClick={() => deleteWhyChoose(index)}
                            variant="ghost"
                            size="sm"
                            className="h-[28px] w-[28px] p-0 text-[#666] hover:text-[#DC2626]"
                          >
                            <Trash2 className="h-[13px] w-[13px]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => openWhyChooseModal()}
                      variant="outline"
                      className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[38px]"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Why Choose Us
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ================= MAIN CREATE/EDIT MODAL ================= */}
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
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[560px] sm:rounded-[28px] sm:p-[32px] md:max-w-[600px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {aboutData ? "Edit About Services" : "Add New About Services"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                {/* Services Badge */}
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Services Badge
                  </Label>
                  <Input
                    value={form.servicesBadge}
                    onChange={(e) =>
                      setForm({ ...form, servicesBadge: e.target.value })
                    }
                    placeholder="OUR CORE SERVICES"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                {/* Services Title */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Type className="h-[13px] w-[13px]" /> Services Title
                  </Label>
                  <Input
                    value={form.servicesTitle}
                    onChange={(e) =>
                      setForm({ ...form, servicesTitle: e.target.value })
                    }
                    placeholder="What we do"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                {/* Services Description */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <AlignLeft className="h-[13px] w-[13px]" /> Services Description
                  </Label>
                  <Textarea
                    value={form.servicesDescription}
                    onChange={(e) =>
                      setForm({ ...form, servicesDescription: e.target.value })
                    }
                    placeholder="Describe your services..."
                    rows={3}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>

                <hr className="border-[#E4E4E4]" />

                {/* Vision */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Eye className="h-[13px] w-[13px]" /> Vision Title
                  </Label>
                  <Input
                    value={form.visionTitle}
                    onChange={(e) =>
                      setForm({ ...form, visionTitle: e.target.value })
                    }
                    placeholder="Our Vision"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Vision Description
                  </Label>
                  <Textarea
                    value={form.visionDescription}
                    onChange={(e) =>
                      setForm({ ...form, visionDescription: e.target.value })
                    }
                    placeholder="Describe your vision..."
                    rows={2}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Vision Number
                  </Label>
                  <Input
                    value={form.visionNumber}
                    onChange={(e) =>
                      setForm({ ...form, visionNumber: e.target.value })
                    }
                    placeholder="01"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                <hr className="border-[#E4E4E4]" />

                {/* Mission */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <Target className="h-[13px] w-[13px]" /> Mission Title
                  </Label>
                  <Input
                    value={form.missionTitle}
                    onChange={(e) =>
                      setForm({ ...form, missionTitle: e.target.value })
                    }
                    placeholder="Our Mission"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Mission Description
                  </Label>
                  <Textarea
                    value={form.missionDescription}
                    onChange={(e) =>
                      setForm({ ...form, missionDescription: e.target.value })
                    }
                    placeholder="Describe your mission..."
                    rows={2}
                    className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Mission Number
                  </Label>
                  <Input
                    value={form.missionNumber}
                    onChange={(e) =>
                      setForm({ ...form, missionNumber: e.target.value })
                    }
                    placeholder="02"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                <hr className="border-[#E4E4E4]" />

                {/* Values Images */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ImageIcon className="h-[13px] w-[13px]" /> Values Image One
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="valuesImageOne"
                    onChange={handleImageOneUpload}
                  />
                  <div
                    onClick={() => !uploading && document.getElementById('valuesImageOne')?.click()}
                    className={`
                      relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
                      ${uploading ? "pointer-events-none opacity-70" : ""}
                    `}
                  >
                    {form.valuesImageOne ? (
                      <>
                        <Image
                          src={form.valuesImageOne}
                          alt="Values Image One"
                          fill
                          unoptimized
                          className="object-cover"
                        />
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
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
                      </div>
                    )}
                  </div>
                  <Input
                    value={form.valuesImageOne}
                    onChange={(e) =>
                      setForm({ ...form, valuesImageOne: e.target.value })
                    }
                    placeholder="Or paste image URL"
                    className="mt-[6px] h-[38px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>

                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ImageIcon className="h-[13px] w-[13px]" /> Values Image Two
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="valuesImageTwo"
                    onChange={handleImageTwoUpload}
                  />
                  <div
                    onClick={() => !uploadingImageTwo && document.getElementById('valuesImageTwo')?.click()}
                    className={`
                      relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
                      ${uploadingImageTwo ? "pointer-events-none opacity-70" : ""}
                    `}
                  >
                    {form.valuesImageTwo ? (
                      <>
                        <Image
                          src={form.valuesImageTwo}
                          alt="Values Image Two"
                          fill
                          unoptimized
                          className="object-cover"
                        />
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
                    {uploadingImageTwo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
                      </div>
                    )}
                  </div>
                  <Input
                    value={form.valuesImageTwo}
                    onChange={(e) =>
                      setForm({ ...form, valuesImageTwo: e.target.value })
                    }
                    placeholder="Or paste image URL"
                    className="mt-[6px] h-[38px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>

                <div>
                  <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                    Values Title
                  </Label>
                  <Input
                    value={form.valuesTitle}
                    onChange={(e) =>
                      setForm({ ...form, valuesTitle: e.target.value })
                    }
                    placeholder="Our Core Values"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                <hr className="border-[#E4E4E4]" />

                {/* Why Choose Us Title */}
                <div>
                  <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                    <ThumbsUp className="h-[13px] w-[13px]" /> Why Choose Us Title
                  </Label>
                  <Input
                    value={form.whyChooseUsTitle}
                    onChange={(e) =>
                      setForm({ ...form, whyChooseUsTitle: e.target.value })
                    }
                    placeholder="Why Choose Us"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                {/* Active */}
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

                {/* Actions */}
                <div className="flex flex-col-reverse gap-[10px] pt-[8px] sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting || uploading || uploadingImageTwo}
                    className="h-[46px] rounded-[14px] border-[#E4E4E4] text-[14px] font-medium text-[#666666] sm:h-[48px] sm:w-[120px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || uploading || uploadingImageTwo}
                    className="h-[46px] gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-[160px]"
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

      {/* ================= SERVICE MODAL ================= */}
      <AnimatePresence>
        {serviceModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeServiceModal}
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
                  {editingServiceIndex !== null ? "Edit Service" : "Add Service"}
                </h3>
                <button
                  onClick={closeServiceModal}
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
                    value={tempService.title}
                    onChange={(e) =>
                      setTempService({ ...tempService, title: e.target.value })
                    }
                    placeholder="Fit-out Solutions"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Description *
                  </Label>
                  <Textarea
                    value={tempService.description}
                    onChange={(e) =>
                      setTempService({ ...tempService, description: e.target.value })
                    }
                    placeholder="Complete interior fit-out solutions..."
                    rows={2}
                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Icon (Font Awesome class)
                  </Label>
                  <Input
                    value={tempService.icon}
                    onChange={(e) =>
                      setTempService({ ...tempService, icon: e.target.value })
                    }
                    placeholder="fa-solid fa-building"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] font-mono focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Link
                  </Label>
                  <Input
                    value={tempService.link}
                    onChange={(e) =>
                      setTempService({ ...tempService, link: e.target.value })
                    }
                    placeholder="/services/fitout-solutions"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Order
                  </Label>
                  <Input
                    type="number"
                    value={tempService.order}
                    onChange={(e) =>
                      setTempService({ ...tempService, order: Number(e.target.value) })
                    }
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeServiceModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveService}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingServiceIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= VALUE MODAL ================= */}
      <AnimatePresence>
        {valueModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeValueModal}
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
                  {editingValueIndex !== null ? "Edit Value" : "Add Value"}
                </h3>
                <button
                  onClick={closeValueModal}
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
                    value={tempValue.title}
                    onChange={(e) =>
                      setTempValue({ ...tempValue, title: e.target.value })
                    }
                    placeholder="Quality Craftsmanship"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Description *
                  </Label>
                  <Textarea
                    value={tempValue.description}
                    onChange={(e) =>
                      setTempValue({ ...tempValue, description: e.target.value })
                    }
                    placeholder="Delivering superior solutions..."
                    rows={2}
                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Icon (Font Awesome class)
                  </Label>
                  <Input
                    value={tempValue.icon}
                    onChange={(e) =>
                      setTempValue({ ...tempValue, icon: e.target.value })
                    }
                    placeholder="fa-solid fa-hammer"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] font-mono focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Order
                  </Label>
                  <Input
                    type="number"
                    value={tempValue.order}
                    onChange={(e) =>
                      setTempValue({ ...tempValue, order: Number(e.target.value) })
                    }
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeValueModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveValue}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingValueIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= WHY CHOOSE MODAL ================= */}
      <AnimatePresence>
        {whyChooseModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeWhyChooseModal}
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
                  {editingWhyChooseIndex !== null ? "Edit Why Choose Us" : "Add Why Choose Us"}
                </h3>
                <button
                  onClick={closeWhyChooseModal}
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
                    value={tempWhyChoose.title}
                    onChange={(e) =>
                      setTempWhyChoose({ ...tempWhyChoose, title: e.target.value })
                    }
                    placeholder="Comprehensive In-House Expertise"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Description *
                  </Label>
                  <Textarea
                    value={tempWhyChoose.description}
                    onChange={(e) =>
                      setTempWhyChoose({ ...tempWhyChoose, description: e.target.value })
                    }
                    placeholder="With a dedicated team of designers..."
                    rows={2}
                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Icon (Font Awesome class)
                  </Label>
                  <Input
                    value={tempWhyChoose.icon}
                    onChange={(e) =>
                      setTempWhyChoose({ ...tempWhyChoose, icon: e.target.value })
                    }
                    placeholder="fa-solid fa-users"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] font-mono focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Order
                  </Label>
                  <Input
                    type="number"
                    value={tempWhyChoose.order}
                    onChange={(e) =>
                      setTempWhyChoose({ ...tempWhyChoose, order: Number(e.target.value) })
                    }
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeWhyChooseModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveWhyChoose}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingWhyChooseIndex !== null ? "Update" : "Add"}
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
                Delete about services content?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                All services, values, and why choose us data will be permanently removed. This can't be undone.
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

// Missing Target icon - add this near the imports
const Target = ({ className }: { className?: string }) => (
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);