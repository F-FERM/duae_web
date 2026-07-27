"use client";

import { SmilePlus, Users, Axe, ScrollText } from "lucide-react";
import Counter from "../Counter";

const stats = [
  {
    number: "10",
    label: "Years of Excellence",
    icon: SmilePlus,
  },
  {
    number: "100",
    label: "Skilled professionals",
    icon: Users,
  },
  {
    number: "400",
    label: "Successful projects",
    icon: Axe,
  },
  {
    number: "600",
    label: "Happy Clients",
    icon: ScrollText,
  },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isLastInRow = (index + 1) % 2 === 0;

            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center border-gray-200 px-4 text-center lg:border-r ${
                  isLastInRow ? "border-r-0" : "border-r"
                } ${index === stats.length - 1 ? "lg:border-r-0" : ""}`}
              >
                {/* Number */}
                <div className="flex items-start">
                  <span className="text-5xl font-bold text-[#db5e41] sm:text-6xl">
                   <span className="text-7xl font-bold text-[#db5e41] sm:text-7xl">
  <Counter end={Number(stat.number)} />
</span>
                  </span>
                  <span className="mt-1 text-2xl font-bold text-[#db5e41] sm:text-3xl">
                    +
                  </span>
                </div>

                {/* Label */}
                <p className="mt-2 text-[18px] font-normal text-[#202020] sm:text-base">
                  {stat.label}
                </p>

                {/* Icon */}
                <Icon
                  className="mt-6 text-[#202020]"
                  size={38}
                  strokeWidth={1.5}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}