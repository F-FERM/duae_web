"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fallbackBg from "../../../public/images/service1.webp";
import api from "@/lib/axios";

interface HeroAboutApiResponse {
  breadcrumbLabel: string;
  breadcrumbLink: string;
  currentPage: string;
  bgImage: string;
}

interface HeroAboutData {
  breadcrumbLabel: string;
  breadcrumbLink: string;
  currentPage: string;
  bgImage: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return fallbackBg.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: HeroAboutData = {
  breadcrumbLabel: "Home",
  breadcrumbLink: "/",
  currentPage: "About Us",
  bgImage: fallbackBg.src,
};

function HeroAboutSkeleton() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image src={fallbackBg} alt="" fill className="object-cover" priority={false} />
      </div>
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1220px] flex-col items-center justify-center px-5 py-12 text-center xs:min-h-[300px] sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <div className="h-9 w-40 animate-pulse rounded-md bg-white/20 xs:h-11 xs:w-52 sm:h-12 sm:w-64 md:h-16 md:w-80" />
        <div className="mt-5 h-4 w-32 animate-pulse rounded-md bg-white/15" />
      </div>
    </section>
  );
}

export default function HeroAbout() {
  const [data, setData] = useState<HeroAboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroAbout = async () => {
      try {
        const res = await api.get<HeroAboutApiResponse>("/about-hero");
        setData({
          breadcrumbLabel: res.data.breadcrumbLabel,
          breadcrumbLink: res.data.breadcrumbLink,
          currentPage: res.data.currentPage,
          bgImage: resolveImage(res.data.bgImage),
        });
      } catch (err) {
        console.error("Failed to fetch about hero section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroAbout();
  }, []);

  if (isLoading) return <HeroAboutSkeleton />;
  if (!data) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={data.bgImage}
          alt=""
          fill
          className="object-cover"
          unoptimized={data.bgImage.startsWith("http") || data.bgImage.startsWith(IMAGE_BASE_URL)}
          priority={false}
        />
      </div>

      {/* Warm dark overlay tint */}
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[260px] max-w-[1220px] flex-col items-center justify-center px-5 py-12 text-center xs:min-h-[300px] sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <h2 className="text-3xl font-extrabold leading-tight text-white xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {data.currentPage}
        </h2>

        <p className="mx-auto mt-4 max-w-[720px] text-xs uppercase tracking-wide text-white/85 xs:text-sm sm:text-base md:mt-5 md:text-lg">
          <Link href={data.breadcrumbLink} className="transition hover:text-white">
            {data.breadcrumbLabel}
          </Link>
          {" / "}
          {data.currentPage}
        </p>
      </div>
    </section>
  );
}