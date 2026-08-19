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
  Type,
  AlignLeft,
  ImageIcon,
  ImagePlus,
  Loader2,
  UploadCloud,
  Mail,
  Phone,
  MapPin,
  FileText,
  Send,
  User,
  Settings,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MessageCircle,
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

export interface FormField {
  _id?: string;
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactPageResponse {
  breadcrumbLabel: string;
  breadcrumbLink: string;
  currentPage: string;
  title: string;
  description: string;
  image: string;
  infoTitle: string;
  infoDescription: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  formTitle: string;
  formSubtitle: string;
  formButtonText: string;
  formFields: FormField[];
  isActive: boolean;
}

interface ContactPage extends ContactPageResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_FORM_FIELD: FormField = {
  name: "",
  type: "text",
  placeholder: "",
  required: true,
};

const EMPTY_FORM: ContactPageResponse = {
  breadcrumbLabel: "Home",
  breadcrumbLink: "/",
  currentPage: "Contact Us",
  title: "",
  description: "",
  image: "",
  infoTitle: "",
  infoDescription: "",
  address: "",
  phone1: "",
  phone2: "",
  email: "",
  formTitle: "Send A Message",
  formSubtitle: "We respond within 24 hours",
  formButtonText: "Send A Message",
  formFields: [],
  isActive: true,
};

const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "tel" },
  { label: "Textarea", value: "textarea" },
  { label: "Number", value: "number" },
];

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactPage | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ContactPageResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ContactPage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form field modal
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [tempField, setTempField] = useState<FormField>(EMPTY_FORM_FIELD);

  // Collapse states
  const [sections, setSections] = useState({
    basic: true,
    hero: true,
    info: true,
    contact: true,
    form: true,
  });

  // ================= FETCH DATA =================

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contact-page");
      
      let data = null;
      if (Array.isArray(res.data)) {
        data = res.data.length > 0 ? res.data[0] : null;
      } else if (res.data && typeof res.data === 'object') {
        data = res.data;
      }
      
      setContactData(data);
      
      if (data) {
        setForm({
          breadcrumbLabel: data.breadcrumbLabel || "Home",
          breadcrumbLink: data.breadcrumbLink || "/",
          currentPage: data.currentPage || "Contact Us",
          title: data.title || "",
          description: data.description || "",
          image: data.image || "",
          infoTitle: data.infoTitle || "",
          infoDescription: data.infoDescription || "",
          address: data.address || "",
          phone1: data.phone1 || "",
          phone2: data.phone2 || "",
          email: data.email || "",
          formTitle: data.formTitle || "Send A Message",
          formSubtitle: data.formSubtitle || "We respond within 24 hours",
          formButtonText: data.formButtonText || "Send A Message",
          formFields: data.formFields || [],
          isActive: data.isActive ?? true,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load contact page data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // ================= MODAL HELPERS =================

  const openCreateModal = () => {
    if (contactData) {
      setForm({
        breadcrumbLabel: contactData.breadcrumbLabel || "Home",
        breadcrumbLink: contactData.breadcrumbLink || "/",
        currentPage: contactData.currentPage || "Contact Us",
        title: contactData.title || "",
        description: contactData.description || "",
        image: contactData.image || "",
        infoTitle: contactData.infoTitle || "",
        infoDescription: contactData.infoDescription || "",
        address: contactData.address || "",
        phone1: contactData.phone1 || "",
        phone2: contactData.phone2 || "",
        email: contactData.email || "",
        formTitle: contactData.formTitle || "Send A Message",
        formSubtitle: contactData.formSubtitle || "We respond within 24 hours",
        formButtonText: contactData.formButtonText || "Send A Message",
        formFields: contactData.formFields || [],
        isActive: contactData.isActive ?? true,
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploading) return;
    setModalOpen(false);
    if (contactData) {
      setForm({
        breadcrumbLabel: contactData.breadcrumbLabel || "Home",
        breadcrumbLink: contactData.breadcrumbLink || "/",
        currentPage: contactData.currentPage || "Contact Us",
        title: contactData.title || "",
        description: contactData.description || "",
        image: contactData.image || "",
        infoTitle: contactData.infoTitle || "",
        infoDescription: contactData.infoDescription || "",
        address: contactData.address || "",
        phone1: contactData.phone1 || "",
        phone2: contactData.phone2 || "",
        email: contactData.email || "",
        formTitle: contactData.formTitle || "Send A Message",
        formSubtitle: contactData.formSubtitle || "We respond within 24 hours",
        formButtonText: contactData.formButtonText || "Send A Message",
        formFields: contactData.formFields || [],
        isActive: contactData.isActive ?? true,
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
        formFields: form.formFields.map((field, index) => ({
          ...field,
          order: index,
        })),
      };

      if (contactData && contactData._id) {
        await api.patch(`/contact-page`, payload);
        toast.success("Contact page updated");
      } else {
        await api.post("/contact-page", payload);
        toast.success("Contact page created");
      }

      closeModal();
      fetchContactData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (contactData ? "Failed to update contact page" : "Failed to create contact page")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ================= TOGGLE ACTIVE =================

  const toggleActive = async (data: ContactPage) => {
    try {
      setTogglingId(data._id);
      await api.patch(`/contact-page/${data._id}`, {
        isActive: !data.isActive,
      });
      setContactData((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
      toast.success(!data.isActive ? "Contact page activated" : "Contact page deactivated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      e.target.value = "";
    }
  };

  // ================= DELETE =================

  const confirmDelete = (data: ContactPage) => setDeleteTarget(data);
  const cancelDelete = () => {
    if (deletingId) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/contact-page/${deleteTarget._id}`);
      setContactData(null);
      setForm(EMPTY_FORM);
      toast.success("Contact page deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete contact page");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FORM FIELD CRUD =================

  const openFieldModal = (index: number | null = null) => {
    if (index !== null && form.formFields[index]) {
      setEditingFieldIndex(index);
      setTempField({ ...form.formFields[index] });
    } else {
      setEditingFieldIndex(null);
      setTempField({ ...EMPTY_FORM_FIELD });
    }
    setFieldModalOpen(true);
  };

  const closeFieldModal = () => {
    setFieldModalOpen(false);
    setEditingFieldIndex(null);
    setTempField(EMPTY_FORM_FIELD);
  };

  const saveField = () => {
    if (!tempField.name || !tempField.placeholder) {
      return toast.error("Field name and placeholder are required");
    }

    const formFields = [...form.formFields];
    if (editingFieldIndex !== null) {
      formFields[editingFieldIndex] = tempField;
    } else {
      formFields.push(tempField);
    }
    setForm({ ...form, formFields });
    closeFieldModal();
  };

  const deleteField = (index: number) => {
    const formFields = form.formFields.filter((_, i) => i !== index);
    setForm({ ...form, formFields });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= form.formFields.length) return;

    const newFormFields = [...form.formFields];
    const [movedItem] = newFormFields.splice(index, 1);
    newFormFields.splice(newIndex, 0, movedItem);

    setForm({ ...form, formFields: newFormFields });
  };

  // ================= RENDER HELPERS =================

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderSectionHeader = (title: string, icon?: React.ReactNode) => {
    const sectionKey = title.toLowerCase().replace(/\s+/g, '') as keyof typeof sections;
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex w-full items-center justify-between py-[8px]"
      >
        <div className="flex items-center gap-[8px]">
          {icon}
          <h4 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
            {title}
          </h4>
        </div>
        {sections[sectionKey] ? (
          <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
        ) : (
          <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
        )}
      </button>
    );
  };

  const renderImageUpload = () => (
    <div>
      <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
        Hero Image
      </Label>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="contactImage"
        onChange={handleImageUpload}
      />
      <div
        onClick={() => !uploading && document.getElementById('contactImage')?.click()}
        className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
      >
        {form.image ? (
          <>
            <Image
              src={form.image}
              alt="Contact hero"
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
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
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
            Contact Page
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage contact page content, form fields, and contact information.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          {contactData ? "Edit Content" : "Create Contact Page"}
        </Button>
      </div>

      {/* CONTENT */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : !contactData ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <MessageCircle className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No contact page content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create your contact page to get started.
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
                    <div>
                      <p className="text-[11px] text-[#999]">
                        {contactData.breadcrumbLabel} / {contactData.currentPage}
                      </p>
                      <h3 className="text-[17px] font-semibold text-[#111111] sm:text-[19px] lg:text-[21px]">
                        {contactData.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleActive(contactData)}
                      disabled={togglingId === contactData._id}
                      className={`
                        rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm transition-colors sm:text-[11px]
                        ${
                          contactData.isActive
                            ? "bg-[#16A34A]/90 text-white"
                            : "bg-black/40 text-white/80"
                        }
                      `}
                    >
                      {togglingId === contactData._id
                        ? "..."
                        : contactData.isActive
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </div>
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
                    onClick={() => confirmDelete(contactData)}
                    variant="outline"
                    className="h-[34px] w-[34px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[36px] sm:w-[36px]"
                  >
                    <Trash2 className="h-[14px] w-[14px]" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mt-[16px]">
                <p className="text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
                  {contactData.description}
                </p>
              </div>

              {/* Image */}
              {contactData.image && (
                <div className="mt-[16px] relative h-[160px] w-full overflow-hidden rounded-[12px] bg-[#F1E4D8] sm:h-[200px]">
                  <Image
                    src={contactData.image}
                    alt={contactData.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}

              {/* Info Section */}
              <div className="mt-[16px] rounded-[12px] bg-[#FFF9F4] p-[16px]">
                <h4 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                  {contactData.infoTitle}
                </h4>
                <p className="mt-[4px] text-[13px] leading-[1.6] text-[#666666]">
                  {contactData.infoDescription}
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-[16px] grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-4">
                {contactData.address && (
                  <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                    <MapPin className="h-[16px] w-[16px] text-[#EA580C]" />
                    <span className="text-[12px] text-[#666] line-clamp-1">{contactData.address}</span>
                  </div>
                )}
                {contactData.phone1 && (
                  <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                    <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                    <span className="text-[12px] text-[#666]">{contactData.phone1}</span>
                  </div>
                )}
                {contactData.phone2 && (
                  <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                    <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                    <span className="text-[12px] text-[#666]">{contactData.phone2}</span>
                  </div>
                )}
                {contactData.email && (
                  <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                    <Mail className="h-[16px] w-[16px] text-[#EA580C]" />
                    <span className="text-[12px] text-[#666]">{contactData.email}</span>
                  </div>
                )}
              </div>

              {/* Form Fields Count */}
              <div className="mt-[16px] flex items-center gap-[12px]">
                <div className="rounded-[8px] bg-[#FFF9F4] px-[12px] py-[6px]">
                  <span className="text-[12px] font-medium text-[#111111]">
                    Form Fields: {contactData.formFields.length}
                  </span>
                </div>
                <div className="rounded-[8px] bg-[#FFF9F4] px-[12px] py-[6px]">
                  <span className="text-[12px] font-medium text-[#111111]">
                    {contactData.formTitle}
                  </span>
                </div>
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
                  {contactData ? "Edit Contact Page" : "Add New Contact Page"}
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
                  {renderSectionHeader("Basic Info", <Settings className="h-[16px] w-[16px]" />)}
                  {sections.basic && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div className="grid grid-cols-2 gap-[10px]">
                        <div>
                          <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                            Breadcrumb Label
                          </Label>
                          <Input
                            value={form.breadcrumbLabel}
                            onChange={(e) => setForm({ ...form, breadcrumbLabel: e.target.value })}
                            placeholder="Home"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                        <div>
                          <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                            Breadcrumb Link
                          </Label>
                          <Input
                            value={form.breadcrumbLink}
                            onChange={(e) => setForm({ ...form, breadcrumbLink: e.target.value })}
                            placeholder="/"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Current Page
                        </Label>
                        <Input
                          value={form.currentPage}
                          onChange={(e) => setForm({ ...form, currentPage: e.target.value })}
                          placeholder="Contact Us"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Title *
                        </Label>
                        <Input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="Get in Touch with Us"
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
                          placeholder="Page description..."
                          rows={2}
                          className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      {renderImageUpload()}
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

                {/* INFO SECTION */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  {renderSectionHeader("Info Section", <FileText className="h-[16px] w-[16px]" />)}
                  {sections.info && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Info Title
                        </Label>
                        <Input
                          value={form.infoTitle}
                          onChange={(e) => setForm({ ...form, infoTitle: e.target.value })}
                          placeholder="Fill out the form & get a call back!"
                          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Info Description
                        </Label>
                        <Textarea
                          value={form.infoDescription}
                          onChange={(e) => setForm({ ...form, infoDescription: e.target.value })}
                          placeholder="Info description..."
                          rows={2}
                          className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CONTACT INFO */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  {renderSectionHeader("Contact Details", <Phone className="h-[16px] w-[16px]" />)}
                  {sections.contact && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Address
                        </Label>
                        <Input
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          placeholder="Al Quoz Industrial Area 1, Dubai, UAE"
                          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-[10px]">
                        <div>
                          <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                            Phone 1
                          </Label>
                          <Input
                            value={form.phone1}
                            onChange={(e) => setForm({ ...form, phone1: e.target.value })}
                            placeholder="+971565066845"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                        <div>
                          <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                            Phone 2
                          </Label>
                          <Input
                            value={form.phone2}
                            onChange={(e) => setForm({ ...form, phone2: e.target.value })}
                            placeholder="+971527875262"
                            className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Email
                        </Label>
                        <Input
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="marketing@wwduae.ae"
                          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* FORM SECTION */}
                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                  {renderSectionHeader("Form Settings", <Send className="h-[16px] w-[16px]" />)}
                  {sections.form && (
                    <div className="mt-[12px] space-y-[12px]">
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Form Title
                        </Label>
                        <Input
                          value={form.formTitle}
                          onChange={(e) => setForm({ ...form, formTitle: e.target.value })}
                          placeholder="Send A Message"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Form Subtitle
                        </Label>
                        <Input
                          value={form.formSubtitle}
                          onChange={(e) => setForm({ ...form, formSubtitle: e.target.value })}
                          placeholder="We respond within 24 hours"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                      <div>
                        <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                          Button Text
                        </Label>
                        <Input
                          value={form.formButtonText}
                          onChange={(e) => setForm({ ...form, formButtonText: e.target.value })}
                          placeholder="Send A Message"
                          className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>

                      <div>
                        <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                          Form Fields ({form.formFields.length})
                        </Label>
                        <div className="space-y-[8px]">
                          {form.formFields.map((field, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between rounded-[8px] border border-[#E4E4E4] bg-white p-[10px]"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-[6px]">
                                  <span className="text-[10px] font-medium text-[#999]">#{index + 1}</span>
                                  <h5 className="text-[12px] font-medium text-[#111111]">{field.name}</h5>
                                  <span className="text-[10px] text-[#999]">({field.type})</span>
                                  {field.required && (
                                    <span className="text-[10px] text-[#DC2626]">*</span>
                                  )}
                                </div>
                                <p className="mt-[2px] text-[10px] text-[#999]">
                                  Placeholder: {field.placeholder}
                                </p>
                              </div>
                              <div className="flex shrink-0 gap-[4px] ml-[8px]">
                                <button
                                  onClick={() => moveField(index, 'up')}
                                  disabled={index === 0}
                                  className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowUp className="h-[12px] w-[12px]" />
                                </button>
                                <button
                                  onClick={() => moveField(index, 'down')}
                                  disabled={index === form.formFields.length - 1}
                                  className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowDown className="h-[12px] w-[12px]" />
                                </button>
                                <Button
                                  onClick={() => openFieldModal(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                                >
                                  <Pencil className="h-[12px] w-[12px]" />
                                </Button>
                                <Button
                                  onClick={() => deleteField(index)}
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
                            onClick={() => openFieldModal()}
                            variant="outline"
                            className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC]"
                          >
                            <Plus className="h-[14px] w-[14px]" />
                            Add Form Field
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
                    className="h-[46px] gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-[160px]"
                  >
                    {submitting && <Loader2 className="h-[16px] w-[16px] animate-spin" />}
                    {contactData ? "Save Changes" : "Create"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FORM FIELD MODAL ================= */}
      <AnimatePresence>
        {fieldModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeFieldModal}
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
                  {editingFieldIndex !== null ? "Edit Form Field" : "Add Form Field"}
                </h3>
                <button
                  onClick={closeFieldModal}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-[16px] space-y-[12px]">
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Field Name *
                  </Label>
                  <Input
                    value={tempField.name}
                    onChange={(e) => setTempField({ ...tempField, name: e.target.value })}
                    placeholder="email"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Field Type
                  </Label>
                  <select
                    value={tempField.type}
                    onChange={(e) => setTempField({ ...tempField, type: e.target.value })}
                    className="h-[42px] w-full rounded-[10px] border border-[#E4E4E4] bg-white px-[12px] text-[13px] focus-visible:ring-[#EA580C]/30"
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Placeholder *
                  </Label>
                  <Input
                    value={tempField.placeholder}
                    onChange={(e) => setTempField({ ...tempField, placeholder: e.target.value })}
                    placeholder="Enter your email"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div className="flex items-center gap-[8px]">
                  <Switch
                    checked={tempField.required}
                    onCheckedChange={(checked) => setTempField({ ...tempField, required: checked })}
                  />
                  <Label className="text-[12px] font-medium text-[#2A2A2A]">Required Field</Label>
                </div>
                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeFieldModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveField}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingFieldIndex !== null ? "Update" : "Add"}
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
                Delete contact page content?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                All contact page content including form fields will be permanently removed. This can't be undone.
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

// ================= ICON COMPONENTS =================

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