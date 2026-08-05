"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  Wrench,
  Package,
  Hammer,
  Sofa,
  PaintBucket,
  Building,
  KeyRound,
  Settings,
  ChefHat,
  Home,
  type LucideIcon,
} from "lucide-react";
import bgTexture from "../../../public/images/services-one-bg.jpg";
import api from "@/lib/axios";

interface ServiceApiItem {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  icon: string;
  order: number;
  isFeatured?: boolean; // optional — API may not send this at all
}

interface ServiceItem {
  id: string;
  image: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const IMAGE_ALT = "Interior fit out company in Dubai";

// Maps the FontAwesome class strings coming from the API to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  "fa-solid fa-hammer": Hammer,
  "fa-solid fa-wrench": Wrench,
  "fa-solid fa-key": KeyRound,
  "fa-solid fa-building": Building,
  "fa-solid fa-gear": Settings,
  "fa-solid fa-couch": Sofa,
  "fa-solid fa-kitchen-set": ChefHat,
  "fa-solid fa-house-chimney": Home,
};

function resolveIcon(icon: string): LucideIcon {
  return iconMap[icon] || Landmark;
}

// Prefix relative image paths coming from the API with your backend/CDN base URL.
// Your current API already returns full Cloudinary URLs, so this just passes them through.
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

function resolveImage(path: string): string {
  if (!path) return "/images/service1.webp";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path}`;
}

function mapApiToServices(data: ServiceApiItem[]): ServiceItem[] {
  return data
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((s) => ({
      id: s._id,
      image: resolveImage(s.image),
      icon: resolveIcon(s.icon),
      title: s.title,
      description: s.shortDescription,
      href: `/services/${s.slug}`,
    }));
}

// Fallback, used only if the API call fails or returns nothing
const defaultServices: ServiceItem[] = [
  {
    id: "joinery",
    image: "/images/service1.webp",
    icon: Landmark,
    title: "Joinery",
    description:
      "From custom furniture to intricate wood detailing, our joinery solutions are designed to add character, durability, and style.",
    href: "/services/joinery",
  },
  {
    id: "renovation-services",
    image: "/images/service1.webp",
    icon: Wrench,
    title: "Renovation Services",
    description:
      "We offer complete renovation services including MEP, painting, gypsum works, and wall fixing, specializing in transforming villas, apartments, kitchens, and bathrooms into modern, functional, and stylish spaces.",
    href: "/services/renovation-services",
  },
  {
    id: "turnkey-solutions",
    image: "/images/service1.webp",
    icon: Package,
    title: "Turnkey Solutions",
    description:
      "Our turnkey solutions cover every stage of your project, from design and planning to execution and finishing, ensuring a hassle-free experience and a fully completed space ready for use.",
    href: "/services/turnkey-solutions",
  },
  {
    id: "fitout-solutions",
    image: "/images/service1.webp",
    icon: Hammer,
    title: "Fit-out Solutions",
    description:
      "Our fit-out solutions cover everything from MEP, painting, gypsum works, and wall fixing to complete finishing touches, tailored for both residential and commercial spaces.",
    href: "/services/fitout-solutions",
  },
  {
    id: "metal-works",
    image: "/images/service1.webp",
    icon: PaintBucket,
    title: "Metal Works",
    description:
      "Our metal works services deliver custom-designed solutions with strength, precision, and durability, including fabrications, structural works, and decorative finishes to enhance both residential and commercial projects.",
    href: "/services/metal-works",
  },
  {
    id: "upholstery",
    image: "/images/service1.webp",
    icon: Sofa,
    title: "Upholstery",
    description:
      "Our upholstery services breathe new life into your furniture with premium fabrics, expert craftsmanship, and customized designs, ensuring comfort, durability, and a perfect match to your interior style.",
    href: "/services/upholstery",
  },
];

function ServicesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#f7f1ee] py-12 xs:py-14 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="mx-auto max-w-[820px] text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-md bg-gray-300 xs:h-9 sm:h-10 md:h-12" />
          <div className="mx-auto mt-4 h-4 w-11/12 animate-pulse rounded-md bg-gray-200 sm:h-5" />
          <div className="mx-auto mt-2 h-4 w-3/4 animate-pulse rounded-md bg-gray-200 sm:h-5" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 xs:mt-12 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col bg-white">
              <div className="h-[200px] w-full animate-pulse bg-gray-200 xs:h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px]" />
              <div className="flex flex-col items-center px-6 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14">
                <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200 sm:h-6" />
                <div className="mt-3 h-3 w-full animate-pulse rounded-md bg-gray-200 sm:mt-4" />
                <div className="mt-2 h-3 w-4/5 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        const res = await api.get<ServiceApiItem[]>("/services/home");
        const mapped = mapApiToServices(res.data ?? []);
        if (isMounted) {
          setServices(mapped.length > 0 ? mapped : defaultServices);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        if (isMounted) setServices(defaultServices);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) return <ServicesSkeleton />;
  if (!services || services.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 xs:py-14 sm:py-16 md:py-20 lg:py-28">
      {/* Background image + overlay so text stays readable */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src={bgTexture} 
          alt={IMAGE_ALT} 
          fill 
          priority={false} 
          className="object-cover" 
        />
        <div className="absolute inset-0 bg-[#f7f1ee]/90" />
      </div>

      <div className="mx-auto max-w-[1220px] px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[820px] text-center"
        >
          <h2 className="text-2xl font-bold text-[#0c1526] xs:text-3xl sm:text-4xl md:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-2 text-sm leading-6 text-gray-600 xs:leading-7 sm:text-base sm:leading-8 md:text-lg">
          At Wood World Decor, we bring expertise and craftsmanship together to offer complete solutions for your space. Our comprehensive services ensure every detail is perfected, from joinery to fit outs and beyond.


          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 xs:mt-12 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 3) * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex h-full origin-center flex-col bg-white transition-all duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* Image + Icon Badge */}
                <div className="relative">
                  <div className="relative h-[200px] w-full overflow-hidden xs:h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px]">
                    <Image
                      src={service.image}
                      alt={IMAGE_ALT}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#0c1526] shadow-md transition-colors duration-500 group-hover:bg-[#db5e41] xs:-bottom-6 xs:h-12 xs:w-12 sm:-bottom-8 sm:h-16 sm:w-16">
                    <Icon
                      className="h-4 w-4 text-white xs:h-5 xs:w-5 sm:h-6 sm:w-6"
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col items-center px-5 pb-8 pt-10 text-center xs:px-6 xs:pb-10 xs:pt-12 sm:px-8 sm:pb-12 sm:pt-14">
                  <h3 className="text-base font-bold text-[#0c1526] transition-colors duration-500 group-hover:text-[#db5e41] xs:text-lg sm:text-xl md:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600 sm:mt-4 sm:text-[15px] sm:leading-7">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="mt-5 inline-block text-sm font-semibold text-[#0c1526] underline decoration-1 underline-offset-4 transition hover:text-[#db5e41] sm:mt-6 sm:text-[15px]"
                  >
                    Know More &raquo;
                  </Link>
                </div>

                {/* Decorative corner squares */}
                <div className="pointer-events-none absolute bottom-4 right-4">
                  <div className="h-4 w-4 bg-[#0c1526]" />
                  <div className="absolute -top-3 -left-3 h-2.5 w-2.5 bg-[#db5e41]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}