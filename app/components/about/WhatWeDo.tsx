"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Layers, Leaf, Award, Wrench, Scissors } from "lucide-react";
import imagepattern1 from "../../../public/images/pattern1.png";
import pattern2 from "../../../public/images/pattern2.png";

const services = [
  { icon: Layers, title: "Joinery" },
  { icon: Leaf, title: "Fit-out Solutions" },
  { icon: Award, title: "Turnkey Solutions" },
  { icon: Wrench, title: "Renovation Services" },
  { icon: Scissors, title: "Metal Works" },
  { icon: Scissors, title: "Upholstery" },
];

export default function WhatWeDo() {
  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-16 sm:py-20 md:py-28">
      {/* Left floating wave pattern — same technique as AboutUs */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={imagepattern1} alt="" priority className="object-cover" />
        </motion.div>
      </div>

      {/* Right floating corner pattern — same technique as AboutUs */}
      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-70">
        <motion.div
          className="relative h-full w-full"
          animate={{
            y: [0, -12, 0, 12, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src={pattern2} alt="" priority className="object-cover" />
        </motion.div>
      </div>

      <div className="relative mx-auto grid max-w-[1220px] grid-cols-1 items-center gap-16 px-4 lg:grid-cols-2 lg:gap-10">
        {/* Left: Text Content */}
        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-[#db5e41] sm:text-base">
            Our Core Services
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-[#0c1526] sm:text-4xl md:text-6xl">
            What we do
          </h2>

          <p className="mt-8 text-[15px] leading-8 text-[#232323] md:text-[18px]">
            At Wood World Decor, we offer a comprehensive range of services,
            specialized in custom joinery, interior fit-out, turnkey fit-out,
            and renovation solutions across the UAE. Guided by years of
            hands-on experience, we focus on delivering results that reflect
            both excellence and efficiency. Right from concept to execution
            and completion, we aim to provide services that embody timeless
            design, superior workmanship, and long-lasting value.
          </p>
        </div>

        {/* Right: Icon Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group flex items-center gap-4 sm:gap-5 cursor-pointer"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-colors duration-300 group-hover:bg-[#db5e41] sm:h-20 sm:w-20">
                  <Icon
                    className="text-[#0c1526] transition-colors duration-300 group-hover:text-white"
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-base font-bold leading-6 text-[#0c1526] sm:text-lg">
                  {service.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}