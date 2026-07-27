"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Landmark, Wrench, Package, Hammer, Sofa, PaintBucket } from "lucide-react";
import service1 from "../../../public/images/service1.webp";
import bgTexture from "../../../public/images/services-one-bg.jpg"; // swap path if different

const services = [
  {
    image: service1,
    icon: Landmark,
    title: "Joinery",
    description:
      "From custom furniture to intricate wood detailing, our joinery solutions are designed to add character, durability, and style.",
    href: "/services/joinery",
  },
  {
    image: service1,
    icon: Wrench,
    title: "Renovation Services",
    description:
      "We offer complete renovation services including MEP, painting, gypsum works, and wall fixing, specializing in transforming villas, apartments, kitchens, and bathrooms into modern, functional, and stylish spaces.",
    href: "/services/renovation",
  },
  {
    image: service1,
    icon: Package,
    title: "Turnkey Solutions",
    description:
      "Our turnkey solutions cover every stage of your project, from design and planning to execution and finishing, ensuring a hassle-free experience and a fully completed space ready for use.",
    href: "/services/turnkey-solutions",
  },
  {
    image: service1,
    icon: Hammer,
    title: "Fit Out",
    description:
      "We deliver complete turnkey fit-out solutions, transforming interiors with precision, quality, and attention to every detail.",
    href: "/services/fit-out",
  },
  {
    image: service1,
    icon: Sofa,
    title: "Interior Design",
    description:
      "Our interior design team crafts functional, stylish spaces tailored to reflect your brand and elevate everyday living.",
    href: "/services/interior-design",
  },
  {
    image: service1,
    icon: PaintBucket,
    title: "Metal Works",
    description:
      "Precision-engineered metal fabrication and installation, built to combine structural strength with refined finishing.",
    href: "/services/metal-works",
  },
];

export default function Services() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-28">
      {/* Background image + overlay so text stays readable */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgTexture}
          alt=""
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
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-2 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
            At Wood World Decor, we bring expertise and craftsmanship together
            to offer complete solutions for your space. Our comprehensive
            services ensure every detail is perfected, from joinery to fit
            outs and beyond.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:mt-16 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
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
                  <div className="relative h-[220px] w-full overflow-hidden sm:h-[260px] md:h-[280px] lg:h-[300px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/50" />

                    {/* Optional Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Circular Icon Badge */}
                  <div className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-[#0c1526] shadow-md transition-colors duration-500 group-hover:bg-[#db5e41] sm:-bottom-8 sm:h-16 sm:w-16">
                    <Icon className="text-white" size={22} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-12 text-center sm:px-8 sm:pb-12 sm:pt-14">
                  <h3 className="text-lg font-bold text-[#0c1526] transition-colors duration-500 group-hover:text-[#db5e41] sm:text-xl md:text-2xl">
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

                {/* Decorative corner squares — stacked, orange over navy */}
                <div className="pointer-events-none absolute bottom-4 right-4">
                  {/* Large Navy Square */}
                  <div className="h-4 w-4 bg-[#0c1526]" />

                  {/* Small Orange Square */}
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