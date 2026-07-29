"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import fallbackImg from "../../../public/images/slide1.webp";

interface WhoWeServeItemApi {
  title: string;
  description: string;
  image: string;
  icon: string;
  link: string;
}

interface ServiceDetailApiResponse {
  whoWeServe: {
    title: string;
    description: string;
    items: WhoWeServeItemApi[];
  };
}

interface WhoWeServeData {
  title: string;
  description: string;
  items: WhoWeServeItemApi[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: WhoWeServeData = {
  title: "Who We Serve",
  description:
    "With expertise in joinery in Dubai, we provide customized solutions that cater to diverse industries. Our joinery works in Dubai are designed to meet the unique requirements of commercial, residential, and hospitality spaces with precision and creativity.",
  items: [
    {
      title: "Commercial Fit-Out",
      description:
        "Our commercial fit-out services include space planning, design, and execution, ensuring that your workspace enhances productivity and reflects your brand identity.",
      image: "",
      icon: "",
      link: "",
    },
    {
      title: "Residential Fit-Out",
      description:
        "As experienced fit out contractors Dubai, we specialize in designing and executing interiors that blend aesthetics with functionality.",
      image: "",
      icon: "",
      link: "",
    },
    {
      title: "Hospitality Fit-Out",
      description:
        "Our hospitality fit-out services focus on delivering interiors that are both inviting and functional.",
      image: "",
      icon: "",
      link: "",
    },
  ],
};

function WhoWeServeSkeleton() {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="mx-auto h-9 w-56 animate-pulse rounded-md bg-gray-200" />
        <div className="mx-auto mt-3 h-4 w-3/4 max-w-[700px] animate-pulse rounded-md bg-gray-200" />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
              <div className="h-[280px] w-full animate-pulse bg-gray-200 md:h-[340px]" />
              <div className="flex flex-col gap-3 p-6">
                <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhoWeServe({ slug }: { slug: string }) {
  const [data, setData] = useState<WhoWeServeData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        setData({
          title: res.data.whoWeServe.title,
          description: res.data.whoWeServe.description,
          items: res.data.whoWeServe.items,
        });
      } catch (err) {
        console.error("Failed to fetch who-we-serve section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <WhoWeServeSkeleton />;

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          {data.title}
        </h2>

        <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
          {data.description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {data.items.map((item, index) => {
            const imgSrc = resolveImage(item.image, fallbackImg.src);
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-[280px] w-full overflow-hidden md:h-[340px]">
                  <Image
                    src={imgSrc}
                    alt={item.title}
                    fill
                    unoptimized={imgSrc.startsWith("http")}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40" />
                </div>

                <div className="relative flex flex-col gap-3 p-6">
                  <span className="absolute left-0 top-1/2 h-16 w-[3px] origin-center -translate-y-1/2 scale-y-0 bg-[#c0522f] transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <h3 className="text-xl font-bold text-[#0d1b2a] md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#0d1b2a]/70 md:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}