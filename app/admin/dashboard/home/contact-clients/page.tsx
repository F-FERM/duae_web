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
    Phone,
    MessageCircle,
    Users,
    Link2,
    ArrowUp,
    ArrowDown,
    Building,
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

export interface ClientItem {
    _id?: string;
    name: string;
    logo: string;
    link: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CtaClientsResponse {
    title: string;
    description: string;
    talkToUsText: string;
    talkToUsLink: string;
    whatsappText: string;
    whatsappLink: string;
    whatsappNumber: string;
    clientsTitle: string;
    clientsDescription: string;
    clients: ClientItem[];
    isActive: boolean;
}

interface CtaClients extends CtaClientsResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

const EMPTY_CLIENT: ClientItem = {
    name: "",
    logo: "",
    link: "",
    order: 0,
};

const EMPTY_FORM: CtaClientsResponse = {
    title: "",
    description: "",
    talkToUsText: "TALK TO US",
    talkToUsLink: "/contact",
    whatsappText: "WHATSAPP US",
    whatsappLink: "https://wa.me/971501234567",
    whatsappNumber: "+971501234567",
    clientsTitle: "Our Clients",
    clientsDescription: "",
    clients: [],
    isActive: true,
};

export default function CtaClientsPage() {
    const [ctaData, setCtaData] = useState<CtaClients | null>(null);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<CtaClientsResponse>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    // Upload states
    const [uploading, setUploading] = useState(false);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<CtaClients | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Client modal
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [editingClientIndex, setEditingClientIndex] = useState<number | null>(null);
    const [tempClient, setTempClient] = useState<ClientItem>(EMPTY_CLIENT);

    // Collapse states
    const [ctaExpanded, setCtaExpanded] = useState(true);
    const [clientsExpanded, setClientsExpanded] = useState(true);

    // ================= FETCH DATA =================

    const fetchCtaData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/home-contact");

            let data = null;
            if (Array.isArray(res.data)) {
                data = res.data.length > 0 ? res.data[0] : null;
            } else if (res.data && typeof res.data === 'object') {
                data = res.data;
            }

            setCtaData(data);

            if (data) {
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    talkToUsText: data.talkToUsText || "TALK TO US",
                    talkToUsLink: data.talkToUsLink || "/contact",
                    whatsappText: data.whatsappText || "WHATSAPP US",
                    whatsappLink: data.whatsappLink || "https://wa.me/971501234567",
                    whatsappNumber: data.whatsappNumber || "+971501234567",
                    clientsTitle: data.clientsTitle || "Our Clients",
                    clientsDescription: data.clientsDescription || "",
                    clients: data.clients || [],
                    isActive: data.isActive ?? true,
                });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load CTA & clients data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCtaData();
    }, []);

    // ================= MODAL HELPERS =================

    const openCreateModal = () => {
        if (ctaData) {
            setForm({
                title: ctaData.title || "",
                description: ctaData.description || "",
                talkToUsText: ctaData.talkToUsText || "TALK TO US",
                talkToUsLink: ctaData.talkToUsLink || "/contact",
                whatsappText: ctaData.whatsappText || "WHATSAPP US",
                whatsappLink: ctaData.whatsappLink || "https://wa.me/971501234567",
                whatsappNumber: ctaData.whatsappNumber || "+971501234567",
                clientsTitle: ctaData.clientsTitle || "Our Clients",
                clientsDescription: ctaData.clientsDescription || "",
                clients: ctaData.clients || [],
                isActive: ctaData.isActive ?? true,
            });
        } else {
            setForm({ ...EMPTY_FORM });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        if (submitting || uploading) return;
        setModalOpen(false);
        if (ctaData) {
            setForm({
                title: ctaData.title || "",
                description: ctaData.description || "",
                talkToUsText: ctaData.talkToUsText || "TALK TO US",
                talkToUsLink: ctaData.talkToUsLink || "/contact",
                whatsappText: ctaData.whatsappText || "WHATSAPP US",
                whatsappLink: ctaData.whatsappLink || "https://wa.me/971501234567",
                whatsappNumber: ctaData.whatsappNumber || "+971501234567",
                clientsTitle: ctaData.clientsTitle || "Our Clients",
                clientsDescription: ctaData.clientsDescription || "",
                clients: ctaData.clients || [],
                isActive: ctaData.isActive ?? true,
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
                clients: form.clients
                    .sort((a, b) => a.order - b.order)
                    .map(({ _id, createdAt, updatedAt, ...rest }) => rest),
            };

            if (ctaData && ctaData._id) {
                await api.patch(`/home-contact`, payload);
                toast.success("CTA & clients updated");
            } else {
                await api.post("/home-contact", payload);
                toast.success("CTA & clients created");
            }

            closeModal();
            fetchCtaData();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                (ctaData ? "Failed to update CTA & clients" : "Failed to create CTA & clients")
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ================= TOGGLE ACTIVE =================

    const toggleActive = async (data: CtaClients) => {
        try {
            setTogglingId(data._id);
            await api.patch(`/cta-clients/${data._id}`, {
                isActive: !data.isActive,
            });
            setCtaData((prev) =>
                prev ? { ...prev, isActive: !prev.isActive } : null
            );
            toast.success(!data.isActive ? "CTA & clients activated" : "CTA & clients deactivated");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update status");
        } finally {
            setTogglingId(null);
        }
    };

    // ================= IMAGE UPLOAD =================

    const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const result = await fileUpload(file);
            setTempClient((prev) => ({ ...prev, logo: result.url }));
            toast.success("Logo uploaded");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to upload logo");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // ================= DELETE =================

    const confirmDelete = (data: CtaClients) => setDeleteTarget(data);
    const cancelDelete = () => {
        if (deletingId) return;
        setDeleteTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeletingId(deleteTarget._id);
            await api.delete(`/cta-clients/${deleteTarget._id}`);
            setCtaData(null);
            setForm(EMPTY_FORM);
            toast.success("CTA & clients deleted");
            setDeleteTarget(null);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete CTA & clients");
        } finally {
            setDeletingId(null);
        }
    };

    // ================= CLIENT CRUD =================

    const openClientModal = (index?: number) => {
        if (index !== undefined) {
            setEditingClientIndex(index);
            setTempClient({ ...form.clients[index] });
        } else {
            setEditingClientIndex(null);
            setTempClient({ ...EMPTY_CLIENT, order: form.clients.length });
        }
        setClientModalOpen(true);
    };

    const closeClientModal = () => {
        setClientModalOpen(false);
        setEditingClientIndex(null);
        setTempClient(EMPTY_CLIENT);
    };

    const saveClient = () => {
        if (!tempClient.name || !tempClient.logo) {
            return toast.error("Client name and logo are required");
        }

        const clients = [...form.clients];
        if (editingClientIndex !== null) {
            clients[editingClientIndex] = tempClient;
        } else {
            clients.push(tempClient);
        }
        setForm({ ...form, clients });
        closeClientModal();
    };

    const deleteClient = (index: number) => {
        const clients = form.clients.filter((_, i) => i !== index);
        setForm({ ...form, clients });
    };

    const moveClient = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= form.clients.length) return;

        const newClients = [...form.clients];
        const [movedItem] = newClients.splice(index, 1);
        newClients.splice(newIndex, 0, movedItem);

        const updatedClients = newClients.map((item, idx) => ({
            ...item,
            order: idx,
        }));

        setForm({ ...form, clients: updatedClients });
    };

    // ================= RENDER HELPERS =================

    const renderLogoUpload = () => (
        <div>
            <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                Client Logo *
            </Label>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                id="clientLogo"
                onChange={handleClientLogoUpload}
            />
            <div
                onClick={() => !uploading && document.getElementById('clientLogo')?.click()}
                className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
            >
                {tempClient.logo ? (
                    <>
                        <Image
                            src={tempClient.logo}
                            alt="Client logo"
                            fill
                            unoptimized
                            className="object-contain p-[10px]"
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
                        <span className="text-[11px] font-medium">Upload logo</span>
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-[20px] w-[20px] animate-spin text-[#EA580C]" />
                    </div>
                )}
            </div>
            <Input
                value={tempClient.logo}
                onChange={(e) => setTempClient({ ...tempClient, logo: e.target.value })}
                placeholder="Or paste logo URL"
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
                        CTA & Clients
                    </h1>
                    <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
                        Manage call-to-action section and client logos.
                    </p>
                </div>

                <Button
                    onClick={openCreateModal}
                    className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
                >
                    <Plus className="h-[18px] w-[18px]" />
                    {ctaData ? "Edit Content" : "Create CTA & Clients"}
                </Button>
            </div>

            {/* CONTENT */}
            <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
                {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
                        <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
                    </div>
                ) : !ctaData ? (
                    <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
                        <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
                            <Phone className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
                            <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                                No CTA & clients content yet
                            </p>
                            <p className="text-[12px] text-[#888888] sm:text-[13px]">
                                Create your CTA & clients section to get started.
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
                                            onClick={() => toggleActive(ctaData)}
                                            disabled={togglingId === ctaData._id}
                                            className={`
                        rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm transition-colors sm:text-[11px]
                        ${ctaData.isActive
                                                    ? "bg-[#16A34A]/90 text-white"
                                                    : "bg-black/40 text-white/80"
                                                }
                      `}
                                        >
                                            {togglingId === ctaData._id
                                                ? "..."
                                                : ctaData.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                        </button>
                                    </div>
                                    <h3 className="mt-[4px] text-[17px] font-semibold text-[#111111] sm:text-[19px] lg:text-[21px]">
                                        {ctaData.title}
                                    </h3>
                                    <p className="mt-[4px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
                                        {ctaData.description}
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
                                        onClick={() => confirmDelete(ctaData)}
                                        variant="outline"
                                        className="h-[34px] w-[34px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[36px] sm:w-[36px]"
                                    >
                                        <Trash2 className="h-[14px] w-[14px]" />
                                    </Button>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-[16px] flex flex-wrap gap-[12px]">
                                <div className="flex items-center gap-[8px] rounded-[10px] bg-[#FFF9F4] px-[14px] py-[8px]">
                                    <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                                    <span className="text-[13px] font-medium text-[#111111]">{ctaData.talkToUsText}</span>
                                    <span className="text-[12px] text-[#999]">{ctaData.talkToUsLink}</span>
                                </div>
                                <div className="flex items-center gap-[8px] rounded-[10px] bg-[#FFF9F4] px-[14px] py-[8px]">
                                    <MessageCircle className="h-[16px] w-[16px] text-[#25D366]" />
                                    <span className="text-[13px] font-medium text-[#111111]">{ctaData.whatsappText}</span>
                                    <span className="text-[12px] text-[#999]">{ctaData.whatsappNumber}</span>
                                </div>
                            </div>

                            {/* Clients */}
                            <div className="mt-[20px]">
                                <h4 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                                    {ctaData.clientsTitle}
                                </h4>
                                {ctaData.clientsDescription && (
                                    <p className="mt-[2px] text-[12px] text-[#666] sm:text-[13px]">
                                        {ctaData.clientsDescription}
                                    </p>
                                )}
                                <div className="mt-[12px] grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-4">
                                    {ctaData.clients.map((client, index) => (
                                        <div
                                            key={client._id || index}
                                            className="flex flex-col items-center rounded-[12px] border border-[#E4E4E4] bg-white p-[12px] transition-all hover:shadow-md"
                                        >
                                            {client.logo ? (
                                                <div className="relative h-[50px] w-full">
                                                    <Image
                                                        src={client.logo}
                                                        alt={client.name}
                                                        fill
                                                        unoptimized
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-[50px] w-full items-center justify-center">
                                                    <Building className="h-[24px] w-[24px] text-[#C2410C]/30" />
                                                </div>
                                            )}
                                            <p className="mt-[6px] text-[11px] font-medium text-[#111111] sm:text-[12px]">
                                                {client.name}
                                            </p>
                                            {client.link && (
                                                <a
                                                    href={client.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-[2px] text-[10px] text-[#999] hover:text-[#EA580C]"
                                                >
                                                    {client.link.replace(/^https?:\/\//, '')}
                                                </a>
                                            )}
                                            <span className="mt-[4px] text-[9px] text-[#999]">#{client.order + 1}</span>
                                        </div>
                                    ))}
                                </div>
                                {ctaData.clients.length === 0 && (
                                    <p className="mt-[12px] text-center text-[12px] text-[#999]">
                                        No clients added yet
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
                                    {ctaData ? "Edit CTA & Clients" : "Add New CTA & Clients"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                                >
                                    <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                                </button>
                            </div>

                            <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                                {/* CTA SECTION */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    <button
                                        onClick={() => setCtaExpanded(!ctaExpanded)}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <h4 className="text-[14px] font-semibold text-[#111111]">Call to Action</h4>
                                        {ctaExpanded ? (
                                            <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                                        ) : (
                                            <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                                        )}
                                    </button>
                                    {ctaExpanded && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                                    Title *
                                                </Label>
                                                <Input
                                                    value={form.title}
                                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                    placeholder="Ready to Transform Your Space?"
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
                                                    placeholder="Get expert joinery, fit-out, and renovation solutions..."
                                                    rows={2}
                                                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-[10px]">
                                                <div>
                                                    <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                        Talk to Us Text
                                                    </Label>
                                                    <Input
                                                        value={form.talkToUsText}
                                                        onChange={(e) => setForm({ ...form, talkToUsText: e.target.value })}
                                                        placeholder="TALK TO US"
                                                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                        Talk to Us Link
                                                    </Label>
                                                    <Input
                                                        value={form.talkToUsLink}
                                                        onChange={(e) => setForm({ ...form, talkToUsLink: e.target.value })}
                                                        placeholder="/contact"
                                                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-[10px]">
                                                <div>
                                                    <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                        WhatsApp Text
                                                    </Label>
                                                    <Input
                                                        value={form.whatsappText}
                                                        onChange={(e) => setForm({ ...form, whatsappText: e.target.value })}
                                                        placeholder="WHATSAPP US"
                                                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                        WhatsApp Number
                                                    </Label>
                                                    <Input
                                                        value={form.whatsappNumber}
                                                        onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                                                        placeholder="+971501234567"
                                                        className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    WhatsApp Link
                                                </Label>
                                                <Input
                                                    value={form.whatsappLink}
                                                    onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
                                                    placeholder="https://wa.me/971501234567"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
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

                                {/* CLIENTS SECTION */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    <button
                                        onClick={() => setClientsExpanded(!clientsExpanded)}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <h4 className="text-[14px] font-semibold text-[#111111]">
                                            Clients ({form.clients.length})
                                        </h4>
                                        {clientsExpanded ? (
                                            <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                                        ) : (
                                            <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                                        )}
                                    </button>
                                    {clientsExpanded && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Clients Title
                                                </Label>
                                                <Input
                                                    value={form.clientsTitle}
                                                    onChange={(e) => setForm({ ...form, clientsTitle: e.target.value })}
                                                    placeholder="Our Clients"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Clients Description
                                                </Label>
                                                <Textarea
                                                    value={form.clientsDescription}
                                                    onChange={(e) => setForm({ ...form, clientsDescription: e.target.value })}
                                                    placeholder="At Wood World Decor, we are proud to serve esteemed clients..."
                                                    rows={2}
                                                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>

                                            <div className="mt-[8px] space-y-[8px]">
                                                {form.clients.map((client, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start justify-between rounded-[8px] border border-[#E4E4E4] bg-white p-[10px]"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-[6px]">
                                                                <span className="text-[10px] font-medium text-[#999]">#{client.order + 1}</span>
                                                                <h5 className="text-[12px] font-medium text-[#111111] truncate">
                                                                    {client.name}
                                                                </h5>
                                                            </div>
                                                            {client.logo && (
                                                                <div className="mt-[2px] flex items-center gap-[6px]">
                                                                    <div className="relative h-[20px] w-[40px]">
                                                                        <Image
                                                                            src={client.logo}
                                                                            alt={client.name}
                                                                            fill
                                                                            unoptimized
                                                                            className="object-contain"
                                                                        />
                                                                    </div>
                                                                    <span className="text-[9px] text-[#999] truncate max-w-[100px]">
                                                                        {client.logo}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {client.link && (
                                                                <div className="mt-[2px] flex items-center gap-[4px] text-[9px] text-[#999]">
                                                                    <Link2 className="h-[10px] w-[10px]" />
                                                                    <span className="truncate max-w-[100px]">{client.link}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex shrink-0 gap-[4px] ml-[8px]">
                                                            <button
                                                                onClick={() => moveClient(index, 'up')}
                                                                disabled={index === 0}
                                                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowUp className="h-[12px] w-[12px]" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveClient(index, 'down')}
                                                                disabled={index === form.clients.length - 1}
                                                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowDown className="h-[12px] w-[12px]" />
                                                            </button>
                                                            <Button
                                                                onClick={() => openClientModal(index)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                                                            >
                                                                <Pencil className="h-[12px] w-[12px]" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => deleteClient(index)}
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
                                                    onClick={() => openClientModal()}
                                                    variant="outline"
                                                    className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC]"
                                                >
                                                    <Plus className="h-[14px] w-[14px]" />
                                                    Add Client
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
                                        {ctaData ? "Save Changes" : "Create"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= CLIENT MODAL ================= */}
            <AnimatePresence>
                {clientModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
                        onClick={closeClientModal}
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
                                    {editingClientIndex !== null ? "Edit Client" : "Add Client"}
                                </h3>
                                <button
                                    onClick={closeClientModal}
                                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                                >
                                    <X className="h-[15px] w-[15px]" />
                                </button>
                            </div>

                            <div className="mt-[16px] space-y-[12px]">
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Client Name *
                                    </Label>
                                    <Input
                                        value={tempClient.name}
                                        onChange={(e) => setTempClient({ ...tempClient, name: e.target.value })}
                                        placeholder="INNAA"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>

                                {renderLogoUpload()}

                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Website Link
                                    </Label>
                                    <Input
                                        value={tempClient.link}
                                        onChange={(e) => setTempClient({ ...tempClient, link: e.target.value })}
                                        placeholder="https://innaa.com"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>

                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Order
                                    </Label>
                                    <Input
                                        type="number"
                                        value={tempClient.order}
                                        onChange={(e) => setTempClient({ ...tempClient, order: Number(e.target.value) })}
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>

                                <div className="flex gap-[10px] pt-[8px]">
                                    <Button
                                        variant="outline"
                                        onClick={closeClientModal}
                                        className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={saveClient}
                                        className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                                    >
                                        {editingClientIndex !== null ? "Update" : "Add"}
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
                                Delete CTA & clients content?
                            </h3>
                            <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                                All content including client logos will be permanently removed. This can't be undone.
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

// Chevron icons
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