"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import ctaBg from "../../../public/images/service1.webp";
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
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    whatsappText: string;
    image: string;
    inlineLinks?: InlineLink[];
  };
}

interface CallToActionData {
  title: string;
  subtitle: string;
  buttonText: string;
  whatsappText: string;
  image: string;
  ctaInlineLinks?: InlineLink[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: CallToActionData = {
  title: "Ready to Transform Your Space?",
  subtitle:
    "Get expert joinery, fit-out, and renovation solutions designed for homes, offices, and commercial projects. Premium quality, on-time delivery, and end-to-end project support.",
  buttonText: "TALK TO US",
  whatsappText: "WHATSAPP US",
  image: ctaBg.src,
  ctaInlineLinks: [],
};

function CallToActionSkeleton() {
  return (
    <section className="relative flex min-h-[320px] w-full animate-pulse flex-col items-center justify-center bg-[#3a1f14]/90 px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
      <div className="h-8 w-2/3 max-w-md rounded-md bg-white/20 sm:h-10 md:h-12" />
      <div className="mt-4 h-4 w-full max-w-[600px] rounded-md bg-white/20" />
      <div className="mt-2 h-4 w-2/3 max-w-[400px] rounded-md bg-white/20" />
      <div className="mt-8 flex flex-col gap-4 sm:flex-row md:mt-10">
        <div className="h-14 w-40 rounded-full bg-white/20" />
        <div className="h-14 w-40 rounded-full bg-white/20" />
      </div>
    </section>
  );
}

export default function CallToAction({ slug }: { slug: string }) {
  const [data, setData] = useState<CallToActionData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const altText = useServiceAltText(slug);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );
        setData({
          title: res.data.cta.title,
          subtitle: res.data.cta.subtitle,
          buttonText: res.data.cta.buttonText,
          whatsappText: res.data.cta.whatsappText,
          image: resolveImage(res.data.cta.image, ctaBg.src),
          ctaInlineLinks: res.data.cta.inlineLinks || [],
        });
      } catch (err) {
        console.error("Failed to fetch CTA content:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <CallToActionSkeleton />;

  // Section-specific links for title and subtitle
  const ctaLinks = data.ctaInlineLinks || [];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={data.image}
          alt={altText}
          fill
          unoptimized={data.image.startsWith("http")}
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        {/* Title with inline links */}
        <div className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          <InlineLinkedText
            text={data.title}
            links={ctaLinks}
            linkClassName="inline-block cursor-pointer font-extrabold text-white underline decoration-white/30 underline-offset-8 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#3a1f14] rounded"
          />
        </div>

        {/* Subtitle with inline links */}
        <div className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-white/85 sm:text-base md:mt-5 md:text-lg">
          <InlineLinkedText
            text={data.subtitle}
            links={ctaLinks}
            linkClassName="inline-block cursor-pointer font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#3a1f14] rounded"
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 md:mt-10">
          <motion.a
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 70, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            href="tel:+971565066845"
            className="group relative flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-[#db5e41] px-8 text-base font-semibold text-white shadow-lg shadow-[#db5e41]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#db5e41]/30"
          >
            <span className="absolute inset-0 -translate-x-full rounded-full bg-black transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative z-10 flex items-center gap-3">
              <Phone size={20} />
              {data.buttonText}
            </span>
          </motion.a>

          <motion.a
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 70, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            href="https://wa.me/971527875262"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-14 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full bg-[#5aa64d] px-8 text-base font-semibold text-white shadow-lg shadow-[#5aa64d]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#5aa64d]/30"
          >
            <span className="absolute inset-0 translate-x-full rounded-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-black">
              <MessageCircle size={20} />
              {data.whatsappText}
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
