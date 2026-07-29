"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Users,
  Ruler,
  Award,
  FileText,
  Clock,
  type LucideIcon,
} from "lucide-react";
import api from "@/lib/axios";

interface WhyChooseUsApi {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AboutContentApiResponse {
  whyChooseUsTitle: string;
  whyChooseUs: WhyChooseUsApi[];
}

interface WhyChooseUsData {
  title: string;
  reasons: WhyChooseUsApi[];
}

const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-users": Users,
  "fa-solid fa-star": Star,
  "fa-solid fa-pen-ruler": Ruler,
  "fa-solid fa-medal": Award,
  "fa-solid fa-file-invoice": FileText,
  "fa-solid fa-clock": Clock,
};

function getIcon(icon: string): LucideIcon {
  return iconMap[icon] || Star;
}

const defaultData: WhyChooseUsData = {
  title: "Why Choose Us",
  reasons: [
    {
      _id: "1",
      order: 0,
      icon: "fa-solid fa-users",
      title: "Comprehensive In-House Expertise",
      description:
        "With a dedicated team of designers and craftsmen, we manage every stage of your project execution.",
    },
    {
      _id: "2",
      order: 1,
      icon: "fa-solid fa-star",
      title: "Proven Track Record",
      description:
        "Our portfolio showcases several successful project executions across residential and commercial properties in the UAE.",
    },
    {
      _id: "3",
      order: 2,
      icon: "fa-solid fa-pen-ruler",
      title: "Customized Joinery Solutions",
      description:
        "Our custom joinery services add elegance, functionality, and a personal touch to every space.",
    },
    {
      _id: "4",
      order: 3,
      icon: "fa-solid fa-medal",
      title: "Uncompromising Quality Standards",
      description:
        "We use premium materials and meticulous craftsmanship to deliver exceptional results that stand the test of time.",
    },
    {
      _id: "5",
      order: 4,
      icon: "fa-solid fa-file-invoice",
      title: "Transparent Project Costs in Dubai",
      description:
        "We provide clear quotations with no hidden charges, helping clients get maximum value for their investment.",
    },
    {
      _id: "6",
      order: 5,
      icon: "fa-solid fa-clock",
      title: "On-Time Delivery and Lasting Results",
      description:
        "Our structured workflow and experienced project managers ensure timely completion without compromising quality.",
    },
  ],
};

function WhyChooseUsSkeleton() {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="mx-auto h-10 w-64 animate-pulse rounded-md bg-gray-200" />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center border border-gray-200 bg-white px-6 py-10 sm:px-8 sm:py-12"
            >
              <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200 sm:h-20 sm:w-20" />
              <div className="mt-6 h-5 w-3/4 animate-pulse rounded-md bg-gray-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-md bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WhyChooseUsLight() {
  const [data, setData] = useState<WhyChooseUsData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const res = await api.get<AboutContentApiResponse>("/about-content");
        setData({
          title: res.data.whyChooseUsTitle,
          reasons: [...res.data.whyChooseUs].sort((a, b) => a.order - b.order),
        });
      } catch (err) {
        console.error("Failed to fetch about content (why choose us):", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (isLoading) return <WhyChooseUsSkeleton />;

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          {data.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {data.reasons.map((reason) => {
            const Icon = getIcon(reason.icon);
            return (
              <div
                key={reason._id}
                className="group flex flex-col items-center border cursor-pointer border-gray-200 bg-white px-6 py-10 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg sm:px-8 sm:py-12"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#db5e41]/40 transition-colors duration-500 group-hover:bg-[#db5e41] sm:h-20 sm:w-20">
                  <Icon
                    className="fill-[#db5e41] text-[#db5e41] transition-colors duration-500 group-hover:fill-white group-hover:text-white"
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mt-6 text-[22px] font-bold leading-7 text-[#0c1526] sm:text-xl">
                  {reason.title}
                </h3>

                <p className="mt-4 text-[12px] leading-7 text-gray-600 sm:text-[16px]">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}