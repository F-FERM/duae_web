"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import hero1 from "../../../public/images/slide1.webp";

interface ServiceDetailApiResponse {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  cta?: {
    whatsappText?: string;
  };
}

interface HeroServiceData {
  title: string;
  subtitle: string;
  image: string;
  whatsappText: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: HeroServiceData = {
  title: "Top Joinery Company in Dubai",
  subtitle:
    "As a leading joinery company in Dubai, we deliver bespoke joinery solutions that blend durability, elegance, and functionality. Our team of skilled craftsmen specializes in custom furniture, wardrobes, decorative wood paneling, and office fit-outs - designed to elevate both residential and commercial spaces. With a commitment to quality and attention to detail, we ensure every project reflects innovation, style, and lasting value.",
  image: hero1.src,
  whatsappText: "WHATSAPP US",
};

function HeroServiceSkeleton() {
  return (
    <section className="relative -mt-10 h-[520px] w-full animate-pulse overflow-hidden bg-gray-300 lg:h-[620px]">
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-5 md:px-10">
        <div className="max-w-[560px] space-y-5">
          <div className="h-9 w-3/4 rounded-md bg-white/20 md:h-12" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md bg-white/20" />
            <div className="h-4 w-full rounded-md bg-white/20" />
            <div className="h-4 w-2/3 rounded-md bg-white/20" />
          </div>
          <div className="h-14 w-40 rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  );
}

export default function HeroService({ slug }: { slug: string }) {
  const [data, setData] = useState<HeroServiceData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        setData({
          title: res.data.heroTitle,
          subtitle: res.data.heroSubtitle,
          image: resolveImage(res.data.heroImage, hero1.src),
          whatsappText: res.data.cta?.whatsappText || "WHATSAPP US",
        });
      } catch (err) {
        console.error("Failed to fetch service hero:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <HeroServiceSkeleton />;

  return (
    <section className="relative -mt-10 h-[520px] w-full overflow-hidden lg:h-[620px]">
      <div className="absolute inset-0">
        <Image
          src={data.image}
          alt={data.title}
          fill
          priority
          unoptimized={data.image.startsWith("http")}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-[#c0522f]/40" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[560px] text-white"
        >
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            {data.title}
          </h1>

          <p className="mt-5 text-[18px] leading-7 text-white/90 md:text-[20px]">
            {data.subtitle}
          </p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/971527875262"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-8 flex h-14 w-fit items-center overflow-hidden rounded-full bg-[#5aa64d] px-8 text-sm font-bold tracking-wide text-white shadow-lg shadow-[#5aa64d]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#5aa64d]/30 md:text-base"
          >
            <span className="absolute inset-0 translate-x-full rounded-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black">
              <MessageCircle size={20} />
              {data.whatsappText}
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}