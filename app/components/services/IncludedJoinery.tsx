"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";

interface IncludedItem {
    title: string;
    description: string;
}

const leftItems: IncludedItem[] = [
    {
        title: "Custom Furniture:",
        description:
            "Handcrafted to reflect your unique vision, our furniture - ranging from bespoke wardrobes to tailor-made cabinetry - is designed to enhance functionality and elevate your interiors with elegance.",
    },
    {
        title: "Doors, Windows & Panels:",
        description:
            "Be it entrance doors, window frames, or decorative wall and ceiling panels, each component is crafted with precision for durability, aesthetic appeal, and seamless integration.",
    },
    {
        title: "Staircases & Gates:",
        description:
            "From sweeping staircases to secure gates, our joinery transforms these elements into architectural focal points that blend safety with sophisticated design.",
    },
    {
        title: "Flooring & Ceilings:",
        description:
            "Expertly installed wood flooring and ceiling finishes add warmth, texture, and character to any room, enhancing both visual appeal and structural longevity.",
    },
    {
        title: "Built-in & Commercial Joinery:",
        description:
            "Tailored solutions such as kitchens, reception counters, display units, and storage systems are built to maximize efficiency and brand identity in both residential and commercial settings.",
    },
];

const rightItems: IncludedItem[] = [
    {
        title: "Kitchen Cabinets & Wardrobes:",
        description:
            "Custom-designed cabinets, wardrobes, and storage solutions that combine smart functionality with modern aesthetics.",
    },
    {
        title: "Reception Counters & Office Fit-outs:",
        description:
            "Stylish reception desks, workstations, and commercial joinery solutions tailored for offices, retail spaces, and showrooms.",
    },
    {
        title: "Wall Cladding & Partitions:",
        description:
            "Decorative wooden wall cladding, feature walls, and partitions that enhance interiors with warmth and texture.",
    },
    {
        title: "Shelving & Storage Units:",
        description:
            "Bespoke shelving systems and storage units designed for maximum space utilization without compromising on style.",
    },
    {
        title: "Outdoor Joinery:",
        description:
            "Pergolas, gazebos, decking, and other exterior woodworks built to withstand the Dubai climate while adding elegance outdoors.",
    },
    {
        title: "Luxury Detailing:",
        description:
            "Intricate carvings, moldings, and embellishments that add a touch of sophistication and luxury to every piece.",
    },
];

function ChecklistColumn({ items }: { items: IncludedItem[] }) {
    return (
        <div className="relative bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.06)] sm:p-8">
            <ul className="flex flex-col gap-5">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#db5e41]/10 text-[#db5e41]">
                            <Check size={14} strokeWidth={3} />
                        </span>
                        <p className="text-[15px] leading-7 text-gray-600 md:text-base">
                            <span className="font-bold text-[#0c1526]">{item.title}</span>{" "}
                            {item.description}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function WhatIncluded() {
    return (
        <section className="relative overflow-hidden bg-[#f6edea] py-20 md:py-28">
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

            {/* pattern2 — tucked in the top-right corner, same as AboutUs */}
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
                    What is Included in Every Joinery
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                    Our comprehensive joinery services solutions ensure that every
                    project - regardless of scale or type - covers a full suite of
                    craftsmanship, from structural pieces to decorative details. As a
                    premier joinery company in Dubai, we pride ourselves on delivering
                    complete, end-to-end wooden solutions tailored for your space.
                </p>

                {/* Two checklist columns */}
                <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2 lg:gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ChecklistColumn items={leftItems} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <ChecklistColumn items={rightItems} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}