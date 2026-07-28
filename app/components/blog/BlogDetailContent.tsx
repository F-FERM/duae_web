"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings, Clock, Phone, Mail } from "lucide-react";
import api from "@/lib/axios";

interface BlogApiItem {
    _id?: string;
    title: string;
    slug: string;
    image: string;
    date: string;
    // content can be a plain HTML string OR an array of block objects from the API
    content?: string | Record<string, unknown>[] | unknown;
    description?: string | Record<string, unknown>[] | unknown;
    category?: string;
    tags?: string[];
    order?: number;
}

/**
 * Converts whatever the API sends as "content" into a renderable HTML string.
 * Handles: plain string, array of rich-text blocks, or anything else.
 */
function resolveContent(raw: unknown): string {
    if (!raw) return "";

    // Already a plain HTML / text string
    if (typeof raw === "string") return raw;

    // Array of block objects (e.g. [{text:"..."}, {html:"..."}, {content:"..."}])
    if (Array.isArray(raw)) {
        return raw
            .map((block) => {
                if (typeof block === "string") return `<p>${block}</p>`;
                if (typeof block !== "object" || block === null) return "";

                const b = block as Record<string, unknown>;

                // Prefer html field
                if (typeof b.html === "string" && b.html) return b.html;

                // text / content / value field
                const textVal = b.text ?? b.content ?? b.value ?? b.body ?? b.paragraph;
                if (typeof textVal === "string" && textVal) return `<p>${textVal}</p>`;

                // Sanity-style: { _type, children: [{text}] }
                if (Array.isArray(b.children)) {
                    const inner = (b.children as Record<string, unknown>[])
                        .map((c) => (typeof c.text === "string" ? c.text : ""))
                        .join("");
                    if (inner) {
                        const tag = b._type === "heading" || b.type === "heading" ? "h2" : "p";
                        return `<${tag}>${inner}</${tag}>`;
                    }
                }

                return "";
            })
            .filter(Boolean)
            .join("");
    }

    // Fallback: stringify for debugging
    return "";
}

interface RelatedBlog {
    id: string;
    title: string;
    date: string;
    href: string;
}

function ContentSkeleton() {
    return (
        <section className="bg-white py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-[1220px] px-4">
                <div className="flex flex-col gap-12 lg:flex-row">
                    {/* Main content skeleton */}
                    <div className="flex-1 min-w-0">
                        <div className="h-6 w-40 animate-pulse rounded bg-gray-200 mb-4" />
                        <div className="h-[400px] w-full animate-pulse rounded bg-gray-200 mb-8" />
                        <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-4 w-full animate-pulse rounded bg-gray-200" />
                            ))}
                            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                    {/* Sidebar skeleton */}
                    <div className="w-full lg:w-[340px] shrink-0">
                        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-6" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 mb-6">
                                <div className="h-20 w-20 shrink-0 animate-pulse rounded bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function BlogDetailContent({ slug }: { slug: string }) {
    const [blog, setBlog] = useState<BlogApiItem | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current blog
                const res = await api.get<BlogApiItem>(`/blogs/detail/${slug}`);
                setBlog(res.data);

                // Fetch recent blogs for sidebar
                const relatedRes = await api.get<BlogApiItem[] | { data?: BlogApiItem[]; blogs?: BlogApiItem[] }>("/blogs", {
                    params: { limit: 5 },
                });

                const raw = Array.isArray(relatedRes.data)
                    ? relatedRes.data
                    : relatedRes.data.data ?? relatedRes.data.blogs ?? [];

                const mapped: RelatedBlog[] = raw
                    .filter((b) => b.slug !== slug)
                    .slice(0, 4)
                    .map((b, i) => ({
                        id: b._id || `${b.slug}-${i}`,
                        title: b.title,
                        date: b.date,
                        href: `/blogs/${b.slug}`,
                    }));

                setRelatedBlogs(mapped);
            } catch (err) {
                console.error("Failed to fetch blog detail:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) return <ContentSkeleton />;
    if (!blog) {
        return (
            <section className="bg-white py-24 text-center">
                <p className="text-lg text-gray-500">Blog post not found.</p>
                <Link href="/blogs" className="mt-4 inline-block text-[#db5e41] hover:underline">
                    ← Back to Blogs
                </Link>
            </section>
        );
    }

    const content = resolveContent(blog.content ?? blog.description);

    return (
        <section className="bg-white py-16 sm:py-20 md:py-24">
            <div className="px-4">
                <div className="flex flex-col gap-12 ">

                    {/* ── Main Article ── */}
                    <article className="flex-1 min-w-0">

                        {/* Orange pill date badge */}
                        <div className="mb-6">
                            <span className="inline-block rounded-full bg-[#db5e41] px-5 py-1.5 text-sm font-semibold text-white">
                                {blog.date}
                            </span>
                        </div>

                        {/* Decorative divider with gear icon */}
                        <div className="relative mb-8 flex items-center justify-center">
                            <div className="absolute left-0 right-0 h-px bg-gray-200" />
                            <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#db5e41]">
                                <Settings size={18} />
                            </span>
                        </div>

                        {/* Blog content – render as HTML if rich, else as plain paragraphs */}
                        {content ? (
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            <p className="text-gray-500 italic">No content available for this post.</p>
                        )}

                        {/* Tags */}
                        {/* {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-10 flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-[#f5ede9] px-3 py-1 text-sm font-medium text-[#db5e41]"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )} */}

                        {/* Back to blogs */}
                        {/* <div className="mt-12 border-t pt-8">
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 bg-[#db5e41] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c44e31]"
                            >
                                ← Back to All Blogs
                            </Link>
                        </div> */}
                    </article>

                    {/* ── Sidebar ── */}
                    <div className="w-full shrink-0 space-y-6">

                        {/* ── Latest Blogs Card ── */}
                        {relatedBlogs.length > 0 && (
                            <div className=" border border-gray-200 p-6">
                                {/* Decorative dot top-left */}
                                <span className="absolute left-4 top-4 h-3 w-3 rounded-full bg-[#f5c5b8]" />

                                <h3 className="mb-1 text-xl font-bold text-[#0c1526]">
                                    Latest Blogs
                                </h3>
                                <div className="mb-6 h-[3px] w-10 bg-[#db5e41]" />

                                <ul className="space-y-5">
                                    {relatedBlogs.map((related) => (
                                        <li key={related.id} className="relative">
                                            {/* Decorative mid-dot */}
                                            <span className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f5c5b8] opacity-50" />

                                            <Link href={related.href} className="group block">
                                                {/* Date row */}
                                                <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Clock size={13} className="shrink-0 text-[#db5e41]" />
                                                    <span>{related.date}</span>
                                                </div>
                                                {/* Title */}
                                                <p className="text-sm font-semibold leading-snug text-[#db5e41] transition group-hover:text-[#c44e31] line-clamp-2">
                                                    {related.title}
                                                </p>
                                            </Link>

                                            {relatedBlogs.indexOf(related) < relatedBlogs.length - 1 && (
                                                <div className="mt-4 border-t border-gray-100" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* ── Contact Us Box ── */}
                        <div className=" overflow-hidden bg-[#db5e41] px-8 py-12 text-center text-white">
                            {/* Decorative blurred circles */}
                            <span className="pointer-events-none absolute -left-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10" />
                            <span className="pointer-events-none absolute -right-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10" />

                            {/* Phone icon circle */}
                            <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                                <Phone size={26} className="text-[#db5e41]" />
                            </div>

                            <h4 className="relative z-10 mb-5 text-xl font-semibold tracking-wide">
                                Contact Us
                            </h4>

                            <a
                                href="tel:+971527875262"
                                className="relative z-10 mb-2 block text-lg font-bold tracking-wider hover:underline"
                            >
                                +971 52 787 5262
                            </a>

                            <a
                                href="mailto:info@wwduae.ae"
                                className="relative z-10 flex items-center justify-center gap-1.5 text-sm text-white/85 hover:text-white hover:underline"
                            >
                                <Mail size={14} />
                                info@wwduae.ae
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
