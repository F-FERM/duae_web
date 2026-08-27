"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import hero1 from "../../../public/images/slide1.webp";
import { useServiceAltText } from "@/app/(web)/services/useServiceAltText";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ServiceDetailApiResponse {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt?: string;
  cta?: {
    whatsappText?: string;
  };
  heroInlineLinks?: InlineLink[];
}

interface HeroServiceData {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  whatsappText: string;
  heroInlineLinks?: InlineLink[];
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
  imageAlt: "Wood World Decor - leading joinery company in Dubai",
  whatsappText: "WHATSAPP US",
  heroInlineLinks: [],
};

function HeroServiceSkeleton() {
  return (
    <section className="relative mt-0 min-h-[560px] w-full animate-pulse overflow-hidden bg-gray-300 py-16 sm:py-20 md:-mt-10 md:h-[520px] md:min-h-0 md:py-0 lg:h-[620px]">
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
  const altText = useServiceAltText(slug);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );
        setData({
          title: res.data.heroTitle,
          subtitle: res.data.heroSubtitle,
          image: resolveImage(res.data.heroImage, hero1.src),
          imageAlt:
            res.data.heroImageAlt ||
            "Wood World Decor - leading joinery company in Dubai",
          whatsappText: res.data.cta?.whatsappText || "WHATSAPP US",
          heroInlineLinks: res.data.heroInlineLinks || [],
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

  const heroLinks = data.heroInlineLinks || [];

  // Helper to render text with or without inline links
  const renderText = (
    text: string,
    links: InlineLink[],
    className: string,
    linkClassName: string,
  ) => {
    // If there are links that match the text, use InlineLinkedText
    const hasMatchingLink = links.some((link) => text.includes(link.text));

    if (hasMatchingLink) {
      return (
        <InlineLinkedText
          text={text}
          links={links}
          linkClassName={linkClassName}
        />
      );
    }

    // Otherwise render plain text
    return <span className={className}>{text}</span>;
  };

  return (
    <section className="relative mt-0 min-h-[560px] w-full overflow-hidden py-16 sm:py-20 md:-mt-10 md:h-[520px] md:min-h-0 md:py-0 lg:h-[620px]">
      <div className="absolute inset-0">
        <Image
          src={data.image}
          alt={data.imageAlt}
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
          {/* Title - with fallback to plain text */}
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            {renderText(
              data.title,
              heroLinks,
              "text-3xl font-extrabold leading-tight md:text-5xl text-white",
              "inline-block cursor-pointer font-extrabold text-white underline decoration-white/30 underline-offset-8 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-black rounded",
            )}
          </h1>

          {/* Description - with fallback to plain text */}
          <div className="mt-5 text-[16px] leading-7 text-white/90 sm:text-[18px] md:text-[20px]">
            {renderText(
              data.subtitle,
              heroLinks,
              "text-[16px] leading-7 text-white/90 sm:text-[18px] md:text-[20px]",
              "inline-block cursor-pointer font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-black rounded",
            )}
          </div>

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
