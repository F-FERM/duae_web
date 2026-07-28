"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fallbackBg from "../../../public/images/service1.webp";
import api from "@/lib/axios";

interface BlogDetailApiItem {
    title: string;
    image: string;
    slug?: string;
}

interface BlogDetailHeroData {
    title: string;
    bgImage: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
    if (!path) return fallbackBg.src;
    if (path.startsWith("http")) return path;
    return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function HeroSkeleton() {
    return (
        <section className="relative w-full overflow-hidden">
            <div className="absolute inset-0">
                <Image src={fallbackBg} alt="" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 bg-[#3a1f14]/70" />
            <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-start justify-center px-5 py-16 sm:min-h-[360px] md:min-h-[420px] md:py-20">
                <div className="h-12 w-3/4 animate-pulse rounded-md bg-white/20 sm:h-14 md:h-16" />
                <div className="mt-5 h-4 w-40 animate-pulse rounded-md bg-white/15" />
            </div>
        </section>
    );
}

export default function BlogDetailHero({ slug }: { slug: string }) {
    const [data, setData] = useState<BlogDetailHeroData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await api.get<BlogDetailApiItem>(`/blogs/detail/${slug}`);
                const blog = res.data;
                setData({
                    title: blog.title,
                    bgImage: blog.image ? resolveImage(blog.image) : fallbackBg.src,
                });
            } catch (err) {
                console.error("Failed to fetch blog hero:", err);
                setData({
                    title: slug
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" "),
                    bgImage: fallbackBg.src,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    if (isLoading) return <HeroSkeleton />;
    if (!data) return null;

    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={data.bgImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    unoptimized={
                        data.bgImage.startsWith("http") ||
                        data.bgImage.startsWith(IMAGE_BASE_URL)
                    }
                    priority
                />
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#3a1f14]/70" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
                <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    {data.title}
                </h1>

                <p className="mx-auto mt-5 text-sm leading-7 text-white/85 sm:text-base">
                    <Link href="/" className="transition hover:text-white">
                        HOME
                    </Link>
                    {" / "}
                    <Link href="/blogs" className="transition hover:text-white">
                        BLOGS
                    </Link>
                    {" / "}
                    <span className="text-white">{data.title.toUpperCase()}</span>
                </p>
            </div>
        </section>
    );
}
