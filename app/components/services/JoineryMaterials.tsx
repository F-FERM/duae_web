"use client";

import { motion } from "framer-motion";
import { PaintRoller } from "lucide-react";
import Image from "next/image";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";

interface MaterialItem {
    title: string;
    description: string;
}

const materials: MaterialItem[] = [
    {
        title: "Hardwoods (Oak, Teak, Walnut)",
        description:
            "Hardwoods are prized for their strength, durability, and rich textures - perfect for high-end joinery works that demand elegance and longevity.",
    },
    {
        title: "Softwoods (Pine, Cedar, Fir)",
        description:
            "Lightweight yet versatile, softwoods are ideal for cost-effective joinery works, offering flexibility in design and finish.",
    },
    {
        title: "Engineered Wood (MDF, HDF, Plywood)",
        description:
            "Engineered woods provide stability and consistency, making them a popular choice for modern joinery works that require precision and durability.",
    },
    {
        title: "Laminates & Veneers",
        description:
            "These materials add style and versatility, allowing us to deliver joinery works with premium finishes that replicate natural textures at a fraction of the cost.",
    },
    {
        title: "Specialty Finishes (Stains, Lacquers, Paints)",
        description:
            "Finishes enhance the beauty and protect the wood, giving your joinery works a refined look that lasts for years.",
    },
    {
        title: "Eco-Friendly Options",
        description:
            "Sustainable woods and finishes are available for eco-conscious clients who want their joinery works to reflect both quality and environmental responsibility.",
    },
];

function MaterialCard({ item, index }: { item: MaterialItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="group relative overflow-hidden bg-[#efece7] p-6 transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:p-8"
        >
            {/* Icon */}
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center text-[#0c1526] transition-transform duration-500 ease-out group-hover:-rotate-12">
                <PaintRoller size={40} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-[#0c1526] transition-colors duration-300 group-hover:text-[#db5e41] sm:text-2xl">
                {item.title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-[17px] leading-7 text-gray-600">
                {item.description}
            </p>

            {/* Decorative corner squares — stacked, orange over navy */}
            <div className="pointer-events-none absolute bottom-4 right-4">
                {/* Large Navy Square */}
                <div className="h-4 w-4 bg-white" />

                {/* Small Orange Square */}
                <div className="absolute -top-3 -left-3 h-2.5 w-2.5 bg-[#db5e41]" />
            </div>        </motion.div>
    );
}

export default function OurJoineryMaterials() {
    return (
        <section className="relative overflow-hidden bg-[#faf7f6] py-20 md:py-28">
            {/* pattern1 — wavy lines carried across the whole section */}
            <div className="pointer-events-none absolute inset-0 opacity-80">
                <motion.div
                    className="relative h-full w-full"
                    animate={{ y: [0, -8, 0, 8, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Image src={imagepattern1} alt="" priority className="object-cover" />
                </motion.div>
            </div>

            {/* pattern2 — tucked in the top-right corner, same as AboutUs / WhatIncluded */}
            <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-80">
                <motion.div
                    className="relative h-full w-full"
                    animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Image src={pattern2} alt="" priority className="object-cover" />
                </motion.div>
            </div>

            <div className="relative mx-auto max-w-[1220px] px-4">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center ">
                    Our Joinery Materials
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                    At the heart of our joinery works lies the use of premium-quality
                    materials that ensure durability, style, and long-lasting
                    performance. We carefully select each material to match the
                    specific needs of your project, delivering both functionality and
                    aesthetic appeal.
                </p>

                {/* Materials grid — responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 lg:gap-8">
                    {materials.map((item, index) => (
                        <MaterialCard key={item.title} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}