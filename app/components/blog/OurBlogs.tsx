"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fallbackBg from "../../../public/images/blog-hero.webp";
import api from "@/lib/axios";

interface BlogApiItem {
  image: string;
}

interface HeroOurBlogsData {
  title: string;
  bgImage: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return fallbackBg.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: HeroOurBlogsData = {
  title: "Our Blogs",
  bgImage: fallbackBg.src,
};

function HeroOurBlogsSkeleton() {
  return (
    <section className="relative mb-19 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image src={fallbackBg} alt="" fill className="object-cover" priority={false} />
      </div>
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <div className="h-12 w-48 animate-pulse rounded-md bg-white/20 sm:h-14 sm:w-64 md:h-16 md:w-80" />
        <div className="mt-5 h-4 w-40 animate-pulse rounded-md bg-white/15" />
      </div>
    </section>
  );
}

export default function HeroOurblogs() {
  const [data, setData] = useState<HeroOurBlogsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroOurBlogs = async () => {
      try {
        const res = await api.get<BlogApiItem[]>("/blogs/latest", {
          params: { limit: "1" },
        });
        const latest = Array.isArray(res.data) ? res.data[0] : null;

        setData({
          title: defaultData.title,
          bgImage: latest?.image ? resolveImage(latest.image) : defaultData.bgImage,
        });
      } catch (err) {
        console.error("Failed to fetch blogs hero:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroOurBlogs();
  }, []);

  if (isLoading) return <HeroOurBlogsSkeleton />;
  if (!data) return null;

  return (
    <section className="relative mb-19 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={fallbackBg}
          alt=""
          fill
          className="object-cover"
          unoptimized={
            data.bgImage.startsWith("http") || data.bgImage.startsWith(IMAGE_BASE_URL)
          }
          priority={false}
        />
      </div>

      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <h2 className="text-5xl font-extrabold leading-tight text-white sm:text-3xl md:text-7xl lg:text-7xl">
          {data.title}
        </h2>

        <p className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-white/85 sm:text-base md:mt-5 md:text-lg">
          <Link href="/" className="transition hover:text-white">
            HOME
          </Link>
          {" / "}
          {data.title.toUpperCase()}
        </p>
      </div>
    </section>
  );
}
