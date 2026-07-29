"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Loader2, Save, Plus, Trash2, ImagePlus, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/axios";
import { fileUpload } from "@/app/api/admin/upload/upload";
import type { GetService, ServiceForm } from "./types";

// ─── helpers ────────────────────────────────────────────────────────────────

function toForm(s: GetService): ServiceForm {
    return {
        title: s.title ?? "", slug: s.slug ?? "",
        shortDescription: s.shortDescription ?? "", fullDescription: s.fullDescription ?? "",
        image: s.image ?? "", icon: s.icon ?? "",
        heroTitle: s.heroTitle ?? "", heroSubtitle: s.heroSubtitle ?? "", heroImage: s.heroImage ?? "",
        stats: s.stats ?? { yearsOfExcellence: 0, yearsLabel: "", skilledProfessionals: 0, professionalsLabel: "", successfulProjects: 0, projectsLabel: "", happyClients: 0, clientsLabel: "" },
        whoWeServe: { title: s.whoWeServeTitle ?? "Who We Serve", description: s.whoWeServeDescription ?? "", items: s.whoWeServe ?? [] },
        whatIsIncluded: { title: s.whatIsIncludedTitle ?? "", description: s.whatIsIncludedDescription ?? "", items: s.whatIsIncluded ?? [] },
        cta: s.cta ?? { title: "", subtitle: "", buttonText: "", whatsappText: "", image: "" },
        about: s.about ?? { title: "", description: "", image: "", foundedYear: "", outlets: 0, teamSize: 0, factoryInfo: "" },
        process: s.process ?? { title: "", description: "", steps: [] },
        materials: s.materials ?? { title: "", description: "", items: [] },
        whyChooseUs: s.whyChooseUs ?? { title: "", items: [] },
        faqs: s.faqs ?? [],
        contact: { title: s.contact?.title ?? "", description: s.contact?.description ?? "" },
        seo: s.seo ?? { metaTitle: "", metaDescription: "", keywords: [] },
        order: s.order ?? 0, isActive: s.isActive ?? true, isFeatured: s.isFeatured ?? false,
    };
}

// ─── tiny shared UI bits ─────────────────────────────────────────────────────

const IS = "h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30";
const TS = "rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30";

function Inp({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div>
            <Label className="mb-[5px] block text-[12px] font-medium text-[#4A4A4A]">{label}</Label>
            <Input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={IS} />
        </div>
    );
}

function Txta({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <div>
            <Label className="mb-[5px] block text-[12px] font-medium text-[#4A4A4A]">{label}</Label>
            <Textarea value={value ?? ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={TS} />
        </div>
    );
}

function SH({ title }: { title: string }) {
    return <p className="border-b border-[#F0EAE3] pb-[6px] text-[13px] font-semibold text-[#111]">{title}</p>;
}

function IC({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
    return (
        <div className="relative rounded-[12px] border border-[#E8DDD5] bg-[#FDFAF7] p-[14px]">
            <button type="button" onClick={onRemove}
                className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors hover:bg-red-200">
                <Trash2 className="h-[11px] w-[11px]" />
            </button>
            <p className="mb-[10px] text-[10px] font-bold uppercase tracking-[0.5px] text-[#C2410C]">#{index + 1}</p>
            <div className="space-y-[10px]">{children}</div>
        </div>
    );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick}
            className="flex w-full items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-[#E4C9B4] bg-white py-[10px] text-[13px] font-medium text-[#C2410C] transition-colors hover:bg-[#FFF4EC]">
            <Plus className="h-[13px] w-[13px]" /> {label}
        </button>
    );
}

// ─── tabs ────────────────────────────────────────────────────────────────────

const TABS = ["Basic", "Hero", "Stats", "Who We Serve", "Included", "CTA & About", "Process", "Materials", "Why Us", "FAQs", "SEO"] as const;
type Tab = typeof TABS[number];

// ─── component ───────────────────────────────────────────────────────────────

interface Props { serviceId: string; onClose: () => void; onSaved: () => void; }

export default function ServiceEditModal({ serviceId, onClose, onSaved }: Props) {
    const [form, setForm] = useState<ServiceForm | null>(null);
    const [fetching, setFetching] = useState(true);
    const [tab, setTab] = useState<Tab>("Basic");
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFetching(true);
        api.get<GetService>(`/services/${serviceId}`)
            .then(r => setForm(toForm(r.data)))
            .catch(() => { toast.error("Failed to load service"); onClose(); })
            .finally(() => setFetching(false));
    }, [serviceId]);

    // ─ setters ─
    const set = (u: Partial<ServiceForm>) => setForm(f => f ? { ...f, ...u } : f);
    const nest = (key: string, u: object) => setForm(f => f ? { ...f, [key]: { ...(f as any)[key], ...u } } : f);
    const setItems = (path: "whoWeServe" | "whatIsIncluded" | "materials" | "whyChooseUs", items: any[]) =>
        setForm(f => f ? { ...f, [path]: { ...(f as any)[path], items } } : f);
    const setSteps = (steps: any[]) => setForm(f => f ? { ...f, process: { ...f.process, steps } } : f);
    const setFaqs = (faqs: any[]) => setForm(f => f ? { ...f, faqs } : f);

    // ─ image upload ─
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        try { setUploading(true); const r = await fileUpload(file); set({ image: r.url }); toast.success("Uploaded"); }
        catch { toast.error("Upload failed"); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
    };

    // ─ save ─
    const handleSave = async () => {
        if (!form) return;
        try {
            setSubmitting(true);
            await api.patch(`/services/${serviceId}`, form);
            toast.success("Service saved!");
            onSaved(); onClose();
        } catch (e: any) { toast.error(e?.response?.data?.message || "Save failed"); }
        finally { setSubmitting(false); }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[12px] backdrop-blur-[4px] sm:p-[24px]"
                onClick={onClose}>
                <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.2 }}
                    onClick={e => e.stopPropagation()}
                    className="relative flex h-[94vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">

                    {/* HEADER */}
                    <div className="flex shrink-0 items-center justify-between border-b border-[#F0EAE3] bg-[#FFF9F4] px-[20px] py-[14px] sm:px-[28px]">
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#C2410C]">Edit Service</p>
                            <h2 className="truncate text-[16px] font-semibold text-[#111] sm:text-[18px]">{form?.title || "Loading…"}</h2>
                        </div>
                        <button onClick={onClose} className="ml-3 flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]">
                            <X className="h-[15px] w-[15px]" />
                        </button>
                    </div>

                    {/* TAB BAR */}
                    <div className="shrink-0 overflow-x-auto border-b border-[#F0EAE3] bg-white">
                        <div className="flex min-w-max px-[16px]">
                            {TABS.map(t => (
                                <button key={t} onClick={() => setTab(t)}
                                    className={`whitespace-nowrap border-b-2 px-[12px] py-[10px] text-[12px] font-medium transition-colors sm:text-[13px] ${tab === t ? "border-[#EA580C] text-[#EA580C]" : "border-transparent text-[#888] hover:text-[#444]"
                                        }`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="flex-1 overflow-y-auto px-[20px] py-[20px] sm:px-[28px]">
                        {fetching || !form ? (
                            <div className="flex min-h-[200px] items-center justify-center">
                                <Loader2 className="h-[24px] w-[24px] animate-spin text-[#EA580C]" />
                            </div>
                        ) : (
                            <div className="space-y-[14px]">

                                {/* ── BASIC ── */}
                                {tab === "Basic" && <>
                                    <div className="grid gap-[12px] sm:grid-cols-2">
                                        <Inp label="Title" value={form.title} onChange={v => set({ title: v })} />
                                        <Inp label="Slug" value={form.slug} onChange={v => set({ slug: v })} />
                                    </div>
                                    <Txta label="Short Description" value={form.shortDescription} onChange={v => set({ shortDescription: v })} rows={2} />
                                    <Txta label="Full Description" value={form.fullDescription} onChange={v => set({ fullDescription: v })} rows={5} />
                                    <div className="grid gap-[12px] sm:grid-cols-2">
                                        <Inp label="Icon (FA class)" value={form.icon} onChange={v => set({ icon: v })} placeholder="fa-solid fa-hammer" />
                                        <Inp label="Order" type="number" value={form.order} onChange={v => set({ order: Number(v) })} />
                                    </div>
                                    {/* image */}
                                    <div>
                                        <Label className="mb-[5px] block text-[12px] font-medium text-[#4A4A4A]">Service Image</Label>
                                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                                        <div onClick={() => !uploading && fileRef.current?.click()}
                                            className={`relative flex h-[120px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#E4C9B4] bg-[#FFF9F4] transition-colors hover:bg-[#FFF4EC] ${uploading ? "pointer-events-none opacity-70" : ""}`}>
                                            {form.image
                                                ? <><Image src={form.image} alt="" fill unoptimized className="object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition hover:bg-black/40 hover:opacity-100">
                                                        <span className="flex items-center gap-1 text-[12px] font-medium text-white"><ImagePlus className="h-3 w-3" />Change</span>
                                                    </div></>
                                                : <div className="flex flex-col items-center gap-1 text-[#C2410C]"><UploadCloud className="h-5 w-5" /><span className="text-[12px] font-medium">Click to upload</span></div>}
                                            {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/70"><Loader2 className="h-5 w-5 animate-spin text-[#EA580C]" /></div>}
                                        </div>
                                        <Input value={form.image} onChange={e => set({ image: e.target.value })} placeholder="Or paste image URL" className="mt-2 h-[36px] rounded-[10px] border-[#E4E4E4] text-[12px]" />
                                    </div>
                                    {/* toggles */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {(["isActive", "isFeatured"] as const).map(key => (
                                            <div key={key} className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] bg-white px-[14px] py-[12px]">
                                                <Label className="text-[13px] font-medium">{key === "isActive" ? "Active" : "Featured"}</Label>
                                                <Switch checked={form[key]} onCheckedChange={v => set({ [key]: v } as any)} />
                                            </div>
                                        ))}
                                    </div>
                                </>}

                                {/* ── HERO ── */}
                                {tab === "Hero" && <>
                                    <Inp label="Hero Title" value={form.heroTitle} onChange={v => set({ heroTitle: v })} />
                                    <Txta label="Hero Subtitle" value={form.heroSubtitle} onChange={v => set({ heroSubtitle: v })} rows={3} />
                                    <Inp label="Hero Image Path" value={form.heroImage} onChange={v => set({ heroImage: v })} placeholder="/images/services/.../hero-bg.jpg" />
                                </>}

                                {/* ── STATS ── */}
                                {tab === "Stats" && (
                                    [["yearsOfExcellence", "yearsLabel", "Years of Excellence"],
                                    ["skilledProfessionals", "professionalsLabel", "Skilled Professionals"],
                                    ["successfulProjects", "projectsLabel", "Successful Projects"],
                                    ["happyClients", "clientsLabel", "Happy Clients"]] as const
                                ).map(([nk, lk, ph]) => (
                                    <div key={nk} className="grid grid-cols-2 gap-3 rounded-[12px] border border-[#E8DDD5] bg-[#FDFAF7] p-[12px]">
                                        <Inp label="Number" type="number" value={form.stats[nk]} onChange={v => nest("stats", { [nk]: Number(v) })} />
                                        <Inp label="Label" value={form.stats[lk]} onChange={v => nest("stats", { [lk]: v })} placeholder={ph} />
                                    </div>
                                ))}

                                {/* ── WHO WE SERVE ── */}
                                {tab === "Who We Serve" && <>
                                    <Inp label="Section Title" value={form.whoWeServe.title} onChange={v => nest("whoWeServe", { title: v })} />
                                    <Txta label="Section Description" value={form.whoWeServe.description} onChange={v => nest("whoWeServe", { description: v })} rows={2} />
                                    <SH title={`Items (${form.whoWeServe.items.length})`} />
                                    {form.whoWeServe.items.map((item, i) => {
                                        const u = (p: object) => { const a = [...form.whoWeServe.items]; a[i] = { ...a[i], ...p }; setItems("whoWeServe", a); };
                                        return <IC key={i} index={i} onRemove={() => setItems("whoWeServe", form.whoWeServe.items.filter((_, x) => x !== i))}>
                                            <div className="grid gap-[10px] sm:grid-cols-2">
                                                <Inp label="Title" value={item.title} onChange={v => u({ title: v })} />
                                                <Inp label="Icon" value={item.icon} onChange={v => u({ icon: v })} placeholder="fa-solid fa-building" />
                                            </div>
                                            <Txta label="Description" value={item.description} onChange={v => u({ description: v })} rows={2} />
                                            <Inp label="Image Path" value={item.image} onChange={v => u({ image: v })} placeholder="/images/services/.../img.jpg" />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add Item" onClick={() => setItems("whoWeServe", [...form.whoWeServe.items, { title: "", description: "", image: "", icon: "" }])} />
                                </>}

                                {/* ── INCLUDED ── */}
                                {tab === "Included" && <>
                                    <Inp label="Section Title" value={form.whatIsIncluded.title} onChange={v => nest("whatIsIncluded", { title: v })} />
                                    <Txta label="Section Description" value={form.whatIsIncluded.description} onChange={v => nest("whatIsIncluded", { description: v })} rows={2} />
                                    <SH title={`Items (${form.whatIsIncluded.items.length})`} />
                                    {form.whatIsIncluded.items.map((item, i) => {
                                        const u = (p: object) => { const a = [...form.whatIsIncluded.items]; a[i] = { ...a[i], ...p }; setItems("whatIsIncluded", a); };
                                        return <IC key={i} index={i} onRemove={() => setItems("whatIsIncluded", form.whatIsIncluded.items.filter((_, x) => x !== i))}>
                                            <div className="grid gap-[10px] sm:grid-cols-2">
                                                <Inp label="Title" value={item.title} onChange={v => u({ title: v })} />
                                                <Inp label="Icon" value={item.icon} onChange={v => u({ icon: v })} placeholder="fa-solid fa-chair" />
                                            </div>
                                            <Txta label="Description" value={item.description} onChange={v => u({ description: v })} rows={2} />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add Item" onClick={() => setItems("whatIsIncluded", [...form.whatIsIncluded.items, { title: "", description: "", icon: "" }])} />
                                </>}

                                {/* ── CTA & ABOUT ── */}
                                {tab === "CTA & About" && <>
                                    <SH title="Call to Action" />
                                    <Inp label="CTA Title" value={form.cta.title} onChange={v => nest("cta", { title: v })} />
                                    <Txta label="CTA Subtitle" value={form.cta.subtitle} onChange={v => nest("cta", { subtitle: v })} rows={2} />
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Inp label="Button Text" value={form.cta.buttonText} onChange={v => nest("cta", { buttonText: v })} placeholder="TALK TO US" />
                                        <Inp label="WhatsApp Text" value={form.cta.whatsappText} onChange={v => nest("cta", { whatsappText: v })} placeholder="WHATSAPP US" />
                                    </div>
                                    <Inp label="CTA Image Path" value={form.cta.image} onChange={v => nest("cta", { image: v })} placeholder="/images/services/.../cta-bg.jpg" />

                                    <SH title="About Section" />
                                    <Inp label="About Title" value={form.about.title} onChange={v => nest("about", { title: v })} />
                                    <Txta label="About Description" value={form.about.description} onChange={v => nest("about", { description: v })} rows={4} />
                                    <Txta label="Factory Info" value={form.about.factoryInfo} onChange={v => nest("about", { factoryInfo: v })} rows={2} />
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <Inp label="Founded Year" value={form.about.foundedYear} onChange={v => nest("about", { foundedYear: v })} placeholder="2015" />
                                        <Inp label="Outlets" type="number" value={form.about.outlets} onChange={v => nest("about", { outlets: Number(v) })} />
                                        <Inp label="Team Size" type="number" value={form.about.teamSize} onChange={v => nest("about", { teamSize: Number(v) })} />
                                    </div>
                                    <Inp label="About Image Path" value={form.about.image} onChange={v => nest("about", { image: v })} placeholder="/images/services/.../about.jpg" />
                                </>}

                                {/* ── PROCESS ── */}
                                {tab === "Process" && <>
                                    <Inp label="Section Title" value={form.process.title} onChange={v => nest("process", { title: v })} />
                                    <Txta label="Section Description" value={form.process.description} onChange={v => nest("process", { description: v })} rows={2} />
                                    <SH title={`Steps (${form.process.steps.length})`} />
                                    {form.process.steps.map((step, i) => {
                                        const u = (p: object) => { const a = [...form.process.steps]; a[i] = { ...a[i], ...p }; setSteps(a); };
                                        return <IC key={i} index={i} onRemove={() => setSteps(form.process.steps.filter((_, x) => x !== i))}>
                                            <div className="grid gap-[10px] sm:grid-cols-3">
                                                <Inp label="Step No." value={step.step} onChange={v => u({ step: v })} placeholder="01" />
                                                <div className="sm:col-span-2"><Inp label="Title" value={step.title} onChange={v => u({ title: v })} /></div>
                                            </div>
                                            <Txta label="Description" value={step.description} onChange={v => u({ description: v })} rows={2} />
                                            <Inp label="Icon" value={step.icon} onChange={v => u({ icon: v })} placeholder="fa-solid fa-users" />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add Step" onClick={() => setSteps([...form.process.steps, { step: String(form.process.steps.length + 1).padStart(2, "0"), title: "", description: "", icon: "" }])} />
                                </>}

                                {/* ── MATERIALS ── */}
                                {tab === "Materials" && <>
                                    <Inp label="Section Title" value={form.materials.title} onChange={v => nest("materials", { title: v })} />
                                    <Txta label="Section Description" value={form.materials.description} onChange={v => nest("materials", { description: v })} rows={2} />
                                    <SH title={`Items (${form.materials.items.length})`} />
                                    {form.materials.items.map((item, i) => {
                                        const u = (p: object) => { const a = [...form.materials.items]; a[i] = { ...a[i], ...p }; setItems("materials", a); };
                                        return <IC key={i} index={i} onRemove={() => setItems("materials", form.materials.items.filter((_, x) => x !== i))}>
                                            <div className="grid gap-[10px] sm:grid-cols-2">
                                                <Inp label="Name" value={item.name} onChange={v => u({ name: v })} />
                                                <Inp label="Icon" value={item.icon} onChange={v => u({ icon: v })} placeholder="fa-solid fa-tree" />
                                            </div>
                                            <Txta label="Description" value={item.description} onChange={v => u({ description: v })} rows={2} />
                                            <Inp label="Image Path" value={item.image} onChange={v => u({ image: v })} placeholder="/images/services/.../img.jpg" />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add Material" onClick={() => setItems("materials", [...form.materials.items, { name: "", description: "", image: "", icon: "" }])} />
                                </>}

                                {/* ── WHY US ── */}
                                {tab === "Why Us" && <>
                                    <Inp label="Section Title" value={form.whyChooseUs.title} onChange={v => nest("whyChooseUs", { title: v })} />
                                    <SH title={`Items (${form.whyChooseUs.items.length})`} />
                                    {form.whyChooseUs.items.map((item, i) => {
                                        const u = (p: object) => { const a = [...form.whyChooseUs.items]; a[i] = { ...a[i], ...p }; setItems("whyChooseUs", a); };
                                        return <IC key={i} index={i} onRemove={() => setItems("whyChooseUs", form.whyChooseUs.items.filter((_, x) => x !== i))}>
                                            <div className="grid gap-[10px] sm:grid-cols-2">
                                                <Inp label="Title" value={item.title} onChange={v => u({ title: v })} />
                                                <Inp label="Icon" value={item.icon} onChange={v => u({ icon: v })} placeholder="fa-solid fa-star" />
                                            </div>
                                            <Txta label="Description" value={item.description} onChange={v => u({ description: v })} rows={2} />
                                            <Inp label="Image Path" value={item.image} onChange={v => u({ image: v })} placeholder="/images/services/.../img.jpg" />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add Item" onClick={() => setItems("whyChooseUs", [...form.whyChooseUs.items, { title: "", description: "", icon: "", image: "" }])} />
                                </>}

                                {/* ── FAQS ── */}
                                {tab === "FAQs" && <>
                                    <SH title={`FAQs (${form.faqs.length})`} />
                                    {form.faqs.map((faq, i) => {
                                        const u = (p: object) => { const a = [...form.faqs]; a[i] = { ...a[i], ...p }; setFaqs(a); };
                                        return <IC key={i} index={i} onRemove={() => setFaqs(form.faqs.filter((_, x) => x !== i))}>
                                            <Inp label="Question" value={faq.question} onChange={v => u({ question: v })} />
                                            <Txta label="Answer" value={faq.answer} onChange={v => u({ answer: v })} rows={2} />
                                        </IC>;
                                    })}
                                    <AddBtn label="Add FAQ" onClick={() => setFaqs([...form.faqs, { question: "", answer: "" }])} />
                                </>}

                                {/* ── SEO & CONTACT ── */}
                                {tab === "SEO" && <>
                                    <SH title="SEO" />
                                    <Inp label="Meta Title" value={form.seo.metaTitle} onChange={v => nest("seo", { metaTitle: v })} />
                                    <Txta label="Meta Description" value={form.seo.metaDescription} onChange={v => nest("seo", { metaDescription: v })} rows={3} />
                                    <div>
                                        <Label className="mb-[5px] block text-[12px] font-medium text-[#4A4A4A]">Keywords (comma-separated)</Label>
                                        <Textarea value={form.seo.keywords.join(", ")} rows={3} className={TS}
                                            placeholder="keyword one, keyword two"
                                            onChange={e => nest("seo", { keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) })} />
                                    </div>
                                    <SH title="Contact Section" />
                                    <Inp label="Contact Title" value={form.contact.title} onChange={v => nest("contact", { title: v })} />
                                    <Txta label="Contact Description" value={form.contact.description} onChange={v => nest("contact", { description: v })} rows={3} />
                                </>}

                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#F0EAE3] bg-[#FFF9F4] px-[20px] py-[14px] sm:px-[28px]">
                        <button onClick={onClose}
                            className="h-[38px] rounded-[10px] border border-[#E4E4E4] bg-white px-[16px] text-[13px] font-medium text-[#666] transition-colors hover:bg-[#F5F5F5]">
                            Cancel
                        </button>
                        <Button onClick={handleSave} disabled={submitting || fetching}
                            className="flex h-[38px] items-center gap-2 rounded-[10px] bg-[#EA580C] px-[18px] text-[13px] font-medium text-white hover:bg-[#D94F0A] hover:shadow-[0_8px_20px_rgba(234,88,12,0.3)] disabled:opacity-60">
                            {submitting ? <Loader2 className="h-[14px] w-[14px] animate-spin" /> : <Save className="h-[14px] w-[14px]" />}
                            Save Changes
                        </Button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
