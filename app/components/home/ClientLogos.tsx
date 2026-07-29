"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import patternBg from "../../../public/images/pattern1.png";
import api from "@/lib/axios";

interface ClientApiItem {
  _id: string;
  name: string;
  logo: string;
  link: string;
  order: number;
}

interface HomeContactApiResponse {
  clientsTitle: string;
  clientsDescription: string;
  clients: ClientApiItem[];
}

interface ClientItem {
  id: string;
  name: string;
  logo: string;
  link: string;
}

interface ClientsData {
  title: string;
  description: string;
  items: ClientItem[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "/images/service1.webp";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapApiToClients(data: HomeContactApiResponse): ClientsData {
  return {
    title: data.clientsTitle || defaultData.title,
    description: data.clientsDescription || defaultData.description,
    items: [...(data.clients || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((c) => ({
        id: c._id,
        name: c.name,
        logo: resolveImage(c.logo),
        link: c.link,
      })),
  };
}

const defaultData: ClientsData = {
  title: "Our Clients",
  description:
    "At Wood World Decor, we are proud to serve esteemed clients delivering bespoke joinery, fit-out, and renovation solutions that reflect our commitment to excellence.",
  items: [
    { id: "1", name: "Surface Eleven", logo: "/images/service1.webp", link: "" },
    { id: "2", name: "JDS", logo: "/images/service1.webp", link: "" },
    { id: "3", name: "Inava", logo: "/images/service1.webp", link: "" },
    { id: "4", name: "Tas-heel", logo: "/images/service1.webp", link: "" },
    { id: "5", name: "Hazy", logo: "/images/service1.webp", link: "" },
    { id: "6", name: "Godiva", logo: "/images/service1.webp", link: "" },
    { id: "7", name: "Fix", logo: "/images/service1.webp", link: "" },
  ],
};

function OurClientsSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24">
      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="mx-auto max-w-[820px] text-center">
          <div className="mx-auto h-8 w-40 animate-pulse rounded-md bg-gray-300 xs:h-9 sm:h-10 md:h-12" />
          <div className="mx-auto mt-4 h-4 w-11/12 animate-pulse rounded-md bg-gray-200 sm:h-5" />
          <div className="mx-auto mt-2 h-4 w-2/3 animate-pulse rounded-md bg-gray-200 sm:h-5" />
        </div>

        <div className="relative mt-8 overflow-hidden rounded-md bg-white p-4 shadow-sm xs:mt-10 sm:mt-14 sm:p-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[70px] w-[120px] flex-shrink-0 animate-pulse rounded-md bg-gray-200 xs:h-[80px] xs:w-[140px] sm:h-[96px] sm:w-[170px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OurClients() {
  const [data, setData] = useState<ClientsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async () => {
      try {
        const res = await api.get<HomeContactApiResponse>("/home-contact");
        const mapped = mapApiToClients(res.data);
        if (isMounted) {
          setData(mapped.items.length > 0 ? mapped : defaultData);
        }
      } catch (err) {
        console.error("Failed to fetch clients section:", err);
        if (isMounted) setData(defaultData);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchClients();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <OurClientsSkeleton />;
  if (!data) return null;

  // Duplicate the list so the marquee loops seamlessly
  const loopLogos = [...data.items, ...data.items];

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24">
      {/* Decorative wave pattern, left side — floating */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[45%] opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -10, 0, 10, 0], x: [0, 6, 0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={patternBg} alt="" className="object-cover" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1220px] px-4">
        {/* Heading */}
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="text-2xl font-bold text-[#0c1526] xs:text-3xl sm:text-4xl md:text-5xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-3 text-sm leading-6 text-gray-600 xs:mt-4 xs:leading-7 sm:text-base">
            {data.description}
          </p>
        </div>

        {/* Marquee card */}
        <div className="relative mt-8 overflow-hidden rounded-md bg-white p-3 shadow-sm xs:mt-10 xs:p-4 sm:mt-14 sm:p-6">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent xs:w-12 sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent xs:w-12 sm:w-20" />

          <div className="group flex overflow-hidden">
            <div className="flex animate-marquee items-center gap-4 group-hover:[animation-play-state:paused] xs:gap-6 sm:gap-10">
              {loopLogos.map((client, index) => {
                const logoImage = (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={140}
                    height={60}
                    unoptimized
                    className="max-h-[42px] w-auto object-contain opacity-90  transition duration-300 hover:opacity-100 hover:grayscale-0 xs:max-h-[50px] sm:max-h-[60px]"
                  />
                );

                return (
                  <div
                    key={`${client.id}-${index}`}
                    className="flex h-[70px] w-[120px] flex-shrink-0 items-center justify-center bg-[#faf7f6] xs:h-[80px] xs:w-[140px] sm:h-[96px] sm:w-[170px]"
                  >
                    {client.link ? (
                      <a
                        href={client.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full items-center justify-center"
                        aria-label={client.name}
                      >
                        {logoImage}
                      </a>
                    ) : (
                      logoImage
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 16s;
          }
        }
      `}</style>
    </section >
  );
}