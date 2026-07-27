"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import commercial from "../../../public/images/slide1.webp";
import residential from "../../../public/images/slide1.webp";
import hospitality from "../../../public/images/slide1.webp";

interface ServeItem {
    image: StaticImageData;
    title: string;
    description: string;
}

const serveItems: ServeItem[] = [
    {
        image: commercial,
        title: "Commercial",
        description:
            "We deliver tailored joinery works in Dubai for offices, retail stores, and corporate environments, ensuring functionality, durability, and a professional finish that enhances your business space.",
    },
    {
        image: residential,
        title: "Residential",
        description:
            "As a trusted joinery company in Dubai, we create bespoke furniture, wardrobes, and wood finishes that bring elegance, comfort, and lasting value to your home.",
    },
    {
        image: hospitality,
        title: "Hospitality",
        description:
            "Our specialized joinery in Dubai for hotels, restaurants, and luxury spaces combines craftsmanship with innovative design, creating inviting and sophisticated environments for guests.",
    },
];

export default function WhoWeServe() {
    return (
        <section className="w-full bg-white py-16 md:py-20">
            <div className="mx-auto max-w-[1200px] px-5 md:px-10">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center ">
                    Who we Serve
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                    With expertise in joinery in Dubai, we provide customized solutions
                    that cater to diverse industries. Our joinery works in Dubai are
                    designed to meet the unique requirements of commercial,
                    residential, and hospitality spaces with precision and creativity.
                </p>

                {/* Cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
                    {serveItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
                        >
                            <div className="relative h-[280px] w-full overflow-hidden md:h-[340px]">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />

                                {/* Dark overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/40" />
                            </div>

                            <div className="relative flex flex-col gap-3 p-6">
                                {/* Small orange accent border on the left, on hover */}
                                <span className="absolute left-0 top-1/2 h-16 w-[3px] origin-center -translate-y-1/2 scale-y-0 bg-[#c0522f] transition-transform duration-300 ease-out group-hover:scale-y-100" />
                                <h3 className="text-xl font-bold text-[#0d1b2a] md:text-2xl">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-7 text-[#0d1b2a]/70 md:text-base">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}