"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Hammer,
  Lightbulb,
  Handshake,
  Users,
  UsersRound,
  Check,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/axios";
import milestoneTop from "../../../public/images/slide1.webp";
import milestoneBottom from "../../../public/images/service1.webp";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface ValueApi {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AboutContentApiResponse {
  valuesTitle: string;
  valuesImageOne: string;
  valuesImageTwo: string;
  values: ValueApi[];
}

interface CoreValuesData {
  title: string;
  imageOne: string;
  imageTwo: string;
  values: ValueApi[];
}

const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-hammer": Hammer,
  "fa-solid fa-lightbulb": Lightbulb,
  "fa-solid fa-handshake": Handshake,
  "fa-solid fa-users": Users,
  "fa-solid fa-people-arrows": UsersRound,
};

function getIcon(icon: string): LucideIcon {
  return iconMap[icon] || Hammer;
}

const defaultData: CoreValuesData = {
  title: "Our Core Values",
  imageOne: milestoneTop.src,
  imageTwo: milestoneBottom.src,
  values: [
    { _id: "1", order: 0, icon: "fa-solid fa-hammer", title: "Quality Craftsmanship", description: "Delivering superior solutions with precision and durability." },
    { _id: "2", order: 1, icon: "fa-solid fa-lightbulb", title: "Innovation", description: "Embracing modern designs to create stylish and functional spaces." },
    { _id: "3", order: 2, icon: "fa-solid fa-handshake", title: "Integrity", description: "Offering transparency and morality in every project undertaken." },
    { _id: "4", order: 3, icon: "fa-solid fa-users", title: "Customer-Centric Approach", description: "Offering personalized solutions that reflect each client's unique needs." },
    { _id: "5", order: 4, icon: "fa-solid fa-people-arrows", title: "Teamwork", description: "Collaboration among designers and craftsmen ensures easy execution of projects." },
  ],
};

function CoreValuesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#e9e7e7] py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-14">
        <div className="relative mx-auto h-[380px] w-full max-w-[380px] animate-pulse rounded-lg bg-gray-300/60 sm:h-[440px] lg:h-[480px] lg:max-w-none" />

        <div>
          <div className="h-9 w-56 animate-pulse rounded-md bg-gray-300/60" />
          <div className="mt-8 space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-gray-300/60" />
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-300/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CoreValues() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<CoreValuesData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await api.get<AboutContentApiResponse>("/about-content");
        setData({
          title: res.data.valuesTitle,
          imageOne: resolveImage(res.data.valuesImageOne, milestoneTop.src),
          imageTwo: resolveImage(res.data.valuesImageTwo, milestoneBottom.src),
          values: [...res.data.values].sort((a, b) => a.order - b.order),
        });
      } catch (err) {
        console.error("Failed to fetch about content (core values):", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  useEffect(() => {
    const node = imageRef.current;
    if (!node || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) return <CoreValuesSkeleton />;

  return (
    <section className="relative overflow-hidden bg-[#e9e7e7] py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-14">
        {/* Left: Image Composition */}
        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none lg:justify-self-start">
          <div
            ref={imageRef}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translate3d(0px, 0px, 0px)"
                : "translate3d(-400px, 0px, 0px)",
              transition:
                "transform 2.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 2.2s cubic-bezier(0.22, 0.61, 0.36, 1)",
              willChange: "transform, opacity",
            }}
            className="relative h-[380px] w-full sm:h-[440px] lg:h-[480px]"
          >
            {/* Orange offset panel behind images */}
            <div className="absolute left-[-16px] top-6 h-[85%] w-[68%] bg-[#db5e41] sm:left-[-24px]" />

            {/* Vertical accent bars */}
            <div className="absolute -top-4 left-[44%] z-10 flex items-center gap-2">
              <span className="h-14 w-[3px] rounded-full bg-white/80 sm:h-16" />
              <span className="h-[70px] w-[3px] rounded-full bg-[#0c1526] sm:h-20" />
            </div>

            {/* Top image */}
            <div className="absolute left-8 top-0 h-[62%] w-[72%] overflow-hidden rounded-t-[70px] sm:h-[64%] sm:rounded-t-[90px]">
              <Image
                src={data.imageOne}
                alt="Core values illustration one"
                fill
                unoptimized={data.imageOne.startsWith("http")}
                className="object-cover"
              />
            </div>

            {/* Bottom image, overlapping */}
            <div className="absolute bottom-0 left-14 h-[52%] w-[72%] overflow-hidden shadow-xl sm:left-16">
              <Image
                src={data.imageTwo}
                alt="Core values illustration two"
                fill
                unoptimized={data.imageTwo.startsWith("http")}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            {data.title}
          </h2>

          <ul className="mt-8 space-y-6">
            {data.values.map((value) => {
              const Icon = getIcon(value.icon);
              return (
                <li key={value._id} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center cursor-pointer hover:bg-[#db5e41] rounded-full border border-[#db5e41]/40 bg-[#db5e41]/10">
                    <Check className="text-[#db5e41] hover:text-white" size={16} strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold leading-6 text-[#0c1526] md:text-[18px]">
                      {value.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-gray-600 md:text-[16px]">
                      {value.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}