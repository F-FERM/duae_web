"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import ctaBg from "../../../public/images/service1.webp";
import { motion } from "framer-motion";
import api from "@/lib/axios";

interface HomeContactApiResponse {
  title: string;
  description: string;
  talkToUsText: string;
  talkToUsLink: string;
  whatsappText: string;
  whatsappLink: string;
  whatsappNumber: string;
  isActive: boolean;
}

interface CtaData {
  title: string;
  description: string;
  talkToUsText: string;
  talkToUsLink: string;
  whatsappText: string;
  whatsappLink: string;
}

const defaultData: CtaData = {
  title: "Ready to Transform Your Space?",
  description:
    "Get expert joinery, fit-out, and renovation solutions designed for homes, offices, and commercial projects. Premium quality, on-time delivery, and end-to-end project support.",
  talkToUsText: "TALK TO US",
  talkToUsLink: "tel:+971565066845",
  whatsappText: "WHATSAPP US",
  whatsappLink: "https://wa.me/971527875262",
};

const IMAGE_ALT = "Interior fit out company in Dubai";

// Normalizes talkToUsLink to a tel: link, a relative route, or passes through
function resolveTalkLink(link: string): string {
  if (!link) return defaultData.talkToUsLink;
  if (link.startsWith("tel:") || link.startsWith("/")) return link;
  if (link.startsWith("+") || /^\d+$/.test(link)) return `tel:${link}`;
  return link;
}

function resolveWhatsappLink(link: string, number: string): string {
  if (link && link.startsWith("http")) return link;
  if (number) {
    const cleaned = number.replace(/[^\d+]/g, "");
    return `https://wa.me/${cleaned.startsWith("+") ? cleaned.substring(1) : cleaned}`;
  }
  return defaultData.whatsappLink;
}

function mapApiToCta(res: HomeContactApiResponse): CtaData {
  return {
    title: res.title || defaultData.title,
    description: res.description || defaultData.description,
    talkToUsText: res.talkToUsText || defaultData.talkToUsText,
    talkToUsLink: resolveTalkLink(res.talkToUsLink),
    whatsappText: res.whatsappText || defaultData.whatsappText,
    whatsappLink: resolveWhatsappLink(res.whatsappLink, res.whatsappNumber),
  };
}

function CallToActionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-[#3a1f14]">
      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <div className="h-8 w-4/5 animate-pulse rounded-md bg-white/20 sm:h-10 sm:w-3/5 md:h-12" />
        <div className="mt-4 h-4 w-11/12 animate-pulse rounded-md bg-white/15 sm:w-2/3" />
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded-md bg-white/15 sm:w-1/2" />
        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-10">
          <div className="h-14 w-full animate-pulse rounded-full bg-white/20 sm:w-40" />
          <div className="h-14 w-full animate-pulse rounded-full bg-white/20 sm:w-44" />
        </div>
      </div>
    </section>
  );
}

export default function CallToAction() {
  const [data, setData] = useState<CtaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCta = async () => {
      try {
        const res = await api.get<HomeContactApiResponse>("/home-contact");
        if (isMounted) setData(mapApiToCta(res.data));
      } catch (err) {
        console.error("Failed to fetch call-to-action section:", err);
        if (isMounted) setData(defaultData);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCta();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <CallToActionSkeleton />;
  if (!data) return null;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image 
          src={ctaBg} 
          alt={IMAGE_ALT} 
          fill 
          className="object-cover" 
          priority={false} 
        />
      </div>

      {/* Warm dark overlay tint */}
      <div className="absolute inset-0 bg-[#3a1f14]/70" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {data.title}
        </h2>

        <p className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-white/85 sm:text-base md:mt-5 md:text-lg">
          {data.description}
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 md:mt-10">
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            {/* Call / Contact */}
            <motion.a
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 70, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              href={data.talkToUsLink}
              className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-[#db5e41] px-8 text-base font-semibold text-white shadow-lg shadow-[#db5e41]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#db5e41]/30 sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full rounded-full bg-black transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 flex items-center gap-3">
                <Phone size={20} />
                {data.talkToUsText}
              </span>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 70, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              href={data.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full bg-[#5aa64d] px-8 text-base font-semibold text-white shadow-lg shadow-[#5aa64d]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#5aa64d]/30 sm:w-auto"
            >
              <span className="absolute inset-0 translate-x-full rounded-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-black">
                <MessageCircle size={20} />
                {data.whatsappText}
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}