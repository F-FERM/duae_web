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
import { Textarea } from "@/components/ui/textarea";

interface Service {
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  icon: string;
  order: number;
}

interface ServiceItem extends Service {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

type ServicesResponse = ServiceItem[];

const ICON_OPTIONS = [
  "fa-solid fa-hammer",
  "fa-solid fa-wrench",
  "fa-solid fa-key",
  "fa-solid fa-building",
  "fa-solid fa-gear",
  "fa-solid fa-couch",
  "fa-solid fa-kitchen-set",
  "fa-solid fa-house-chimney",
  "fa-solid fa-paint-roller",
  "fa-solid fa-screwdriver-wrench",
];

const EMPTY_FORM: Service = {
  title: "",
  slug: "",
  shortDescription: "",
  image: "",
  icon: "fa-solid fa-hammer",
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

function mapToForm(data: Partial<ServiceItem>): Service {
  return {
    title: data.title || "",
    slug: data.slug || "",
    shortDescription: data.shortDescription || "",
    image: data.image || "",
    icon: data.icon || "fa-solid fa-hammer",
    order: data.order ?? 0,
  };
}

export default function ServiceAdminPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Service>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingService, setFetchingService] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get<ServicesResponse>("/services");
      const sorted = [...(Array.isArray(res.data) ? res.data : [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setServices(sorted);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to load services"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: services.length });
    setModalOpen(true);
  };

  const openEditModal = async (id: string) => {
    setEditingId(id);
    setModalOpen(true);
    setFetchingService(true);

    try {
      const res = await api.get<ServiceItem>(`/services/${id}`);
      setForm(mapToForm(res.data));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to load service details"));
      setModalOpen(false);
    } finally {
      setFetchingService(false);
    }
  };

  const closeModal = () => {
    if (submitting || uploading) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, image: result.url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.shortDescription.trim()) {
      return toast.error("Title and short description are required");
    }
    if (!form.image.trim()) {
      return toast.error("Service image is required");
    }

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await api.patch(`/services/${editingId}`, payload);
        toast.success("Service updated");
      } else {
        await api.post("/services", payload);
        toast.success("Service created");
      }

      closeModal();
      fetchServices();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(
          err,
          editingId ? "Failed to update service" : "Failed to create service"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/services/${deleteTarget._id}`);
      setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Service deleted");
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete service"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-4 py-6 sm:px-7 sm:py-9 md:px-9 lg:px-12 lg:py-12 2xl:px-16">
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
          success: { iconTheme: { primary: "#EA580C", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
            Services
          </h1>
          <p className="mt-1.5 text-sm text-[#666666]">
            Manage services shown on the website navigation and home page.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="h-11 w-full gap-2 rounded-[14px] bg-[#EA580C] text-white hover:bg-[#EA580C] sm:w-auto sm:px-5"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="mx-auto mt-6 max-w-[1600px] sm:mt-7 lg:mt-8">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#EA580C]" />
          </div>
        ) : services.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-2.5 p-12 text-center">
              <ImageIcon className="h-8 w-8 text-[#C2410C]/50" />
              <p className="text-[15px] font-medium text-[#333333]">No services yet</p>
              <p className="text-[13px] text-[#888888]">
                Add your first service to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service._id}
                className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="relative h-[160px] w-full bg-[#F1E4D8] sm:h-[180px]">
                  {service.image ? (
                    <Image
                      src={resolveImage(service.image)}
                      alt={service.title}
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
                    <GripVertical className="mr-1 inline h-3 w-3" />
                    Order {service.order}
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#C2410C]">
                    {service.icon}
                  </p>
                  <h3 className="mt-1 text-[16px] font-semibold text-[#111111]">
                    {service.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#666666]">
                    {service.shortDescription}
                  </p>
                  <p className="mt-2 text-[11px] text-[#999]">/services/{service.slug}</p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => openEditModal(service._id)}
                      variant="outline"
                      className="h-9 flex-1 gap-1.5 rounded-[10px] border-[#E4C9B4] text-[#C2410C] hover:bg-[#FFF4EC]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(service)}
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
              className="relative max-h-[94vh] w-full max-w-[560px] overflow-y-auto rounded-t-[24px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#111111] sm:text-2xl">
                  {editingId ? "Edit Service" : "Create Service"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {fetchingService ? (
                <div className="flex min-h-[280px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#EA580C]" />
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div>
                    <Label className="mb-2 flex items-center gap-1.5 text-sm">
                      <Type className="h-3.5 w-3.5" /> Title
                    </Label>
                    <Input
                      value={form.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          title,
                          slug: editingId ? prev.slug : slugify(title),
                        }));
                      }}
                      placeholder="Joinery"
                      className="h-11 rounded-[12px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">Slug</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="joinery"
                      className="h-11 rounded-[12px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-1.5 text-sm">
                      <AlignLeft className="h-3.5 w-3.5" /> Short Description
                    </Label>
                    <Textarea
                      value={form.shortDescription}
                      onChange={(e) =>
                        setForm({ ...form, shortDescription: e.target.value })
                      }
                      placeholder="Brief service description"
                      rows={4}
                      className="rounded-[12px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">Icon</Label>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="h-11 w-full rounded-[12px] border border-[#E4E4E4] px-3 text-sm outline-none focus:border-[#EA580C]"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="mb-2 block text-sm">Order</Label>
                    <Input
                      type="number"
                      value={form.order}
                      onChange={(e) =>
                        setForm({ ...form, order: Number(e.target.value) })
                      }
                      className="h-11 rounded-[12px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 flex items-center gap-1.5 text-sm">
                      <ImagePlus className="h-3.5 w-3.5" /> Image
                    </Label>
                    {form.image && (
                      <div className="relative mb-3 h-36 w-full overflow-hidden rounded-[12px] bg-[#F1E4D8]">
                        <Image
                          src={resolveImage(form.image)}
                          alt="Service preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="h-10 gap-2 rounded-[10px] border-[#E4C9B4] text-[#C2410C] hover:bg-[#FFF4EC]"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UploadCloud className="h-4 w-4" />
                      )}
                      {form.image ? "Replace Image" : "Upload Image"}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 xs:flex-row xs:justify-end">
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
                      disabled={submitting || uploading}
                      className="h-11 rounded-[12px] bg-[#EA580C] px-5 text-white hover:bg-[#EA580C]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingId ? (
                        "Update Service"
                      ) : (
                        "Create Service"
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
              <h3 className="text-lg font-semibold text-[#111111]">Delete Service?</h3>
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
                  {deletingId ? "Deleting..." : "Delete Service"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
