"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import fallbackBg from "../../../public/images/service1.webp";
import api from "@/lib/axios";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface HomeWorksApiResponse {
  title: string;
  titleInlineLinks?: InlineLink[];
  featuredImage: string;
}

interface HeroOurWorksData {
  title: string;
  bgImage: string;
  inlineLinks?: InlineLink[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return fallbackBg.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: HeroOurWorksData = {
  title: "Our Works",
  bgImage: fallbackBg.src,
  inlineLinks: [],
};

function HeroOurWorksSkeleton() {
  return (
    <section className="relative mb-19 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={fallbackBg}
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <div className="h-12 w-48 animate-pulse rounded-md bg-white/20 sm:h-14 sm:w-64 md:h-16 md:w-80" />
        <div className="mt-5 h-4 w-40 animate-pulse rounded-md bg-white/15" />
      </div>
    </section>
  );
}

export default function HeroOurWorks() {
  const [data, setData] = useState<HeroOurWorksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroOurWorks = async () => {
      try {
        const res = await api.get<HomeWorksApiResponse>("/home-works");
        setData({
          title: res.data.title || defaultData.title,
          bgImage: resolveImage(res.data.featuredImage),
          inlineLinks: res.data.titleInlineLinks || [],
        });
      } catch (err) {
        console.error("Failed to fetch our works hero:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroOurWorks();
  }, []);

  if (isLoading) return <HeroOurWorksSkeleton />;
  if (!data) return null;

  return (
    <section className="relative mb-19 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.bgImage}
          alt=""
          fill
          className="object-cover"
          unoptimized={
            data.bgImage.startsWith("http") ||
            data.bgImage.startsWith(IMAGE_BASE_URL)
          }
          priority={false}
        />
      </div>

      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <h2 className="text-5xl font-extrabold leading-tight text-white sm:text-3xl md:text-7xl lg:text-7xl">
          <InlineLinkedText
            text={data.title}
            links={data.inlineLinks || []}
            linkClassName="inline-block cursor-pointer font-extrabold text-white underline decoration-white/30 underline-offset-8 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#3a1f14] rounded"
          />
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
