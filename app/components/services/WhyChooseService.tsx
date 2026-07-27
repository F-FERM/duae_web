"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import whyBg from "../../../public/images/pattern3.png";

const features = [
    {
        number: "01",
        title: "Expert Craftsmanship",
        description:
            "As a leading joinery company in Dubai, we deliver precision-crafted solutions that blend functionality with timeless design.",
    },
    {
        number: "02",
        title: "Comprehensive Services",
        description:
            "From custom furniture to large-scale fit-outs, our joinery works in Dubai cover residential, commercial, and hospitality projects with ease.",
    },
    {
        number: "03",
        title: "Premium Quality Materials",
        description:
            "We use only the finest hardwoods, engineered woods, and finishes to ensure every piece of joinery in Dubai stands the test of time.",
    },
    {
        number: "04",
        title: "Tailored Design Approach",
        description:
            "Our team creates bespoke designs to suit your style and space, making each project unique and aligned with your vision.",
    },
    {
        number: "05",
        title: "Trusted Experience",
        description:
            "With 10 plus years of expertise in joinery works Dubai, we have built a reputation for reliability, innovation, and customer satisfaction.",
    },
    {
        number: "06",
        title: "Specialized Joinery Expertise",
        description:
            "As a trusted joinery company in Dubai, we focus exclusively on delivering bespoke woodwork solutions tailored to your project needs.",
    },
    {
        number: "07",
        title: "Wide Range of Joinery Services",
        description:
            "Our joinery works in Dubai cover custom furniture, doors, panels, staircases, flooring, ceilings, and decorative installations for all sectors.",
    },
    {
        number: "08",
        title: "End-to-End Joinery Solutions",
        description:
            "From consultation and design to fabrication and installation, our joinery company in Dubai delivers complete solutions under one roof.",
    },
];

// Reusable floating dot-grid pattern
function DotGrid({ className }: { className?: string }) {
    return (
        <motion.div
            className={`pointer-events-none grid grid-cols-4 gap-3 ${className}`}
            animate={{ y: [0, -10, 0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
            {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-white/25" />
            ))}
        </motion.div>
    );
}

export default function WhyChooseUsService() {
    return (
        <section
            className="relative overflow-hidden bg-black bg-center py-16 sm:py-20 md:py-28"
            style={{ backgroundImage: `url(${whyBg.src})` }}
        >
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[length:24px_24px]" />

            {/* Floating dot patterns — fade/scale in on scroll, then float continuously */}
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-1/4 top-6 -translate-x-1/2 sm:top-10"
            >
                <DotGrid />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 left-2/3 -translate-x-1/2 sm:bottom-10"
            >
                <DotGrid />
            </motion.div>

            <div className="relative mx-auto max-w-[1350px] px-4">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
                >
                    Why Choose Us
                </motion.h2>

                <div className="relative mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-16 cursor-pointer">

                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.number}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.6,
                                delay: (index % 4) * 0.12,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="group relative flex flex-col items-center bg-[#0c0c0c] px-6 pb-10 pt-16 text-center transition-all duration-500 ease-out hover:-translate-y-2 sm:px-8 sm:pt-20"
                        >
                            {/* Icon badge */}
                            <div className="absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#db5e41] shadow-lg transition-transform duration-500 ease-out group-hover:rotate-[360deg] sm:h-20 sm:w-20">
                                <CheckCircle2 className="text-white" size={30} strokeWidth={1.8} />
                            </div>

                            <h3 className="text-[22px] font-bold text-white transition-colors duration-500 group-hover:text-[#db5e41] sm:text-3xl">
                                {feature.title}
                            </h3>

                            <p className="mx-auto mt-4 max-w-[280px] text-sm leading-7 text-white/60 sm:text-[18px]">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}