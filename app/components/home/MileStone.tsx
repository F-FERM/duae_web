"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import milestoneTop from "../../../public/images/slide1.webp";
import milestoneBottom from "../../../public/images/service1.webp";

const milestones = [
  {
    text: "Featured on ArchDaily for Of Palm Pavilion – a sustainable installation crafted from palm waste.",
  },
  {
    text: "Listed in Dezeen's Top Design Festival Installations 2023, highlighting creativity and innovation",
  },
  {
    text: "Celebrated at Dubai Design Week, chosen as one of the Top 10 installations worldwide.",
  },
  {
    text: "Recognized for innovation and sustainability, ranking Wood World Decor among best joinery fitout companies in Dubai.",
  },
];

export default function Milestones() {
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
    <section className="relative overflow-hidden bg-[#e9e7e7] py-16 sm:py-20 md:py-28">
      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-14">
        {/* Left: Image Composition */}
        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none lg:justify-self-start">
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
            className="relative h-[380px] w-full sm:h-[440px] lg:h-[480px]"
          >
            {/* Orange offset panel behind images */}
            <div className="absolute left-[-16px] top-6 h-[85%] w-[68%] bg-[#db5e41] sm:left-[-24px]" />

            {/* Vertical accent bars */}
            <div className="absolute -top-4 left-[44%] z-10 flex items-center gap-2">
              <span className="h-14 w-[3px] rounded-full bg-white/80 sm:h-16" />
              <span className="h-[70px] w-[3px] rounded-full bg-[#0c1526] sm:h-20" />
            </div>

            {/* Top image */}
            <div className="absolute left-8 top-0 h-[62%] w-[72%] overflow-hidden rounded-t-[70px] sm:h-[64%] sm:rounded-t-[90px]">
              <Image
                src={milestoneTop}
                alt="Of Palm Pavilion installation"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom image, overlapping */}
            <div className="absolute bottom-0 left-14 h-[52%] w-[72%] overflow-hidden shadow-xl sm:left-16">
              <Image
                src={milestoneBottom}
                alt="Of Palm Pavilion detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right: Text Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            Our Milestones
          </h2>

          <p className="mt-6 text-base font-bold leading-7 text-[#0c1526] sm:text-lg md:text-xl">
            Recognized Among the Top Global Design Installations
          </p>

          <p className="mt-2 text-[15px] leading-7 text-gray-500 md:text-[17px]">
            Explore Our International Recognition and Features
          </p>

          <ul className="mt-8 space-y-6">
            {milestones.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#db5e41]/40 bg-[#db5e41]/10">
                  <Check className="text-[#db5e41]" size={14} strokeWidth={3} />
                </span>
                <p className="text-[15px] font-semibold leading-7 text-[#0c1526] md:text-[16px]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}