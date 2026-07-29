"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Hammer,
  Users,
  Clock,
  Star,
  type LucideIcon,
} from "lucide-react";
import whyBg from "../../../public/images/pattern3.png";
import api from "@/lib/axios";

interface WhyChooseApiItem {
  _id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface WhyChooseApiResponse {
  title: string;
  items: WhyChooseApiItem[];
}

interface FeatureItem {
  id: string;
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WhyChooseData {
  heading: string;
  features: FeatureItem[];
}

// Font Awesome class (from API) -> lucide-react icon. Extend this map as the
// backend adds new icon values; unmapped icons fall back to Settings below.
const ICON_MAP: Record<string, LucideIcon> = {
  "fa-hammer": Hammer,
  "fa-people-arrows": Users,
  "fa-clock": Clock,
  "fa-star": Star,
  "fa-check-circle": CheckCircle2,
  "fa-wrench": Wrench,
  "fa-shield-check": ShieldCheck,
  "fa-gear": Settings,
  "fa-cog": Settings,
};

function resolveIcon(faIconClass: string): LucideIcon {
  const key = (faIconClass || "")
    .split(" ")
    .find((part) => part.startsWith("fa-") && part !== "fa-solid" && part !== "fa-regular");
  return (key && ICON_MAP[key]) || Settings;
}

function mapApiToWhyChoose(data: WhyChooseApiResponse): WhyChooseData {
  return {
    heading: data.title,
    features: [...(data.items || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        id: item._id,
        number: item.number,
        icon: resolveIcon(item.icon),
        title: item.title,
        description: item.description,
      })),
  };
}

const defaultData: WhyChooseData = {
  heading: "Why Choose Us",
  features: [
    {
      id: "1",
      number: "01",
      icon: Settings,
      title: "Expert Craftsmanship",
      description:
        "Every project is handled with precision and detail, ensuring top-quality finishes that stand the test of time.",
    },
    {
      id: "2",
      number: "02",
      icon: CheckCircle2,
      title: "End-to-End Solutions",
      description:
        "From design to execution, we provide complete turnkey services for residential, commercial, and hospitality projects.",
    },
    {
      id: "3",
      number: "03",
      icon: Wrench,
      title: "On-Time Delivery",
      description:
        "We value deadlines and ensure timely project completion without compromising on quality.",
    },
    {
      id: "4",
      number: "04",
      icon: ShieldCheck,
      title: "Trusted Experience",
      description:
        "With 10+ years of experience, Wood World Decor leads joinery fitout companies in Dubai with designs that inspire.",
    },
  ],
};

// Reusable floating dot-grid pattern
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
    <section
      className="relative overflow-hidden bg-black bg-center py-12 xs:py-14 sm:py-20 md:py-28"
      style={{ backgroundImage: `url(${whyBg.src})` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

      <div className="relative mx-auto max-w-[1100px] px-4">
        <div className="mx-auto h-8 w-40 animate-pulse rounded-md bg-white/20 xs:h-9 xs:w-48 sm:h-10 sm:w-56 md:h-12 md:w-64" />

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-16 md:grid-cols-2 md:gap-y-16">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
              <div className="mb-6 h-16 w-16 animate-pulse rounded-full bg-white/20 sm:h-20 sm:w-20" />
              <div className="h-6 w-40 animate-pulse rounded-md bg-white/20 sm:h-7 sm:w-48" />
              <div className="mt-4 h-4 w-56 animate-pulse rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhyChooseUs() {
  const [data, setData] = useState<WhyChooseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWhyChoose = async () => {
      try {
        const res = await api.get<WhyChooseApiResponse>("/home-why-choose");
        const mapped = mapApiToWhyChoose(res.data);
        setData(mapped.features.length > 0 ? mapped : defaultData);
      } catch (err) {
        console.error("Failed to fetch why-choose-us section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhyChoose();
  }, []);

  if (isLoading) return <WhyChooseUsSkeleton />;
  if (!data) return null;

  return (
    <section
      className="relative overflow-hidden bg-black bg-center py-12 xs:py-14 sm:py-20 md:py-28"
      style={{ backgroundImage: `url(${whyBg.src})` }}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

      {/* Floating dot patterns — fade/scale in on scroll, then float continuously */}
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

      <div className="relative mx-auto max-w-[1100px] px-4">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-2xl font-extrabold text-white xs:text-3xl sm:text-4xl md:text-5xl"
        >
          {data.heading}
        </motion.h2>

        <div className="relative mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-16 md:grid-cols-2 md:gap-y-16 cursor-pointer">
          {/* Horizontal connector between top row cards (desktop only) */}
          <div className="pointer-events-none absolute left-1/2 top-[95px] hidden h-[2px] w-10 -translate-x-1/2 bg-[#db5e41] md:block" />
          {/* Horizontal connector between bottom row cards (desktop only) */}
          <div className="pointer-events-none absolute bottom-[145px] left-1/2 hidden h-[1px] w-10 -translate-x-1/2 bg-[#db5e41] md:block" />

          {data.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 2) * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center px-4 pb-10 pt-16 text-center transition-all duration-500 ease-out hover:-translate-y-2 xs:px-6 sm:px-10 sm:pt-20"
              >
                {/* Icon badge */}
                <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#db5e41] shadow-lg transition-colors duration-500 sm:h-20 sm:w-20">
                  <Icon className="text-white" size={30} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-bold text-white transition-colors duration-500 group-hover:text-[#db5e41] xs:text-[22px] sm:text-3xl">
                  {feature.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-white/60 xs:leading-7 sm:text-[18px]">
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