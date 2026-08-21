"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import api from "@/lib/axios";

// Fallback images
import work1 from "../../../public/images/slide1.webp";
import bgTexture from "../../../public/images/services-one-bg.jpg"; // swap path if different
import { useServiceAltText } from "@/app/(web)/services/useServiceAltText";

interface TrustedImage {
  title: string;
  description: string;
  url: string;
  alt?: string;
}

interface TrustedJoineryWorks {
  title: string;
  description: string;
  images: TrustedImage[];
}

interface ServiceDetailApiResponse {
  title?: string;
  fullDescription?: string;
  trustedJoineryWorks?: TrustedJoineryWorks;
}

interface JoineryWorksData {
  title: string;
  description: string;
  images: TrustedImage[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: JoineryWorksData = {
  title: "Trusted Joinery Works in Dubai",
  description:
    "As a premier joinery company in Dubai, we specialize in delivering high-quality craftsmanship tailored to your unique needs. Our expertise in joinery works in Dubai covers a wide range of services designed for commercial, residential, and hospitality projects. From bespoke furniture and detailed wood paneling to complete fit-out solutions, we combine precision, durability, and aesthetic excellence to transform every space into a statement of style and functionality.",
  images: Array.from({ length: 6 }).map((_, i) => ({
    title: `Project ${i + 1}`,
    description: "Quality joinery works tailored to your needs.",
    url: work1.src,
    alt: `Joinery project ${i + 1} by Wood World Decor`,
  })),
};

function JoineryWorksSkeleton() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 -z-10 bg-[#f7f1ee]/90" />
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="mx-auto h-10 w-72 animate-pulse rounded-md bg-gray-300" />
        <div className="mx-auto mt-4 h-6 w-3/4 max-w-[700px] animate-pulse rounded-md bg-gray-300" />
        <div className="mx-auto mt-2 h-6 w-5/6 max-w-[700px] animate-pulse rounded-md bg-gray-300" />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] w-full animate-pulse bg-gray-300 sm:h-[300px] md:h-[380px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function JoineryWorks({ slug }: { slug?: string }) {
  const [data, setData] = useState<JoineryWorksData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const altText = useServiceAltText(slug || 'joinery');

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        if (!slug) return;

        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        
        const trusted = res.data.trustedJoineryWorks;

        setData({
          title: trusted?.title || (res.data.title ? `Trusted ${res.data.title} Works in Dubai` : defaultData.title),
          description: trusted?.description || res.data.fullDescription || defaultData.description,
          images:
            trusted?.images && trusted.images.length > 0
              ? trusted.images.map((img) => {
                  const isString = typeof img === "string";
                  return {
                    title: isString ? "" : img.title,
                    description: isString ? "" : img.description,
                    url: resolveImage(isString ? img : img?.url, work1.src),
                    alt: isString ? altText : (img.alt || `${img.title} - Wood World Decor`),
                  };
                })
              : defaultData.images,
        });
      } catch (err) {
        console.error("Failed to fetch JoineryWorks section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug, altText]);

  if (isLoading) return <JoineryWorksSkeleton />;

  // Fallback alt text if image doesn't have one
  const getImageAlt = (img: TrustedImage, index: number) => {
    return img.alt || `${img.title || `Image ${index + 1}`} - Wood World Decor`;
  };

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src={bgTexture} 
          alt="Wood World Decor - joinery works background texture" 
          fill 
          priority={false} 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-[#f7f1ee]/90" />
      </div>

      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          {data.title}
        </h2>

        <p className="mx-auto mt-3 max-w-[900px] text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg text-center">
          {data.description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
          {data.images.map((img, index) => {
            const imgUrl = img?.url || "";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                className="group relative h-[260px] w-full overflow-hidden sm:h-[300px] md:h-[380px] rounded-lg shadow-sm"
              >
                <Image
                  src={imgUrl || bgTexture.src}
                  alt={getImageAlt(img, index)}
                  fill
                  unoptimized={imgUrl.startsWith("http")}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    {img.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 ease-out">
                    {img.description}
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