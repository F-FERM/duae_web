"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import fallbackImg from "../../../public/images/slide1.webp";
import { useServiceAltText } from "@/app/(web)/services/useServiceAltText";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface WhoWeServeItemApi {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  icon?: string;
  link?: string;
  inlineLinks?: InlineLink[];
}

interface ServiceDetailApiResponse {
  whoWeServe: {
    title: string;
    description: string;
    items: WhoWeServeItemApi[];
    inlineLinks?: InlineLink[];
  };
}

interface WhoWeServeData {
  title: string;
  description: string;
  items: WhoWeServeItemApi[];
  inlineLinks?: InlineLink[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string | undefined, fallback: string = "") {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const defaultData: WhoWeServeData = {
  title: "Who We Serve",
  description:
    "With expertise in joinery in Dubai, we provide customized solutions that cater to diverse industries. Our joinery works in Dubai are designed to meet the unique requirements of commercial, residential, and hospitality spaces with precision and creativity.",
  inlineLinks: [],
  items: [
    {
      title: "Commercial Fit-Out",
      description:
        "Our commercial fit-out services include space planning, design, and execution, ensuring that your workspace enhances productivity and reflects your brand identity.",
      image: "",
      alt: "Commercial fit-out services by Wood World Decor",
      icon: "",
      link: "",
      inlineLinks: [],
    },
    {
      title: "Residential Fit-Out",
      description:
        "As experienced fit out contractors Dubai, we specialize in designing and executing interiors that blend aesthetics with functionality.",
      image: "",
      alt: "Residential fit-out services by Wood World Decor",
      icon: "",
      link: "",
      inlineLinks: [],
    },
    {
      title: "Hospitality Fit-Out",
      description:
        "Our hospitality fit-out services focus on delivering interiors that are both inviting and functional.",
      image: "",
      alt: "Hospitality fit-out services by Wood World Decor",
      icon: "",
      link: "",
      inlineLinks: [],
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
            <div
              key={i}
              className="flex flex-col bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            >
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
  const altText = useServiceAltText(slug);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );
        setData({
          title: res.data.whoWeServe.title,
          description: res.data.whoWeServe.description,
          items: res.data.whoWeServe.items.map((item) => ({
            ...item,
            alt: item.alt || `${item.title} - Wood World Decor`,
            inlineLinks: item.inlineLinks || [],
          })),
          inlineLinks: res.data.whoWeServe.inlineLinks || [],
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

  const getItemAlt = (item: WhoWeServeItemApi) => {
    return item.alt || `${item.title} - Wood World Decor`;
  };

  // Get inline links from the whoWeServe object
  const sectionLinks = data.inlineLinks || [];

  // Helper to render text with or without inline links
  const renderText = (
    text: string,
    links: InlineLink[],
    className: string,
    linkClassName: string,
  ) => {
    if (!text) return null;
    const hasMatchingLink = links.some((link) => text.includes(link.text));

    if (hasMatchingLink) {
      return (
        <InlineLinkedText
          text={text}
          links={links}
          linkClassName={linkClassName}
        />
      );
    }
    return <span className={className}>{text}</span>;
  };

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        {/* Title with inline links */}
        <div className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          {renderText(
            data.title,
            sectionLinks,
            "text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center",
            "inline-block cursor-pointer font-bold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded",
          )}
        </div>

        {/* Description with inline links */}
        <div className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg text-center max-w-4xl">
          {renderText(
            data.description,
            sectionLinks,
            "text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg text-center max-w-4xl",
            "inline-block cursor-pointer font-medium text-gray-600 underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded",
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {data.items.map((item, index) => {
            const imgSrc = resolveImage(item?.image);
            const itemAlt = getItemAlt(item);

            const content = (
              <>
                {imgSrc && (
                  <div className="relative h-[280px] w-full overflow-hidden md:h-[340px]">
                    <Image
                      src={imgSrc}
                      alt={itemAlt}
                      fill
                      unoptimized={imgSrc.startsWith("http")}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40" />
                  </div>
                )}

                <div className="relative flex flex-col gap-3 p-6 flex-grow">
                  <span className="absolute left-0 top-1/2 h-16 w-[3px] origin-center -translate-y-1/2 scale-y-0 bg-[#c0522f] transition-transform duration-300 ease-out group-hover:scale-y-100" />
                  <div className="flex items-center gap-3">
                    {item.icon && (
                      <i className={`${item.icon} text-xl text-[#c0522f]`}></i>
                    )}
                    <h3 className="text-xl font-bold text-[#0d1b2a] md:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                  {/* Item Description with inline links */}
                  <div className="text-sm leading-7 text-[#0d1b2a]/70 md:text-base">
                    {renderText(
                      item.description,
                      item.inlineLinks || [],
                      "text-sm leading-7 text-[#0d1b2a]/70 md:text-base",
                      "inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded",
                    )}
                  </div>
                </div>
              </>
            );

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] h-full"
              >
                {item.link ? (
                  <Link href={item.link} className="flex flex-col h-full">
                    {content}
                  </Link>
                ) : (
                  <div className="flex flex-col h-full">{content}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
