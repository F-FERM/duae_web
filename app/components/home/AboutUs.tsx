"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquareMore } from "lucide-react";
import aboutMain from "../../../public/images/service1.webp";
import aboutPortrait from "../../../public/images/service1.webp";
import imagepattern1 from "../../../public/images/pattern1.png";
import pattern2 from "../../../public/images/pattern2.png";

export default function AboutUs() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-20 md:py-28">
      {/* BACKGROUND PATTERN — pattern1 stretches across the whole section
          (not just a corner box) so the wave lines carry through behind the
          heading on the left AND continue down behind the image on the right */}
   <div className="pointer-events-none absolute inset-0 opacity-90">
  <motion.div
    className="relative h-full w-full"
    animate={{
      y: [0, -8, 0, 8, 0],
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
     
      priority
      className="object-cover"
    />
  </motion.div>
</div>

      {/* pattern2 — flush against the true top-right corner of the section,
          sits as a direct child of the section so it isn't constrained by
          the inner max-w/px-4 container */}
    <div className="pointer-events-none absolute right-0 top-0 z-0  opacity-70 ">
  <motion.div
    className="relative h-full w-full"
    animate={{
      y: [0, -12, 0, 12, 0],
      rotate: [0, 2, 0, -2, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <Image
      src={pattern2}
      alt=""
      
      priority
      className="object-cover"
    />
  </motion.div>
</div>
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-10">
        {/* Left: Text Content (fully static) */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            About Us
          </h2>

          <p className="mt-2 text-lg font-semibold leading-8 text-gray-600 md:text-xl">
            10+ Years of Excellence: Delivering Trusted Joinery, Fit-Out, and
            Renovation Solutions
          </p>

          <p className="m text-[15px] leading-8 text-gray-500 font-medium md:text-[18px]">
            Established in February 2015, Wood World Decor LLC has grown into
            one of the leading joinery fitout companies in Dubai, offering
            trusted services in joinery, fit-out, renovations, and turnkey
            solutions with a dedicated team of 100+ skilled professionals.
            Over the years, we have delivered exceptional residential and
            commercial projects, offering services that include MEP works,
            painting, gypsum, wall fixing, metal works, and upholstery. Our
            award-winning &ldquo;Of Palm&rdquo; Pavilion - crafted from
            sustainable local palm materials - was featured among the Top 10
            Installations at Dubai Design Week. Our commitment to quality
            craftsmanship, innovative design, and customer satisfaction has
            enabled us to transform spaces with precision and style, making
            us a reliable partner for clients seeking functional and elegant
            solutions.
          </p>

          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 bg-[#db5e41] px-10 py-4 text-[15px] font-semibold tracking-wide text-white transition hover:bg-[#c74f34]"
          >
            VIEW MORE <ArrowRight size={20} />
          </Link>
        </div>

        {/* Right: Image Composition wrapper */}
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
            transition={{
              duration: 2.2,
              ease: [0.22, 0.61, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="relative"
          >
            {/* Orange offset border behind main image */}
            <div className="absolute right-[-16px] top-4 h-[80%] w-[92%] bg-[#db5e41] sm:right-[-24px]" />

            {/* Main image */}
            <div className="relative h-[340px] w-[92%] overflow-hidden sm:h-[400px] lg:h-[440px]">
              <Image
                src={aboutMain}
                alt="Craftsman working with wood"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Overlapping rounded portrait image */}
            <div className="absolute -bottom-14 right-0 h-[260px] w-[190px] overflow-hidden rounded-t-[110px] shadow-xl sm:h-[300px] sm:w-[220px] lg:right-[-8px]">
              <Image
                src={aboutPortrait}
                alt="Wood World Decor craftsman"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Badge + pattern2 share one wrapper so pattern2 sits tucked
                behind the badge with only its left edge peeking out, just
                like the reference */}
            <div className="absolute bottom-2 left-0 z-10">
              {/* Orange stat badge */}
              <div className="relative flex w-[240px] items-center gap-4 bg-[#db5e41] px-6 py-6 shadow-lg sm:w-[270px]">
                {/* small vertical double-bar accent */}
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
                  10+ Years
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