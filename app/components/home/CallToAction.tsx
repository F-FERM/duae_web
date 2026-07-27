"use client";

import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import ctaBg from "../../../public/images/service1.webp";

export default function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden">
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
        <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Ready to Transform Your Space?
        </h2>

        <p className="mx-auto mt-4 max-w-[720px] text-sm leading-7 text-white/85 sm:text-base md:mt-5 md:text-lg">
          Get expert joinery, fit-out, and renovation solutions designed for
          homes, offices, and commercial projects. Premium quality, on-time
          delivery, and end-to-end project support.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5 md:mt-10">
          <a
            href="tel:+971527875262"
            className="flex h-14 items-center gap-3 bg-[#db5e41] px-8 text-base font-semibold text-white transition hover:bg-[#c74f34] sm:h-16 sm:px-10 sm:text-lg"
          >
            <Phone size={20} />
            TALK TO US
          </a>

          <a
            href="https://wa.me/971527875262"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center gap-3 bg-[#5aa64d] px-8 text-base font-semibold text-white transition hover:bg-[#4a8d41] sm:h-16 sm:px-10 sm:text-lg"
          >
            <MessageCircle size={20} />
            WHATSAPP US
          </a>
        </div>
      </div>
    </section>
  );
}