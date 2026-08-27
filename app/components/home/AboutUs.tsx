"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquareMore,
  Newspaper,
  Trophy,
  Award,
  Leaf,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import imagepattern1 from "../../../public/images/pattern1.png";
import pattern2 from "../../../public/images/pattern2.png";
import api from "@/lib/axios";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface Milestone {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  inlineLinks?: InlineLink[];
}

interface AboutApiResponse {
  _id: string;
  title: string;
  description: string;
  image: string;
  alt?: string;
  imageTwo: string;
  imageTwoAlt?: string;
  buttonText: string;
  buttonLink: string;
  foundedYear: string;
  foundedMonth: string;
  yearsOfExcellence: number;
  teamSize: number;
  milestonesTitle: string;
  milestonesSubtitle: string;
  milestonesImageOne: string;
  milestonesImageOneAlt?: string;
  milestonesImageTwo: string;
  milestonesImageTwoAlt?: string;
  milestones: Milestone[];
  isActive: boolean;
  inlineLinks?: InlineLink[];
}

const milestoneIconMap: Record<string, LucideIcon> = {
  "fa-solid fa-newspaper": Newspaper,
  "fa-solid fa-trophy": Trophy,
  "fa-solid fa-award": Award,
  "fa-solid fa-leaf": Leaf,
};

function resolveMilestoneIcon(icon: string): LucideIcon {
  return milestoneIconMap[icon] || Sparkles;
}

export default function AboutUs() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<AboutApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback alt text
  const FALLBACK_ALT =
    "Wood World Decor - leading joinery and fitout company in Dubai";

  useEffect(() => {
    let isMounted = true;

    const fetchAbout = async () => {
      try {
        const res = await api.get<AboutApiResponse>("/home-about");
        if (isMounted) setData(res.data);
      } catch (err) {
        console.error("Failed to fetch about section:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAbout();
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
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, data]);

  if (isLoading) return <div className="py-28 text-center">Loading...</div>;
  if (!data) return null;

  const milestones = (data.milestones ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Use alt from about section or fallback
  const aboutAlt = data.alt || FALLBACK_ALT;
  const inlineLinks = data.inlineLinks || [];

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={imagepattern1}
            alt={aboutAlt}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-70">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={pattern2}
            alt={aboutAlt}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* About block */}
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-10">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            About Us
          </h2>
          <div className="mt-2 text-lg font-semibold leading-8 text-gray-600 md:text-xl">
            <InlineLinkedText
              text={data.title}
              links={inlineLinks}
              linkClassName="inline-block cursor-pointer font-semibold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </div>
          <div className="mt-4 text-[15px] leading-8 text-gray-500 font-medium md:text-[18px]">
            <InlineLinkedText
              text={data.description}
              links={inlineLinks}
              linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
            />
          </div>
          <Link
            href={data.buttonLink}
            className="mt-8 inline-flex items-center gap-2 bg-[#db5e41] px-10 py-4 text-[15px] font-semibold tracking-wide text-white transition hover:bg-[#c74f34]"
          >
            {data.buttonText} <ArrowRight size={20} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
          <motion.div
            ref={imageRef}
            initial={false}
            animate={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translate3d(0px, 0px, 0px)"
                : "translate3d(400px, 0px, 0px)",
            }}
            transition={{ duration: 2.2, ease: [0.22, 0.61, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="relative"
          >
            <div className="absolute right-[-16px] top-4 h-[80%] w-[92%] bg-[#db5e41] sm:right-[-24px]" />

            <div className="relative h-[340px] w-[92%] overflow-hidden sm:h-[400px] lg:h-[440px]">
              <Image
                src={data.image}
                alt={aboutAlt}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-14 right-0 h-[260px] w-[190px] overflow-hidden rounded-t-[110px] shadow-xl sm:h-[300px] sm:w-[220px] lg:right-[-8px]">
              <Image
                src={data.imageTwo || data.image}
                alt={aboutAlt}
                fill
                priority
                sizes="190px"
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-2 left-0 z-10">
              <div className="relative flex w-[240px] items-center gap-4 bg-[#db5e41] px-6 py-6 shadow-lg sm:w-[270px]">
                <span className="flex shrink-0 gap-[3px]">
                  <span className="h-7 w-[3px] rounded-full bg-white/70" />
                  <span className="h-7 w-[3px] rounded-full bg-white/70" />
                </span>
                <MessageSquareMore
                  className="shrink-0 text-white"
                  size={28}
                  strokeWidth={1.5}
                />
                <p className="text-lg font-bold leading-6 text-white">
                  {data.yearsOfExcellence}+ Years
                  <br />
                  of Excellence
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}