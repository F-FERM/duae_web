"use client";

import { useEffect, useState } from "react";
import { SmilePlus, Users, Axe, ScrollText, type LucideIcon } from "lucide-react";
import Counter from "../Counter";
import api from "@/lib/axios";

interface StatsData {
  yearsOfExcellence: number;
  yearsLabel: string;
  skilledProfessionals: number;
  professionalsLabel: string;
  successfulProjects: number;
  projectsLabel: string;
  happyClients: number;
  clientsLabel: string;
}

interface StatItem {
  number: number;
  label: string;
  icon: LucideIcon;
}

const defaultData: StatsData = {
  yearsOfExcellence: 10,
  yearsLabel: "Years of Excellence",
  skilledProfessionals: 100,
  professionalsLabel: "Skilled professionals",
  successfulProjects: 400,
  projectsLabel: "Successful projects",
  happyClients: 600,
  clientsLabel: "Happy Clients",
};

// Icons stay fixed on the frontend since the API doesn't send them
function buildStats(data: StatsData): StatItem[] {
  return [
    { number: data.yearsOfExcellence, label: data.yearsLabel, icon: SmilePlus },
    { number: data.skilledProfessionals, label: data.professionalsLabel, icon: Users },
    { number: data.successfulProjects, label: data.projectsLabel, icon: Axe },
    { number: data.happyClients, label: data.clientsLabel, icon: ScrollText },
  ];
}

function StatsSkeleton() {
  return (
    <section className="bg-white py-12 xs:py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center px-3 text-center sm:px-4">
              <div className="h-10 w-16 animate-pulse rounded-md bg-gray-200 xs:h-12 sm:h-14 md:h-16" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded-md bg-gray-200 sm:h-4 sm:w-28" />
              <div className="mt-5 h-8 w-8 animate-pulse rounded-full bg-gray-200 sm:h-9 sm:w-9" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<StatsData>("home-hero/stats");
        setStats(buildStats(res.data));
      } catch (err) {
        console.error("Failed to fetch stats section:", err);
        setStats(buildStats(defaultData));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <StatsSkeleton />;
  if (!stats || stats.length === 0) return null;

  return (
    <section className="bg-white py-12 xs:py-14 sm:py-16 md:py-20">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isFirstColMobile = index % 2 === 0; // left column on 2-col mobile grid
            const isTopRowMobile = index < 2; // top row on 2-col mobile grid
            const isLastSm = index === stats.length - 1; // last item on 4-col row

            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center border-gray-200 px-3 pb-8 text-center xs:px-4 sm:border-b-0 sm:px-4 sm:pb-0 ${
                  isTopRowMobile ? "border-b" : ""
                } ${isFirstColMobile ? "border-r" : ""} ${
                  isLastSm ? "sm:border-r-0" : "sm:border-r"
                }`}
              >
                {/* Number */}
                <div className="flex items-start">
                  <span className="text-4xl font-bold text-[#db5e41] xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl">
                    <Counter end={stat.number} />
                  </span>
                  <span className="mt-0.5 text-xl font-bold text-[#db5e41] xs:mt-1 sm:text-2xl md:text-3xl">
                    +
                  </span>
                </div>

                {/* Label */}
                <p className="mt-2 text-sm font-normal text-[#202020] xs:text-base sm:mt-3 sm:text-base md:text-lg">
                  {stat.label}
                </p>

                {/* Icon */}
                <Icon
                  className="mt-4 h-7 w-7 text-[#202020] xs:mt-5 xs:h-8 xs:w-8 sm:mt-6 sm:h-9 sm:w-9 md:h-10 md:w-10"
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