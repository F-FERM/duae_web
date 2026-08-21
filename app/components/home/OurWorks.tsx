"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

interface WorkImageApiItem {
  _id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
  alt: string; 
}

interface OurWorksApiResponse {
  introText: string;
  title: string;
  buttonText: string;
  buttonLink: string;
  featuredTitle: string;
  featuredDescription: string;
  featuredImage: string;
  featuredCategory: string;
  featuredImageAlt: string;
  images: WorkImageApiItem[];
}

interface WorkItem {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  alt: string;
}

interface OurWorksData {
  heading: string;
  introText: string;
  items: WorkItem[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "/images/service1.webp";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Fallback alt text for images without alt
const FALLBACK_ALT = "Wood World Decor - interior fit out and joinery projects in Dubai";

function mapApiToOurWorks(data: OurWorksApiResponse): OurWorksData {
  return {
    heading: data.title,
    introText: data.introText,
    items: [...(data.images || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 4) // Only take first 4 for display
      .map((img) => ({
        id: img._id,
        image: resolveImage(img.url),
        title: img.title,
        description: img.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        alt: img.alt || FALLBACK_ALT,
      })),
  };
}

const defaultData: OurWorksData = {
  heading: "Our Works",
  introText:
    "With over 10 years of experience, we have successfully delivered a wide range of projects that showcase our expertise in joinery, fit-out, renovations, and turnkey solutions. From luxury villas to commercial spaces, our works reflect quality, creativity, and attention to detail.",
  items: [
    {
      id: "1",
      image: "/images/slide1.webp",
      title: "Apartments in Burj Khalifa",
      description: "Luxury apartment interiors with premium joinery and fit-out solutions.",
      buttonText: "View Our Works",
      buttonLink: "/our-works",
      alt: "Luxury apartment interiors at Burj Khalifa by Wood World Decor",
    },
    {
      id: "2",
      image: "/images/service1.webp",
      title: "Hoof Cafe",
      description: "Custom metal works and industrial design for Hoof Cafe.",
      buttonText: "View Our Works",
      buttonLink: "/our-works",
      alt: "Custom metal works at Hoof Cafe by Wood World Decor",
    },
    {
      id: "3",
      image: "/images/slide1.webp",
      title: "Abu Dhabi VIP Airport",
      description: "Premium joinery and fit-out solutions for VIP airport terminal.",
      buttonText: "View Our Works",
      buttonLink: "/our-works",
      alt: "Premium joinery at Abu Dhabi VIP Airport by Wood World Decor",
    },
    {
      id: "4",
      image: "/images/service1.webp",
      title: "Residential Villa",
      description: "Complete renovation and fit-out for luxury residential villa.",
      buttonText: "View Our Works",
      buttonLink: "/our-works",
      alt: "Luxury residential villa renovation by Wood World Decor",
    },
  ],
};

function OurWorksSkeleton() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1.6fr] lg:items-center">
          <div className="relative">
            <div className="p-6 xs:p-8 sm:p-10 lg:p-14">
              <div className="h-10 w-40 animate-pulse rounded-md bg-gray-200 xs:h-12 xs:w-48 sm:h-14 sm:w-56 lg:h-16 lg:w-64 xl:h-20 xl:w-72" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-11/12 animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[260px] w-full animate-pulse bg-slate-200 sm:h-[420px] md:h-[520px] lg:h-[600px] xl:h-[680px]"
          />
        ))}
      </div>
    </section>
  );
}

export default function OurWorks() {
  const [data, setData] = useState<OurWorksData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOurWorks = async () => {
      try {
        const res = await api.get<OurWorksApiResponse>("/home-works");
        const mapped = mapApiToOurWorks(res.data);
        setData(mapped.items.length > 0 ? mapped : defaultData);
      } catch (err) {
        console.error("Failed to fetch our works section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOurWorks();
  }, []);

  if (isLoading) return <OurWorksSkeleton />;
  if (!data) return null;

  return (
    <section className="overflow-hidden bg-white">
      {/* Heading + intro text stay inside the max-width container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1.6fr] lg:items-center">
          <div className="relative">
            <div className="p-6 xs:p-8 sm:p-10 lg:p-14">
              <div className="absolute -right-8 top-8 h-24 w-24 rounded-3xl bg-[#f7e4d7] opacity-50 blur-2xl" />
              <h2 className="relative text-3xl font-semibold leading-tight xs:text-4xl sm:text-5xl lg:text-5xl xl:text-7xl">
                {data.heading}
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-slate-900">
            <p className="text-base text-gray-600 leading-7 sm:text-lg sm:leading-9 lg:pr-10">
              {data.introText}
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed image grid, edge-to-edge with zero gap between columns */}
      <div className="mt-10 grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
        {data.items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="group relative block">
            {/* Image */}
            <div className="relative h-[260px] w-full overflow-hidden bg-slate-100 sm:h-[420px] md:h-[520px] lg:h-[600px] xl:h-[680px]">
              <Image
                src={item.image}
                alt={item.alt || FALLBACK_ALT} 
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-105"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 z-[1] bg-slate-950/0 transition duration-300 ease-out group-hover:bg-slate-950/50" />
            </div>

            {/* Hover card: centered over the image, wider than the column so text has room to breathe.
                Width/padding/text now scale down on small screens so the card never overflows the
                viewport; from sm: up it renders exactly as before (w-[400px], p-8, text-2xl, etc). */}
            <div className="pointer-events-none absolute left-1/2 bottom-4 z-30 w-[92vw] max-w-[320px] -translate-x-1/2 translate-y-10 scale-95 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 xs:max-w-[360px] sm:bottom-6 sm:w-[400px] sm:max-w-none">
              <div className="rounded-xl bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.25)] sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 flex-shrink-0 rounded-full border border-[#f2c4b0] bg-[#fcd5c1]" />
                  <h3 className="text-lg font-semibold text-slate-900 sm:text-2xl">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-[15px] sm:leading-8">
                  {item.description}
                </p>

                <Link href={item.buttonLink || "/our-works"} className="pointer-events-auto block">
                  <button className="mt-5 w-full rounded-2xl bg-[#dc5c39] py-3 text-sm font-semibold text-white transition hover:bg-[#bb4e2d] sm:mt-8 sm:py-4 sm:text-base">
                    {item.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}