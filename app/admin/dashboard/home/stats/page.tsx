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
} from "lucide-react";

import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ================= TYPES =================

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
}

interface HomeStats extends LisHomeStatsResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

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
};

export default function HomeHeroStatsPage() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [form, setForm] = useState<LisHomeStatsResponse>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // ================= SAVE (PATCH, SINGLETON) =================

  const handleSave = async () => {
    if (!form.companyName || !form.tagline || !form.description) {
      return toast.error("Company name, tagline and description are required");
    }

    try {
      setSaving(true);

      // Singleton resource: PATCH updates the single stats document if it
      // exists, otherwise falls back to creating it via POST.
      if (stats?._id) {
        await api.patch(`/home-hero/stats`, form);
      } else {
        await api.patch("/home-hero/stats", form);
      }

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
    value: LisHomeStatsResponse[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

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
                    ({ key, labelKey, icon: Icon, placeholder, labelPlaceholder }) => (
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
                    )
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
          </div>
        )}
      </div>
    </section>
  );
}