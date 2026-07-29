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
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Type,
  UploadCloud,
  Users,
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

interface WhyChooseItem {
  _id?: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface HomeWhyChooseResponse {
  title: string;
  items: WhyChooseItem[];
  teamTitle: string;
  teamDescription: string;
  teamImage: string[];
  teamButtonText: string;
  teamButtonLink: string;
  teamSize: number;
  yearsExperience: number;
  phoneNumber1: string;
  phoneNumber2: string;
  email: string;
  address: string;
  isActive: boolean;
}

interface HomeWhyChoose extends HomeWhyChooseResponse {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

const ICON_OPTIONS = [
  "fa-solid fa-hammer",
  "fa-solid fa-people-arrows",
  "fa-solid fa-clock",
  "fa-solid fa-star",
  "fa-solid fa-check-circle",
  "fa-solid fa-wrench",
  "fa-solid fa-shield-check",
  "fa-solid fa-trophy",
  "fa-solid fa-award",
  "fa-solid fa-leaf",
  "fa-solid fa-newspaper",
];

const EMPTY_ITEM: WhyChooseItem = {
  number: "01",
  title: "",
  description: "",
  icon: "fa-solid fa-hammer",
  order: 0,
};

const EMPTY_FORM: HomeWhyChooseResponse = {
  title: "Why Choose Us",
  items: [],
  teamTitle: "Our Team",
  teamDescription: "",
  teamImage: [],
  teamButtonText: "Get Started Now!",
  teamButtonLink: "/contact",
  teamSize: 0,
  yearsExperience: 0,
  phoneNumber1: "",
  phoneNumber2: "",
  email: "",
  address: "",
  isActive: true,
};

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatItemNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export default function HomeWhyChooseAdminPage() {
  const [sectionData, setSectionData] = useState<HomeWhyChoose | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<HomeWhyChooseResponse>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [uploadingTeamImage, setUploadingTeamImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [showItemForm, setShowItemForm] = useState(false);
  const [itemDraft, setItemDraft] = useState<WhyChooseItem>(EMPTY_ITEM);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const teamImageInputRef = useRef<HTMLInputElement>(null);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const res = await api.get<HomeWhyChoose | HomeWhyChoose[]>("/home-why-choose");

      let data: HomeWhyChoose | null = null;
      if (Array.isArray(res.data)) {
        data = res.data.length > 0 ? res.data[0] : null;
      } else if (res.data && typeof res.data === "object") {
        data = res.data as HomeWhyChoose;
      }

      setSectionData(data);
      if (data) {
        setForm({
          title: data.title || "Why Choose Us",
          items: [...(data.items || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
          teamTitle: data.teamTitle || "Our Team",
          teamDescription: data.teamDescription || "",
          teamImage: Array.isArray(data.teamImage) ? data.teamImage : [],
          teamButtonText: data.teamButtonText || "",
          teamButtonLink: data.teamButtonLink || "/contact",
          teamSize: data.teamSize || 0,
          yearsExperience: data.yearsExperience || 0,
          phoneNumber1: data.phoneNumber1 || "",
          phoneNumber2: data.phoneNumber2 || "",
          email: data.email || "",
          address: data.address || "",
          isActive: data.isActive ?? true,
        });
      } else {
        setForm(EMPTY_FORM);
      }
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
          : "Failed to load why choose us section";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const openModal = () => {
    if (sectionData) {
      setForm({
        title: sectionData.title || "Why Choose Us",
        items: [...(sectionData.items || [])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        ),
        teamTitle: sectionData.teamTitle || "Our Team",
        teamDescription: sectionData.teamDescription || "",
        teamImage: Array.isArray(sectionData.teamImage) ? sectionData.teamImage : [],
        teamButtonText: sectionData.teamButtonText || "",
        teamButtonLink: sectionData.teamButtonLink || "/contact",
        teamSize: sectionData.teamSize || 0,
        yearsExperience: sectionData.yearsExperience || 0,
        phoneNumber1: sectionData.phoneNumber1 || "",
        phoneNumber2: sectionData.phoneNumber2 || "",
        email: sectionData.email || "",
        address: sectionData.address || "",
        isActive: sectionData.isActive ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploadingTeamImage) return;
    setModalOpen(false);
    setShowItemForm(false);
    setEditingItemIndex(null);
    setItemDraft(EMPTY_ITEM);
  };

  const handleTeamImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingTeamImage(true);
      const uploads = await Promise.all(
        Array.from(files).map((file) => fileUpload(file))
      );
      const newUrls = uploads.map((result) => result.url);
      setForm((prev) => ({ ...prev, teamImage: [...prev.teamImage, ...newUrls] }));
      toast.success(
        newUrls.length > 1 ? "Team images uploaded" : "Team image uploaded"
      );
    } catch {
      toast.error("Failed to upload team image");
    } finally {
      setUploadingTeamImage(false);
      if (teamImageInputRef.current) teamImageInputRef.current.value = "";
    }
  };

  const removeTeamImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      teamImage: prev.teamImage.filter((_, i) => i !== index),
    }));
  };

  const openAddItem = () => {
    setItemDraft({
      ...EMPTY_ITEM,
      number: formatItemNumber(form.items.length),
      order: form.items.length,
    });
    setEditingItemIndex(null);
    setShowItemForm(true);
  };

  const openEditItem = (index: number) => {
    setItemDraft(form.items[index]);
    setEditingItemIndex(index);
    setShowItemForm(true);
  };

  const cancelItemForm = () => {
    setShowItemForm(false);
    setEditingItemIndex(null);
    setItemDraft(EMPTY_ITEM);
  };

  const saveItemDraft = () => {
    if (!itemDraft.title.trim() || !itemDraft.description.trim()) {
      toast.error("Item title and description are required");
      return;
    }

    setForm((prev) => {
      const items = [...prev.items];
      if (editingItemIndex !== null) {
        items[editingItemIndex] = itemDraft;
      } else {
        items.push(itemDraft);
      }
      return {
        ...prev,
        items: items.map((item, index) => ({
          ...item,
          order: index,
          number: item.number || formatItemNumber(index),
        })),
      };
    });
    cancelItemForm();
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          order: i,
          number: formatItemNumber(i),
        })),
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      return toast.error("Section title is required");
    }
    if (!form.teamTitle.trim() || !form.teamDescription.trim()) {
      return toast.error("Team title and description are required");
    }
    if (form.teamImage.length === 0) {
      return toast.error("At least one team image is required");
    }
    if (form.items.length === 0) {
      return toast.error("Add at least one why choose us item");
    }

    try {
      setSubmitting(true);

      if (sectionData?._id) {
        await api.patch("/home-why-choose", form);
        toast.success("Why choose us section updated");
      } else {
        await api.post("/home-why-choose", form);
        toast.success("Why choose us section created");
      }

      closeModal();
      fetchSection();
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
          : sectionData
            ? "Failed to update section"
            : "Failed to create section";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async () => {
    if (!sectionData) return;

    try {
      setToggling(true);
      await api.patch("/home-why-choose", { isActive: !sectionData.isActive });
      setSectionData((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
      toast.success(!sectionData.isActive ? "Section activated" : "Section deactivated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionData) return;

    try {
      setDeleting(true);
      await api.delete("/home-why-choose");
      setSectionData(null);
      setForm(EMPTY_FORM);
      setDeleteOpen(false);
      toast.success("Why choose us section deleted");
    } catch {
      toast.error("Failed to delete section");
    } finally {
      setDeleting(false);
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
            Why Choose Us & Team
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage why choose us items, team section, and contact details for the home page.
          </p>
        </div>

        <Button
          onClick={openModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          {sectionData ? "Edit Section" : "Create Section"}
        </Button>
      </div>

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : !sectionData ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No why choose us content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create the section to manage items, team info, and contact details.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-[16px]">
            <Card className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]">
              <div className="relative h-[220px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[260px]">
                {sectionData.teamImage && sectionData.teamImage.length > 0 ? (
                  <Image
                    src={resolveImage(sectionData.teamImage[0])}
                    alt={sectionData.teamTitle}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-[26px] w-[26px] text-[#C2410C]/40" />
                  </div>
                )}

                {sectionData.teamImage && sectionData.teamImage.length > 1 && (
                  <div className="absolute bottom-[12px] right-[12px] rounded-full bg-black/50 px-[10px] py-[5px] text-[11px] font-medium text-white backdrop-blur-sm">
                    +{sectionData.teamImage.length - 1} more
                  </div>
                )}

                <div className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full bg-black/50 px-[10px] py-[5px] text-[11px] font-medium text-white backdrop-blur-sm">
                  <GripVertical className="h-[12px] w-[12px]" />
                  Why Choose & Team
                </div>

                <button
                  onClick={toggleActive}
                  disabled={toggling}
                  className={`absolute right-[12px] top-[12px] rounded-full px-[10px] py-[5px] text-[11px] font-medium backdrop-blur-sm transition-colors ${
                    sectionData.isActive
                      ? "bg-[#16A34A]/90 text-white"
                      : "bg-black/40 text-white/80"
                  }`}
                >
                  {toggling ? "..." : sectionData.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              <CardContent className="p-[16px] sm:p-[20px] lg:p-[24px]">
                <h3 className="text-[18px] font-semibold text-[#111111] sm:text-[20px]">
                  {sectionData.title}
                </h3>
                <p className="mt-[6px] text-[12px] text-[#888888]">
                  {sectionData.items?.length || 0} why choose items
                </p>

                <div className="mt-[12px] grid grid-cols-1 gap-[10px] sm:grid-cols-2">
                  {[...(sectionData.items || [])]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div
                        key={item._id || `${item.title}-${index}`}
                        className="rounded-[12px] bg-[#FFF8F3] p-[12px]"
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#C2410C]">
                          {item.number} • {item.icon}
                        </p>
                        <p className="mt-[4px] text-[13px] font-semibold text-[#111111]">
                          {item.title}
                        </p>
                        <p className="mt-[4px] line-clamp-2 text-[12px] text-[#666666]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="mt-[14px] rounded-[12px] bg-[#FFF8F3] p-[14px]">
                  <div className="flex items-center gap-[8px]">
                    <Users className="h-[14px] w-[14px] text-[#EA580C]" />
                    <p className="text-[13px] font-semibold text-[#111111]">
                      {sectionData.teamTitle}
                    </p>
                  </div>
                  <p className="mt-[6px] line-clamp-3 text-[12px] leading-[1.6] text-[#666666]">
                    {sectionData.teamDescription}
                  </p>
                  <div className="mt-[8px] flex flex-wrap gap-[12px] text-[11px] text-[#666666]">
                    <span>{sectionData.teamSize}+ team</span>
                    <span>{sectionData.yearsExperience}+ years</span>
                  </div>
                </div>

                <div className="mt-[12px] flex flex-wrap gap-[12px] text-[12px] text-[#666666]">
                  {sectionData.phoneNumber1 && (
                    <span className="flex items-center gap-[4px]">
                      <Phone className="h-[12px] w-[12px] text-[#EA580C]" />
                      {sectionData.phoneNumber1}
                    </span>
                  )}
                  {sectionData.email && (
                    <span className="flex items-center gap-[4px]">
                      <Mail className="h-[12px] w-[12px] text-[#EA580C]" />
                      {sectionData.email}
                    </span>
                  )}
                  {sectionData.address && (
                    <span className="flex items-center gap-[4px]">
                      <MapPin className="h-[12px] w-[12px] text-[#EA580C]" />
                      {sectionData.address}
                    </span>
                  )}
                </div>

                <div className="mt-[14px] flex flex-wrap items-center gap-[8px]">
                  <Button
                    onClick={openModal}
                    variant="outline"
                    className="h-[36px] gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[12px] text-[13px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                  >
                    <Pencil className="h-[13px] w-[13px]" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => setDeleteOpen(true)}
                    variant="outline"
                    className="h-[36px] w-[36px] rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                  >
                    <Trash2 className="h-[14px] w-[14px]" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[680px] sm:rounded-[28px] sm:p-[32px] md:max-w-[760px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {sectionData ? "Edit Why Choose Us" : "Create Why Choose Us"}
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
                    placeholder="Why Choose Us"
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                  />
                </div>

                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <div className="flex flex-col gap-[10px] xs:flex-row xs:items-center xs:justify-between">
                    <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                      Why Choose Items
                    </h3>
                    <Button
                      type="button"
                      onClick={openAddItem}
                      className="h-[38px] w-full gap-[6px] rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C] xs:w-auto"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Item
                    </Button>
                  </div>

                  {showItemForm && (
                    <div className="mt-[12px] space-y-[10px] rounded-[12px] border border-[#F0D9C8] bg-[#FFF8F3] p-[12px]">
                      <h4 className="text-[13px] font-semibold text-[#111111]">
                        {editingItemIndex !== null ? "Edit Item" : "New Item"}
                      </h4>

                      <div className="grid grid-cols-1 gap-[10px] xs:grid-cols-2">
                        <Input
                          value={itemDraft.number}
                          onChange={(e) =>
                            setItemDraft((prev) => ({ ...prev, number: e.target.value }))
                          }
                          placeholder="01"
                          className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                        />
                        <select
                          value={itemDraft.icon}
                          onChange={(e) =>
                            setItemDraft((prev) => ({ ...prev, icon: e.target.value }))
                          }
                          className="h-[44px] w-full rounded-[10px] border border-[#E4E4E4] bg-white px-[12px] text-[13px] outline-none focus:border-[#EA580C]"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        value={itemDraft.title}
                        onChange={(e) =>
                          setItemDraft((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="Item title"
                        className="h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <Textarea
                        value={itemDraft.description}
                        onChange={(e) =>
                          setItemDraft((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Item description"
                        rows={3}
                        className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
                      />

                      <div className="flex flex-col gap-[8px] xs:flex-row">
                        <Button
                          type="button"
                          onClick={saveItemDraft}
                          className="h-[40px] rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                        >
                          {editingItemIndex !== null ? "Save Item" : "Add Item"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={cancelItemForm}
                          className="h-[40px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-[12px] space-y-[10px]">
                    {form.items.length === 0 && (
                      <p className="text-[12px] text-[#888888]">
                        No items yet. Add your first why choose us item above.
                      </p>
                    )}

                    {form.items.map((item, index) => (
                      <div
                        key={item._id || `${item.title}-${index}`}
                        className="flex flex-col gap-[10px] rounded-[12px] border border-[#ECECEC] bg-white p-[12px] sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-[#C2410C]">
                            {item.number} • {item.icon}
                          </p>
                          <p className="truncate text-[13px] font-semibold text-[#111111]">
                            {item.title}
                          </p>
                          <p className="line-clamp-2 text-[12px] text-[#666666]">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex gap-[8px] sm:shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openEditItem(index)}
                            className="h-[34px] rounded-[8px] border-[#E4C9B4] px-[10px] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeItem(index)}
                            className="h-[34px] rounded-[8px] border-[#F3D0D0] px-[10px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#F0D9C8] bg-[#FFF8F3] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                    Team Section
                  </h3>

                  <div className="mt-[12px] space-y-[12px]">
                    <Input
                      value={form.teamTitle}
                      onChange={(e) => setForm({ ...form, teamTitle: e.target.value })}
                      placeholder="Our Team"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                    />

                    <Textarea
                      value={form.teamDescription}
                      onChange={(e) =>
                        setForm({ ...form, teamDescription: e.target.value })
                      }
                      placeholder="Team description"
                      rows={4}
                      className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px]"
                    />

                    <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                      <Input
                        type="number"
                        value={form.teamSize}
                        onChange={(e) =>
                          setForm({ ...form, teamSize: Number(e.target.value) })
                        }
                        placeholder="Team size"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                      />
                      <Input
                        type="number"
                        value={form.yearsExperience}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            yearsExperience: Number(e.target.value),
                          })
                        }
                        placeholder="Years experience"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                      <Input
                        value={form.teamButtonText}
                        onChange={(e) =>
                          setForm({ ...form, teamButtonText: e.target.value })
                        }
                        placeholder="Button text"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                      />
                      <Input
                        value={form.teamButtonLink}
                        onChange={(e) =>
                          setForm({ ...form, teamButtonLink: e.target.value })
                        }
                        placeholder="/contact"
                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                      />
                    </div>

                    <div>
                      <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                        <ImagePlus className="h-[13px] w-[13px]" /> Team Images
                      </Label>

                      {form.teamImage.length > 0 && (
                        <div className="mb-[10px] grid grid-cols-2 gap-[10px] xs:grid-cols-3">
                          {form.teamImage.map((img, index) => (
                            <div
                              key={`${img}-${index}`}
                              className="group relative h-[100px] w-full overflow-hidden rounded-[12px] bg-[#F1E4D8] sm:h-[110px]"
                            >
                              <Image
                                src={resolveImage(img)}
                                alt={`Team preview ${index + 1}`}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeTeamImage(index)}
                                className="absolute right-[6px] top-[6px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                              >
                                <X className="h-[12px] w-[12px]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        ref={teamImageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleTeamImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => teamImageInputRef.current?.click()}
                        disabled={uploadingTeamImage}
                        className="h-[44px] w-full gap-[8px] rounded-[12px] border-[#E4C9B4] bg-white text-[13px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] sm:w-auto sm:px-[16px]"
                      >
                        {uploadingTeamImage ? (
                          <Loader2 className="h-[14px] w-[14px] animate-spin" />
                        ) : (
                          <UploadCloud className="h-[14px] w-[14px]" />
                        )}
                        {form.teamImage.length > 0
                          ? "Add More Images"
                          : "Upload Team Images"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <h3 className="text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                    Contact Details
                  </h3>

                  <div className="mt-[12px] grid grid-cols-1 gap-[12px] sm:grid-cols-2">
                    <Input
                      value={form.phoneNumber1}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber1: e.target.value })
                      }
                      placeholder="Phone number 1"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                    />
                    <Input
                      value={form.phoneNumber2}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber2: e.target.value })
                      }
                      placeholder="Phone number 2"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                    />
                    <Input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Email"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                    />
                    <Input
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Address"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] sm:h-[48px]"
                    />
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
                    disabled={submitting || uploadingTeamImage}
                    className="h-[46px] rounded-[12px] bg-[#EA580C] px-[22px] text-[14px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : sectionData ? (
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
        {deleteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => !deleting && setDeleteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Delete Why Choose Us Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove the why choose us section, team info, and contact details.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  {deleting ? "Deleting..." : "Delete Section"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}