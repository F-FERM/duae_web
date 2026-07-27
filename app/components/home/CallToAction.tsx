"use client";

import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import ctaBg from "../../../public/images/service1.webp";
import { motion } from "framer-motion";

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
           <motion.a
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 70, opacity: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.55,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        href="tel:+971527875262"
        className="group relative flex h-16 overflow-hidden bg-[#db5e41] px-10 text-lg font-semibold text-white"
      >
        <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 group-hover:translate-x-0" />

        <span className="relative z-10 flex items-center gap-3">
          <Phone size={22} />
          TALK TO US
        </span>
      </motion.a>

      {/* WhatsApp */}
      <motion.a
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 70, opacity: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.7,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        href="https://wa.me/971527875262"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-16 overflow-hidden bg-[#5aa64d] px-10 text-lg font-semibold text-white"
      >
        <span className="absolute inset-0 translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />

        <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-black">
          <MessageCircle size={22} />
          WHATSAPP US
        </span>
      </motion.a>
        </div>
      </div>
    </section>
  );
}