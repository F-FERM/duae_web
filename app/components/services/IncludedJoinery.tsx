"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import api from "@/lib/axios";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";

interface IncludedItemApi {
  title: string;
  description: string;
  icon: string;
}

interface ServiceDetailApiResponse {
  whatIsIncluded: {
    title: string;
    description: string;
    items: IncludedItemApi[];
  };
}

interface WhatIncludedData {
  title: string;
  description: string;
  items: IncludedItemApi[];
}

const defaultData: WhatIncludedData = {
  title: "What Is Included in Every Fit-Out",
  description:
    "Our comprehensive fit-out solutions ensure that every project - regardless of scale or type - covers a full suite of craftsmanship, from structural pieces to decorative details.",
  items: [
    { title: "Custom Joinery", description: "Our expert team crafts bespoke joinery solutions tailored to your space and style.", icon: "" },
    { title: "Upholstery", description: "We provide high-quality upholstery services that combine comfort with style.", icon: "" },
    { title: "Turnkey Fit-Out", description: "We deliver complete turnkey solutions, managing every stage of your project.", icon: "" },
    { title: "Electrical, Lighting & Mechanical Installations", description: "Our team handles all electrical, lighting, and mechanical systems with precision and safety.", icon: "" },
    { title: "Decor Solutions", description: "We curate furniture, artwork, accessories, and décor elements that bring your vision to life.", icon: "" },
  ],
};

function ChecklistColumn({ items }: { items: IncludedItemApi[] }) {
  return (
    <div className="relative bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:p-8">
      <ul className="flex flex-col gap-5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#db5e41]/10 text-[#db5e41]">
              <Check size={14} strokeWidth={3} />
            </span>
            <p className="text-[15px] leading-7 text-gray-600 md:text-base">
              <span className="font-bold text-[#0c1526]">{item.title}:</span>{" "}
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhatIncludedSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-20 md:py-28">
      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="mx-auto h-9 w-72 animate-pulse rounded-md bg-white/60" />
        <div className="mx-auto mt-3 h-4 w-3/4 max-w-[700px] animate-pulse rounded-md bg-white/60" />

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2 lg:gap-8">
          {Array.from({ length: 2 }).map((_, colIndex) => (
            <div key={colIndex} className="bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:p-8">
              <div className="flex flex-col gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 shrink-0 animate-pulse rounded-full bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhatIncluded({ slug }: { slug: string }) {
  const [data, setData] = useState<WhatIncludedData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        setData({
          title: res.data.whatIsIncluded.title,
          description: res.data.whatIsIncluded.description,
          items: res.data.whatIsIncluded.items,
        });
      } catch (err) {
        console.error("Failed to fetch what-included section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <WhatIncludedSkeleton />;

  // Split the single items array into two roughly-even columns
  const mid = Math.ceil(data.items.length / 2);
  const leftItems = data.items.slice(0, mid);
  const rightItems = data.items.slice(mid);

  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={imagepattern1} alt="" priority className="object-cover" />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={pattern2} alt="" priority className="object-cover" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1220px] px-4">
        <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          {data.title}
        </h2>

        <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
          {data.description}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <ChecklistColumn items={leftItems} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ChecklistColumn items={rightItems} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}