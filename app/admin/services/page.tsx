"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Layers, ImageIcon, Loader2, GripVertical, Tag, Pencil } from "lucide-react";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import ServiceEditModal from "./ServiceEditModal";
import type { ServiceListItem } from "./types";

export default function ServicesListPage() {
    const [services, setServices] = useState<ServiceListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await api.get<ServiceListItem[]>("/services");
            setServices([...res.data].sort((a, b) => a.order - b.order));
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    return (
        <section className="min-h-screen bg-[#FFF4EC] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
            <Toaster position="top-right" toastOptions={{
                duration: 3000,
                style: { borderRadius: "12px", background: "#111111", color: "#fff", fontSize: "14px" },
                success: { iconTheme: { primary: "#EA580C", secondary: "#fff" } },
                error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
            }} />

            {/* HEADER */}
            <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
                        Services
                    </h1>
                    <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
                        Click any card to edit the service details.
                    </p>
                </div>
                {!loading && services.length > 0 && (
                    <div className="flex shrink-0 items-center gap-[8px] rounded-[14px] border border-[#E4C9B4] bg-white px-[16px] py-[10px] text-[13px] font-medium text-[#C2410C]">
                        <Layers className="h-[15px] w-[15px]" />
                        {services.length} total &middot; {services.filter(s => s.isActive).length} active
                    </div>
                )}
            </div>

            {/* LIST */}
            <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
                {loading ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C]" />
                    </div>
                ) : services.length === 0 ? (
                    <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
                        <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
                            <Layers className="h-[32px] w-[32px] text-[#C2410C]/50" />
                            <p className="text-[14px] font-medium text-[#333333]">No services found</p>
                            <p className="text-[12px] text-[#888888]">Services from the database will appear here.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 gap-[16px] xs:grid-cols-2 sm:gap-[18px] lg:grid-cols-3 2xl:grid-cols-4">
                            {services.map((service, i) => (
                                <motion.div key={service._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.04 }}>
                                    <Card
                                        onClick={() => setEditingId(service._id)}
                                        className="group h-full cursor-pointer overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] transition-all duration-300 hover:shadow-[0_18px_50px_rgba(234,88,12,0.15)] sm:rounded-[22px]"
                                    >
                                        {/* IMAGE */}
                                        <div className="relative h-[150px] w-full overflow-hidden bg-[#F1E4D8] sm:h-[170px] lg:h-[180px]">
                                            {service.image
                                                ? <Image src={service.image} alt={service.title} fill unoptimized sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                : <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-[28px] w-[28px] text-[#C2410C]/40" /></div>}

                                            {/* order badge */}
                                            <div className="absolute left-[10px] top-[10px] flex items-center gap-[5px] rounded-full bg-black/50 px-[9px] py-[4px] text-[10px] font-medium text-white backdrop-blur-sm">
                                                <GripVertical className="h-[10px] w-[10px]" /> Order {service.order}
                                            </div>
                                            {/* active badge */}
                                            <div className={`absolute right-[10px] top-[10px] rounded-full px-[9px] py-[4px] text-[10px] font-medium backdrop-blur-sm ${service.isActive ? "bg-[#16A34A]/90 text-white" : "bg-black/40 text-white/80"}`}>
                                                {service.isActive ? "Active" : "Inactive"}
                                            </div>
                                            {/* featured badge */}
                                            {service.isFeatured && (
                                                <div className="absolute bottom-[10px] left-[10px] rounded-full bg-[#EA580C]/90 px-[9px] py-[3px] text-[10px] font-medium text-white backdrop-blur-sm">Featured</div>
                                            )}
                                            {/* hover overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                                                <div className="flex items-center gap-[6px] rounded-full bg-white px-[14px] py-[8px] text-[12px] font-semibold text-[#C2410C] shadow-lg">
                                                    <Pencil className="h-[12px] w-[12px]" /> Edit Service
                                                </div>
                                            </div>
                                        </div>

                                        {/* BODY */}
                                        <CardContent className="p-[16px] sm:p-[18px]">
                                            <h3 className="line-clamp-1 text-[16px] font-semibold text-[#111111]">{service.title}</h3>
                                            <div className="mt-[4px] flex items-center gap-[5px] text-[11px] text-[#888888]">
                                                <Tag className="h-[10px] w-[10px] shrink-0" />
                                                <span className="truncate font-mono">{service.slug}</span>
                                            </div>
                                            <p className="mt-[8px] line-clamp-2 text-[12px] leading-[1.65] text-[#666666]">{service.shortDescription}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* EDIT MODAL */}
            {editingId && (
                <ServiceEditModal
                    serviceId={editingId}
                    onClose={() => setEditingId(null)}
                    onSaved={fetchServices}
                />
            )}
        </section>
    );
}
