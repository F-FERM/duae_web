"use client";

import Image from "next/image";
import ctaBg from "../../../public/images/service1.webp";

export default function HeroContactUs() {
  return (
    <section className="relative w-full overflow-hidden mb-19">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={ctaBg}
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Warm dark overlay tint */}
      <div className="absolute inset-0 bg-[#3a1f14]/70" />
      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#2a1710]/80 via-[#3a1f14]/40 to-transparent" /> */}

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-[1220px] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[360px] md:min-h-[420px] md:py-20">
        <h2 className="text-5xl font-extrabold leading-tight text-white sm:text-3xl md:text-7xl lg:text-7xl">
         Contact Us
        </h2>

        <p className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-white/85 sm:text-base md:mt-5 md:text-lg">
          HOME / CONTACT US
        </p>

       
      
      </div>
    </section>
  );
}