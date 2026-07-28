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
    ImageIcon,
    ImagePlus,
    Loader2,
    UploadCloud,
    Eye,
    EyeOff,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Search,
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

export interface ServiceItem {
    _id?: string;
    title: string;
    slug: string;
    shortDescription: string;
    image: string;
    icon: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ServicesResponse {
    services: ServiceItem[];
}

const EMPTY_SERVICE: ServiceItem = {
    title: "",
    slug: "",
    shortDescription: "",
    image: "",
    icon: "fa-solid fa-cube",
    order: 0,
};

export default function ServicesListingPage() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<ServiceItem>(EMPTY_SERVICE);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Reorder state
    const [reordering, setReordering] = useState(false);

    // ================= FETCH SERVICES =================

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await api.get("/services/home");

            let data = [];
            if (Array.isArray(res.data)) {
                data = res.data;
            } else if (res.data && typeof res.data === 'object' && res.data.services) {
                data = res.data.services;
            } else if (res.data && typeof res.data === 'object') {
                data = [res.data];
            }

            // Sort by order
            const sorted = data.sort((a: ServiceItem, b: ServiceItem) => (a.order || 0) - (b.order || 0));
            setServices(sorted);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // ================= MODAL HELPERS =================

    const openCreateModal = () => {
        setEditingId(null);
        setForm({ ...EMPTY_SERVICE, order: services.length });
        setModalOpen(true);
    };

    const openEditModal = (service: ServiceItem) => {
        setEditingId(service._id || null);
        setForm({ ...service });
        setModalOpen(true);
    };

    const closeModal = () => {
        if (submitting || uploading) return;
        setModalOpen(false);
        setEditingId(null);
        setForm(EMPTY_SERVICE);
    };

    // ================= SUBMIT (CREATE / UPDATE) =================

    const handleSubmit = async () => {
        if (!form.title || !form.shortDescription) {
            return toast.error("Title and short description are required");
        }

        try {
            setSubmitting(true);

            // Generate slug from title if not provided
            const { _id, createdAt, updatedAt, ...restForm } = form;
            const payload = {
                ...restForm,
                slug: form.slug || form.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'),
            };

            if (editingId) {
                // UPDATE - PATCH to /services/{id}
                await api.patch(`/services/${editingId}`, payload);
                toast.success("Service updated");
            } else {
                // CREATE - POST to /services
                await api.post("/services", payload);
                toast.success("Service created");
            }

            closeModal();
            fetchServices();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                (editingId ? "Failed to update service" : "Failed to create service")
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ================= DELETE =================

    const confirmDelete = (service: ServiceItem) => setDeleteTarget(service);
    const cancelDelete = () => {
        if (deletingId) return;
        setDeleteTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeletingId(deleteTarget._id || '');
            // DELETE - DELETE to /services/{id}
            await api.delete(`/services/${deleteTarget._id}`);
            toast.success("Service deleted");
            setDeleteTarget(null);
            fetchServices();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete service");
        } finally {
            setDeletingId(null);
        }
    };

    // ================= REORDER =================

    const moveService = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= services.length) return;

        const newServices = [...services];
        const [movedItem] = newServices.splice(index, 1);
        newServices.splice(newIndex, 0, movedItem);

        // Update order numbers
        const updatedServices = newServices.map((item, idx) => ({
            ...item,
            order: idx,
        }));

        setServices(updatedServices);
        setReordering(true);

        try {
            // Update each service's order individually
            const updatePromises = updatedServices.map((service) => {
                if (service._id) {
                    return api.patch(`/services/${service._id}`, { order: service.order });
                }
                return Promise.resolve();
            });

            await Promise.all(updatePromises);
            toast.success("Order updated");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update order");
            // Revert on error
            fetchServices();
        } finally {
            setReordering(false);
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

    // ================= FILTER SERVICES =================

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* ================= HEADER ================= */}

            <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
                        Services
                    </h1>
                    <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
                        Manage all your services. Use arrow buttons to reorder.
                    </p>
                </div>

                <div className="flex flex-col gap-[10px] xs:flex-row sm:gap-[12px]">
                    <div className="relative">
                        <Search className="absolute left-[12px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#999]" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search services..."
                            className="h-[42px] w-full rounded-[12px] border-[#E4E4E4] bg-white pl-[36px] text-[13px] focus-visible:ring-[#EA580C]/30 sm:w-[200px] lg:w-[260px]"
                        />
                    </div>

                    <Button
                        onClick={openCreateModal}
                        className="flex h-[42px] items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[44px] sm:px-[20px] sm:text-[14px]"
                    >
                        <Plus className="h-[17px] w-[17px]" />
                        Add Service
                    </Button>
                </div>
            </div>

            {/* ================= CONTENT ================= */}

            <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
                {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
                        <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
                    </div>
                ) : services.length === 0 ? (
                    <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
                        <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
                            <ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
                            <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                                No services yet
                            </p>
                            <p className="text-[12px] text-[#888888] sm:text-[13px]">
                                Add your first service to get started.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {reordering && (
                            <div className="mb-[16px] flex items-center gap-[8px] rounded-[12px] bg-[#FFF9F4] px-[14px] py-[8px] text-[13px] text-[#666]">
                                <Loader2 className="h-[16px] w-[16px] animate-spin text-[#EA580C]" />
                                Updating order...
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-[16px] xs:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 2xl:grid-cols-4">
                            {filteredServices.map((service, index) => (
                                <Card
                                    key={service._id || index}
                                    className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.15)] sm:rounded-[22px]"
                                >
                                    {/* IMAGE */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F1E4D8] xs:h-[140px] xs:aspect-auto sm:h-[160px] lg:h-[170px]">
                                        {service.image ? (
                                            <Image
                                                src={service.image}
                                                alt={service.title}
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
                                            #{service.order ?? index + 1}
                                        </div>

                                        <div className="absolute right-[10px] top-[10px] flex gap-[4px] sm:right-[12px] sm:top-[12px]">
                                            <button
                                                onClick={() => moveService(index, 'up')}
                                                disabled={index === 0 || reordering}
                                                className="rounded-full bg-black/40 p-[4px] text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed sm:p-[5px]"
                                                title="Move up"
                                            >
                                                <ArrowUp className="h-[12px] w-[12px] sm:h-[13px] sm:w-[13px]" />
                                            </button>
                                            <button
                                                onClick={() => moveService(index, 'down')}
                                                disabled={index === services.length - 1 || reordering}
                                                className="rounded-full bg-black/40 p-[4px] text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed sm:p-[5px]"
                                                title="Move down"
                                            >
                                                <ArrowDown className="h-[12px] w-[12px] sm:h-[13px] sm:w-[13px]" />
                                            </button>
                                        </div>
                                    </div>

                                    <CardContent className="p-[16px] sm:p-[18px] lg:p-[20px]">
                                        <div className="flex items-start justify-between gap-[8px]">
                                            <h3 className="line-clamp-1 flex-1 text-[15px] font-semibold text-[#111111] sm:text-[16px] lg:text-[17px]">
                                                {service.title}
                                            </h3>
                                            <span className="shrink-0 font-mono text-[10px] text-[#999] sm:text-[11px]">
                                                {service.icon}
                                            </span>
                                        </div>

                                        <p className="mt-[6px] line-clamp-2 text-[11px] leading-[1.5] text-[#666666] sm:text-[12px]">
                                            {service.shortDescription}
                                        </p>

                                        <div className="mt-[10px] flex items-center gap-[6px] text-[10px] text-[#999] sm:mt-[12px] sm:text-[11px]">
                                            <span className="truncate font-mono">/{service.slug}</span>
                                        </div>

                                        <div className="mt-[12px] flex shrink-0 items-center justify-end gap-[8px] sm:mt-[14px]">
                                            <Button
                                                onClick={() => openEditModal(service)}
                                                variant="outline"
                                                className="h-[32px] flex-1 gap-[6px] rounded-[10px] border-[#E4C9B4] bg-white px-[10px] text-[11px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C] xs:flex-none sm:h-[34px] sm:px-[12px] sm:text-[12px]"
                                            >
                                                <Pencil className="h-[12px] w-[12px] sm:h-[13px] sm:w-[13px]" />
                                                Edit
                                            </Button>

                                            <Button
                                                onClick={() => confirmDelete(service)}
                                                variant="outline"
                                                className="h-[32px] w-[32px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[34px] sm:w-[34px]"
                                            >
                                                <Trash2 className="h-[13px] w-[13px] sm:h-[14px] sm:w-[14px]" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredServices.length === 0 && (
                            <div className="mt-[32px] text-center text-[14px] text-[#666]">
                                No services found matching "{searchTerm}"
                            </div>
                        )}
                    </>
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
                            className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[520px] sm:rounded-[28px] sm:p-[32px] md:max-w-[560px]"
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                                    {editingId ? "Edit Service" : "Add New Service"}
                                </h2>

                                <button
                                    onClick={closeModal}
                                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                                >
                                    <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                                </button>
                            </div>

                            <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                                {/* TITLE */}
                                <div>
                                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                                        <Type className="h-[13px] w-[13px]" /> Title *
                                    </Label>
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="Fit-out Solutions"
                                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                                    />
                                </div>

                                {/* SLUG */}
                                <div>
                                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                                        Slug
                                    </Label>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        placeholder="fitout-solutions"
                                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white font-mono text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                                    />
                                    <p className="mt-[4px] text-[11px] text-[#999]">
                                        Leave empty to auto-generate from title
                                    </p>
                                </div>

                                {/* SHORT DESCRIPTION */}
                                <div>
                                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                                        <Type className="h-[13px] w-[13px]" /> Short Description *
                                    </Label>
                                    <Textarea
                                        value={form.shortDescription}
                                        onChange={(e) =>
                                            setForm({ ...form, shortDescription: e.target.value })
                                        }
                                        placeholder="Brief description of the service..."
                                        rows={2}
                                        className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>

                                {/* IMAGE UPLOAD */}
                                <div>
                                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                                        <ImageIcon className="h-[13px] w-[13px]" /> Service Image
                                    </Label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="serviceImage"
                                        onChange={handleImageUpload}
                                    />

                                    <div
                                        onClick={() => !uploading && document.getElementById('serviceImage')?.click()}
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
                                                    alt="Service preview"
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
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        placeholder="Or paste an image URL"
                                        className="mt-[8px] h-[40px] rounded-[12px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30 sm:h-[42px]"
                                    />
                                </div>

                                {/* ICON */}
                                <div>
                                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                                        Icon (Font Awesome)
                                    </Label>
                                    <Input
                                        value={form.icon}
                                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                        placeholder="fa-solid fa-building"
                                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white font-mono text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                                    />
                                </div>

                                {/* ORDER */}
                                <div>
                                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                                        Display Order
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) =>
                                            setForm({ ...form, order: Number(e.target.value) })
                                        }
                                        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                                    />
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
                                        {submitting && (
                                            <Loader2 className="h-[16px] w-[16px] animate-spin" />
                                        )}
                                        {editingId ? "Save Changes" : "Create Service"}
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
                                Delete this service?
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