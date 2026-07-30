"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  ExternalLink,
  GripVertical,
  ImageIcon,
  ImagePlus,
  Layers,
  Loader2,
  Plus,
  Save,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { fileUpload } from "@/app/api/admin/upload/upload";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";

// ===================== TYPES =====================

interface StatFields {
  yearsOfExcellence: number;
  yearsLabel: string;
  skilledProfessionals: number;
  professionalsLabel: string;
  successfulProjects: number;
  projectsLabel: string;
  happyClients: number;
  clientsLabel: string;
}

interface WhoWeServeItem {
  title: string;
  description: string;
  image?: string;
  icon: string;
  link?: string | null;
}

// FIX: whoWeServe from the API is an object with title/description/items,
// not a bare array of items. This matches the real shape.
interface WhoWeServe {
  title: string;
  description: string;
  items: WhoWeServeItem[];
}

interface WhatIsIncludedItem {
  title: string;
  description: string;
  icon: string;
}

// FIX: same issue as whoWeServe — whatIsIncluded is an object with
// title/description/items, not a bare array.
interface WhatIsIncluded {
  title: string;
  description: string;
  items: WhatIsIncludedItem[];
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

interface MaterialItem {
  name: string;
  description: string;
  image?: string;
  icon: string;
}

interface WhyChooseItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ContactField {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface TrustedImage {
  url: string;
  title: string;
  description: string;
}

interface TrustedJoineryWorks {
  title: string;
  description: string;
  images: TrustedImage[];
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  icon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  parentService: string | null;
  createdAt: string;
  updatedAt: string;
  stats: StatFields;
  whoWeServe: WhoWeServe;
  whatIsIncluded: WhatIsIncluded;
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    whatsappText: string;
    image?: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    foundedYear: string;
    outlets: number;
    teamSize: number;
    factoryInfo: string;
  };
  process: {
    title: string;
    description: string;
    steps: ProcessStep[];
  };
  materials: {
    title: string;
    description: string;
    items: MaterialItem[];
  };
  whyChooseUs: {
    title: string;
    items: WhyChooseItem[];
  };
  faqs: FaqItem[];
  contact: {
    title: string;
    description: string;
    fields: ContactField[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  trustedJoineryWorks: TrustedJoineryWorks;
}

// ===================== HELPERS =====================

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ===================== SMALL UI HELPERS =====================

function Field({
  label,
  children,
  hasChanged = false,
}: {
  label: string;
  children: React.ReactNode;
  hasChanged?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[6px]">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
          {label}
        </label>
        {hasChanged && (
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
            Changed
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors";

const inputChangedCls =
  "w-full rounded-[10px] border-2 border-[#EA580C] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors";

const textareaCls =
  "w-full rounded-[10px] border border-[#E4C9B4] bg-white px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors resize-y min-h-[80px]";

const textareaChangedCls =
  "w-full rounded-[10px] border-2 border-[#EA580C] bg-[#FFF9F4] px-[12px] py-[9px] text-[13px] text-[#111111] placeholder:text-[#BBBBBB] focus:border-[#EA580C] focus:outline-none transition-colors resize-y min-h-[80px]";

// ===================== TABS =====================

const TABS = [
  "Basic",
  "Hero",
  "Stats",
  "Who We Serve",
  "What's Included",
  "CTA",
  "About",
  "Process",
  "Materials",
  "Why Choose Us",
  "FAQs",
  "Contact",
  "SEO",
  "Trusted Works",
] as const;

type TabName = (typeof TABS)[number];

// ===================== IMAGE UPLOAD COMPONENT =====================

function ImageUpload({
  value,
  onChange,
  label,
  uploading,
  setUploading,
  hasChanged = false,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged?: boolean;
}) {
  const uniqueId = useId();
  const inputId = `upload-${uniqueId}`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await fileUpload(file);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="mb-[6px] flex items-center gap-[6px]">
        <Label className="text-[12px] font-medium text-[#2A2A2A]">{label}</Label>
        {hasChanged && (
          <span className="flex items-center gap-[4px] text-[10px] font-medium text-[#EA580C]">
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C]" />
            Changed
          </span>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={inputId}
        onChange={handleFileUpload}
      />
      <div
        onClick={() => !uploading && document.getElementById(inputId)?.click()}
        className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
          ${hasChanged ? "border-2 border-[#EA580C] bg-[#FFF9F4]" : ""}
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
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
          </div>
        )}
      </div>
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        className={`mt-[4px] h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30 ${hasChanged ? "border-2 border-[#EA580C] bg-[#FFF9F4]" : ""}`}
      />
    </div>
  );
}

// ===================== REUSABLE ITEM CARD =====================

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E4C9B4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[14px] py-[11px] text-left"
      >
        <span className="truncate text-[13px] font-medium text-[#333333]">{title}</span>
        <div className="flex items-center gap-[8px]">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), onRemove())}
            className="rounded-[6px] p-[4px] text-[#DC2626] transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-[13px] w-[13px]" />
          </span>
          {open ? (
            <ChevronUp className="h-[14px] w-[14px] text-[#888888]" />
          ) : (
            <ChevronDown className="h-[14px] w-[14px] text-[#888888]" />
          )}
        </div>
      </button>
      {open && (
        <div className="border-t border-[#F1E4D8] p-[14px]">
          {children}
        </div>
      )}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[6px] self-start rounded-[10px] border border-dashed border-[#E4C9B4] px-[14px] py-[9px] text-[12px] font-medium text-[#C2410C] transition-colors hover:border-[#EA580C] hover:bg-[#FFF4EC]"
    >
      <Plus className="h-[13px] w-[13px]" />
      {label}
    </button>
  );
}

// ===================== MODAL =====================

function ServiceEditModal({
  service: initialService,
  onClose,
  onSaved,
}: {
  service: Service;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Service>(() => {
    const cloned = deepClone(initialService);
    // Ensure all nested objects exist
    if (!cloned.stats) {
      cloned.stats = {
        yearsOfExcellence: 0,
        yearsLabel: "Years of Excellence",
        skilledProfessionals: 0,
        professionalsLabel: "Skilled professionals",
        successfulProjects: 0,
        projectsLabel: "Successful projects",
        happyClients: 0,
        clientsLabel: "Happy Clients",
      };
    }

    // FIX: whoWeServe/whatIsIncluded are OBJECTS ({ title, description, items })
    // in the API response, not bare arrays. The old code checked
    // Array.isArray(cloned.whoWeServe) and reset it to [] whenever it was an
    // object — which is always, since the API never sends a bare array. That
    // wiped out the real data on every modal open. Guard against the object
    // shape instead, and only default the nested `items` array when missing.
    if (
      !cloned.whoWeServe ||
      typeof cloned.whoWeServe !== "object" ||
      Array.isArray(cloned.whoWeServe)
    ) {
      cloned.whoWeServe = { title: "", description: "", items: [] };
    }
    if (!Array.isArray(cloned.whoWeServe.items)) {
      cloned.whoWeServe.items = [];
    }

    if (
      !cloned.whatIsIncluded ||
      typeof cloned.whatIsIncluded !== "object" ||
      Array.isArray(cloned.whatIsIncluded)
    ) {
      cloned.whatIsIncluded = { title: "", description: "", items: [] };
    }
    if (!Array.isArray(cloned.whatIsIncluded.items)) {
      cloned.whatIsIncluded.items = [];
    }

    if (!cloned.cta) {
      cloned.cta = { title: "", subtitle: "", buttonText: "", whatsappText: "", image: "" };
    }
    if (!cloned.about) {
      cloned.about = { title: "", description: "", image: "", foundedYear: "", outlets: 0, teamSize: 0, factoryInfo: "" };
    }
    if (!cloned.process) {
      cloned.process = { title: "", description: "", steps: [] };
    }
    if (!cloned.process.steps) {
      cloned.process.steps = [];
    }
    if (!cloned.materials) {
      cloned.materials = { title: "", description: "", items: [] };
    }
    if (!cloned.materials.items) {
      cloned.materials.items = [];
    }
    if (!cloned.whyChooseUs) {
      cloned.whyChooseUs = { title: "", items: [] };
    }
    if (!cloned.whyChooseUs.items) {
      cloned.whyChooseUs.items = [];
    }
    if (!cloned.faqs) {
      cloned.faqs = [];
    }
    if (!cloned.contact) {
      cloned.contact = { title: "", description: "", fields: [] };
    }
    if (!cloned.contact.fields) {
      cloned.contact.fields = [];
    }
    if (!cloned.seo) {
      cloned.seo = { metaTitle: "", metaDescription: "", keywords: [] };
    }
    if (!cloned.seo.keywords) {
      cloned.seo.keywords = [];
    }
    if (!cloned.trustedJoineryWorks) {
      cloned.trustedJoineryWorks = { title: "", description: "", images: [] };
    }
    if (!cloned.trustedJoineryWorks.images) {
      cloned.trustedJoineryWorks.images = [];
    }
    return cloned;
  });
  const [originalForm] = useState<Service>(() => deepClone(initialService));
  const [activeTab, setActiveTab] = useState<TabName>("Basic");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingCta, setUploadingCta] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);

  // Check if a field has changed
  const hasChanged = (path: string): boolean => {
    const keys = path.split(".");
    let formValue: any = form;
    let originalValue: any = originalForm;

    for (const key of keys) {
      if (formValue === undefined || formValue === null) return false;
      if (originalValue === undefined || originalValue === null) return false;
      formValue = formValue[key];
      originalValue = originalValue[key];
    }

    return JSON.stringify(formValue) !== JSON.stringify(originalValue);
  };

  // Check if a tab has any changes
  const tabHasChanges = (tab: TabName): boolean => {
    switch(tab) {
      case "Basic":
        return hasChanged("title") || hasChanged("slug") || hasChanged("icon") ||
               hasChanged("order") || hasChanged("image") || hasChanged("shortDescription") ||
               hasChanged("fullDescription") || hasChanged("isActive") || hasChanged("isFeatured") ||
               hasChanged("parentService");
      case "Hero":
        return hasChanged("heroTitle") || hasChanged("heroSubtitle") || hasChanged("heroImage");
      case "Stats":
        return hasChanged("stats");
      case "Who We Serve":
        return hasChanged("whoWeServe");
      case "What's Included":
        return hasChanged("whatIsIncluded");
      case "CTA":
        return hasChanged("cta");
      case "About":
        return hasChanged("about");
      case "Process":
        return hasChanged("process");
      case "Materials":
        return hasChanged("materials");
      case "Why Choose Us":
        return hasChanged("whyChooseUs");
      case "FAQs":
        return hasChanged("faqs");
      case "Contact":
        return hasChanged("contact");
      case "SEO":
        return hasChanged("seo");
      case "Trusted Works":
        return hasChanged("trustedJoineryWorks");
      default:
        return false;
    }
  };

  const setField = (path: string, value: unknown) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      const keys = path.split(".");
      let cur: any = clone;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { _id, __v, ...cleanPayload } = form as Service & { __v?: number };
      await api.patch(`/services/${form._id}`, cleanPayload);
      toast.success("Service updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[3px] sm:items-center sm:p-[16px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.22 }}
        className="relative flex w-full max-w-[860px] flex-col overflow-hidden rounded-t-[24px] bg-[#FFF4EC] shadow-2xl sm:max-h-[92vh] sm:rounded-[24px]"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px] sm:py-[16px]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#EA580C]">
              Edit Service
            </p>
            <h2 className="mt-[1px] text-[16px] font-semibold text-[#111111] sm:text-[18px]">
              {form.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-[7px] text-[#888888] transition-colors hover:bg-[#F1E4D8] hover:text-[#111111]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="shrink-0 overflow-x-auto border-b border-[#E4C9B4] bg-white">
          <div className="flex min-w-max px-[20px] sm:px-[28px]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-[2px] px-[12px] py-[10px] text-[12px] font-medium whitespace-nowrap transition-colors sm:text-[13px] flex items-center gap-[6px] ${
                  activeTab === tab
                    ? "border-[#EA580C] text-[#EA580C]"
                    : "border-transparent text-[#888888] hover:text-[#333333]"
                }`}
              >
                {tab}
                {tabHasChanges(tab) && (
                  <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-[20px] sm:p-[28px]">
          {activeTab === "Basic" && (
            <BasicTab
              form={form}
              setField={setField}
              uploading={uploading}
              setUploading={setUploading}
              hasChanged={hasChanged}
            />
          )}
          {activeTab === "Hero" && (
            <HeroTab
              form={form}
              setField={setField}
              uploading={uploadingHero}
              setUploading={setUploadingHero}
              hasChanged={hasChanged}
            />
          )}
          {activeTab === "Stats" && (
            <StatsTab form={form} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "Who We Serve" && (
            <WhoWeServeTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "What's Included" && (
            <WhatIsIncludedTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "CTA" && (
            <CtaTab
              form={form}
              setField={setField}
              uploading={uploadingCta}
              setUploading={setUploadingCta}
              hasChanged={hasChanged}
            />
          )}
          {activeTab === "About" && (
            <AboutTab
              form={form}
              setField={setField}
              uploading={uploadingAbout}
              setUploading={setUploadingAbout}
              hasChanged={hasChanged}
            />
          )}
          {activeTab === "Process" && (
            <ProcessTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "Materials" && (
            <MaterialsTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "Why Choose Us" && (
            <WhyChooseUsTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "FAQs" && (
            <FaqsTab form={form} setForm={setForm} hasChanged={hasChanged} />
          )}
          {activeTab === "Contact" && (
            <ContactTab form={form} setField={setField} hasChanged={hasChanged} />
          )}
          {activeTab === "SEO" && (
            <SeoTab form={form} setField={setField} setForm={setForm} hasChanged={hasChanged} />
          )}
          {activeTab === "Trusted Works" && (
            <TrustedWorksTab form={form} setForm={setForm} setField={setField} hasChanged={hasChanged} />
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-[10px] border-t border-[#E4C9B4] bg-white px-[20px] py-[14px] sm:px-[28px]">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-[#E4C9B4] bg-white px-[16px] py-[9px] text-[13px] font-medium text-[#666666] transition-colors hover:bg-[#F9EEE6]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-[7px] rounded-[10px] bg-[#EA580C] px-[18px] py-[9px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-[14px] w-[14px] animate-spin" />
            ) : (
              <Save className="h-[14px] w-[14px]" />
            )}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ===================== TAB PANELS =====================

function BasicTab({
  form,
  setField,
  uploading,
  setUploading,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged: (path: string) => boolean;
}) {
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <Field label="Title" hasChanged={hasChanged("title")}>
        <input className={getInputClass("title")} value={form.title} onChange={(e) => setField("title", e.target.value)} />
      </Field>
      <Field label="Slug" hasChanged={hasChanged("slug")}>
        <input className={getInputClass("slug")} value={form.slug} onChange={(e) => setField("slug", e.target.value)} />
      </Field>
      <Field label="Icon" hasChanged={hasChanged("icon")}>
        <input className={getInputClass("icon")} value={form.icon} onChange={(e) => setField("icon", e.target.value)} placeholder="fa-solid fa-hammer" />
      </Field>
      <Field label="Order" hasChanged={hasChanged("order")}>
        <input type="number" className={getInputClass("order")} value={form.order} onChange={(e) => setField("order", Number(e.target.value))} />
      </Field>
      <div className="sm:col-span-2">
        <ImageUpload
          value={form.image}
          onChange={(url) => setField("image", url)}
          label="Main Image"
          uploading={uploading}
          setUploading={setUploading}
          hasChanged={hasChanged("image")}
        />
      </div>
      <div className="sm:col-span-2">
        <Field label="Short Description" hasChanged={hasChanged("shortDescription")}>
          <textarea className={getTextareaClass("shortDescription")} value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Full Description" hasChanged={hasChanged("fullDescription")}>
          <textarea className={getTextareaClass("fullDescription")} style={{ minHeight: 120 }} value={form.fullDescription} onChange={(e) => setField("fullDescription", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap gap-[20px] pt-[4px]">
        <label className="flex cursor-pointer items-center gap-[8px]">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} className="h-[15px] w-[15px] accent-[#EA580C]" />
          <span className="text-[13px] text-[#333333]">Active</span>
          {hasChanged("isActive") && (
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
          )}
        </label>
        <label className="flex cursor-pointer items-center gap-[8px]">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setField("isFeatured", e.target.checked)} className="h-[15px] w-[15px] accent-[#EA580C]" />
          <span className="text-[13px] text-[#333333]">Featured</span>
          {hasChanged("isFeatured") && (
            <CircleDot className="h-[10px] w-[10px] fill-[#EA580C] text-[#EA580C]" />
          )}
        </label>
        <Field label="Parent Service ID" hasChanged={hasChanged("parentService")}>
          <input className={getInputClass("parentService")} value={form.parentService || ''} onChange={(e) => setField("parentService", e.target.value || null)} placeholder="null" />
        </Field>
      </div>
    </div>
  );
}

function HeroTab({
  form,
  setField,
  uploading,
  setUploading,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged: (path: string) => boolean;
}) {
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Hero Title" hasChanged={hasChanged("heroTitle")}>
          <input className={getInputClass("heroTitle")} value={form.heroTitle} onChange={(e) => setField("heroTitle", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Hero Subtitle" hasChanged={hasChanged("heroSubtitle")}>
          <textarea className={getTextareaClass("heroSubtitle")} value={form.heroSubtitle} onChange={(e) => setField("heroSubtitle", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <ImageUpload
          value={form.heroImage}
          onChange={(url) => setField("heroImage", url)}
          label="Hero Image"
          uploading={uploading}
          setUploading={setUploading}
          hasChanged={hasChanged("heroImage")}
        />
      </div>
    </div>
  );
}

function StatsTab({
  form,
  setField,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const s = form.stats ?? {};
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <Field label="Years of Excellence" hasChanged={hasChanged("stats.yearsOfExcellence")}>
        <input type="number" className={getInputClass("stats.yearsOfExcellence")} value={s.yearsOfExcellence} onChange={(e) => setField("stats.yearsOfExcellence", Number(e.target.value))} />
      </Field>
      <Field label="Years Label" hasChanged={hasChanged("stats.yearsLabel")}>
        <input className={getInputClass("stats.yearsLabel")} value={s.yearsLabel} onChange={(e) => setField("stats.yearsLabel", e.target.value)} />
      </Field>
      <Field label="Skilled Professionals" hasChanged={hasChanged("stats.skilledProfessionals")}>
        <input type="number" className={getInputClass("stats.skilledProfessionals")} value={s.skilledProfessionals} onChange={(e) => setField("stats.skilledProfessionals", Number(e.target.value))} />
      </Field>
      <Field label="Professionals Label" hasChanged={hasChanged("stats.professionalsLabel")}>
        <input className={getInputClass("stats.professionalsLabel")} value={s.professionalsLabel} onChange={(e) => setField("stats.professionalsLabel", e.target.value)} />
      </Field>
      <Field label="Successful Projects" hasChanged={hasChanged("stats.successfulProjects")}>
        <input type="number" className={getInputClass("stats.successfulProjects")} value={s.successfulProjects} onChange={(e) => setField("stats.successfulProjects", Number(e.target.value))} />
      </Field>
      <Field label="Projects Label" hasChanged={hasChanged("stats.projectsLabel")}>
        <input className={getInputClass("stats.projectsLabel")} value={s.projectsLabel} onChange={(e) => setField("stats.projectsLabel", e.target.value)} />
      </Field>
      <Field label="Happy Clients" hasChanged={hasChanged("stats.happyClients")}>
        <input type="number" className={getInputClass("stats.happyClients")} value={s.happyClients} onChange={(e) => setField("stats.happyClients", Number(e.target.value))} />
      </Field>
      <Field label="Clients Label" hasChanged={hasChanged("stats.clientsLabel")}>
        <input className={getInputClass("stats.clientsLabel")} value={s.clientsLabel} onChange={(e) => setField("stats.clientsLabel", e.target.value)} />
      </Field>
    </div>
  );
}

// FIX: whoWeServe is { title, description, items: [] }. All reads/writes go
// through form.whoWeServe.items instead of form.whoWeServe directly, and the
// section title/description fields are now editable too.
function WhoWeServeTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const section = form.whoWeServe ?? { title: "", description: "", items: [] };
  const items = Array.isArray(section.items) ? section.items : [];

  const updateItem = (idx: number, key: keyof WhoWeServeItem, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whoWeServe) {
        clone.whoWeServe = { title: "", description: "", items: [] };
      }
      if (!Array.isArray(clone.whoWeServe.items)) {
        clone.whoWeServe.items = [];
      }
      if (!clone.whoWeServe.items[idx]) {
        clone.whoWeServe.items[idx] = { title: "", description: "", image: "", icon: "", link: null };
      }
      (clone.whoWeServe.items[idx] as any)[key] = val;
      return clone;
    });
  };

  const addItem = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whoWeServe) {
        clone.whoWeServe = { title: "", description: "", items: [] };
      }
      if (!Array.isArray(clone.whoWeServe.items)) {
        clone.whoWeServe.items = [];
      }
      clone.whoWeServe.items.push({
        title: "",
        description: "",
        image: "",
        icon: "",
        link: null,
      });
      return clone;
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (Array.isArray(clone.whoWeServe?.items)) {
        clone.whoWeServe.items.splice(idx, 1);
      }
      return clone;
    });
  };

  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("whoWeServe.title")}>
        <input
          className={getInputClass("whoWeServe.title")}
          value={section.title}
          onChange={(e) => setField("whoWeServe.title", e.target.value)}
        />
      </Field>
      <Field label="Section Description" hasChanged={hasChanged("whoWeServe.description")}>
        <textarea
          className={getTextareaClass("whoWeServe.description")}
          value={section.description}
          onChange={(e) => setField("whoWeServe.description", e.target.value)}
        />
      </Field>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Items ({items.length})</p>
      {items.map((item, idx) => (
        <ItemCard key={idx} title={item.title || `Item ${idx + 1}`} onRemove={() => removeItem(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <Field label="Title" hasChanged={hasChanged(`whoWeServe.items.${idx}.title`)}>
              <input
                className={getInputClass(`whoWeServe.items.${idx}.title`)}
                value={item.title || ''}
                onChange={(e) => updateItem(idx, "title", e.target.value)}
              />
            </Field>
            <Field label="Icon" hasChanged={hasChanged(`whoWeServe.items.${idx}.icon`)}>
              <input
                className={getInputClass(`whoWeServe.items.${idx}.icon`)}
                value={item.icon || ''}
                onChange={(e) => updateItem(idx, "icon", e.target.value)}
                placeholder="fa-solid fa-building"
              />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                value={item.image || ''}
                onChange={(url) => updateItem(idx, "image", url)}
                label="Image"
                uploading={uploadingIdx === idx}
                setUploading={(loading) => setUploadingIdx(loading ? idx : null)}
                hasChanged={hasChanged(`whoWeServe.items.${idx}.image`)}
              />
            </div>
            <Field label="Link" hasChanged={hasChanged(`whoWeServe.items.${idx}.link`)}>
              <input
                className={getInputClass(`whoWeServe.items.${idx}.link`)}
                value={item.link || ''}
                onChange={(e) => updateItem(idx, "link", e.target.value)}
                placeholder="/services/..."
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`whoWeServe.items.${idx}.description`)}>
                <textarea
                  className={getTextareaClass(`whoWeServe.items.${idx}.description`)}
                  value={item.description || ''}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem} label="Add Item" />
    </div>
  );
}

// FIX: whatIsIncluded is { title, description, items: [] }. All reads/writes
// go through form.whatIsIncluded.items, and the section title/description
// fields are now editable too.
function WhatIsIncludedTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const section = form.whatIsIncluded ?? { title: "", description: "", items: [] };
  const items = Array.isArray(section.items) ? section.items : [];

  const updateItem = (idx: number, key: keyof WhatIsIncludedItem, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whatIsIncluded) {
        clone.whatIsIncluded = { title: "", description: "", items: [] };
      }
      if (!Array.isArray(clone.whatIsIncluded.items)) {
        clone.whatIsIncluded.items = [];
      }
      if (!clone.whatIsIncluded.items[idx]) {
        clone.whatIsIncluded.items[idx] = { title: "", description: "", icon: "" };
      }
      (clone.whatIsIncluded.items[idx] as any)[key] = val;
      return clone;
    });
  };

  const addItem = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whatIsIncluded) {
        clone.whatIsIncluded = { title: "", description: "", items: [] };
      }
      if (!Array.isArray(clone.whatIsIncluded.items)) {
        clone.whatIsIncluded.items = [];
      }
      clone.whatIsIncluded.items.push({
        title: "",
        description: "",
        icon: "",
      });
      return clone;
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (Array.isArray(clone.whatIsIncluded?.items)) {
        clone.whatIsIncluded.items.splice(idx, 1);
      }
      return clone;
    });
  };

  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("whatIsIncluded.title")}>
        <input
          className={getInputClass("whatIsIncluded.title")}
          value={section.title}
          onChange={(e) => setField("whatIsIncluded.title", e.target.value)}
        />
      </Field>
      <Field label="Section Description" hasChanged={hasChanged("whatIsIncluded.description")}>
        <textarea
          className={getTextareaClass("whatIsIncluded.description")}
          value={section.description}
          onChange={(e) => setField("whatIsIncluded.description", e.target.value)}
        />
      </Field>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Items ({items.length})</p>
      {items.map((item, idx) => (
        <ItemCard key={idx} title={item.title || `Item ${idx + 1}`} onRemove={() => removeItem(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <Field label="Title" hasChanged={hasChanged(`whatIsIncluded.items.${idx}.title`)}>
              <input
                className={getInputClass(`whatIsIncluded.items.${idx}.title`)}
                value={item.title || ''}
                onChange={(e) => updateItem(idx, "title", e.target.value)}
              />
            </Field>
            <Field label="Icon" hasChanged={hasChanged(`whatIsIncluded.items.${idx}.icon`)}>
              <input
                className={getInputClass(`whatIsIncluded.items.${idx}.icon`)}
                value={item.icon || ''}
                onChange={(e) => updateItem(idx, "icon", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`whatIsIncluded.items.${idx}.description`)}>
                <textarea
                  className={getTextareaClass(`whatIsIncluded.items.${idx}.description`)}
                  value={item.description || ''}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem} label="Add Item" />
    </div>
  );
}

function CtaTab({
  form,
  setField,
  uploading,
  setUploading,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged: (path: string) => boolean;
}) {
  const cta = form.cta ?? { title: "", subtitle: "", buttonText: "", whatsappText: "", image: "" };
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Title" hasChanged={hasChanged("cta.title")}>
          <input className={getInputClass("cta.title")} value={cta.title} onChange={(e) => setField("cta.title", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Subtitle" hasChanged={hasChanged("cta.subtitle")}>
          <textarea className={getTextareaClass("cta.subtitle")} value={cta.subtitle} onChange={(e) => setField("cta.subtitle", e.target.value)} />
        </Field>
      </div>
      <Field label="Button Text" hasChanged={hasChanged("cta.buttonText")}>
        <input className={getInputClass("cta.buttonText")} value={cta.buttonText} onChange={(e) => setField("cta.buttonText", e.target.value)} />
      </Field>
      <Field label="WhatsApp Text" hasChanged={hasChanged("cta.whatsappText")}>
        <input className={getInputClass("cta.whatsappText")} value={cta.whatsappText} onChange={(e) => setField("cta.whatsappText", e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <ImageUpload
          value={cta.image || ''}
          onChange={(url) => setField("cta.image", url)}
          label="CTA Image"
          uploading={uploading}
          setUploading={setUploading}
          hasChanged={hasChanged("cta.image")}
        />
      </div>
    </div>
  );
}

function AboutTab({
  form,
  setField,
  uploading,
  setUploading,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
  hasChanged: (path: string) => boolean;
}) {
  const about = form.about ?? { title: "", description: "", image: "", foundedYear: "", outlets: 0, teamSize: 0, factoryInfo: "" };
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Title" hasChanged={hasChanged("about.title")}>
          <input className={getInputClass("about.title")} value={about.title} onChange={(e) => setField("about.title", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" hasChanged={hasChanged("about.description")}>
          <textarea className={getTextareaClass("about.description")} style={{ minHeight: 100 }} value={about.description} onChange={(e) => setField("about.description", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <ImageUpload
          value={about.image}
          onChange={(url) => setField("about.image", url)}
          label="About Image"
          uploading={uploading}
          setUploading={setUploading}
          hasChanged={hasChanged("about.image")}
        />
      </div>
      <Field label="Founded Year" hasChanged={hasChanged("about.foundedYear")}>
        <input className={getInputClass("about.foundedYear")} value={about.foundedYear} onChange={(e) => setField("about.foundedYear", e.target.value)} />
      </Field>
      <Field label="Outlets" hasChanged={hasChanged("about.outlets")}>
        <input type="number" className={getInputClass("about.outlets")} value={about.outlets} onChange={(e) => setField("about.outlets", Number(e.target.value))} />
      </Field>
      <Field label="Team Size" hasChanged={hasChanged("about.teamSize")}>
        <input type="number" className={getInputClass("about.teamSize")} value={about.teamSize} onChange={(e) => setField("about.teamSize", Number(e.target.value))} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Factory Info" hasChanged={hasChanged("about.factoryInfo")}>
          <textarea className={getTextareaClass("about.factoryInfo")} value={about.factoryInfo} onChange={(e) => setField("about.factoryInfo", e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function ProcessTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const section = form.process ?? { title: "", description: "", steps: [] };
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateStep = (idx: number, key: keyof ProcessStep, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.process) clone.process = { title: "", description: "", steps: [] };
      if (!clone.process.steps) clone.process.steps = [];
      if (!clone.process.steps[idx]) {
        clone.process.steps[idx] = { step: "", title: "", description: "", icon: "" };
      }
      clone.process.steps[idx][key] = val;
      return clone;
    });
  };

  const addStep = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.process) clone.process = { title: "", description: "", steps: [] };
      if (!clone.process.steps) clone.process.steps = [];
      const n = clone.process.steps.length + 1;
      clone.process.steps.push({ step: String(n).padStart(2, "0"), title: "", description: "", icon: "" });
      return clone;
    });
  };

  const removeStep = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.process?.steps) {
        clone.process.steps.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("process.title")}>
        <input className={getInputClass("process.title")} value={section.title} onChange={(e) => setField("process.title", e.target.value)} />
      </Field>
      <Field label="Section Description" hasChanged={hasChanged("process.description")}>
        <textarea className={getTextareaClass("process.description")} value={section.description} onChange={(e) => setField("process.description", e.target.value)} />
      </Field>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Steps</p>
      {(section.steps ?? []).map((step, idx) => (
        <ItemCard key={idx} title={step.title || `Step ${step.step}`} onRemove={() => removeStep(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <Field label="Step No." hasChanged={hasChanged(`process.steps.${idx}.step`)}>
              <input className={getInputClass(`process.steps.${idx}.step`)} value={step.step} onChange={(e) => updateStep(idx, "step", e.target.value)} />
            </Field>
            <Field label="Icon" hasChanged={hasChanged(`process.steps.${idx}.icon`)}>
              <input className={getInputClass(`process.steps.${idx}.icon`)} value={step.icon} onChange={(e) => updateStep(idx, "icon", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Title" hasChanged={hasChanged(`process.steps.${idx}.title`)}>
                <input className={getInputClass(`process.steps.${idx}.title`)} value={step.title} onChange={(e) => updateStep(idx, "title", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`process.steps.${idx}.description`)}>
                <textarea className={getTextareaClass(`process.steps.${idx}.description`)} value={step.description} onChange={(e) => updateStep(idx, "description", e.target.value)} />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addStep} label="Add Step" />
    </div>
  );
}

function MaterialsTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const section = form.materials ?? { title: "", description: "", items: [] };
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateItem = (idx: number, key: keyof MaterialItem, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.materials) clone.materials = { title: "", description: "", items: [] };
      if (!clone.materials.items) clone.materials.items = [];
      if (!clone.materials.items[idx]) {
        clone.materials.items[idx] = { name: "", description: "", image: "", icon: "" };
      }
      clone.materials.items[idx][key] = val;
      return clone;
    });
  };

  const addItem = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.materials) clone.materials = { title: "", description: "", items: [] };
      if (!clone.materials.items) clone.materials.items = [];
      clone.materials.items.push({ name: "", description: "", image: "", icon: "" });
      return clone;
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.materials?.items) {
        clone.materials.items.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("materials.title")}>
        <input className={getInputClass("materials.title")} value={section.title} onChange={(e) => setField("materials.title", e.target.value)} />
      </Field>
      <Field label="Section Description" hasChanged={hasChanged("materials.description")}>
        <textarea className={getTextareaClass("materials.description")} value={section.description} onChange={(e) => setField("materials.description", e.target.value)} />
      </Field>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Items</p>
      {(section.items ?? []).map((item, idx) => (
        <ItemCard key={idx} title={item.name || `Material ${idx + 1}`} onRemove={() => removeItem(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <Field label="Name" hasChanged={hasChanged(`materials.items.${idx}.name`)}>
              <input className={getInputClass(`materials.items.${idx}.name`)} value={item.name} onChange={(e) => updateItem(idx, "name", e.target.value)} />
            </Field>
            <Field label="Icon" hasChanged={hasChanged(`materials.items.${idx}.icon`)}>
              <input className={getInputClass(`materials.items.${idx}.icon`)} value={item.icon} onChange={(e) => updateItem(idx, "icon", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                value={item.image || ''}
                onChange={(url) => updateItem(idx, "image", url)}
                label="Image"
                uploading={uploadingIdx === idx}
                setUploading={(loading) => setUploadingIdx(loading ? idx : null)}
                hasChanged={hasChanged(`materials.items.${idx}.image`)}
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`materials.items.${idx}.description`)}>
                <textarea className={getTextareaClass(`materials.items.${idx}.description`)} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem} label="Add Material" />
    </div>
  );
}

function WhyChooseUsTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const section = form.whyChooseUs ?? { title: "", items: [] };
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateItem = (idx: number, key: keyof WhyChooseItem, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChooseUs) clone.whyChooseUs = { title: "", items: [] };
      if (!clone.whyChooseUs.items) clone.whyChooseUs.items = [];
      if (!clone.whyChooseUs.items[idx]) {
        clone.whyChooseUs.items[idx] = { title: "", description: "", icon: "", image: "" };
      }
      clone.whyChooseUs.items[idx][key] = val;
      return clone;
    });
  };

  const addItem = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.whyChooseUs) clone.whyChooseUs = { title: "", items: [] };
      if (!clone.whyChooseUs.items) clone.whyChooseUs.items = [];
      clone.whyChooseUs.items.push({ title: "", description: "", icon: "", image: "" });
      return clone;
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.whyChooseUs?.items) {
        clone.whyChooseUs.items.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("whyChooseUs.title")}>
        <input className={getInputClass("whyChooseUs.title")} value={section.title} onChange={(e) => setField("whyChooseUs.title", e.target.value)} />
      </Field>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Items</p>
      {(section.items ?? []).map((item, idx) => (
        <ItemCard key={idx} title={item.title || `Item ${idx + 1}`} onRemove={() => removeItem(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <Field label="Title" hasChanged={hasChanged(`whyChooseUs.items.${idx}.title`)}>
              <input className={getInputClass(`whyChooseUs.items.${idx}.title`)} value={item.title} onChange={(e) => updateItem(idx, "title", e.target.value)} />
            </Field>
            <Field label="Icon" hasChanged={hasChanged(`whyChooseUs.items.${idx}.icon`)}>
              <input className={getInputClass(`whyChooseUs.items.${idx}.icon`)} value={item.icon} onChange={(e) => updateItem(idx, "icon", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                value={item.image || ''}
                onChange={(url) => updateItem(idx, "image", url)}
                label="Image"
                uploading={uploadingIdx === idx}
                setUploading={(loading) => setUploadingIdx(loading ? idx : null)}
                hasChanged={hasChanged(`whyChooseUs.items.${idx}.image`)}
              />
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`whyChooseUs.items.${idx}.description`)}>
                <textarea className={getTextareaClass(`whyChooseUs.items.${idx}.description`)} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem} label="Add Item" />
    </div>
  );
}

function FaqsTab({
  form,
  setForm,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  hasChanged: (path: string) => boolean;
}) {
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateFaq = (idx: number, key: keyof FaqItem, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.faqs) clone.faqs = [];
      if (!clone.faqs[idx]) {
        clone.faqs[idx] = { question: "", answer: "" };
      }
      clone.faqs[idx][key] = val;
      return clone;
    });
  };

  const addFaq = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.faqs) clone.faqs = [];
      clone.faqs.push({ question: "", answer: "" });
      return clone;
    });
  };

  const removeFaq = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.faqs) {
        clone.faqs.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[14px]">
      {(form.faqs ?? []).map((faq, idx) => (
        <ItemCard key={idx} title={faq.question || `FAQ ${idx + 1}`} onRemove={() => removeFaq(idx)}>
          <Field label="Question" hasChanged={hasChanged(`faqs.${idx}.question`)}>
            <input className={getInputClass(`faqs.${idx}.question`)} value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} />
          </Field>
          <div className="mt-[10px]">
            <Field label="Answer" hasChanged={hasChanged(`faqs.${idx}.answer`)}>
              <textarea className={getTextareaClass(`faqs.${idx}.answer`)} value={faq.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)} />
            </Field>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addFaq} label="Add FAQ" />
    </div>
  );
}

function ContactTab({
  form,
  setField,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const contact = form.contact;
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  return (
    <div className="grid gap-[16px] sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Title" hasChanged={hasChanged("contact.title")}>
          <input className={getInputClass("contact.title")} value={contact.title} onChange={(e) => setField("contact.title", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" hasChanged={hasChanged("contact.description")}>
          <textarea className={getTextareaClass("contact.description")} value={contact.description} onChange={(e) => setField("contact.description", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <p className="text-[12px] text-[#888888]">
          Contact form fields are managed directly in the database. Showing {contact.fields?.length ?? 0} fields.
        </p>
      </div>
    </div>
  );
}

function SeoTab({
  form,
  setField,
  setForm,
  hasChanged,
}: {
  form: Service;
  setField: (path: string, value: unknown) => void;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  hasChanged: (path: string) => boolean;
}) {
  const seo = form.seo;
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateKeyword = (idx: number, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.seo) clone.seo = { metaTitle: "", metaDescription: "", keywords: [] };
      if (!clone.seo.keywords) clone.seo.keywords = [];
      clone.seo.keywords[idx] = val;
      return clone;
    });
  };

  const addKeyword = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.seo) clone.seo = { metaTitle: "", metaDescription: "", keywords: [] };
      if (!clone.seo.keywords) clone.seo.keywords = [];
      clone.seo.keywords.push("");
      return clone;
    });
  };

  const removeKeyword = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.seo?.keywords) {
        clone.seo.keywords.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Meta Title" hasChanged={hasChanged("seo.metaTitle")}>
        <input className={getInputClass("seo.metaTitle")} value={seo.metaTitle} onChange={(e) => setField("seo.metaTitle", e.target.value)} />
      </Field>
      <Field label="Meta Description" hasChanged={hasChanged("seo.metaDescription")}>
        <textarea className={getTextareaClass("seo.metaDescription")} value={seo.metaDescription} onChange={(e) => setField("seo.metaDescription", e.target.value)} />
      </Field>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">Keywords</p>
      <div className="flex flex-col gap-[8px]">
        {seo.keywords.map((kw, idx) => (
          <div key={idx} className="flex items-center gap-[8px]">
            <input
              className={getInputClass(`seo.keywords.${idx}`)}
              value={kw}
              onChange={(e) => updateKeyword(idx, e.target.value)}
              placeholder="keyword"
            />
            <button
              onClick={() => removeKeyword(idx)}
              className="shrink-0 rounded-[8px] p-[7px] text-[#DC2626] transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-[14px] w-[14px]" />
            </button>
          </div>
        ))}
      </div>
      <AddButton onClick={addKeyword} label="Add Keyword" />
    </div>
  );
}

function TrustedWorksTab({
  form,
  setForm,
  setField,
  hasChanged,
}: {
  form: Service;
  setForm: React.Dispatch<React.SetStateAction<Service>>;
  setField: (path: string, value: unknown) => void;
  hasChanged: (path: string) => boolean;
}) {
  const trusted = form.trustedJoineryWorks ?? { title: "", description: "", images: [] };
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const getInputClass = (path: string) => hasChanged(path) ? inputChangedCls : inputCls;
  const getTextareaClass = (path: string) => hasChanged(path) ? textareaChangedCls : textareaCls;

  const updateImage = (idx: number, key: keyof TrustedImage, val: string) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.trustedJoineryWorks) clone.trustedJoineryWorks = { title: "", description: "", images: [] };
      if (!clone.trustedJoineryWorks.images) clone.trustedJoineryWorks.images = [];
      if (!clone.trustedJoineryWorks.images[idx]) {
        clone.trustedJoineryWorks.images[idx] = { url: "", title: "", description: "" };
      }
      clone.trustedJoineryWorks.images[idx][key] = val;
      return clone;
    });
  };

  const addImage = () => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (!clone.trustedJoineryWorks) clone.trustedJoineryWorks = { title: "", description: "", images: [] };
      if (!clone.trustedJoineryWorks.images) clone.trustedJoineryWorks.images = [];
      clone.trustedJoineryWorks.images.push({ url: "", title: "", description: "" });
      return clone;
    });
  };

  const removeImage = (idx: number) => {
    setForm((prev) => {
      const clone = deepClone(prev);
      if (clone.trustedJoineryWorks?.images) {
        clone.trustedJoineryWorks.images.splice(idx, 1);
      }
      return clone;
    });
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <Field label="Section Title" hasChanged={hasChanged("trustedJoineryWorks.title")}>
        <input className={getInputClass("trustedJoineryWorks.title")} value={trusted.title} onChange={(e) => setField("trustedJoineryWorks.title", e.target.value)} />
      </Field>
      <Field label="Section Description" hasChanged={hasChanged("trustedJoineryWorks.description")}>
        <textarea className={getTextareaClass("trustedJoineryWorks.description")} value={trusted.description} onChange={(e) => setField("trustedJoineryWorks.description", e.target.value)} />
      </Field>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#888888]">
        Images ({trusted.images.length})
      </p>
      {(trusted.images ?? []).map((img, idx) => (
        <ItemCard key={idx} title={img.title || `Image ${idx + 1}`} onRemove={() => removeImage(idx)}>
          <div className="grid gap-[12px] sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload
                value={img.url}
                onChange={(url) => updateImage(idx, "url", url)}
                label="Image URL"
                uploading={uploadingIdx === idx}
                setUploading={(loading) => setUploadingIdx(loading ? idx : null)}
                hasChanged={hasChanged(`trustedJoineryWorks.images.${idx}.url`)}
              />
            </div>
            <Field label="Title" hasChanged={hasChanged(`trustedJoineryWorks.images.${idx}.title`)}>
              <input className={getInputClass(`trustedJoineryWorks.images.${idx}.title`)} value={img.title} onChange={(e) => updateImage(idx, "title", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description" hasChanged={hasChanged(`trustedJoineryWorks.images.${idx}.description`)}>
                <textarea className={getTextareaClass(`trustedJoineryWorks.images.${idx}.description`)} value={img.description} onChange={(e) => updateImage(idx, "description", e.target.value)} />
              </Field>
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addImage} label="Add Image" />
    </div>
  );
}

// ===================== PAGE =====================

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Service[]>("/services");
      const sorted = [...res.data].sort((a, b) => a.order - b.order);
      setServices(sorted);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", background: "#111111", color: "#fff", fontSize: "14px" },
          success: { iconTheme: { primary: "#EA580C", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Services
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Click a card to edit its details. Changed fields are highlighted in orange.
          </p>
        </div>
        {!loading && services.length > 0 && (
          <div className="flex shrink-0 items-center gap-[8px] rounded-[14px] border border-[#E4C9B4] bg-white px-[16px] py-[10px] text-[13px] font-medium text-[#C2410C] sm:text-[14px]">
            <Layers className="h-[15px] w-[15px]" />
            {services.length} service{services.length !== 1 ? "s" : ""}
            &nbsp;&middot;&nbsp;
            {services.filter((s) => s.isActive).length} active
          </div>
        )}
      </div>

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-[28px] w-[28px] animate-spin text-[#EA580C]" />
          </div>
        ) : services.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
              <Layers className="h-[32px] w-[32px] text-[#C2410C]/50" />
              <p className="text-[14px] font-medium text-[#333333]">No services found</p>
              <p className="text-[12px] text-[#888888]">Services added in the database will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-[16px] xs:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 2xl:grid-cols-4">
              {services.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <Card
                    onClick={() => setSelected(service)}
                    className="group h-full cursor-pointer overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.18)] hover:ring-2 hover:ring-[#EA580C]/30 sm:rounded-[22px]"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1E4D8] xs:aspect-auto xs:h-[150px] sm:h-[170px] lg:h-[180px]">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          unoptimized
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/40" />
                        </div>
                      )}

                      <div className="absolute left-[10px] top-[10px] flex items-center gap-[5px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm sm:left-[12px] sm:top-[12px]">
                        <GripVertical className="h-[11px] w-[11px]" />
                        Order {service.order}
                      </div>

                      <div className={`absolute right-[10px] top-[10px] rounded-full px-[9px] py-[4px] text-[10px] font-medium backdrop-blur-sm sm:right-[12px] sm:top-[12px] ${service.isActive ? "bg-[#16A34A]/90 text-white" : "bg-black/40 text-white/80"}`}>
                        {service.isActive ? "Active" : "Inactive"}
                      </div>

                      {service.isFeatured && (
                        <div className="absolute bottom-[10px] left-[10px] rounded-full bg-[#EA580C]/90 px-[9px] py-[3px] text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-[12px] sm:left-[12px]">
                          Featured
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-[#EA580C]/0 opacity-0 transition-all duration-300 group-hover:bg-[#EA580C]/10 group-hover:opacity-100">
                        <span className="rounded-full bg-[#EA580C] px-[14px] py-[6px] text-[11px] font-semibold text-white shadow-lg">
                          Edit Details
                        </span>
                      </div>
                    </div>

                    <CardContent className="flex flex-col gap-[10px] p-[16px] sm:p-[18px] lg:p-[20px]">
                      {service.icon && (
                        <div className="flex items-center gap-[6px] text-[11px] font-medium text-[#C2410C]">
                          <i className={`${service.icon} text-[13px]`} />
                          <span className="truncate font-mono text-[10px] text-[#888888]">
                            {service.icon}
                          </span>
                        </div>
                      )}

                      <h3 className="line-clamp-1 text-[16px] font-semibold text-[#111111] sm:text-[17px] lg:text-[18px]">
                        {service.title}
                      </h3>

                      <div className="flex items-center gap-[5px] text-[11px] text-[#888888]">
                        <Tag className="h-[11px] w-[11px] shrink-0" />
                        <span className="truncate font-mono">{service.slug}</span>
                      </div>

                      <p className="line-clamp-2 text-[12px] leading-[1.65] text-[#666666] sm:text-[13px]">
                        {service.shortDescription}
                      </p>

                      <a
                        href={`/services/${service.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-[4px] flex items-center gap-[5px] self-start rounded-[8px] border border-[#E4C9B4] bg-white px-[10px] py-[5px] text-[11px] font-medium text-[#C2410C] transition-colors hover:bg-[#FFF4EC] sm:text-[12px]"
                      >
                        <ExternalLink className="h-[11px] w-[11px]" />
                        View page
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ServiceEditModal
            service={selected}
            onClose={() => setSelected(null)}
            onSaved={fetchServices}
          />
        )}
      </AnimatePresence>
    </section>
  );
}