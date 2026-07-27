"use client";

import { Star } from "lucide-react";

const reasons = [
  {
    title: "Comprehensive In-House Expertise",
    description:
      "With a dedicated team of designers and craftsmen, we manage every stage of your project execution.",
  },
  {
    title: "Proven Track Record",
    description:
      "Our portfolio showcases several successful project executions across residential and commercial properties in the UAE.",
  },
  {
    title: "Customized Joinery Solutions",
    description:
      "Our custom joinery services add elegance, functionality, and a personal touch to every space.",
  },
  {
    title: "Uncompromising Quality Standards",
    description:
      "We use premium materials and meticulous craftsmanship to deliver exceptional results that stand the test of time.",
  },
  {
    title: "Transparent Project Costs in Dubai",
    description:
      "We provide clear quotations with no hidden charges, helping clients get maximum value for their investment.",
  },
  {
    title: "On-Time Delivery and Lasting Results",
    description:
      "Our structured workflow and experienced project managers ensure timely completion without compromising quality.",
  },
];

export default function WhyChooseUsLight() {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          Why Choose Us
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group flex flex-col items-center border cursor-pointer  border-gray-200 bg-white px-6 py-10 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-lg sm:px-8 sm:py-12"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#db5e41]/40 transition-colors duration-500 group-hover:bg-[#db5e41] sm:h-20 sm:w-20">
                <Star
                  className="fill-[#db5e41] text-[#db5e41] transition-colors duration-500 group-hover:fill-white group-hover:text-white"
                  size={28}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-6 text-[22px] font-bold leading-7 text-[#0c1526] sm:text-xl">
                {reason.title}
              </h3>

              <p className="mt-4 text-[12px] leading-7 text-gray-600 sm:text-[15px]">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}