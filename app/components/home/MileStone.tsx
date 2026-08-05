"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  Newspaper,
  Trophy,
  Award,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import milestoneTop from "../../../public/images/slide1.webp";
import milestoneBottom from "../../../public/images/service1.webp";
import api from "@/lib/axios";

interface MilestoneApiItem {
  title: string;
  description: string;
  icon: string;
  order: number;
  _id: string;
}

interface AboutApiResponse {
  milestonesTitle: string;
  milestonesSubtitle: string;
  milestonesImageOne?: string;
  milestonesImageTwo?: string;
  milestones: MilestoneApiItem[];
}

interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface MilestonesData {
  title: string;
  subtitle: string;
  imageOne: string | null; // null → fall back to the static local image
  imageTwo: string | null;
  items: MilestoneItem[];
}

const IMAGE_ALT = "Interior fit out company in Dubai";

const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-newspaper": Newspaper,
  "fa-solid fa-trophy": Trophy,
  "fa-solid fa-award": Award,
  "fa-solid fa-leaf": Leaf,
};

function resolveIcon(icon: string): LucideIcon {
  return iconMap[icon] || Award;
}

function mapApiToMilestones(data: AboutApiResponse): MilestonesData {
  return {
    title: data.milestonesTitle,
    subtitle: data.milestonesSubtitle,
    imageOne: data.milestonesImageOne || null,
    imageTwo: data.milestonesImageTwo || null,
    items: [...(data.milestones ?? [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((m) => ({
        id: m._id,
        title: m.title,
        description: m.description,
        icon: resolveIcon(m.icon),
      })),
  };
}

const defaultData: MilestonesData = {
  title: "Our Milestones",
  subtitle: "Recognized Among the Top Global Design Installations",
  imageOne: null,
  imageTwo: null,
  items: [
    {
      id: "1",
      title: "Featured on ArchDaily",
      description: "Of Palm Pavilion – a sustainable installation crafted from palm waste.",
      icon: Newspaper,
    },
    {
      id: "2",
      title: "Listed in Dezeen's Top Design Festival Installations 2023",
      description: "Highlighting creativity and innovation in sustainable design.",
      icon: Trophy,
    },
    {
      id: "3",
      title: "Celebrated at Dubai Design Week",
      description: "Chosen as one of the Top 10 installations worldwide.",
      icon: Award,
    },
    {
      id: "4",
      title: "Recognized for Innovation and Sustainability",
      description: "Ranking Wood World Decor among best joinery fitout companies in Dubai.",
      icon: Leaf,
    },
  ],
};

function MilestonesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#e9e7e7] py-14 xs:py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-12 px-4 xs:gap-14 sm:gap-16 lg:grid-cols-2 lg:gap-14">
        <div className="relative mx-auto h-[320px] w-full max-w-[340px] animate-pulse bg-gray-300 xs:h-[380px] xs:max-w-[380px] sm:h-[440px] lg:h-[480px] lg:max-w-none" />
        <div className="relative z-10 w-full">
          <div className="h-8 w-44 animate-pulse rounded-md bg-gray-300 xs:h-9 sm:h-10 md:h-12" />
          <div className="mt-5 h-5 w-3/4 animate-pulse rounded-md bg-gray-300 sm:h-6" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-gray-300" />
          <div className="mt-8 space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-gray-300" />
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Milestones() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMilestones = async () => {
      try {
        const res = await api.get<AboutApiResponse>("/home-about");
        const mapped = mapApiToMilestones(res.data);
        if (isMounted) {
          setData(mapped.items.length > 0 ? mapped : defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch milestones:", err);
        if (isMounted) setData(defaultData);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMilestones();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;

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
  }, [isLoading, data]); // re-runs once real content mounts

  if (isLoading) return <MilestonesSkeleton />;
  if (!data) return null;

  return (
    <section className="relative overflow-hidden bg-[#e9e7e7] py-14 xs:py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-12 px-4 xs:gap-14 sm:gap-16 lg:grid-cols-2 lg:gap-14">
        {/* Left: Image Composition */}
        <div className="relative mx-auto w-full max-w-[320px] xs:max-w-[380px] lg:max-w-none lg:justify-self-start">
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
            className="relative h-[320px] w-full xs:h-[380px] sm:h-[440px] lg:h-[480px]"
          >
            {/* Orange offset panel behind images */}
            <div className="absolute left-[-10px] top-5 h-[85%] w-[68%] bg-[#db5e41] xs:left-[-16px] xs:top-6 sm:left-[-24px]" />

            {/* Vertical accent bars */}
            <div className="absolute -top-3 left-[44%] z-10 flex items-center gap-2 xs:-top-4">
              <span className="h-12 w-[3px] rounded-full bg-white/80 xs:h-14 sm:h-16" />
              <span className="h-[58px] w-[3px] rounded-full bg-[#0c1526] xs:h-[70px] sm:h-20" />
            </div>

            {/* Top image — API image if available, static fallback otherwise */}
            <div className="absolute left-6 top-0 h-[62%] w-[72%] overflow-hidden rounded-t-[56px] xs:left-8 xs:rounded-t-[70px] sm:h-[64%] sm:rounded-t-[90px]">
              <Image
                src={data.imageOne || milestoneTop}
                alt={IMAGE_ALT}
                fill
                sizes="(max-width: 640px) 72vw, 36vw"
                className="object-cover"
              />
            </div>

            {/* Bottom image, overlapping */}
            <div className="absolute bottom-0 left-11 h-[52%] w-[72%] overflow-hidden shadow-xl xs:left-14 sm:left-16">
              <Image
                src={data.imageTwo || milestoneBottom}
                alt={IMAGE_ALT}
                fill
                sizes="(max-width: 640px) 72vw, 36vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-[#0c1526] xs:text-3xl sm:text-4xl md:text-5xl">
            {data.title}
          </h2>

          <p className="mt-5 text-sm font-bold leading-6 text-[#0c1526] xs:mt-6 xs:text-base xs:leading-7 sm:text-lg md:text-xl">
            {data.subtitle}
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-500 xs:text-[15px] xs:leading-7 md:text-[17px]">
            Explore Our International Recognition and Features
          </p>

          <ul className="mt-6 space-y-5 xs:mt-8 xs:space-y-6">
            {data.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex items-start gap-3 xs:gap-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#db5e41]/40 bg-[#db5e41]/10 hover:bg-[#db5e41] xs:h-6 xs:w-6">
                    <Icon className="text-[#db5e41] hover:text-white" size={12} strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-6 text-[#0c1526] xs:text-[15px] xs:leading-7 md:text-[18px]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[16px] leading-5 text-gray-500 xs:text-[13px] xs:leading-6">
                      {item.description}
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