"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";

interface Milestone {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AboutApiResponse {
  _id?: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  foundedYear: string;
  foundedMonth: string;
  yearsOfExcellence: number;
  teamSize: number;
  milestonesTitle: string;
  milestonesSubtitle: string;
  milestones: Milestone[];
  isActive: boolean;
}

type FormState = Omit<AboutApiResponse, "_id">;

const emptyMilestone: Milestone = {
  title: "",
  description: "",
  icon: "fa-solid fa-star",
  order: 0,
};

const defaultForm: FormState = {
  title: "",
  description: "",
  image: "",
  buttonText: "VIEW MORE",
  buttonLink: "/about",
  foundedYear: "",
  foundedMonth: "",
  yearsOfExcellence: 0,
  teamSize: 0,
  milestonesTitle: "Our Milestones",
  milestonesSubtitle: "",
  milestones: [],
  isActive: true,
};

// Known icon values used across the site's sections — extend as needed.
const ICON_OPTIONS = [
  "fa-solid fa-newspaper",
  "fa-solid fa-trophy",
  "fa-solid fa-award",
  "fa-solid fa-leaf",
  "fa-solid fa-hammer",
  "fa-solid fa-people-arrows",
  "fa-solid fa-clock",
  "fa-solid fa-star",
  "fa-solid fa-check-circle",
  "fa-solid fa-wrench",
  "fa-solid fa-shield-check",
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function inputClass(extra = "") {
  return `w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#db5e41] focus:ring-1 focus:ring-[#db5e41] ${extra}`;
}

function labelClass() {
  return "mb-1.5 block text-sm font-medium text-gray-700";
}

export default function AboutAdminForm() {
  const [docId, setDocId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [milestoneDraft, setMilestoneDraft] = useState<Milestone>(emptyMilestone);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get<AboutApiResponse>("/home-about");
        const { _id, ...rest } = res.data;
        setDocId(_id ?? null);
        setForm({ ...defaultForm, ...rest });
        setImagePreview(rest.image || "");
      } catch (err) {
        console.error("Failed to fetch home-about section:", err);
        setStatus({ type: "error", message: "Couldn't load the About section. You can still fill the form and save." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function openAddMilestone() {
    setMilestoneDraft({ ...emptyMilestone, order: form.milestones.length });
    setEditingIndex(null);
    setShowMilestoneForm(true);
  }

  function openEditMilestone(index: number) {
    setMilestoneDraft(form.milestones[index]);
    setEditingIndex(index);
    setShowMilestoneForm(true);
  }

  function cancelMilestoneForm() {
    setShowMilestoneForm(false);
    setEditingIndex(null);
    setMilestoneDraft(emptyMilestone);
  }

  function saveMilestoneDraft() {
    if (!milestoneDraft.title.trim() || !milestoneDraft.description.trim()) {
      setStatus({ type: "error", message: "Milestone title and description are required." });
      return;
    }
    setForm((prev) => {
      const milestones = [...prev.milestones];
      if (editingIndex !== null) {
        milestones[editingIndex] = milestoneDraft;
      } else {
        milestones.push(milestoneDraft);
      }
      return { ...prev, milestones };
    });
    cancelMilestoneForm();
  }

  function requestDeleteMilestone(index: number) {
    setConfirmDeleteIndex(index);
  }

  function confirmDeleteMilestone() {
    if (confirmDeleteIndex === null) return;
    setForm((prev) => ({
      ...prev,
      milestones: prev.milestones
        .filter((_, i) => i !== confirmDeleteIndex)
        .map((m, i) => ({ ...m, order: i })),
    }));
    setConfirmDeleteIndex(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      let payload: FormData | FormState;
      let headers: Record<string, string> | undefined;

      if (imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (key === "milestones") {
            fd.append("milestones", JSON.stringify(value));
          } else {
            fd.append(key, String(value));
          }
        });
        fd.append("image", imageFile);
        payload = fd;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        payload = form;
      }

      if (docId) {
        await api.put(`/home-about/${docId}`, payload, headers ? { headers } : undefined);
      } else {
        await api.post("/home-about", payload, headers ? { headers } : undefined);
      }

      setStatus({ type: "success", message: "About section saved successfully." });
      setImageFile(null);
    } catch (err) {
      console.error("Failed to save home-about section:", err);
      setStatus({ type: "error", message: "Something went wrong while saving. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="mt-6 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Edit About Section</h1>

      {status && (
        <div
          className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Core content */}
        <section className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Content</h2>

          <div>
            <label className={labelClass()}>Title</label>
            <input
              className={inputClass()}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelClass()}>Description</label>
            <textarea
              className={inputClass("min-h-[140px] resize-y")}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass()}>Button Text</label>
              <input
                className={inputClass()}
                value={form.buttonText}
                onChange={(e) => updateField("buttonText", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass()}>Button Link</label>
              <input
                className={inputClass()}
                value={form.buttonLink}
                onChange={(e) => updateField("buttonLink", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass()}>Image</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {imagePreview && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-40">
                  <Image src={imagePreview} alt="About section preview" fill unoptimized className="object-cover" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                {imagePreview ? "Replace Image" : "Upload Image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Company Stats</h2>

          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-4">
            <div>
              <label className={labelClass()}>Founded Month</label>
              <select
                className={inputClass()}
                value={form.foundedMonth}
                onChange={(e) => updateField("foundedMonth", e.target.value)}
              >
                <option value="">Select</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass()}>Founded Year</label>
              <input
                className={inputClass()}
                value={form.foundedYear}
                onChange={(e) => updateField("foundedYear", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass()}>Years of Excellence</label>
              <input
                type="number"
                className={inputClass()}
                value={form.yearsOfExcellence}
                onChange={(e) => updateField("yearsOfExcellence", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass()}>Team Size</label>
              <input
                type="number"
                className={inputClass()}
                value={form.teamSize}
                onChange={(e) => updateField("teamSize", Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="space-y-4 rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Milestones</h2>
            <button
              type="button"
              onClick={openAddMilestone}
              className="w-full rounded-lg bg-[#db5e41] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bb4e2d] xs:w-auto"
            >
              + Add Milestone
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass()}>Milestones Title</label>
              <input
                className={inputClass()}
                value={form.milestonesTitle}
                onChange={(e) => updateField("milestonesTitle", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass()}>Milestones Subtitle</label>
              <input
                className={inputClass()}
                value={form.milestonesSubtitle}
                onChange={(e) => updateField("milestonesSubtitle", e.target.value)}
              />
            </div>
          </div>

          {/* Inline add/edit milestone form */}
          {showMilestoneForm && (
            <div className="space-y-3 rounded-lg border border-[#db5e41]/30 bg-[#fff7f5] p-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {editingIndex !== null ? "Edit Milestone" : "New Milestone"}
              </h3>
              <div>
                <label className={labelClass()}>Title</label>
                <input
                  className={inputClass()}
                  value={milestoneDraft.title}
                  onChange={(e) => setMilestoneDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass()}>Description</label>
                <textarea
                  className={inputClass("min-h-[80px] resize-y")}
                  value={milestoneDraft.description}
                  onChange={(e) => setMilestoneDraft((d) => ({ ...d, description: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass()}>Icon</label>
                <select
                  className={inputClass()}
                  value={milestoneDraft.icon}
                  onChange={(e) => setMilestoneDraft((d) => ({ ...d, icon: e.target.value }))}
                >
                  {ICON_OPTIONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 xs:flex-row">
                <button
                  type="button"
                  onClick={saveMilestoneDraft}
                  className="w-full rounded-lg bg-[#db5e41] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bb4e2d] xs:w-auto"
                >
                  {editingIndex !== null ? "Save Changes" : "Add Milestone"}
                </button>
                <button
                  type="button"
                  onClick={cancelMilestoneForm}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 xs:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Milestones list */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {form.milestones.length === 0 && (
              <p className="text-sm text-gray-500 sm:col-span-2">No milestones yet — add your first one above.</p>
            )}
            {form.milestones.map((milestone, index) => (
              <div key={milestone._id ?? index} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#db5e41]">{milestone.icon}</p>
                    <h4 className="mt-1 text-sm font-semibold text-gray-900">{milestone.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                {confirmDeleteIndex === index ? (
                  <div className="mt-3 flex flex-col gap-2 xs:flex-row">
                    <span className="text-xs text-gray-600 xs:self-center">Delete this milestone?</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={confirmDeleteMilestone}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteIndex(null)}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditMilestone(index)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteMilestone(index)}
                      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 xs:flex-row xs:justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-[#db5e41] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#bb4e2d] disabled:cursor-not-allowed disabled:opacity-60 xs:w-auto"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}