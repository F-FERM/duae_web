"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Layers,
  Building2,
  Hammer,
  KeyRound,
  Wrench,
  Settings,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/axios";
import imagepattern1 from "../../../public/images/pattern1.png";
import pattern2 from "../../../public/images/pattern2.png";

interface ServiceApi {
  _id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  order: number;
}

interface AboutContentApiResponse {
  servicesBadge: string;
  servicesTitle: string;
  servicesDescription: string;
  services: ServiceApi[];
}

interface WhatWeDoData {
  badge: string;
  title: string;
  description: string;
  services: ServiceApi[];
}

const IMAGE_ALT = "Interior fit out company in uae";

// FontAwesome class (from API) -> lucide-react icon
const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-building": Building2,
  "fa-solid fa-hammer": Hammer,
  "fa-solid fa-key": KeyRound,
  "fa-solid fa-wrench": Wrench,
  "fa-solid fa-gear": Settings,
  "fa-solid fa-couch": Sofa,
};

function getIcon(icon: string): LucideIcon {
  return iconMap[icon] || Layers;
}

const defaultData: WhatWeDoData = {
  badge: "Our Core Services",
  title: "What we do",
  description:
    "At Wood World Decor, we offer a comprehensive range of services, specialized in custom joinery, interior fit-out, turnkey fit-out, and renovation solutions across the UAE. Guided by years of hands-on experience, we focus on delivering results that reflect both excellence and efficiency. Right from concept to execution and completion, we aim to provide services that embody timeless design, superior workmanship, and long-lasting value.",
  services: [
    { _id: "1", title: "Joinery", description: "", icon: "fa-solid fa-hammer", link: "", order: 0 },
    { _id: "2", title: "Fit-out Solutions", description: "", icon: "fa-solid fa-building", link: "", order: 1 },
    { _id: "3", title: "Turnkey Solutions", description: "", icon: "fa-solid fa-key", link: "", order: 2 },
    { _id: "4", title: "Renovation Services", description: "", icon: "fa-solid fa-wrench", link: "", order: 3 },
    { _id: "5", title: "Metal Works", description: "", icon: "fa-solid fa-gear", link: "", order: 4 },
    { _id: "6", title: "Upholstery", description: "", icon: "fa-solid fa-couch", link: "", order: 5 },
  ],
};

function WhatWeDoSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded-md bg-black/10" />
          <div className="h-10 w-3/4 animate-pulse rounded-md bg-black/10" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-black/10" />
            <div className="h-4 w-full animate-pulse rounded-md bg-black/10" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-black/10" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 sm:gap-5">
              <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-black/10 sm:h-20 sm:w-20" />
              <div className="h-4 w-24 animate-pulse rounded-md bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhatWeDo() {
  const [data, setData] = useState<WhatWeDoData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await api.get<AboutContentApiResponse>("/about-content");
        setData({
          badge: res.data.servicesBadge,
          title: res.data.servicesTitle,
          description: res.data.servicesDescription,
          services: [...res.data.services].sort((a, b) => a.order - b.order),
        });
      } catch (err) {
        console.error("Failed to fetch about content (services):", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (isLoading) return <WhatWeDoSkeleton />;

  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-16 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image 
            src={imagepattern1} 
            alt={IMAGE_ALT} 
            priority 
            className="object-cover" 
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-70">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image 
            src={pattern2} 
            alt={IMAGE_ALT} 
            priority 
            className="object-cover" 
          />
        </motion.div>
      </div>

      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-10">
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#db5e41] sm:text-base">
            {data.badge}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#0c1526] sm:text-4xl md:text-6xl">
            {data.title}
          </h2>
          <p className="mt-8 text-[15px] leading-8 text-[#232323] md:text-[18px]">
            {data.description}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
          {data.services.map((service) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service._id}
                className="group flex items-center gap-4 sm:gap-5 cursor-pointer"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-colors duration-300 group-hover:bg-[#db5e41] sm:h-20 sm:w-20">
                  <Icon
                    className="text-[#0c1526] transition-colors duration-300 group-hover:text-white"
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-base font-bold leading-6 text-[#0c1526] sm:text-lg">
                  {service.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}