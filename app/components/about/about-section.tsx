"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageSquareMore } from "lucide-react";
import api from "@/lib/axios";
import fallbackMain from "../../../public/images/service1.webp";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLinkApi {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface AboutDetailApiResponse {
  badge: string;
  title: string;
  description: string;
  image: string;
  foundedYear: string;
  teamSize: number;
  experienceYears: number;
  inlineLinks?: InlineLinkApi[];
}

interface AboutDetailData {
  badge: string;
  title: string;
  paragraphs: string[];
  image: string;
  experienceYears: number;
  inlineLinks: InlineLinkApi[];
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

const IMAGE_ALT = "Interior fit out company in uae";

function resolveImage(path: string): string {
  if (!path) return fallbackMain.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapApiToAboutDetail(data: AboutDetailApiResponse): AboutDetailData {
  return {
    badge: data.badge,
    title: data.title,
    paragraphs: (data.description || "")
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean),
    image: resolveImage(data.image),
    experienceYears: data.experienceYears,
    inlineLinks: data.inlineLinks || [],
  };
}

const defaultData: AboutDetailData = {
  badge: "About Wood World Decor LLC",
  title: "Trusted Joinery, Fit-Out & Renovation Experts in Dubai, UAE",
  paragraphs: [
    "Founded in 2015, Wood World Decor has become one of the UAE's most trusted names in joinery, interior fit-out, and renovation solutions. With a team of over 100 skilled professionals, we specialize in transforming residential and commercial spaces into elegant, functional, and inspiring environments.",
    "Whether it's bespoke joinery, detailed interior fit-outs, or full-scale villa renovations, our designers and craftsmen bring creativity and precision to every project. Each solution is thoughtfully created to meet the unique requirements of our clients while maintaining the highest standards of quality and durability.",
    "At the core of our success is our dedicated workforce, committed to upholding the highest standards of quality, reliability, and customer satisfaction. Over the years, we have earned the trust of businesses and individuals across the UAE by consistently delivering excellence in every project we undertake. When you choose Wood World Decor, you partner with a company that blends expertise, innovation, and professionalism to bring your vision to life.",
  ],
  image: fallbackMain.src,
  experienceYears: 10,
  inlineLinks: [],
};

// Small reusable dot-grid decoration
function DotGrid({
  className,
  dotClassName,
}: {
  className?: string;
  dotClassName?: string;
}) {
  return (
    <div className={`grid grid-cols-5 gap-2 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className={`h-1 w-1 rounded-full ${dotClassName ?? "bg-gray-300"}`}
        />
      ))}
    </div>
  );
}

function AboutDetailSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-12 xs:py-14 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto h-[300px] w-full max-w-[460px] animate-pulse rounded-lg bg-gray-200 xs:h-[360px] sm:h-[520px] lg:h-[580px] lg:max-w-none" />

        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded-md bg-gray-200" />
          <div className="h-8 w-full animate-pulse rounded-md bg-gray-200" />
          <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutDetailSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<AboutDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutDetail = async () => {
      try {
        const res = await api.get<AboutDetailApiResponse>("/about-hero");
        setData(mapApiToAboutDetail(res.data));
      } catch (err) {
        console.error("Failed to fetch about detail section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutDetail();
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
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading]);

  if (isLoading) return <AboutDetailSkeleton />;
  if (!data) return null;

  const inlineLinks = data.inlineLinks || [];

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-12 xs:py-14 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        {/* Left: Image Composition */}
        <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none lg:justify-self-start">
          {/* Decorative border frame, sits behind the lower-right area */}
          <div className="pointer-events-none absolute bottom-0 right-[-24px] top-[130px] hidden w-[70%] border border-gray-200 sm:block" />

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
            className="relative h-[340px] w-full xs:h-[380px] sm:h-[520px] lg:h-[580px]"
          >
            {/* Orange offset panel behind top image */}
            <div className="absolute left-[-12px] top-0 h-[46%] w-[86%] bg-[#db5e41] xs:left-[-16px] sm:left-[-24px]" />

            {/* Vertical accent bars, top-right of top image */}
            <div className="absolute right-4 top-0 z-10 flex items-center gap-2 xs:right-6 sm:right-8">
              <span className="h-12 w-[3px] rounded-full bg-white xs:h-14 sm:h-16" />
              <span className="h-14 w-[3px] rounded-full bg-[#0c1526] xs:h-16 sm:h-20" />
            </div>

            {/* Top image — large rounded top-left corner */}
            <div className="absolute left-6 top-0 h-[46%] w-[80%] overflow-hidden rounded-tl-[70px] shadow-md xs:left-8 xs:rounded-tl-[90px] sm:left-10 sm:rounded-tl-[110px]">
              <Image
                src={data.image}
                alt={IMAGE_ALT}
                fill
                priority
                unoptimized={data.image.startsWith("http")}
                className="object-cover"
              />
            </div>

            {/* Dot grid, tucked in the gap between the two images */}
            <DotGrid
              className="absolute right-2 top-[38%] z-10 sm:right-4"
              dotClassName="bg-gray-300"
            />

            {/* Bottom image, overlapping */}
            <div className="absolute bottom-[20%] left-0 h-[42%] w-[68%] overflow-hidden shadow-xl sm:bottom-[22%]">
              <Image
                src={data.image}
                alt={IMAGE_ALT}
                fill
                unoptimized={data.image.startsWith("http")}
                className="object-cover"
              />
            </div>

            {/* Orange stat badge, overlapping bottom-right of the second image */}
            <div className="absolute bottom-0 left-[38%] z-10 w-[64%] max-w-[280px] xs:left-[42%] sm:left-[46%]">
              <div className="relative flex items-center gap-2 bg-[#db5e41] px-3 py-3 shadow-lg xs:gap-3 xs:px-5 xs:py-5 sm:gap-4 sm:px-6 sm:py-6">
                {/* Vertical accent bar */}
                <span className="h-7 w-[3px] shrink-0 rounded-full bg-white/80 xs:h-8 sm:h-9" />

                <MessageSquareMore
                  className="shrink-0 text-white"
                  size={22}
                  strokeWidth={1.5}
                />

                <p className="text-sm font-bold leading-5 text-white xs:text-base xs:leading-6 sm:text-lg">
                  {data.experienceYears}+ Years
                  <br />
                  of Excellence
                </p>

                {/* Dot pattern, top-right corner of the badge */}
                <DotGrid
                  className="absolute right-2 top-2 grid-cols-4 xs:right-3 xs:top-3"
                  dotClassName="bg-white/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="relative z-10">
          {/* Badge with inline links support */}
          <div className="text-xs font-semibold uppercase tracking-[2px] text-[#db5e41] xs:text-sm xs:tracking-[3px] sm:text-base">
            <InlineLinkedText
              text={data.badge}
              links={inlineLinks}
              linkClassName="inline-block cursor-pointer font-semibold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </div>

          {/* Title with inline links support */}
          <div className="mt-3 text-2xl font-extrabold leading-tight text-[#0c1526] xs:text-3xl sm:text-4xl md:text-5xl">
            <InlineLinkedText
              text={data.title}
              links={inlineLinks}
              linkClassName="inline-block cursor-pointer font-extrabold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </div>

          {/* Paragraphs with inline links support */}
          <div className="mt-6 space-y-4 text-sm leading-7 text-[#232323] xs:text-[15px] xs:leading-8 md:text-[18px]">
            {data.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <InlineLinkedText text={paragraph} links={inlineLinks} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
