"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import fallbackTeamPhoto from "../../../public/images/service1.webp";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface TeamImage {
  url: string;
  alt: string;
}

interface OurTeamApiResponse {
  title: string;
  description: string;
  teamImages: TeamImage[];
  buttonText: string;
  buttonLink: string;
  teamSize: number;
  yearsExperience: number;
  inlineLinks?: InlineLink[];
  descriptionInlineLinks?: InlineLink[];
}

interface TeamPhoto {
  image: string;
  alt: string;
}

interface OurTeamData {
  heading: string;
  description: string;
  photos: TeamPhoto[];
  inlineLinks?: InlineLink[];
  descriptionInlineLinks?: InlineLink[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";
const FALLBACK_ALT =
  "Wood World Decor team - professional craftsmen and interior fitout experts in Dubai";

function resolveImage(path: string | undefined): string {
  if (!path) return fallbackTeamPhoto.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapApiToOurTeam(data: OurTeamApiResponse): OurTeamData {
  let photos: TeamPhoto[] = [];

  if (data.teamImages && Array.isArray(data.teamImages)) {
    photos = data.teamImages.map((img) => ({
      image: resolveImage(img.url),
      alt: img.alt || FALLBACK_ALT,
    }));
  }

  // Pad to at least 3 images if we don't have enough
  while (photos.length < 3) {
    const fallbackPhoto =
      photos.length > 0
        ? photos[0]
        : {
            image: fallbackTeamPhoto.src,
            alt: FALLBACK_ALT,
          };
    photos.push({ ...fallbackPhoto });
  }

  return {
    heading: data.title,
    description: data.description,
    photos: photos.slice(0, 3),
    inlineLinks: data.inlineLinks || [],
    descriptionInlineLinks: data.descriptionInlineLinks || [],
  };
}

const defaultData: OurTeamData = {
  heading: "Our Team",
  description:
    "Behind every successful project is our dedicated team, known for their creativity, precision, and client-focused approach. With over 10 years of industry expertise, masterful detailing, and a commitment to on-time project delivery, Wood World Decor stands among the leading joinery fitout companies in Dubai. Our team of 100+ creative professionals collaborates closely with clients to transform spaces with style and innovation.",
  photos: [
    {
      image: fallbackTeamPhoto.src,
      alt: "Wood World Decor team member at work",
    },
    { image: fallbackTeamPhoto.src, alt: "Wood World Decor team group photo" },
    {
      image: fallbackTeamPhoto.src,
      alt: "Wood World Decor craftsman in workshop",
    },
  ],
  inlineLinks: [],
  descriptionInlineLinks: [],
};

function OurTeamSkeleton() {
  return (
    <section className="relative bg-white py-12 xs:py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="mx-auto max-w-[900px] text-center">
          <div className="mx-auto h-8 w-40 animate-pulse rounded-md bg-gray-200 xs:h-9 xs:w-48 sm:h-10 sm:w-56 md:h-12 md:w-64" />
          <div className="mx-auto mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-11/12 animate-pulse rounded-md bg-gray-200" />
            <div className="mx-auto h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[220px] w-full animate-pulse rounded-md bg-gray-200 xs:h-[260px] sm:h-[320px] md:h-[340px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OurTeam() {
  const [data, setData] = useState<OurTeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOurTeam = async () => {
      try {
        const res = await api.get<OurTeamApiResponse>("/home-why-choose/team");
        setData(mapApiToOurTeam(res.data));
      } catch (err) {
        console.error("Failed to fetch our team section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOurTeam();
  }, []);

  if (isLoading) return <OurTeamSkeleton />;
  if (!data) return null;

  return (
    <section className="relative bg-white py-12 xs:py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        {/* Heading */}
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-2xl font-bold text-[#0c1526] xs:text-3xl sm:text-4xl md:text-5xl">
            <InlineLinkedText
              text={data.heading}
              links={data.inlineLinks || []}
              linkClassName="inline-block cursor-pointer font-bold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </h2>

          <div className="mx-auto mt-3 text-sm leading-6 text-gray-600 xs:leading-7 sm:text-[18px]">
            <InlineLinkedText
              text={data.description}
              links={data.descriptionInlineLinks || []}
              linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </div>
        </div>

        {/* Photo Row */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6 cursor-pointer">
          {data.photos.map((photo, index) => (
            <div
              key={index}
              className="group relative h-[220px] w-full overflow-hidden xs:h-[260px] sm:h-[320px] md:h-[340px]"
            >
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                unoptimized={
                  photo.image.startsWith("http") ||
                  photo.image.startsWith(IMAGE_BASE_URL)
                }
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
