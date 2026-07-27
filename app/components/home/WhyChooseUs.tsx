"use client";

import { motion } from "framer-motion";
import { Settings, CheckCircle2, Wrench, ShieldCheck } from "lucide-react";
import whyBg from "../../../public/images/pattern3.png";

const features = [
  {
    number: "01",
    icon: Settings,
    title: "Expert Craftsmanship",
    description:
      "Every project is handled with precision and detail, ensuring top-quality finishes that stand the test of time.",
  },
  {
    number: "02",
    icon: CheckCircle2,
    title: "End-to-End Solutions",
    description:
      "From design to execution, we provide complete turnkey services for residential, commercial, and hospitality projects.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "On-Time Delivery",
    description:
      "We value deadlines and ensure timely project completion without compromising on quality.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Trusted Experience",
    description:
      "With 10+ years of experience, Wood World Decor leads joinery fitout companies in Dubai with designs that inspire.",
  },
];

// Reusable floating dot-grid pattern
function DotGrid({ className }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none grid grid-cols-4 gap-3 ${className}`}
      animate={{ y: [0, -10, 0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-white/25" />
      ))}
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="relative overflow-hidden bg-black  bg-center py-16 sm:py-20 md:py-28"
      style={{ backgroundImage: `url(${whyBg.src})` }}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

      {/* Floating dot patterns — centered horizontally, top and bottom */}
      <DotGrid className="absolute left-1/4 top-6 -translate-x-1/2 sm:top-10" />
      <DotGrid className="absolute bottom-6 left-2/3  -translate-x-1/2 sm:bottom-10" />

      <div className="relative mx-auto max-w-[1100px] px-4">
        <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          Why Choose Us
        </h2>

        <div className="relative mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:mt-16 md:grid-cols-2 md:gap-y-16 cursor-pointer">
          {/* Horizontal connector between top row cards (desktop only) */}
          <div className="pointer-events-none absolute left-1/2 top-[95px] hidden h-[2px] w-10 -translate-x-1/2 bg-[#db5e41] md:block" />
          {/* Horizontal connector between bottom row cards (desktop only) */}
          <div className="pointer-events-none absolute bottom-[145px] left-1/2 hidden h-[1px] w-10 -translate-x-1/2 bg-[#db5e41] md:block" />

          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.number}
                className="group relative flex flex-col items-center px-6 pb-10 pt-16 text-center transition-all duration-500 ease-out hover:-translate-y-2 sm:px-10 sm:pt-20"
              >
                {/* Icon badge */}
                <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#db5e41] shadow-lg transition-colors duration-500 sm:h-20 sm:w-20">
                  <Icon className="text-white" size={30} strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-bold text-white transition-colors duration-500 group-hover:text-[#db5e41] sm:text-xl">
                  {feature.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[320px] text-sm leading-7 text-white/60 sm:text-[15px]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}