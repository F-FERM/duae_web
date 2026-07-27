"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquareMore } from "lucide-react";
import aboutMain from "../../../public/images/service1.webp";
import aboutSecondary from "../../../public/images/service1.webp";

// Small reusable dot-grid decoration
function DotGrid({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  return (
    <div className={`grid grid-cols-5 gap-2 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className={`h-1 w-1 rounded-full ${dotClassName ?? "bg-gray-300"}`} />
      ))}
    </div>
  );
}

export default function AboutDetailSection() {
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
    <section className="relative overflow-hidden bg-[#faf7f6] py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-16">
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
            className="relative h-[420px] w-full sm:h-[520px] lg:h-[580px]"
          >
            {/* Orange offset panel behind top image */}
            <div className="absolute left-[-16px] top-0 h-[46%] w-[86%] bg-[#db5e41] sm:left-[-24px]" />

            {/* Vertical accent bars, top-right of top image */}
            <div className="absolute right-6 top-0 z-10 flex items-center gap-2 sm:right-8">
              <span className="h-14 w-[3px] rounded-full bg-white sm:h-16" />
              <span className="h-16 w-[3px] rounded-full bg-[#0c1526] sm:h-20" />
            </div>

            {/* Top image — large rounded top-left corner */}
            <div className="absolute left-8 top-0 h-[46%] w-[80%] overflow-hidden rounded-tl-[90px] shadow-md sm:left-10 sm:rounded-tl-[110px]">
              <Image
                src={aboutMain}
                alt="Wood World Decor office fit-out"
                fill
                priority
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
                src={aboutSecondary}
                alt="Wood World Decor kitchen interior"
                fill
                className="object-cover"
              />
            </div>

            {/* Orange stat badge, overlapping bottom-right of the second image */}
            <div className="absolute bottom-0 left-[42%] z-10 w-[62%] max-w-[280px] sm:left-[46%]">
              <div className="relative flex items-center gap-3 bg-[#db5e41] px-5 py-5 shadow-lg sm:gap-4 sm:px-6 sm:py-6">
                {/* Vertical accent bar */}
                <span className="h-8 w-[3px] shrink-0 rounded-full bg-white/80 sm:h-9" />

                <MessageSquareMore
                  className="shrink-0 text-white"
                  size={26}
                  strokeWidth={1.5}
                />

                <p className="text-base font-bold leading-6 text-white sm:text-lg">
                  10+ Years
                  <br />
                  of Excellence
                </p>

                {/* Dot pattern, top-right corner of the badge */}
                <DotGrid
                  className="absolute right-3 top-3 grid-cols-4"
                  dotClassName="bg-white/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#db5e41] sm:text-base">
            About Wood World Decor LLC
          </p>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#0c1526] sm:text-4xl md:text-5xl ">
            Trusted Joinery, Fit-Out &amp; Renovation Experts in Dubai, UAE
          </h2>

          <div className="mt-6 space-y-2 text-[15px] leading-8 text-[#232323] md:text-[18px]">
            <p>
              Founded in 2015, Wood World Decor has become one of the UAE&apos;s
              most trusted names in joinery, interior fit-out, and renovation
              solutions. With a team of over 100 skilled professionals, we
              specialize in transforming residential and commercial spaces
              into elegant, functional, and inspiring environments.
            </p>

            <p>
              Whether it&apos;s bespoke joinery, detailed interior fit-outs, or full-scale villa renovations, our designers and craftsmen bring creativity and precision to every project. Each solution is thoughtfully created to meet the unique requirements of our clients while maintaining the highest standards of quality and durability.
            </p>

            <p>
             At the core of our success is our dedicated workforce, committed to upholding the highest standards of quality, reliability, and customer satisfaction. Over the years, we have earned the trust of businesses and individuals across the UAE by consistently delivering excellence in every project we undertake. When you choose Wood World Decor, you partner with a company that blends expertise, innovation, and professionalism to bring your vision to life.
            </p>
          </div>

          
        </div>
      </div>
    </section>
  );
}