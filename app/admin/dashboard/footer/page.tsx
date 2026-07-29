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
    Mail,
    Phone,
    MapPin,
    Link2,
    Globe,
    ArrowUp,
    ArrowDown,
    Settings,
    List,
    Layers,
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

export interface FooterLink {
    _id?: string;
    label: string;
    url: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SocialLink {
    _id?: string;
    platform: string;
    url: string;
    icon: string;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface FooterResponse {
    companyName: string;
    companyTagline: string;
    companyDescription: string;
    logo: string;
    logoAlt: string;
    servicesTitle: string;
    services: FooterLink[];
    quickLinksTitle: string;
    quickLinks: FooterLink[];
    socialTitle: string;
    socialLinks: SocialLink[];
    email: string;
    phone1: string;
    phone2: string;
    address: string;
    creditText: string;
    creditLink: string;
    bottomLinks: FooterLink[];
    isActive: boolean;
}

interface Footer extends FooterResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
}

const EMPTY_LINK: FooterLink = {
    label: "",
    url: "",
    order: 0,
};

const EMPTY_SOCIAL: SocialLink = {
    platform: "",
    url: "",
    icon: "fa-brands fa-globe",
    order: 0,
};

const EMPTY_FORM: FooterResponse = {
    companyName: "",
    companyTagline: "",
    companyDescription: "",
    logo: "",
    logoAlt: "",
    servicesTitle: "Services",
    services: [],
    quickLinksTitle: "Quick Links",
    quickLinks: [],
    socialTitle: "Follow us on:",
    socialLinks: [],
    email: "",
    phone1: "",
    phone2: "",
    address: "",
    creditText: "",
    creditLink: "",
    bottomLinks: [],
    isActive: true,
};

const SOCIAL_PLATFORMS = [
    { label: "Facebook", icon: "fa-brands fa-facebook" },
    { label: "Instagram", icon: "fa-brands fa-instagram" },
    { label: "LinkedIn", icon: "fa-brands fa-linkedin" },
    { label: "YouTube", icon: "fa-brands fa-youtube" },
    { label: "Twitter", icon: "fa-brands fa-twitter" },
    { label: "Pinterest", icon: "fa-brands fa-pinterest" },
    { label: "TikTok", icon: "fa-brands fa-tiktok" },
    { label: "Snapchat", icon: "fa-brands fa-snapchat" },
    { label: "WhatsApp", icon: "fa-brands fa-whatsapp" },
    { label: "Telegram", icon: "fa-brands fa-telegram" },
];

export default function FooterPage() {
    const [footerData, setFooterData] = useState<Footer | null>(null);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<FooterResponse>(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Delete state
    const [deleteTarget, setDeleteTarget] = useState<Footer | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Link modals
    const [linkModal, setLinkModal] = useState<{
        open: boolean;
        type: 'services' | 'quickLinks' | 'bottomLinks';
        index: number | null;
        data: FooterLink;
    }>({
        open: false,
        type: 'services',
        index: null,
        data: { ...EMPTY_LINK },
    });

    // Social modal
    const [socialModalOpen, setSocialModalOpen] = useState(false);
    const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
    const [tempSocial, setTempSocial] = useState<SocialLink>(EMPTY_SOCIAL);

    // Collapse states
    const [sections, setSections] = useState({
        company: true,
        contact: true,
        services: true,
        quickLinks: true,
        social: true,
        footer: true,
    });

    // ================= FETCH DATA =================

    const fetchFooterData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/footer");

            let data = null;
            if (Array.isArray(res.data)) {
                data = res.data.length > 0 ? res.data[0] : null;
            } else if (res.data && typeof res.data === 'object') {
                data = res.data;
            }

            setFooterData(data);

            if (data) {
                setForm({
                    companyName: data.companyName || "",
                    companyTagline: data.companyTagline || "",
                    companyDescription: data.companyDescription || "",
                    logo: data.logo || "",
                    logoAlt: data.logoAlt || "",
                    servicesTitle: data.servicesTitle || "Services",
                    services: data.services || [],
                    quickLinksTitle: data.quickLinksTitle || "Quick Links",
                    quickLinks: data.quickLinks || [],
                    socialTitle: data.socialTitle || "Follow us on:",
                    socialLinks: data.socialLinks || [],
                    email: data.email || "",
                    phone1: data.phone1 || "",
                    phone2: data.phone2 || "",
                    address: data.address || "",
                    creditText: data.creditText || "",
                    creditLink: data.creditLink || "",
                    bottomLinks: data.bottomLinks || [],
                    isActive: data.isActive ?? true,
                });
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load footer data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFooterData();
    }, []);

    // ================= MODAL HELPERS =================

    const openCreateModal = () => {
        if (footerData) {
            setForm({
                companyName: footerData.companyName || "",
                companyTagline: footerData.companyTagline || "",
                companyDescription: footerData.companyDescription || "",
                logo: footerData.logo || "",
                logoAlt: footerData.logoAlt || "",
                servicesTitle: footerData.servicesTitle || "Services",
                services: footerData.services || [],
                quickLinksTitle: footerData.quickLinksTitle || "Quick Links",
                quickLinks: footerData.quickLinks || [],
                socialTitle: footerData.socialTitle || "Follow us on:",
                socialLinks: footerData.socialLinks || [],
                email: footerData.email || "",
                phone1: footerData.phone1 || "",
                phone2: footerData.phone2 || "",
                address: footerData.address || "",
                creditText: footerData.creditText || "",
                creditLink: footerData.creditLink || "",
                bottomLinks: footerData.bottomLinks || [],
                isActive: footerData.isActive ?? true,
            });
        } else {
            setForm({ ...EMPTY_FORM });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        if (submitting || uploading) return;
        setModalOpen(false);
        if (footerData) {
            setForm({
                companyName: footerData.companyName || "",
                companyTagline: footerData.companyTagline || "",
                companyDescription: footerData.companyDescription || "",
                logo: footerData.logo || "",
                logoAlt: footerData.logoAlt || "",
                servicesTitle: footerData.servicesTitle || "Services",
                services: footerData.services || [],
                quickLinksTitle: footerData.quickLinksTitle || "Quick Links",
                quickLinks: footerData.quickLinks || [],
                socialTitle: footerData.socialTitle || "Follow us on:",
                socialLinks: footerData.socialLinks || [],
                email: footerData.email || "",
                phone1: footerData.phone1 || "",
                phone2: footerData.phone2 || "",
                address: footerData.address || "",
                creditText: footerData.creditText || "",
                creditLink: footerData.creditLink || "",
                bottomLinks: footerData.bottomLinks || [],
                isActive: footerData.isActive ?? true,
            });
        } else {
            setForm(EMPTY_FORM);
        }
    };

    // ================= SUBMIT =================

    const handleSubmit = async () => {
        if (!form.companyName || !form.companyDescription) {
            return toast.error("Company name and description are required");
        }

        try {
            setSubmitting(true);

            const stripMeta = ({ _id, createdAt, updatedAt, ...rest }: any) => rest;

            const payload = {
                ...form,
                services: form.services.sort((a, b) => a.order - b.order).map(stripMeta),
                quickLinks: form.quickLinks.sort((a, b) => a.order - b.order).map(stripMeta),
                socialLinks: form.socialLinks.sort((a, b) => a.order - b.order).map(stripMeta),
                bottomLinks: form.bottomLinks.sort((a, b) => a.order - b.order).map(stripMeta),
            };

            if (footerData && footerData._id) {
                await api.patch(`/footer`, payload);
                toast.success("Footer updated");
            } else {
                await api.post("/footer", payload);
                toast.success("Footer created");
            }

            closeModal();
            fetchFooterData();
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message ||
                (footerData ? "Failed to update footer" : "Failed to create footer")
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ================= TOGGLE ACTIVE =================

    const toggleActive = async (data: Footer) => {
        try {
            setTogglingId(data._id);
            await api.patch(`/footer/${data._id}`, {
                isActive: !data.isActive,
            });
            setFooterData((prev) =>
                prev ? { ...prev, isActive: !prev.isActive } : null
            );
            toast.success(!data.isActive ? "Footer activated" : "Footer deactivated");
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
            setForm((prev) => ({ ...prev, logo: result.url }));
            toast.success("Logo uploaded");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to upload logo");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // ================= DELETE =================

    const confirmDelete = (data: Footer) => setDeleteTarget(data);
    const cancelDelete = () => {
        if (deletingId) return;
        setDeleteTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeletingId(deleteTarget._id);
            await api.delete(`/footer/${deleteTarget._id}`);
            setFooterData(null);
            setForm(EMPTY_FORM);
            toast.success("Footer deleted");
            setDeleteTarget(null);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete footer");
        } finally {
            setDeletingId(null);
        }
    };

    // ================= LINK CRUD =================

    const openLinkModal = (type: 'services' | 'quickLinks' | 'bottomLinks', index: number | null = null) => {
        let data = { ...EMPTY_LINK };
        let items = [];

        switch (type) {
            case 'services':
                items = form.services;
                break;
            case 'quickLinks':
                items = form.quickLinks;
                break;
            case 'bottomLinks':
                items = form.bottomLinks;
                break;
        }

        if (index !== null && items[index]) {
            data = { ...items[index] };
        } else {
            data = { ...EMPTY_LINK, order: items.length };
        }

        setLinkModal({ open: true, type, index, data });
    };

    const closeLinkModal = () => {
        setLinkModal({ open: false, type: 'services', index: null, data: { ...EMPTY_LINK } });
    };

    const saveLink = () => {
        const { type, index, data } = linkModal;
        if (!data.label || !data.url) {
            return toast.error("Label and URL are required");
        }

        const updateItems = (items: FooterLink[]) => {
            const newItems = [...items];
            if (index !== null && index < items.length) {
                newItems[index] = data;
            } else {
                newItems.push(data);
            }
            return newItems;
        };

        switch (type) {
            case 'services':
                setForm({ ...form, services: updateItems(form.services) });
                break;
            case 'quickLinks':
                setForm({ ...form, quickLinks: updateItems(form.quickLinks) });
                break;
            case 'bottomLinks':
                setForm({ ...form, bottomLinks: updateItems(form.bottomLinks) });
                break;
        }

        closeLinkModal();
        toast.success("Link saved");
    };

    const deleteLink = (type: 'services' | 'quickLinks' | 'bottomLinks', index: number) => {
        const deleteFromArray = (items: FooterLink[]) => items.filter((_, i) => i !== index);

        switch (type) {
            case 'services':
                setForm({ ...form, services: deleteFromArray(form.services) });
                break;
            case 'quickLinks':
                setForm({ ...form, quickLinks: deleteFromArray(form.quickLinks) });
                break;
            case 'bottomLinks':
                setForm({ ...form, bottomLinks: deleteFromArray(form.bottomLinks) });
                break;
        }
    };

    const moveLink = (type: 'services' | 'quickLinks' | 'bottomLinks', index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const items = type === 'services' ? form.services : type === 'quickLinks' ? form.quickLinks : form.bottomLinks;

        if (newIndex < 0 || newIndex >= items.length) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(index, 1);
        newItems.splice(newIndex, 0, movedItem);

        const updatedItems = newItems.map((item, idx) => ({ ...item, order: idx }));

        switch (type) {
            case 'services':
                setForm({ ...form, services: updatedItems });
                break;
            case 'quickLinks':
                setForm({ ...form, quickLinks: updatedItems });
                break;
            case 'bottomLinks':
                setForm({ ...form, bottomLinks: updatedItems });
                break;
        }
    };

    // ================= SOCIAL CRUD =================

    const openSocialModal = (index: number | null = null) => {
        if (index !== null && form.socialLinks[index]) {
            setEditingSocialIndex(index);
            setTempSocial({ ...form.socialLinks[index] });
        } else {
            setEditingSocialIndex(null);
            setTempSocial({ ...EMPTY_SOCIAL, order: form.socialLinks.length });
        }
        setSocialModalOpen(true);
    };

    const closeSocialModal = () => {
        setSocialModalOpen(false);
        setEditingSocialIndex(null);
        setTempSocial(EMPTY_SOCIAL);
    };

    const saveSocial = () => {
        if (!tempSocial.platform || !tempSocial.url) {
            return toast.error("Platform and URL are required");
        }

        const socialLinks = [...form.socialLinks];
        if (editingSocialIndex !== null) {
            socialLinks[editingSocialIndex] = tempSocial;
        } else {
            socialLinks.push(tempSocial);
        }
        setForm({ ...form, socialLinks });
        closeSocialModal();
    };

    const deleteSocial = (index: number) => {
        const socialLinks = form.socialLinks.filter((_, i) => i !== index);
        setForm({ ...form, socialLinks });
    };

    const moveSocial = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= form.socialLinks.length) return;

        const newSocialLinks = [...form.socialLinks];
        const [movedItem] = newSocialLinks.splice(index, 1);
        newSocialLinks.splice(newIndex, 0, movedItem);

        const updatedSocialLinks = newSocialLinks.map((item, idx) => ({
            ...item,
            order: idx,
        }));

        setForm({ ...form, socialLinks: updatedSocialLinks });
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

    const renderLinkList = (
        items: FooterLink[],
        type: 'services' | 'quickLinks' | 'bottomLinks',
        addLabel: string
    ) => (
        <div className="mt-[8px] space-y-[8px]">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start justify-between rounded-[8px] border border-[#E4E4E4] bg-white p-[10px]"
                >
                    <div className="flex-1">
                        <div className="flex items-center gap-[6px]">
                            <span className="text-[10px] font-medium text-[#999]">#{item.order + 1}</span>
                            <h5 className="text-[12px] font-medium text-[#111111]">{item.label}</h5>
                        </div>
                        <div className="mt-[2px] flex items-center gap-[4px] text-[10px] text-[#999]">
                            <Link2 className="h-[10px] w-[10px]" />
                            <span className="truncate">{item.url}</span>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-[4px] ml-[8px]">
                        <button
                            onClick={() => moveLink(type, index, 'up')}
                            disabled={index === 0}
                            className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowUp className="h-[12px] w-[12px]" />
                        </button>
                        <button
                            onClick={() => moveLink(type, index, 'down')}
                            disabled={index === items.length - 1}
                            className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ArrowDown className="h-[12px] w-[12px]" />
                        </button>
                        <Button
                            onClick={() => openLinkModal(type, index)}
                            variant="ghost"
                            size="sm"
                            className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                        >
                            <Pencil className="h-[12px] w-[12px]" />
                        </Button>
                        <Button
                            onClick={() => deleteLink(type, index)}
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
                onClick={() => openLinkModal(type)}
                variant="outline"
                className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC]"
            >
                <Plus className="h-[14px] w-[14px]" />
                {addLabel}
            </Button>
        </div>
    );

    const renderLogoUpload = () => (
        <div>
            <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                Logo
            </Label>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                id="footerLogo"
                onChange={handleImageUpload}
            />
            <div
                onClick={() => !uploading && document.getElementById('footerLogo')?.click()}
                className={`
          relative flex h-[100px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC]
          ${uploading ? "pointer-events-none opacity-70" : ""}
        `}
            >
                {form.logo ? (
                    <>
                        <Image
                            src={form.logo}
                            alt={form.logoAlt || "Logo"}
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
                value={form.logo}
                onChange={(e) => setForm({ ...form, logo: e.target.value })}
                placeholder="Or paste logo URL"
                className="mt-[4px] h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30"
            />
            <div className="mt-[4px]">
                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                    Logo Alt Text
                </Label>
                <Input
                    value={form.logoAlt}
                    onChange={(e) => setForm({ ...form, logoAlt: e.target.value })}
                    placeholder="Wood World Decor Logo"
                    className="h-[36px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30"
                />
            </div>
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
                        Footer
                    </h1>
                    <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
                        Manage footer content, links, and social media.
                    </p>
                </div>

                <Button
                    onClick={openCreateModal}
                    className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white hover:bg-[#EA580C] hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
                >
                    <Plus className="h-[18px] w-[18px]" />
                    {footerData ? "Edit Content" : "Create Footer"}
                </Button>
            </div>

            {/* CONTENT */}
            <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
                {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
                        <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
                    </div>
                ) : !footerData ? (
                    <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60 sm:rounded-[24px]">
                        <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
                            <Layers className="h-[28px] w-[28px] text-[#C2410C]/50 sm:h-[32px] sm:w-[32px]" />
                            <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                                No footer content yet
                            </p>
                            <p className="text-[12px] text-[#888888] sm:text-[13px]">
                                Create your footer to get started.
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
                                        {footerData.logo && (
                                            <div className="relative h-[40px] w-[40px]">
                                                <Image
                                                    src={footerData.logo}
                                                    alt={footerData.logoAlt || "Logo"}
                                                    fill
                                                    unoptimized
                                                    className="object-contain"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-[17px] font-semibold text-[#111111] sm:text-[19px] lg:text-[21px]">
                                                {footerData.companyName}
                                            </h3>
                                            {footerData.companyTagline && (
                                                <p className="text-[12px] text-[#999]">{footerData.companyTagline}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleActive(footerData)}
                                            disabled={togglingId === footerData._id}
                                            className={`
                        rounded-full px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm transition-colors sm:text-[11px]
                        ${footerData.isActive
                                                    ? "bg-[#16A34A]/90 text-white"
                                                    : "bg-black/40 text-white/80"
                                                }
                      `}
                                        >
                                            {togglingId === footerData._id
                                                ? "..."
                                                : footerData.isActive
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
                                        onClick={() => confirmDelete(footerData)}
                                        variant="outline"
                                        className="h-[34px] w-[34px] shrink-0 rounded-[10px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626] sm:h-[36px] sm:w-[36px]"
                                    >
                                        <Trash2 className="h-[14px] w-[14px]" />
                                    </Button>
                                </div>
                            </div>

                            {/* Company Description */}
                            <div className="mt-[16px]">
                                <p className="text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
                                    {footerData.companyDescription}
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-[16px] grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-4">
                                {footerData.email && (
                                    <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                                        <Mail className="h-[16px] w-[16px] text-[#EA580C]" />
                                        <span className="text-[12px] text-[#666]">{footerData.email}</span>
                                    </div>
                                )}
                                {footerData.phone1 && (
                                    <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                                        <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                                        <span className="text-[12px] text-[#666]">{footerData.phone1}</span>
                                    </div>
                                )}
                                {footerData.phone2 && (
                                    <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                                        <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                                        <span className="text-[12px] text-[#666]">{footerData.phone2}</span>
                                    </div>
                                )}
                                {footerData.address && (
                                    <div className="flex items-center gap-[8px] rounded-[8px] bg-[#FFF9F4] p-[10px]">
                                        <MapPin className="h-[16px] w-[16px] text-[#EA580C]" />
                                        <span className="text-[12px] text-[#666] line-clamp-1">{footerData.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="mt-[16px] grid grid-cols-3 gap-[12px] sm:grid-cols-5">
                                <div className="rounded-[8px] bg-[#FFF9F4] p-[8px] text-center">
                                    <div className="text-[14px] font-semibold text-[#111111]">{footerData.services.length}</div>
                                    <div className="text-[9px] text-[#666]">Services</div>
                                </div>
                                <div className="rounded-[8px] bg-[#FFF9F4] p-[8px] text-center">
                                    <div className="text-[14px] font-semibold text-[#111111]">{footerData.quickLinks.length}</div>
                                    <div className="text-[9px] text-[#666]">Quick Links</div>
                                </div>
                                <div className="rounded-[8px] bg-[#FFF9F4] p-[8px] text-center">
                                    <div className="text-[14px] font-semibold text-[#111111]">{footerData.socialLinks.length}</div>
                                    <div className="text-[9px] text-[#666]">Social Links</div>
                                </div>
                                <div className="rounded-[8px] bg-[#FFF9F4] p-[8px] text-center">
                                    <div className="text-[14px] font-semibold text-[#111111]">{footerData.bottomLinks.length}</div>
                                    <div className="text-[9px] text-[#666]">Bottom Links</div>
                                </div>
                                <div className="rounded-[8px] bg-[#FFF9F4] p-[8px] text-center">
                                    <div className="text-[11px] font-semibold text-[#111111] line-clamp-1">
                                        {footerData.creditText.split(' ').slice(0, 3).join(' ')}...
                                    </div>
                                    <div className="text-[9px] text-[#666]">Credit</div>
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
                                    {footerData ? "Edit Footer" : "Add New Footer"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                                >
                                    <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                                </button>
                            </div>

                            <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                                {/* COMPANY INFO */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Company Info", <Building className="h-[16px] w-[16px]" />)}
                                    {sections.company && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                                    Company Name *
                                                </Label>
                                                <Input
                                                    value={form.companyName}
                                                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                                    placeholder="WOOD WORLD DECOR L.L.C."
                                                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                                    Company Tagline
                                                </Label>
                                                <Input
                                                    value={form.companyTagline}
                                                    onChange={(e) => setForm({ ...form, companyTagline: e.target.value })}
                                                    placeholder="JOINERY & FITOUT"
                                                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                                    Company Description *
                                                </Label>
                                                <Textarea
                                                    value={form.companyDescription}
                                                    onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
                                                    placeholder="Company description..."
                                                    rows={2}
                                                    className="rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            {renderLogoUpload()}
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

                                {/* CONTACT INFO */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Contact Info", <Phone className="h-[16px] w-[16px]" />)}
                                    {sections.contact && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                                    Email
                                                </Label>
                                                <Input
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="info@wwdudae.ae"
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
                                                        placeholder="+971527875262"
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
                                                    Address
                                                </Label>
                                                <Input
                                                    value={form.address}
                                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                                    placeholder="Al Quoz Industrial Area 1, Dubai, UAE"
                                                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SERVICES */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Services", <List className="h-[16px] w-[16px]" />)}
                                    {sections.services && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Section Title
                                                </Label>
                                                <Input
                                                    value={form.servicesTitle}
                                                    onChange={(e) => setForm({ ...form, servicesTitle: e.target.value })}
                                                    placeholder="Services"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            {renderLinkList(
                                                form.services,
                                                'services',
                                                'Add Service Link'
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* QUICK LINKS */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Quick Links", <Link2 className="h-[16px] w-[16px]" />)}
                                    {sections.quickLinks && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Section Title
                                                </Label>
                                                <Input
                                                    value={form.quickLinksTitle}
                                                    onChange={(e) => setForm({ ...form, quickLinksTitle: e.target.value })}
                                                    placeholder="Quick Links"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            {renderLinkList(
                                                form.quickLinks,
                                                'quickLinks',
                                                'Add Quick Link'
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* SOCIAL LINKS */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Social Links", <Globe className="h-[16px] w-[16px]" />)}
                                    {sections.social && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Section Title
                                                </Label>
                                                <Input
                                                    value={form.socialTitle}
                                                    onChange={(e) => setForm({ ...form, socialTitle: e.target.value })}
                                                    placeholder="Follow us on:"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div className="mt-[8px] space-y-[8px]">
                                                {form.socialLinks.map((social, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start justify-between rounded-[8px] border border-[#E4E4E4] bg-white p-[10px]"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-[6px]">
                                                                <span className="text-[10px] font-medium text-[#999]">#{social.order + 1}</span>
                                                                <span className="font-mono text-[10px] text-[#999]">{social.icon}</span>
                                                                <h5 className="text-[12px] font-medium text-[#111111]">{social.platform}</h5>
                                                            </div>
                                                            <div className="mt-[2px] flex items-center gap-[4px] text-[10px] text-[#999]">
                                                                <Link2 className="h-[10px] w-[10px]" />
                                                                <span className="truncate">{social.url}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex shrink-0 gap-[4px] ml-[8px]">
                                                            <button
                                                                onClick={() => moveSocial(index, 'up')}
                                                                disabled={index === 0}
                                                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowUp className="h-[12px] w-[12px]" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveSocial(index, 'down')}
                                                                disabled={index === form.socialLinks.length - 1}
                                                                className="rounded p-[4px] text-[#999] hover:bg-[#FFF4EC] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <ArrowDown className="h-[12px] w-[12px]" />
                                                            </button>
                                                            <Button
                                                                onClick={() => openSocialModal(index)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                                                            >
                                                                <Pencil className="h-[12px] w-[12px]" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => deleteSocial(index)}
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
                                                    onClick={() => openSocialModal()}
                                                    variant="outline"
                                                    className="h-[36px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC]"
                                                >
                                                    <Plus className="h-[14px] w-[14px]" />
                                                    Add Social Link
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* FOOTER */}
                                <div className="rounded-[12px] border border-[#E4E4E4] p-[14px]">
                                    {renderSectionHeader("Footer Credits", <Settings className="h-[16px] w-[16px]" />)}
                                    {sections.footer && (
                                        <div className="mt-[12px] space-y-[12px]">
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Credit Text
                                                </Label>
                                                <Input
                                                    value={form.creditText}
                                                    onChange={(e) => setForm({ ...form, creditText: e.target.value })}
                                                    placeholder="Website Designed & Developed by F-Ferm Digital Labs"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Credit Link
                                                </Label>
                                                <Input
                                                    value={form.creditLink}
                                                    onChange={(e) => setForm({ ...form, creditLink: e.target.value })}
                                                    placeholder="https://f-ferm.com"
                                                    className="h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                                />
                                            </div>
                                            <div>
                                                <Label className="mb-[4px] block text-[11px] font-medium text-[#2A2A2A]">
                                                    Bottom Links
                                                </Label>
                                                {renderLinkList(
                                                    form.bottomLinks,
                                                    'bottomLinks',
                                                    'Add Bottom Link'
                                                )}
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
                                        {footerData ? "Save Changes" : "Create"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= LINK MODAL ================= */}
            <AnimatePresence>
                {linkModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
                        onClick={closeLinkModal}
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
                                    {linkModal.index !== null ? 'Edit' : 'Add'} {linkModal.type === 'services' ? 'Service' : linkModal.type === 'quickLinks' ? 'Quick Link' : 'Bottom Link'}
                                </h3>
                                <button
                                    onClick={closeLinkModal}
                                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                                >
                                    <X className="h-[15px] w-[15px]" />
                                </button>
                            </div>

                            <div className="mt-[16px] space-y-[12px]">
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Label *
                                    </Label>
                                    <Input
                                        value={linkModal.data.label}
                                        onChange={(e) => setLinkModal({
                                            ...linkModal,
                                            data: { ...linkModal.data, label: e.target.value }
                                        })}
                                        placeholder="Home"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        URL *
                                    </Label>
                                    <Input
                                        value={linkModal.data.url}
                                        onChange={(e) => setLinkModal({
                                            ...linkModal,
                                            data: { ...linkModal.data, url: e.target.value }
                                        })}
                                        placeholder="/"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Order
                                    </Label>
                                    <Input
                                        type="number"
                                        value={linkModal.data.order}
                                        onChange={(e) => setLinkModal({
                                            ...linkModal,
                                            data: { ...linkModal.data, order: Number(e.target.value) }
                                        })}
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>
                                <div className="flex gap-[10px] pt-[8px]">
                                    <Button
                                        variant="outline"
                                        onClick={closeLinkModal}
                                        className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={saveLink}
                                        className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                                    >
                                        {linkModal.index !== null ? "Update" : "Add"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= SOCIAL MODAL ================= */}
            <AnimatePresence>
                {socialModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
                        onClick={closeSocialModal}
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
                                    {editingSocialIndex !== null ? "Edit Social Link" : "Add Social Link"}
                                </h3>
                                <button
                                    onClick={closeSocialModal}
                                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                                >
                                    <X className="h-[15px] w-[15px]" />
                                </button>
                            </div>

                            <div className="mt-[16px] space-y-[12px]">
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Platform *
                                    </Label>
                                    <select
                                        value={tempSocial.platform}
                                        onChange={(e) => {
                                            const platform = e.target.value;
                                            const found = SOCIAL_PLATFORMS.find(p => p.label === platform);
                                            setTempSocial({
                                                ...tempSocial,
                                                platform,
                                                icon: found?.icon || "fa-brands fa-globe"
                                            });
                                        }}
                                        className="h-[42px] w-full rounded-[10px] border border-[#E4E4E4] bg-white px-[12px] text-[13px] focus-visible:ring-[#EA580C]/30"
                                    >
                                        <option value="">Select platform</option>
                                        {SOCIAL_PLATFORMS.map((p) => (
                                            <option key={p.label} value={p.label}>
                                                {p.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        URL *
                                    </Label>
                                    <Input
                                        value={tempSocial.url}
                                        onChange={(e) => setTempSocial({ ...tempSocial, url: e.target.value })}
                                        placeholder="https://www.facebook.com/woodworlddecor"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Icon (Font Awesome)
                                    </Label>
                                    <Input
                                        value={tempSocial.icon}
                                        onChange={(e) => setTempSocial({ ...tempSocial, icon: e.target.value })}
                                        placeholder="fa-brands fa-facebook"
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white font-mono text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                    <p className="mt-[4px] text-[10px] text-[#999]">
                                        Auto-populated when selecting a platform
                                    </p>
                                </div>
                                <div>
                                    <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                                        Order
                                    </Label>
                                    <Input
                                        type="number"
                                        value={tempSocial.order}
                                        onChange={(e) => setTempSocial({ ...tempSocial, order: Number(e.target.value) })}
                                        className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                                    />
                                </div>
                                <div className="flex gap-[10px] pt-[8px]">
                                    <Button
                                        variant="outline"
                                        onClick={closeSocialModal}
                                        className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={saveSocial}
                                        className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                                    >
                                        {editingSocialIndex !== null ? "Update" : "Add"}
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
                                Delete footer content?
                            </h3>
                            <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666666] sm:text-[13px]">
                                All footer content including links and social media will be permanently removed. This can't be undone.
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

const Building = ({ className }: { className?: string }) => (
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
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="9" y1="22" x2="15" y2="22" />
        <line x1="9" y1="6" x2="15" y2="6" />
        <line x1="9" y1="10" x2="15" y2="10" />
        <line x1="9" y1="14" x2="15" y2="14" />
        <line x1="9" y1="18" x2="15" y2="18" />
    </svg>
);

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