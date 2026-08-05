"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import fallbackTeamPhoto from "../../../public/images/service1.webp";

interface OurTeamApiResponse {
  teamTitle: string;
  teamDescription: string;
  teamImage: string | string[];
  teamButtonText: string;
  teamButtonLink: string;
  teamSize: number;
  yearsExperience: number;
}

interface TeamPhoto {
  image: string;
  alt: string;
}

interface OurTeamData {
  heading: string;
  description: string;
  photos: TeamPhoto[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

const IMAGE_ALT = "Interior fit out company in Dubai";

function resolveImage(path: string | undefined): string {
  if (!path) return fallbackTeamPhoto.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapApiToOurTeam(data: OurTeamApiResponse): OurTeamData {
  const images = Array.isArray(data.teamImage) ? data.teamImage : [data.teamImage];
  const resolvedImages = images.map((img) => resolveImage(img));

  // Pad to at least 3 images if we don't have enough
  while (resolvedImages.length < 3) {
    resolvedImages.push(resolvedImages[0] || fallbackTeamPhoto.src);
  }

  return {
    heading: data.teamTitle,
    description: data.teamDescription,
    photos: [
      { image: resolvedImages[0], alt: IMAGE_ALT },
      { image: resolvedImages[1], alt: IMAGE_ALT },
      { image: resolvedImages[2], alt: IMAGE_ALT },
    ],
  };
}

const defaultData: OurTeamData = {
  heading: "Our Team",
  description:
    "Behind every successful project is our dedicated team, known for their creativity, precision, and client-focused approach. With over 10 years of industry expertise, masterful detailing, and a commitment to on-time project delivery, Wood World Decor stands among the leading joinery fitout companies in Dubai. Our team of 100+ creative professionals collaborates closely with clients to transform spaces with style and innovation.",
  photos: [
    { image: fallbackTeamPhoto.src, alt: IMAGE_ALT },
    { image: fallbackTeamPhoto.src, alt: IMAGE_ALT },
    { image: fallbackTeamPhoto.src, alt: IMAGE_ALT },
  ],
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
        const res = await api.get<OurTeamApiResponse>("/home-why-choose");
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
            {data.heading}
          </h2>

          <p className="mx-auto mt-3 text-sm leading-6 text-gray-600 xs:leading-7 sm:text-[18px]">
            {data.description}
          </p>
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
                unoptimized={photo.image.startsWith("http") || photo.image.startsWith(IMAGE_BASE_URL)}
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