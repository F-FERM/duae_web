"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import hero1 from "../../../public/images/slide1.webp";
import { motion } from "framer-motion";

export default function HeroService() {
    return (
        <section className="relative -mt-10 h-[520px] w-full overflow-hidden lg:h-[620px]">
            {/* Background image */}
            <div className="absolute inset-0">
                <Image
                    src={hero1}
                    alt="Top Joinery Company in Dubai"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Dark-to-orange gradient overlay, matching the reference */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-[#c0522f]/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-5 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-[560px] text-white"
                >
                    <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
                        Top Joinery Company in Dubai
                    </h1>

                    <p className="mt-5 text-[18px] leading-7 text-white/90 md:text-[20px]">
                        As a leading joinery company in Dubai, we deliver bespoke joinery
                        solutions that blend durability, elegance, and functionality. Our
                        team of skilled craftsmen specializes in custom furniture,
                        wardrobes, decorative wood paneling, and office fit-outs -
                        designed to elevate both residential and commercial spaces. With
                        a commitment to quality and attention to detail, we ensure every
                        project reflects innovation, style, and lasting value.
                    </p>

<motion.a
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.25 }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    href="https://wa.me/971527875262"
    target="_blank"
    rel="noopener noreferrer"
    className="group relative mt-8 flex h-14 w-fit items-center overflow-hidden rounded-full bg-[#5aa64d] px-8 text-sm font-bold tracking-wide text-white shadow-lg shadow-[#5aa64d]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#5aa64d]/30 md:text-base"
>
    <span className="absolute inset-0 translate-x-full rounded-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
    <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black">
        <MessageCircle size={20} />
        WHATSAPP US
    </span>
</motion.a>
                </motion.div>
            </div>
        </section>
    );
}