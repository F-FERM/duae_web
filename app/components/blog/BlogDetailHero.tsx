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
      <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1220px] flex-col items-center justify-center px-4 py-12 sm:min-h-[320px] sm:px-6 sm:py-16 md:min-h-[360px] md:py-20 lg:min-h-[420px]">
        <div className="h-9 w-11/12 max-w-md animate-pulse rounded-md bg-white/20 sm:h-12 sm:w-3/4 md:h-14 lg:h-16" />
        <div className="mt-4 h-3.5 w-32 animate-pulse rounded-md bg-white/15 sm:mt-5 sm:h-4 sm:w-40" />
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
          sizes="100vw"
          className="object-cover"
          unoptimized={
            data.bgImage.startsWith("http") ||
            (IMAGE_BASE_URL !== "" && data.bgImage.startsWith(IMAGE_BASE_URL))
          }
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1220px] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[320px] sm:px-6 sm:py-16 md:min-h-[360px] md:py-20 lg:min-h-[420px]">
        <h1 className="max-w-4xl break-words text-2xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {data.title}
        </h1>

        <p className="mx-auto mt-4 max-w-full break-words px-2 text-xs leading-6 text-white/85 sm:mt-5 sm:px-0 sm:text-sm sm:leading-7 md:text-base">
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