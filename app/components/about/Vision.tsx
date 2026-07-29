"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import whyBg from "../../../public/images/pattern3.png";

interface AboutContentApiResponse {
  visionTitle: string;
  visionDescription: string;
  visionNumber: string;
  missionTitle: string;
  missionDescription: string;
  missionNumber: string;
}

interface VisionFeature {
  number: string;
  title: string;
  description: string;
}

interface VisionData {
  features: VisionFeature[];
}

// Fixed icons per card position — API doesn't send icons for these two
const icons = [Settings, CheckCircle2];

const defaultData: VisionData = {
  features: [
    {
      number: "01",
      title: "Our Vision",
      description:
        "To become UAE's leading provider of bespoke joinery, interiors, and renovation experiences - wherever space we touch reflects elegance, innovation, and lasting craftsmanship.",
    },
    {
      number: "02",
      title: "Our Mission",
      description:
        "To deliver exceptional interior fit-out, joinery, and renovation services by combining creativity with precision, ensuring every project meets the highest standards of quality and durability.",
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

function VisionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-[1100px] px-4">
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-16 md:grid-cols-2 md:gap-y-16">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center px-6 pb-10 pt-16 sm:px-10 sm:pt-20">
              <div className="h-16 w-16 animate-pulse rounded-full bg-white/10 sm:h-20 sm:w-20" />
              <div className="mt-6 h-7 w-40 animate-pulse rounded-md bg-white/10" />
              <div className="mt-4 h-4 w-64 animate-pulse rounded-md bg-white/10" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Vision() {
  const [data, setData] = useState<VisionData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await api.get<AboutContentApiResponse>("/about-content");
        setData({
          features: [
            {
              number: res.data.visionNumber,
              title: res.data.visionTitle,
              description: res.data.visionDescription,
            },
            {
              number: res.data.missionNumber,
              title: res.data.missionTitle,
              description: res.data.missionDescription,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch about content (vision/mission):", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (isLoading) return <VisionSkeleton />;

  return (
    <section
      className="relative overflow-hidden bg-black bg-center py-16 sm:py-20 md:py-28"
      style={{ backgroundImage: `url(${whyBg.src})` }}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

      {/* Floating dot patterns */}
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
        <div className="relative mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-16 md:grid-cols-2 md:gap-y-16 cursor-pointer">
          {/* Horizontal connector between cards (desktop only) */}
          <div className="pointer-events-none absolute left-1/2 top-[95px] hidden h-[2px] w-10 -translate-x-1/2 bg-[#db5e41] md:block" />

          {data.features.map((feature, index) => {
            const Icon = icons[index] || Settings;
            return (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 2) * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center px-6 pb-10 pt-16 text-center transition-all duration-500 ease-out hover:-translate-y-2 sm:px-10 sm:pt-20"
              >
                <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#db5e41] shadow-lg transition-colors duration-500 sm:h-20 sm:w-20">
                  <Icon className="text-white" size={30} strokeWidth={1.8} />
                </div>

                <h3 className="text-[22px] font-bold text-white transition-colors duration-500 group-hover:text-[#db5e41] sm:text-3xl">
                  {feature.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[320px] text-sm leading-7 text-white/60 sm:text-[18px]">
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