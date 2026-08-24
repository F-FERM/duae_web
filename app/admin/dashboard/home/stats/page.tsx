"use client";

import { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  Save,
  Award,
  Users,
  Briefcase,
  Smile,
  Building2,
  Type,
  AlignLeft,
  MessageCircle,
  Hash,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Sparkles,
} from "lucide-react";

import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

// ================= TYPES =================

interface InlineLinkItem {
  _id?: string;
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

export interface LisHomeStatsResponse {
  yearsOfExcellence: number;
  yearsLabel: string;
  skilledProfessionals: number;
  professionalsLabel: string;
  successfulProjects: number;
  projectsLabel: string;
  happyClients: number;
  clientsLabel: string;
  companyName: string;
  tagline: string;
  description: string;
  contactText: string;
  whatsappText: string;
  whatsappNumber: string;
  inlineLinks?: InlineLinkItem[];
}

interface HomeStats extends LisHomeStatsResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const EMPTY_INLINE_LINK: InlineLinkItem = {
  text: "",
  url: "/",
  type: "page",
  openInNewTab: false,
  position: 0,
};

const EMPTY_FORM: LisHomeStatsResponse = {
  yearsOfExcellence: 0,
  yearsLabel: "",
  skilledProfessionals: 0,
  professionalsLabel: "",
  successfulProjects: 0,
  projectsLabel: "",
  happyClients: 0,
  clientsLabel: "",
  companyName: "",
  tagline: "",
  description: "",
  contactText: "",
  whatsappText: "",
  whatsappNumber: "",
  inlineLinks: [],
};

// Link type options
const LINK_TYPES = [
  { value: "page", label: "Page", icon: FileText },
  { value: "section", label: "Section", icon: Layers },
  { value: "external", label: "External", icon: Globe },
];

// Common text suggestions for inline links
const COMMON_TEXT_SUGGESTIONS = [
  { label: "Dubai", url: "/locations/dubai" },
  { label: "UAE", url: "/locations/uae" },
  { label: "joinery", url: "/services/joinery" },
  { label: "fit-out", url: "/services/fitout-solutions" },
  { label: "metal works", url: "/services/metal-works" },
  { label: "renovation", url: "/services/renovation-services" },
  { label: "upholstery", url: "/services/upholstery" },
  { label: "bespoke", url: "/services/custom" },
  { label: "turnkey", url: "/services/turnkey-solutions" },
];

export default function HomeHeroStatsPage() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [form, setForm] = useState<LisHomeStatsResponse>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Inline Links state
  const [editingInlineLinkIndex, setEditingInlineLinkIndex] = useState<
    number | null
  >(null);
  const [inlineLinkModalOpen, setInlineLinkModalOpen] = useState(false);
  const [tempInlineLink, setTempInlineLink] =
    useState<InlineLinkItem>(EMPTY_INLINE_LINK);
  const [inlineLinksExpanded, setInlineLinksExpanded] = useState(true);
  const [linkSearchTerm, setLinkSearchTerm] = useState("");

  // ================= FETCH =================

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get<HomeStats>("/home-hero/stats");
      setStats(res.data);

      const {
        yearsOfExcellence,
        yearsLabel,
        skilledProfessionals,
        professionalsLabel,
        successfulProjects,
        projectsLabel,
        happyClients,
        clientsLabel,
        companyName,
        tagline,
        description,
        contactText,
        whatsappText,
        whatsappNumber,
        inlineLinks,
      } = res.data;

      setForm({
        yearsOfExcellence,
        yearsLabel,
        skilledProfessionals,
        professionalsLabel,
        successfulProjects,
        projectsLabel,
        happyClients,
        clientsLabel,
        companyName,
        tagline,
        description,
        contactText,
        whatsappText,
        whatsappNumber,
        inlineLinks: inlineLinks || [],
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ================= SAVE =================

  const handleSave = async () => {
    if (!form.companyName || !form.tagline || !form.description) {
      return toast.error("Company name, tagline and description are required");
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        inlineLinks: form.inlineLinks?.map(({ _id, ...rest }) => rest) || [],
      };

      await api.patch("/home-hero/stats", payload);

      toast.success("Stats updated");
      fetchStats();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update stats");
    } finally {
      setSaving(false);
    }
  };

  const setField = <K extends keyof LisHomeStatsResponse>(
    key: K,
    value: LisHomeStatsResponse[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ================= INLINE LINKS CRUD =================

  const openInlineLinkModal = (
    index?: number,
    suggestedText?: string,
    suggestedUrl?: string,
  ) => {
    if (index !== undefined) {
      setEditingInlineLinkIndex(index);
      setTempInlineLink({
        ...(form.inlineLinks?.[index] || EMPTY_INLINE_LINK),
      });
    } else {
      setEditingInlineLinkIndex(null);
      setTempInlineLink({
        ...EMPTY_INLINE_LINK,
        text: suggestedText || "",
        url: suggestedUrl || "/",
        position: form.inlineLinks?.length || 0,
      });
    }
    setInlineLinkModalOpen(true);
  };

  const closeInlineLinkModal = () => {
    setInlineLinkModalOpen(false);
    setEditingInlineLinkIndex(null);
    setTempInlineLink(EMPTY_INLINE_LINK);
  };

  const saveInlineLink = () => {
    if (!tempInlineLink.text || !tempInlineLink.url) {
      return toast.error("Text and URL are required");
    }

    const currentLinks = form.inlineLinks || [];

    const duplicate = currentLinks.some(
      (link, index) =>
        link.text.toLowerCase() === tempInlineLink.text.toLowerCase() &&
        index !== editingInlineLinkIndex,
    );

    if (duplicate) {
      return toast.error(
        `"${tempInlineLink.text}" already has an inline link. Please edit the existing one.`,
      );
    }

    const inlineLinks = [...currentLinks];
    if (editingInlineLinkIndex !== null) {
      inlineLinks[editingInlineLinkIndex] = tempInlineLink;
    } else {
      inlineLinks.push(tempInlineLink);
    }
    setForm({ ...form, inlineLinks });
    closeInlineLinkModal();
    toast.success(
      editingInlineLinkIndex !== null
        ? "Inline link updated"
        : "Inline link added",
    );
  };

  const deleteInlineLink = (index: number) => {
    const inlineLinks = (form.inlineLinks || []).filter((_, i) => i !== index);
    setForm({ ...form, inlineLinks });
    toast.success("Inline link removed");
  };

  // Get link type icon
  const getLinkTypeIcon = (type: string) => {
    const found = LINK_TYPES.find((t) => t.value === type);
    if (found) {
      const IconComponent = found.icon;
      return <IconComponent className="h-[12px] w-[12px]" />;
    }
    return <LinkIcon className="h-[12px] w-[12px]" />;
  };

  // Filter inline links based on search
  const filteredInlineLinks = (form.inlineLinks || []).filter(
    (link) =>
      link.text.toLowerCase().includes(linkSearchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(linkSearchTerm.toLowerCase()),
  );

  // Get all text content for suggestions
  const getAllContentText = () => {
    return form.companyName + " " + form.tagline + " " + form.description;
  };

  // Find suggested texts from content that might need links
  const getSuggestedTexts = () => {
    const content = getAllContentText().toLowerCase();
    const suggestions = [];
    const existingTexts = new Set(
      (form.inlineLinks || []).map((l) => l.text.toLowerCase()),
    );

    for (const suggestion of COMMON_TEXT_SUGGESTIONS) {
      if (
        !existingTexts.has(suggestion.label.toLowerCase()) &&
        content.includes(suggestion.label.toLowerCase())
      ) {
        suggestions.push(suggestion);
      }
    }
    return suggestions;
  };

  const suggestedTexts = getSuggestedTexts();

  const statCards: {
    key: keyof LisHomeStatsResponse;
    labelKey: keyof LisHomeStatsResponse;
    icon: React.ElementType;
    placeholder: string;
    labelPlaceholder: string;
  }[] = [
    {
      key: "yearsOfExcellence",
      labelKey: "yearsLabel",
      icon: Award,
      placeholder: "10",
      labelPlaceholder: "Years of Excellence",
    },
    {
      key: "skilledProfessionals",
      labelKey: "professionalsLabel",
      icon: Users,
      placeholder: "100",
      labelPlaceholder: "Skilled professionals",
    },
    {
      key: "successfulProjects",
      labelKey: "projectsLabel",
      icon: Briefcase,
      placeholder: "400",
      labelPlaceholder: "Successful projects",
    },
    {
      key: "happyClients",
      labelKey: "clientsLabel",
      icon: Smile,
      placeholder: "600",
      labelPlaceholder: "Happy Clients",
    },
  ];

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
            Home Hero Stats
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the company stats and info shown on the homepage hero
            section.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading || saving}
          className="
            flex h-[46px] w-full items-center justify-center gap-[8px]
            rounded-[14px] bg-[#EA580C] text-[14px] font-medium text-white
            hover:bg-[#EA580C]
            hover:shadow-[0_14px_30px_rgba(234,88,12,0.3)]
            sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]
          "
        >
          {saving ? (
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
          ) : (
            <Save className="h-[18px] w-[18px]" />
          )}
          Save Changes
        </Button>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#EA580C] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : (
          <div className="flex flex-col gap-[18px] sm:gap-[22px]">
            {/* ============ STAT COUNTERS ============ */}
            <Card className="rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] sm:rounded-[22px]">
              <CardContent className="p-[16px] sm:p-[22px] lg:p-[26px]">
                <h2 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                  Stat counters
                </h2>
                <p className="mt-[4px] text-[12px] text-[#888888] sm:text-[13px]">
                  These are the four counters shown in the hero section.
                </p>

                <div className="mt-[16px] grid grid-cols-1 gap-[14px] xs:grid-cols-2 sm:mt-[20px] sm:gap-[16px] lg:grid-cols-4">
                  {statCards.map(
                    ({
                      key,
                      labelKey,
                      icon: Icon,
                      placeholder,
                      labelPlaceholder,
                    }) => (
                      <div
                        key={key}
                        className="rounded-[14px] border border-[#E4C9B4] bg-[#FFF9F4] p-[14px] sm:p-[16px]"
                      >
                        <div className="flex items-center gap-[8px] text-[#C2410C]">
                          <Icon className="h-[15px] w-[15px]" />
                          <span className="text-[11px] font-medium uppercase tracking-[0.5px]">
                            {key}
                          </span>
                        </div>

                        <Input
                          type="number"
                          value={form[key] as number}
                          onChange={(e) =>
                            setField(key, Number(e.target.value) as any)
                          }
                          placeholder={placeholder}
                          className="mt-[10px] h-[44px] rounded-[10px] border-[#E4E4E4] bg-white text-[16px] font-semibold focus-visible:ring-[#EA580C]/30"
                        />

                        <Input
                          value={form[labelKey] as string}
                          onChange={(e) =>
                            setField(labelKey, e.target.value as any)
                          }
                          placeholder={labelPlaceholder}
                          className="mt-[8px] h-[38px] rounded-[10px] border-[#E4E4E4] bg-white text-[12px] focus-visible:ring-[#EA580C]/30"
                        />
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* ============ COMPANY INFO ============ */}
            <Card className="rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] sm:rounded-[22px]">
              <CardContent className="p-[16px] sm:p-[22px] lg:p-[26px]">
                <h2 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                  Company info
                </h2>
                <p className="mt-[4px] text-[12px] text-[#888888] sm:text-[13px]">
                  Company name, tagline and description shown alongside the
                  stats.
                </p>

                <div className="mt-[16px] space-y-[14px] sm:mt-[20px] sm:space-y-[16px]">
                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Building2 className="h-[13px] w-[13px]" /> Company name
                    </Label>
                    <Input
                      value={form.companyName}
                      onChange={(e) => setField("companyName", e.target.value)}
                      placeholder="WOOD WORLD DECOR LLC"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <Type className="h-[13px] w-[13px]" /> Tagline
                    </Label>
                    <Input
                      value={form.tagline}
                      onChange={(e) => setField("tagline", e.target.value)}
                      placeholder="Leading Joinery Fitout Company in Dubai, UAE"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <AlignLeft className="h-[13px] w-[13px]" /> Description
                    </Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      placeholder="We specialize in high-quality joinery and fit-out solutions..."
                      rows={3}
                      className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ============ CONTACT / WHATSAPP ============ */}
            <Card className="rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] sm:rounded-[22px]">
              <CardContent className="p-[16px] sm:p-[22px] lg:p-[26px]">
                <h2 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                  Contact buttons
                </h2>
                <p className="mt-[4px] text-[12px] text-[#888888] sm:text-[13px]">
                  Button labels and WhatsApp number used for the hero CTAs.
                </p>

                <div className="mt-[16px] grid grid-cols-1 gap-[12px] xs:grid-cols-2 sm:mt-[20px] sm:gap-[14px]">
                  <div>
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      Contact button text
                    </Label>
                    <Input
                      value={form.contactText}
                      onChange={(e) => setField("contactText", e.target.value)}
                      placeholder="TALK TO US"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
                      <MessageCircle className="h-[13px] w-[13px]" /> WhatsApp
                      button text
                    </Label>
                    <Input
                      value={form.whatsappText}
                      onChange={(e) => setField("whatsappText", e.target.value)}
                      placeholder="WHATSAPP US"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>

                  <div className="xs:col-span-2">
                    <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
                      WhatsApp number
                    </Label>
                    <Input
                      value={form.whatsappNumber}
                      onChange={(e) =>
                        setField("whatsappNumber", e.target.value)
                      }
                      placeholder="+971501234567"
                      className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#EA580C]/30 sm:h-[48px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ============ INLINE LINKS SECTION ============ */}
            <Card className="rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-[10px] sm:rounded-[22px]">
              <CardContent className="p-[16px] sm:p-[22px] lg:p-[26px]">
                <button
                  onClick={() => setInlineLinksExpanded(!inlineLinksExpanded)}
                  className="flex w-full items-center justify-between py-[4px]"
                >
                  <div className="flex items-center gap-[6px]">
                    <Hash className="h-[14px] w-[14px] text-[#EA580C]" />
                    <h2 className="text-[15px] font-semibold text-[#111111] sm:text-[16px]">
                      Inline Links ({form.inlineLinks?.length || 0})
                    </h2>
                    <span className="text-[11px] font-normal text-[#888888]">
                      (text-based links within content)
                    </span>
                  </div>
                  {inlineLinksExpanded ? (
                    <ChevronUp className="h-[18px] w-[18px] text-[#666]" />
                  ) : (
                    <ChevronDown className="h-[18px] w-[18px] text-[#666]" />
                  )}
                </button>

                <p className="mt-[4px] text-[12px] text-[#888888] sm:text-[13px]">
                  Text that will become clickable within the stats description.
                </p>

                {inlineLinksExpanded && (
                  <div className="mt-[12px]">
                    {/* Suggestions Section */}
                    {suggestedTexts.length > 0 && (
                      <div className="mb-4 rounded-[10px] border border-[#E4C9B4] bg-[#FFF9F4] p-[12px]">
                        <div className="flex items-center gap-[6px] text-[12px] font-medium text-[#666666]">
                          <Sparkles className="h-[14px] w-[14px] text-[#EA580C]" />
                          <span>Suggested texts that might need links:</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {suggestedTexts.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              onClick={() =>
                                openInlineLinkModal(
                                  undefined,
                                  suggestion.label,
                                  suggestion.url,
                                )
                              }
                              variant="outline"
                              className="h-[28px] gap-[4px] rounded-full border-[#E4C9B4] px-3 text-[11px] text-[#C2410C] hover:bg-[#FFF4EC] hover:text-[#C2410C]"
                            >
                              <Plus className="h-[10px] w-[10px]" />"
                              {suggestion.label}"
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Bar */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#999]" />
                      <Input
                        placeholder="Search inline links..."
                        value={linkSearchTerm}
                        onChange={(e) => setLinkSearchTerm(e.target.value)}
                        className="h-[36px] pl-[34px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                      />
                    </div>

                    <div className="space-y-[8px] max-h-[200px] overflow-y-auto pr-[4px]">
                      {filteredInlineLinks.length === 0 ? (
                        <div className="rounded-[10px] border border-dashed border-[#E4E4E4] p-[16px] text-center">
                          <p className="text-[12px] text-[#888888]">
                            {linkSearchTerm
                              ? "No matching inline links found"
                              : "No inline links configured yet"}
                          </p>
                        </div>
                      ) : (
                        filteredInlineLinks.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between rounded-[10px] border border-[#E4E4E4] bg-white p-[10px]"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-[6px] flex-wrap">
                                <span className="text-[9px] font-medium text-[#999]">
                                  #{link.position}
                                </span>
                                <div className="flex items-center gap-[4px] text-[9px] text-[#999]">
                                  {getLinkTypeIcon(link.type)}
                                  <span className="text-[7px] uppercase tracking-wider text-[#999]">
                                    {link.type}
                                  </span>
                                </div>
                                <span className="rounded bg-[#FFF4EC] px-1.5 py-0.5 text-[11px] font-medium text-[#EA580C] truncate max-w-[120px]">
                                  "{link.text}"
                                </span>
                              </div>
                              <div className="mt-[2px] flex items-center gap-[6px] text-[10px] text-[#666666]">
                                <span className="truncate">{link.url}</span>
                                {link.openInNewTab && (
                                  <span className="flex items-center gap-[4px] text-[8px] text-[#999] shrink-0">
                                    <ExternalLink className="h-[8px] w-[8px]" />
                                    New tab
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-[2px] ml-[8px]">
                              <Button
                                onClick={() => openInlineLinkModal(index)}
                                variant="ghost"
                                size="sm"
                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#EA580C]"
                              >
                                <Pencil className="h-[11px] w-[11px]" />
                              </Button>
                              <Button
                                onClick={() => deleteInlineLink(index)}
                                variant="ghost"
                                size="sm"
                                className="h-[24px] w-[24px] p-0 text-[#666] hover:text-[#DC2626]"
                              >
                                <Trash2 className="h-[11px] w-[11px]" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <Button
                      onClick={() => openInlineLinkModal()}
                      variant="outline"
                      className="mt-3 h-[34px] w-full gap-[6px] rounded-[10px] border-dashed border-[#E4C9B4] text-[12px] text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[36px]"
                    >
                      <Plus className="h-[14px] w-[14px]" />
                      Add Inline Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* ================= INLINE LINK MODAL ================= */}
      <AnimatePresence>
        {inlineLinkModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-[4px] p-[16px]"
            onClick={closeInlineLinkModal}
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
                  {editingInlineLinkIndex !== null
                    ? "Edit Inline Link"
                    : "Add Inline Link"}
                </h3>
                <button
                  onClick={closeInlineLinkModal}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-[16px] space-y-[12px]">
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Text to Link *
                  </Label>
                  <Input
                    value={tempInlineLink.text}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        text: e.target.value,
                      })
                    }
                    placeholder="Dubai"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                  <p className="mt-[4px] text-[10px] text-[#888888]">
                    This text will become clickable in your content. Must match
                    exactly.
                  </p>
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    URL *
                  </Label>
                  <Input
                    value={tempInlineLink.url}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        url: e.target.value,
                      })
                    }
                    placeholder="/locations/dubai"
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Link Type
                  </Label>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {LINK_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      const isSelected = tempInlineLink.type === type.value;
                      return (
                        <Button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setTempInlineLink({
                              ...tempInlineLink,
                              type: type.value,
                            })
                          }
                          variant={isSelected ? "default" : "outline"}
                          className={`
                            h-[36px] gap-[6px] rounded-[10px] text-[11px] font-medium
                            ${
                              isSelected
                                ? "bg-[#EA580C] text-white hover:bg-[#EA580C]"
                                : "border-[#E4E4E4] text-[#666] hover:bg-[#FFF4EC]"
                            }
                          `}
                        >
                          <IconComponent className="h-[13px] w-[13px]" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-[12px] pt-[4px]">
                  <Switch
                    id="inlineOpenInNewTab"
                    checked={tempInlineLink.openInNewTab}
                    onCheckedChange={(checked) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        openInNewTab: checked,
                      })
                    }
                  />
                  <Label
                    htmlFor="inlineOpenInNewTab"
                    className="text-[12px] font-medium text-[#2A2A2A]"
                  >
                    Open in new tab
                  </Label>
                </div>
                <div>
                  <Label className="mb-[6px] block text-[12px] font-medium text-[#2A2A2A]">
                    Position
                  </Label>
                  <Input
                    type="number"
                    value={tempInlineLink.position}
                    onChange={(e) =>
                      setTempInlineLink({
                        ...tempInlineLink,
                        position: Number(e.target.value),
                      })
                    }
                    className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#EA580C]/30"
                  />
                  <p className="mt-[4px] text-[10px] text-[#888888]">
                    Order of this link in the content (lower numbers appear
                    first)
                  </p>
                </div>

                {/* Preview Section */}
                {tempInlineLink.text && tempInlineLink.url && (
                  <div className="rounded-[10px] border border-[#E4C9B4] bg-[#FFF9F4] p-[12px]">
                    <p className="text-[11px] font-medium text-[#666666]">
                      Preview:
                    </p>
                    <p className="mt-[4px] text-[13px] text-[#111111]">
                      ...{" "}
                      <span className="cursor-pointer font-semibold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-2 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41]">
                        {tempInlineLink.text}
                      </span>{" "}
                      ...
                    </p>
                    <p className="mt-[4px] text-[10px] text-[#888888]">
                      → {tempInlineLink.url}
                      {tempInlineLink.openInNewTab && " (opens in new tab)"}
                    </p>
                  </div>
                )}

                <div className="flex gap-[10px] pt-[8px]">
                  <Button
                    variant="outline"
                    onClick={closeInlineLinkModal}
                    className="h-[40px] flex-1 rounded-[10px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveInlineLink}
                    className="h-[40px] flex-1 rounded-[10px] bg-[#EA580C] text-[13px] font-medium text-white hover:bg-[#EA580C]"
                  >
                    {editingInlineLinkIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
