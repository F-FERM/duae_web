"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Star,
  ClipboardList,
  Ruler,
  Hammer,
  Clock,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/axios";
import whyBg from "../../../public/images/pattern3.png";

interface WhyChooseUsItemApi {
  title: string;
  description: string;
  icon: string;
  image: string;
}

interface ServiceDetailApiResponse {
  whyChooseUs: {
    title: string;
    items: WhyChooseUsItemApi[];
  };
}

interface WhyChooseUsData {
  title: string;
  items: WhyChooseUsItemApi[];
}

const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-star": Star,
  "fa-solid fa-clipboard-list": ClipboardList,
  "fa-solid fa-pen-ruler": Ruler,
  "fa-solid fa-hammer": Hammer,
  "fa-solid fa-clock": Clock,
};

function getIcon(icon: string): LucideIcon {
  return iconMap[icon] || CheckCircle2;
}

const defaultData: WhyChooseUsData = {
  title: "Why Choose Us?",
  items: [
    { title: "Expertise You Can Trust", description: "With years of experience, we are recognized as best fit out contractors in Dubai, delivering projects with precision and excellence.", icon: "fa-solid fa-star", image: "" },
    { title: "Comprehensive Fit-Out Solutions", description: "As leading interior fit out contractors in Dubai, we handle every aspect of your project - from design and joinery to electrical and finishing touches.", icon: "fa-solid fa-clipboard-list", image: "" },
    { title: "Innovative & Customized Designs", description: "We create tailor-made interiors that combine style, functionality, and innovation to reflect your unique vision.", icon: "fa-solid fa-pen-ruler", image: "" },
    { title: "Quality Craftsmanship", description: "Our skilled team ensures high-quality workmanship, attention to detail, and durable results that stand the test of time.", icon: "fa-solid fa-hammer", image: "" },
    { title: "Timely Delivery & Client Satisfaction", description: "We prioritize efficiency and seamless project management, ensuring every fit-out is completed on time while exceeding client expectations.", icon: "fa-solid fa-clock", image: "" },
  ],
};

function DotGrid({ className }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none grid grid-cols-4 gap-3 ${className}`}
      animate={{ y: [0, -10, 0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-white/25" />
      ))}
    </motion.div>
  );
}

function WhyChooseUsSkeleton() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-[1350px] px-4">
        <div className="mx-auto h-9 w-64 animate-pulse rounded-md bg-white/10" />

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center bg-[#0c0c0c] px-6 pb-10 pt-16 sm:px-8 sm:pt-20">
              <div className="h-16 w-16 animate-pulse rounded-full bg-white/10 sm:h-20 sm:w-20" />
              <div className="mt-6 h-7 w-40 animate-pulse rounded-md bg-white/10" />
              <div className="mt-4 h-4 w-56 animate-pulse rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-40 animate-pulse rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhyChooseUsService({ slug }: { slug: string }) {
  const [data, setData] = useState<WhyChooseUsData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        setData({
          title: res.data.whyChooseUs.title,
          items: res.data.whyChooseUs.items,
        });
      } catch (err) {
        console.error("Failed to fetch why-choose-us section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <WhyChooseUsSkeleton />;

  return (
    <section
      className="relative overflow-hidden bg-black bg-center py-16 sm:py-20 md:py-28"
      style={{ backgroundImage: `url(${whyBg.src})` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/4 top-6 -translate-x-1/2 sm:top-10"
      >
        <DotGrid />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-6 left-2/3 -translate-x-1/2 sm:bottom-10"
      >
        <DotGrid />
      </motion.div>

      <div className="relative mx-auto max-w-[1350px] px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
        >
          {data.title}
        </motion.h2>

        <div className="relative mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-16 cursor-pointer">
          {data.items.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 4) * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center bg-[#0c0c0c] px-6 pb-10 pt-16 text-center transition-all duration-500 ease-out hover:-translate-y-2 sm:px-8 sm:pt-20"
              >
                <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#db5e41] shadow-lg transition-transform duration-500 ease-out group-hover:rotate-[360deg] sm:h-20 sm:w-20">
                  <Icon className="text-white" size={30} strokeWidth={1.8} />
                </div>

                <h3 className="text-[22px] font-bold text-white transition-colors duration-500 group-hover:text-[#db5e41] sm:text-3xl">
                  {feature.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[280px] text-sm leading-7 text-white/60 sm:text-[18px]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}