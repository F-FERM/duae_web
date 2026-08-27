"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PaintRoller } from "lucide-react";
import api from "@/lib/axios";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";
import { useServiceAltText } from "@/app/(web)/services/useServiceAltText";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface MaterialItemApi {
  name: string;
  description: string;
  image: string;
  icon: string;
  inlineLinks?: InlineLink[];
}

interface ServiceDetailApiResponse {
  materials: {
    title: string;
    description: string;
    items: MaterialItemApi[];
    inlineLinks?: InlineLink[];
  };
}

interface MaterialsData {
  title: string;
  description: string;
  items: MaterialItemApi[];
  inlineLinks?: InlineLink[];
}

const defaultData: MaterialsData = {
  title: "Our Fit-Out Materials",
  description:
    "We use only the highest quality materials for all our fit-out projects, ensuring durability, style, and long-lasting performance.",
  inlineLinks: [],
  items: [
    {
      name: "Premium Woods & Veneers",
      description:
        "High-quality woods and veneers for elegant and durable joinery and finishing works.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
    {
      name: "Quality Flooring Materials",
      description:
        "Premium flooring options including hardwood, tiles, marble, and luxury vinyl.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
    {
      name: "Gypsum & Ceiling Materials",
      description:
        "High-quality gypsum and ceiling materials for modern false ceiling solutions.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
    {
      name: "Paints & Wall Finishes",
      description:
        "Premium paints and wall finishes for flawless and long-lasting wall aesthetics.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
    {
      name: "Electrical & Lighting Components",
      description:
        "Quality electrical and lighting components for safe, modern installations.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
    {
      name: "Decor & Finishing Materials",
      description:
        "Premium decor materials, fabrics, and finishes for the perfect finishing touches.",
      image: "",
      icon: "",
      inlineLinks: [],
    },
  ],
};

function MaterialCard({
  item,
  index,
}: {
  item: MaterialItemApi;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative overflow-hidden bg-[#efece7] p-6 transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8"
    >
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center text-[#0c1526] transition-transform duration-500 ease-out group-hover:-rotate-12">
        <PaintRoller size={40} strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-bold text-[#0c1526] transition-colors duration-300 group-hover:text-[#db5e41] sm:text-2xl">
        {item.name}
      </h3>

      <div className="mt-3 text-[17px] leading-7 text-gray-600">
        <InlineLinkedText
          text={item.description}
          links={item.inlineLinks || []}
          linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
        />
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4">
        <div className="h-4 w-4 bg-white" />
        <div className="absolute -top-3 -left-3 h-2.5 w-2.5 bg-[#db5e41]" />
      </div>
    </motion.div>
  );
}

function MaterialsSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-20 md:py-28">
      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="mx-auto h-9 w-64 animate-pulse rounded-md bg-gray-200" />
        <div className="mx-auto mt-3 h-4 w-3/4 max-w-[700px] animate-pulse rounded-md bg-gray-200" />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#efece7] p-6 sm:p-8">
              <div className="h-14 w-14 animate-pulse rounded-md bg-gray-300" />
              <div className="mt-6 h-6 w-3/4 animate-pulse rounded-md bg-gray-300" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-md bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OurJoineryMaterials({ slug }: { slug: string }) {
  const [data, setData] = useState<MaterialsData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const altText = useServiceAltText(slug);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );
        setData({
          title: res.data.materials.title,
          description: res.data.materials.description,
          items: res.data.materials.items.map((item) => ({
            ...item,
            inlineLinks: item.inlineLinks || [],
          })),
          inlineLinks: res.data.materials.inlineLinks || [],
        });
      } catch (err) {
        console.error("Failed to fetch materials section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <MaterialsSkeleton />;

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={imagepattern1}
            alt={altText}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={pattern2}
            alt={altText}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          <InlineLinkedText
            text={data.title}
            links={data.inlineLinks || []}
            linkClassName="inline-block cursor-pointer font-bold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
          />
        </div>

        <div className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg text-center max-w-3xl">
          <InlineLinkedText
            text={data.description}
            links={data.inlineLinks || []}
            linkClassName="inline-block cursor-pointer font-medium text-gray-600 underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-8">
          {data.items.map((item, index) => (
            <MaterialCard key={item.name} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
