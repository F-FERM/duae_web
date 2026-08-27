"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import fallbackImage from "../../../public/images/service1.webp";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface WorkImageApiItem {
  _id?: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
  alt?: string;
  inlineLinks?: InlineLink[];
}

interface HomeWorksApiResponse {
  introText?: string;
  introInlineLinks?: InlineLink[];
  title?: string;
  titleInlineLinks?: InlineLink[];
  images: WorkImageApiItem[];
  buttonText?: string;
  buttonLink?: string;
  featuredTitle?: string;
  featuredTitleInlineLinks?: InlineLink[];
  featuredDescription?: string;
  featuredDescriptionInlineLinks?: InlineLink[];
  featuredImage?: string;
  featuredCategory?: string;
}

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  alt: string;
  inlineLinks?: InlineLink[];
}

interface GalleryData {
  heading?: string;
  headingInlineLinks?: InlineLink[];
  introText?: string;
  introInlineLinks?: InlineLink[];
  images: GalleryImage[];
  buttonText?: string;
  buttonLink?: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";
const COLUMN_COUNT = 4;
const FALLBACK_ALT =
  "Wood World Decor - interior fit out and joinery projects in Dubai";

function resolveImage(path: string): string {
  if (!path) return fallbackImage.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function splitIntoColumns(
  images: GalleryImage[],
  columnCount: number,
): GalleryImage[][] {
  const columns: GalleryImage[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  images.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });
  return columns;
}

const defaultImages: GalleryImage[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  src: fallbackImage.src,
  title: `Project photo ${i + 1}`,
  description: `Project photo ${i + 1} description`,
  alt: FALLBACK_ALT,
  inlineLinks: [],
}));

const defaultData: GalleryData = {
  heading: "Our Works",
  headingInlineLinks: [],
  introText:
    "With over 10 years of experience, we have successfully delivered a wide range of projects that showcase our expertise in joinery, fit-out, renovations, and turnkey solutions.",
  introInlineLinks: [],
  images: defaultImages,
  buttonText: "View All Projects",
  buttonLink: "/our-works",
};

function GalleryGridSkeleton() {
  const skeletonColumns = splitIntoColumns(defaultImages, COLUMN_COUNT);

  return (
    <section className="relative mb-19 w-full bg-white">
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4 sm:gap-x-5">
        {skeletonColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((image) => (
              <div
                key={image.id}
                className="relative w-full animate-pulse overflow-hidden bg-gray-200"
                style={{ aspectRatio: "3 / 4" }}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function GalleryGrid() {
  const [data, setData] = useState<GalleryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get<HomeWorksApiResponse>("/home-works");

        const mappedImages = [...(res.data.images || [])]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((img, index) => ({
            id: img._id || `${img.url}-${index}`,
            src: resolveImage(img.url),
            title: img.title || `Project photo ${index + 1}`,
            description: img.description || "",
            alt: img.alt || FALLBACK_ALT,
            inlineLinks: img.inlineLinks || [],
          }));

        setData({
          heading: res.data.title || "Our Works",
          headingInlineLinks: res.data.titleInlineLinks || [],
          introText: res.data.introText || "",
          introInlineLinks: res.data.introInlineLinks || [],
          images: mappedImages.length > 0 ? mappedImages : defaultImages,
          buttonText: res.data.buttonText || "View All Projects",
          buttonLink: res.data.buttonLink || "/our-works",
        });
      } catch (err) {
        console.error("Failed to fetch our works gallery:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) return <GalleryGridSkeleton />;
  if (!data) return null;

  const columns = splitIntoColumns(data.images, COLUMN_COUNT);

  return (
    <section className="relative mb-19 w-full bg-white">
      {/* Header Section with Inline Links */}
      {(data.heading || data.introText) && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1.6fr] lg:items-center">
            {data.heading && (
              <div className="relative">
                <div className="p-4 xs:p-6 sm:p-8 lg:p-10">
                  <div className="absolute -right-8 top-8 h-24 w-24 rounded-3xl bg-[#f7e4d7] opacity-50 blur-2xl" />
                  <h2 className="relative text-2xl font-semibold leading-tight xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                    <InlineLinkedText
                      text={data.heading}
                      links={data.headingInlineLinks || []}
                      linkClassName="inline-block cursor-pointer font-semibold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
                    />
                  </h2>
                </div>
              </div>
            )}

            {data.introText && (
              <div className="space-y-4 text-slate-900">
                <div className="text-sm text-gray-600 leading-7 sm:text-base sm:leading-8 lg:pr-6">
                  <InlineLinkedText
                    text={data.introText}
                    links={data.introInlineLinks || []}
                    linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
                  />
                </div>
                {data.buttonText && data.buttonLink && (
                  <Link href={data.buttonLink} className="inline-block">
                    <button className="rounded-lg bg-[#dc5c39] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#bb4e2d] sm:px-8 sm:py-3 sm:text-base">
                      {data.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4 sm:gap-x-5">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((image) => (
              <div
                key={image.id}
                className="group relative w-full overflow-hidden"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={image.src}
                  alt={image.alt || image.title}
                  fill
                  unoptimized={
                    image.src.startsWith("http") ||
                    image.src.startsWith(IMAGE_BASE_URL)
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/50" />

                {/* Hover overlay with title and description */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <h3 className="text-sm font-bold text-white text-center sm:text-base md:text-lg">
                    <InlineLinkedText
                      text={image.title}
                      links={image.inlineLinks || []}
                      linkClassName="inline-block cursor-pointer font-bold text-white underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-black rounded"
                    />
                  </h3>
                  {image.description && (
                    <div className="mt-1 text-xs text-white/80 text-center sm:text-sm">
                      <InlineLinkedText
                        text={image.description}
                        links={image.inlineLinks || []}
                        linkClassName="inline-block cursor-pointer font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-black rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
