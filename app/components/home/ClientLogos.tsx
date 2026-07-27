"use client";

import Image from "next/image";
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import logo1 from "../../../public/images/service1.webp";
import logo2 from "../../../public/images/service1.webp";
import logo3 from "../../../public/images/service1.webp";
import logo4 from "../../../public/images/service1.webp";
import logo5 from "../../../public/images/service1.webp";
import logo6 from "../../../public/images/service1.webp";
import logo7 from "../../../public/images/service1.webp";
import patternBg from "../../../public/images/pattern1.png";

const clients: { name: string; logo: StaticImageData }[] = [
  { name: "Surface Eleven", logo: logo1 },
  { name: "JDS", logo: logo2 },
  { name: "Inava", logo: logo3 },
  { name: "Tas-heel", logo: logo4 },
  { name: "Hazy", logo: logo5 },
  { name: "Godiva", logo: logo6 },
  { name: "Fix", logo: logo7 },
];

export default function OurClients() {
  // Duplicate the list so the marquee loops seamlessly
  const loopLogos = [...clients, ...clients];

  return (
    <section className="relative overflow-hidden bg-[#faf7f6] py-16 sm:py-20 md:py-24">
      {/* Decorative wave pattern, left side — floating */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[45%] opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{
            y: [0, -10, 0, 10, 0],
            x: [0, 6, 0, -6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image src={patternBg} alt="" className="object-cover" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1220px] px-4">
        {/* Heading */}
        <div className="mx-auto max-w-[820px] text-center">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            Our Clients
          </h2>
          <p className="mx-auto mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            At Wood World Decor, we are proud to serve esteemed clients
            delivering bespoke joinery, fit-out, and renovation solutions
            that reflect our commitment to excellence.
          </p>
        </div>

        {/* Marquee card */}
        <div className="relative mt-10 overflow-hidden rounded-md bg-white p-4 shadow-sm sm:mt-14 sm:p-6">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

          <div className="group flex overflow-hidden">
            <div className="flex animate-marquee items-center gap-6 group-hover:[animation-play-state:paused] sm:gap-10">
              {loopLogos.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex h-[80px] w-[140px] flex-shrink-0 items-center justify-center bg-[#faf7f6] sm:h-[96px] sm:w-[170px]"
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    className="max-h-[50px] w-auto object-contain opacity-90 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:max-h-[60px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: max-content;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 16s;
          }
        }
      `}</style>
    </section>
  );
}