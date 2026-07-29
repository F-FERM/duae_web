"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  Mail,
  Phone,
  User,
  MessageSquare,
  Trash2,
  Eye,
  X,
  Search,
  RefreshCw,
  Inbox,
  Circle,
  CheckCircle2,
} from "lucide-react";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactSubmission {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: "pending" | "resolved" | string;
  isRead: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: string }) {
  const isPending = status === "pending";
  return (
    <span
      className={`inline-flex items-center gap-[4px] rounded-full px-[8px] py-[3px] text-[10px] font-semibold capitalize ${
        isPending
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      <span
        className={`h-[6px] w-[6px] rounded-full ${
          isPending ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SubmissionSkeleton() {
  return (
    <div className="space-y-[10px]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-[76px] w-full animate-pulse rounded-[16px] bg-white/70"
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [viewTarget, setViewTarget] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchSubmissions = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get("/contact-submissions");
      const raw: ContactSubmission[] = Array.isArray(res.data)
        ? res.data
        : (res.data?.data ?? res.data?.submissions ?? []);
      setSubmissions(
        [...raw].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to load submissions"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/contact-submissions/${deleteTarget._id}`);
      setSubmissions((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Submission deleted");
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to delete"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.phone?.toLowerCase().includes(q) ||
      s.message?.toLowerCase().includes(q)
    );
  });

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section className="min-h-screen bg-[#FFF4EC] px-[16px] py-[24px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", background: "#111", color: "#fff", fontSize: "14px" },
          success: { iconTheme: { primary: "#EA580C", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* Header */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-[10px]">
            <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] sm:text-[28px] lg:text-[32px]">
              Contact Submissions
            </h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#EA580C] px-[8px] py-[2px] text-[11px] font-bold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px]">
            All messages submitted through the contact form.
          </p>
        </div>

        <Button
          onClick={() => fetchSubmissions(true)}
          disabled={refreshing}
          variant="outline"
          className="h-[42px] gap-[6px] rounded-[12px] border-[#E4C9B4] bg-white px-[14px] text-[13px] font-medium text-[#C2410C] hover:bg-[#FFF4EC] sm:h-[44px]"
        >
          <RefreshCw className={`h-[15px] w-[15px] ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="mx-auto mt-[20px] max-w-[1600px]">
        <div className="relative max-w-[420px]">
          <Search className="absolute left-[12px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#999]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or message..."
            className="h-[42px] rounded-[12px] border-[#E4C9B4] bg-white pl-[36px] text-[13px] focus-visible:ring-[#EA580C]/30"
          />
        </div>
      </div>

      {/* List */}
      <div className="mx-auto mt-[20px] max-w-[1600px]">
        {loading ? (
          <SubmissionSkeleton />
        ) : filtered.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#E4C9B4] bg-white/60">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[48px] text-center">
              <Inbox className="h-[32px] w-[32px] text-[#C2410C]/40" />
              <p className="text-[14px] font-medium text-[#333]">
                {search ? "No results found" : "No submissions yet"}
              </p>
              <p className="text-[12px] text-[#888]">
                {search
                  ? "Try a different search term."
                  : "Submissions from the contact form will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-[8px]">
            {/* Stats row */}
            <div className="mb-[14px] flex flex-wrap items-center gap-[8px]">
              <span className="rounded-[8px] bg-white px-[12px] py-[5px] text-[12px] font-medium text-[#111]">
                {filtered.length} {filtered.length === 1 ? "submission" : "submissions"}
                {search && ` for "${search}"`}
              </span>
              {unreadCount > 0 && (
                <span className="rounded-[8px] bg-amber-50 px-[12px] py-[5px] text-[12px] font-medium text-amber-700">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {filtered.map((submission) => (
              <motion.div
                key={submission._id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <Card
                  className={`overflow-hidden rounded-[16px] border bg-white/85 shadow-[0_2px_14px_rgba(0,0,0,0.05)] backdrop-blur-[6px] transition-shadow hover:shadow-[0_6px_28px_rgba(234,88,12,0.1)] ${
                    !submission.isRead ? "border-[#EA580C]/25" : "border-white/60"
                  }`}
                >
                  <CardContent className="p-[14px] sm:p-[16px]">
                    <div className="flex flex-wrap items-start justify-between gap-[12px]">

                      {/* Unread dot */}
                      <div className="flex items-start gap-[10px]">
                        <div className="mt-[3px]">
                          {submission.isRead ? (
                            <CheckCircle2 className="h-[14px] w-[14px] text-[#ccc]" />
                          ) : (
                            <Circle className="h-[14px] w-[14px] fill-[#EA580C] text-[#EA580C]" />
                          )}
                        </div>

                        {/* Info grid */}
                        <div className="flex flex-wrap items-start gap-x-[20px] gap-y-[8px]">
                          {/* Name */}
                          <div className="min-w-[110px]">
                            <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Name</p>
                            <p className="text-[13px] font-semibold text-[#111]">{submission.name}</p>
                          </div>

                          {/* Phone */}
                          <div className="min-w-[120px]">
                            <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Phone</p>
                            <a
                              href={`tel:${submission.phone}`}
                              className="text-[13px] font-medium text-[#333] hover:text-[#EA580C]"
                            >
                              {submission.phone}
                            </a>
                          </div>

                          {/* Email */}
                          <div className="min-w-[160px]">
                            <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Email</p>
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-[13px] font-medium text-[#333] hover:text-[#EA580C]"
                            >
                              {submission.email}
                            </a>
                          </div>

                          {/* Message preview */}
                          <div className="min-w-[160px] max-w-[280px]">
                            <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Message</p>
                            <p className="line-clamp-1 text-[13px] text-[#555]">{submission.message}</p>
                          </div>

                          {/* Status */}
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Status</p>
                            <StatusBadge status={submission.status} />
                          </div>
                        </div>
                      </div>

                      {/* Right: date + actions */}
                      <div className="flex shrink-0 flex-col items-end gap-[8px]">
                        <p className="text-[11px] text-[#bbb]">{formatDate(submission.createdAt)}</p>
                        <div className="flex items-center gap-[6px]">
                          <Button
                            onClick={() => setViewTarget(submission)}
                            variant="outline"
                            className="h-[30px] gap-[4px] rounded-[8px] border-[#E4C9B4] bg-white px-[10px] text-[11px] font-medium text-[#C2410C] hover:bg-[#FFF4EC]"
                          >
                            <Eye className="h-[12px] w-[12px]" />
                            View
                          </Button>
                          <Button
                            onClick={() => setDeleteTarget(submission)}
                            variant="outline"
                            className="h-[30px] w-[30px] shrink-0 rounded-[8px] border-[#F3D0D0] bg-white p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                          >
                            <Trash2 className="h-[12px] w-[12px]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── View Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {viewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[16px] backdrop-blur-[4px]"
            onClick={() => setViewTarget(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[520px] rounded-[22px] bg-white p-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-[28px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <h2 className="text-[18px] font-semibold text-[#111]">Submission Details</h2>
                  <StatusBadge status={viewTarget.status} />
                </div>
                <button
                  onClick={() => setViewTarget(null)}
                  className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] hover:bg-[#EDE3D6]"
                >
                  <X className="h-[15px] w-[15px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[10px]">
                {/* Name */}
                <div className="flex items-center gap-[12px] rounded-[12px] bg-[#FFF9F4] p-[12px]">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FFF4EC]">
                    <User className="h-[16px] w-[16px] text-[#EA580C]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Name</p>
                    <p className="text-[14px] font-semibold text-[#111]">{viewTarget.name}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-[12px] rounded-[12px] bg-[#FFF9F4] p-[12px]">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FFF4EC]">
                    <Phone className="h-[16px] w-[16px] text-[#EA580C]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Phone</p>
                    <a href={`tel:${viewTarget.phone}`} className="text-[14px] font-medium text-[#111] hover:text-[#EA580C]">
                      {viewTarget.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-[12px] rounded-[12px] bg-[#FFF9F4] p-[12px]">
                  <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#FFF4EC]">
                    <Mail className="h-[16px] w-[16px] text-[#EA580C]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Email</p>
                    <a href={`mailto:${viewTarget.email}`} className="text-[14px] font-medium text-[#111] hover:text-[#EA580C]">
                      {viewTarget.email}
                    </a>
                  </div>
                </div>

                {/* Message */}
                <div className="rounded-[12px] bg-[#FFF9F4] p-[12px]">
                  <div className="mb-[8px] flex items-center gap-[8px]">
                    <MessageSquare className="h-[15px] w-[15px] text-[#EA580C]" />
                    <p className="text-[10px] uppercase tracking-wide text-[#aaa]">Message</p>
                  </div>
                  <p className="whitespace-pre-wrap text-[14px] leading-[1.75] text-[#333]">
                    {viewTarget.message}
                  </p>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-[8px] rounded-[12px] bg-[#F9F9F9] px-[12px] py-[10px]">
                  <div className="flex items-center gap-[6px]">
                    {viewTarget.isRead ? (
                      <CheckCircle2 className="h-[14px] w-[14px] text-emerald-500" />
                    ) : (
                      <Circle className="h-[14px] w-[14px] fill-amber-500 text-amber-500" />
                    )}
                    <span className="text-[12px] text-[#666]">
                      {viewTarget.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#bbb]">
                    Received: {formatDate(viewTarget.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-[18px] flex justify-end gap-[10px]">
                <Button
                  onClick={() => { setDeleteTarget(viewTarget); setViewTarget(null); }}
                  variant="outline"
                  className="h-[38px] gap-[5px] rounded-[10px] border-[#F3D0D0] text-[13px] text-[#DC2626] hover:bg-[#FEF2F2]"
                >
                  <Trash2 className="h-[13px] w-[13px]" />
                  Delete
                </Button>
                <Button
                  onClick={() => setViewTarget(null)}
                  className="h-[38px] rounded-[10px] bg-[#EA580C] px-[20px] text-[13px] font-medium text-white hover:bg-[#D14E0A]"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-[16px] backdrop-blur-[4px]"
            onClick={() => { if (!deletingId) setDeleteTarget(null); }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] rounded-[20px] bg-white p-[22px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:p-[26px]"
            >
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#FEF2F2]">
                <Trash2 className="h-[20px] w-[20px] text-[#DC2626]" />
              </div>
              <h3 className="mt-[14px] text-[16px] font-semibold text-[#111]">
                Delete this submission?
              </h3>
              <p className="mt-[6px] text-[12px] leading-[1.6] text-[#666]">
                From <strong>{deleteTarget.name}</strong> ({deleteTarget.email}). This action cannot be undone.
              </p>
              <div className="mt-[20px] flex gap-[10px]">
                <Button
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!deletingId}
                  className="h-[42px] flex-1 rounded-[12px] border-[#E4E4E4] text-[13px] font-medium text-[#666]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[42px] flex-1 gap-[6px] rounded-[12px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#B91C1C]"
                >
                  {deletingId ? (
                    <Loader2 className="h-[14px] w-[14px] animate-spin" />
                  ) : (
                    <Trash2 className="h-[13px] w-[13px]" />
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
