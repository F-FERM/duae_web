"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquareMore } from "lucide-react";
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

interface ServiceAboutData {
  title: string;
  description: string;
  imageOne: string;
  imageTwo: string;
  foundedYear: string;
  outlets: number;
  teamSize: number;
  factoryInfo: string;
  inlineLinks?: InlineLink[];
}

interface ServiceData {
  _id: string;
  title: string;
  slug: string;
  about: ServiceAboutData;
  image: string;
  heroImage?: string;
}

interface ServiceAboutProps {
  slug: string;
}

// Fallback data
const defaultData = {
  title: "Nearly a Decade of Excellence in Joinery",
  description:
    "Founded in 2015, Wood World Decor has grown into a leading joinery company in Dubai, backed by a team of 100+ skilled professionals. With over 6 outlets across the UAE, we pride ourselves on delivering bespoke joinery solutions for residential, commercial, and hospitality projects.",
  imageOne: "",
  imageTwo: "",
  foundedYear: "2015",
  outlets: 6,
  teamSize: 100,
  factoryInfo:
    "Our state-of-the-art joinery factory in Dubai is equipped with advanced CNC machinery and modern woodworking technology.",
  inlineLinks: [],
};

function ServiceAboutSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f7] py-16 sm:py-20 md:py-24 lg:py-[60px] xl:py-[70px]">
      <div className="mx-auto max-w-[1220px] px-5 sm:px-6 lg:px-8 xl:px-0">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.95fr] lg:gap-8 xl:gap-12">
          <div className="max-w-[590px]">
            <div className="h-12 w-40 animate-pulse rounded-md bg-gray-300" />
            <div className="mt-4 h-6 w-3/4 animate-pulse rounded-md bg-gray-300" />
            <div className="mt-2 h-20 w-full animate-pulse rounded-md bg-gray-300" />
            <div className="mt-7 h-[59px] w-[137px] animate-pulse rounded-md bg-gray-300" />
          </div>
          <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
            <div className="h-[350px] w-[88%] animate-pulse rounded-md bg-gray-300 sm:h-[410px] md:h-[440px] lg:h-[450px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServiceAbout({ slug }: ServiceAboutProps) {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const FALLBACK_ALT =
    "Wood World Decor - leading joinery and fitout company in Dubai";

  useEffect(() => {
    let isMounted = true;

    const fetchServiceData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const endpoint = `/services/detail/${slug}`;

        console.log("Fetching service data from:", endpoint);

        const res = await api.get<ServiceData>(endpoint);

        if (isMounted) {
          console.log("Service data received:", res.data);
          console.log("About data:", res.data.about);
          setServiceData(res.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch service about section:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.message || "Failed to load service data",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      fetchServiceData();
    } else {
      setIsLoading(false);
      setError("No slug provided");
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Intersection observer for image reveal
  useEffect(() => {
    const node = document.getElementById("service-about-image");
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isLoading, serviceData]);

  if (isLoading) return <ServiceAboutSkeleton />;

  if (error) {
    return (
      <section className="relative overflow-hidden bg-[#faf8f7] py-20 md:py-28">
        <div className="mx-auto max-w-[1220px] px-4 text-center">
          <p className="text-red-500">Error loading about section: {error}</p>
        </div>
      </section>
    );
  }

  // Use service data or fallback
  const about = serviceData?.about || defaultData;

  const title = about.title || defaultData.title;
  const description = about.description || defaultData.description;
  const inlineLinks = about.inlineLinks || [];

  // Get images from about object
  const mainImage = about.imageOne || "";
  const secondaryImage = about.imageTwo || "";

  // Fallback to service main image if about images are missing
  const fallbackImage = serviceData?.image || "";
  const finalMainImage = mainImage || fallbackImage;
  const finalSecondaryImage = secondaryImage || fallbackImage;

  // Hardcode years of excellence to 10
  const yearsOfExcellence = 10;

  const aboutAlt = finalMainImage || FALLBACK_ALT;

  return (
    <section className="relative overflow-hidden bg-[#faf8f7] py-16 sm:py-20 md:py-24 lg:py-[60px] xl:py-[70px]">
      {/* ======================================================
          BACKGROUND PATTERN
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          animate={{
            y: [0, -6, 0, 6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={imagepattern1}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
        </motion.div>
      </div>

      {/* ======================================================
          TOP RIGHT PATTERN
      ====================================================== */}

      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[300px] w-[300px] opacity-50 sm:h-[400px] sm:w-[400px] lg:h-[520px] lg:w-[520px]">
        <motion.div
          className="relative h-full w-full"
          animate={{
            y: [0, -10, 0, 10, 0],
            rotate: [0, 1.5, 0, -1.5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src={pattern2}
            alt=""
            fill
            priority
            sizes="520px"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-14 px-5 sm:px-6 md:gap-16 lg:grid-cols-[1fr_0.95fr] lg:gap-8 lg:px-8 xl:gap-12 xl:px-0">
        {/* ====================================================
            LEFT CONTENT
        ==================================================== */}

        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="relative z-20 max-w-[590px]"
        >
          {/* TITLE */}

          <h2 className="m-0 text-[42px] font-extrabold leading-[1.05] tracking-[-1.5px] text-[#0b1425] sm:text-[48px] md:text-[54px] lg:text-[56px] xl:text-[58px]">
            About Us
          </h2>

          {/* SUB TITLE - with inline links */}

          {title && (
            <div className="mt-4">
              <InlineLinkedText
                text={title}
                links={inlineLinks}
                className="text-[15px] font-bold leading-[1.5] text-[#555555] sm:text-[16px] md:text-[17px]"
                linkClassName="inline-block cursor-pointer font-bold text-[#df5d40] underline decoration-[#df5d40]/30 underline-offset-2 transition-all duration-200 hover:text-[#c94e34] hover:decoration-[#df5d40] focus:outline-none focus:ring-2 focus:ring-[#df5d40] focus:ring-offset-2 rounded"
              />
            </div>
          )}

          {/* DESCRIPTION - with inline links */}

          <div className="mt-2">
            <InlineLinkedText
              text={description}
              links={inlineLinks}
              className="text-[15px] font-medium leading-[2] text-[#5b5b5b] sm:text-[16px] md:text-[17px] lg:text-[17px]"
              linkClassName="inline-block cursor-pointer font-medium text-[#df5d40] underline decoration-[#df5d40]/30 underline-offset-2 transition-all duration-200 hover:text-[#c94e34] hover:decoration-[#df5d40] focus:outline-none focus:ring-2 focus:ring-[#df5d40] focus:ring-offset-2 rounded"
            />
          </div>

          {/* VIEW MORE BUTTON */}

          <Link
            href="/about"
            className="group relative mt-7 inline-flex h-[59px] min-w-[137px] items-center justify-center overflow-hidden bg-[#df5d40] px-7 text-[13px] font-bold uppercase tracking-[0.2px] text-white transition-all duration-300 hover:bg-[#c94e34]"
          >
            <span className="relative z-10">View More</span>
            <span className="absolute bottom-[4px] right-[4px] h-[8px] w-[8px] bg-white transition-transform duration-300 group-hover:scale-125" />
          </Link>
        </motion.div>

        {/* ====================================================
            RIGHT IMAGE AREA
        ==================================================== */}

        <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
          <motion.div
            id="service-about-image"
            initial={{
              opacity: 0,
              x: 120,
            }}
            animate={{
              opacity: isVisible ? 1 : 0,
              x: isVisible ? 0 : 120,
            }}
            transition={{
              duration: 1.3,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            className="relative"
            style={{
              willChange: "transform, opacity",
            }}
          >
            {/* =================================================
                THIN OUTLINE DECORATION
            ================================================= */}

            <div className="pointer-events-none absolute -bottom-[29px] left-[-18px] hidden h-[72%] w-[72%] border border-[#ddd6d2] sm:block lg:left-[-18px] xl:left-[-18px]" />

            {/* =================================================
                ORANGE BACKGROUND BLOCK
            ================================================= */}

            <div className="absolute right-[-1px] top-[52px] z-0 h-[78%] w-[92px] bg-[#df5d40] sm:right-[-10px] sm:w-[105px] md:right-[-15px] md:w-[115px] lg:right-[-16px] lg:w-[110px] xl:right-[-18px] xl:w-[115px]" />

            {/* =================================================
                MAIN IMAGE
            ================================================= */}

            <div className="relative z-[2] ml-0 h-[350px] w-[88%] overflow-hidden sm:h-[410px] md:h-[440px] lg:h-[450px] xl:h-[450px]">
              {finalMainImage ? (
                <Image
                  src={finalMainImage}
                  alt={aboutAlt}
                  fill
                  priority
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 48vw, 520px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* =================================================
                SECONDARY FLOATING IMAGE
            ================================================= */}

            {finalSecondaryImage && finalSecondaryImage !== finalMainImage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 35,
                }}
                transition={{
                  duration: 1,
                  delay: 0.35,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
                className="absolute bottom-[-1px] right-[-1px] z-[5] h-[205px] w-[225px] overflow-hidden rounded-t-[50px] shadow-[0_12px_35px_rgba(0,0,0,0.16)] sm:h-[250px] sm:w-[275px] sm:rounded-t-[65px] md:h-[275px] md:w-[295px] lg:h-[270px] lg:w-[290px] xl:h-[275px] xl:w-[295px]"
              >
                <Image
                  src={finalSecondaryImage}
                  alt={`${aboutAlt} - secondary`}
                  fill
                  priority
                  sizes="295px"
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* =================================================
                10+ YEARS BADGE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20,
              }}
              transition={{
                duration: 0.8,
                delay: 0.65,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="absolute bottom-[66px] left-[13px] z-20 sm:bottom-[63px] sm:left-[14px] md:bottom-[65px] md:left-[15px] lg:bottom-[65px] lg:left-[14px]"
            >
              <div className="relative flex h-[105px] w-[238px] items-center bg-[#df5d40] px-5 sm:h-[116px] sm:w-[270px] sm:px-6 md:h-[118px] md:w-[278px]">
                {/* Vertical white decorative lines */}

                <span className="absolute left-[9px] top-[10px] flex gap-[3px]">
                  <span className="h-[28px] w-[3px] bg-white" />
                  <span className="h-[28px] w-[3px] bg-white/80" />
                </span>

                {/* Icon */}

                <MessageSquareMore
                  className="ml-1 shrink-0 text-white sm:ml-0"
                  size={40}
                  strokeWidth={1.5}
                />

                {/* Text */}

                <p className="ml-4 text-[16px] font-bold leading-[1.55] text-white sm:ml-5 sm:text-[17px]">
                  10+ Years
                  <br />
                  of Excellence
                </p>

                {/* Dotted pattern */}

                <div className="absolute right-[12px] top-[12px] grid grid-cols-4 gap-[5px] opacity-90">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span
                      key={index}
                      className="h-[2px] w-[2px] rounded-full bg-white"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* =================================================
                BOTTOM DOT DECORATION
            ================================================= */}

            <div className="pointer-events-none absolute bottom-[-30px] left-[15px] z-[1] hidden sm:block">
              <div className="grid grid-cols-5 gap-[8px] opacity-70">
                {Array.from({ length: 30 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-[3px] w-[3px] rounded-full bg-[#d7d4d2]"
                  />
                ))}
              </div>
            </div>

            {/* =================================================
                RIGHT CIRCLE DECORATION
            ================================================= */}

            <div className="pointer-events-none absolute right-[-43px] top-[74%] hidden h-[23px] w-[23px] rounded-full border border-[#df5d40] lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
