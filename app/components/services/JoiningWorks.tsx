"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

// Replace these with your actual project images
import work1 from "../../../public/images/slide1.webp";
import work2 from "../../../public/images/slide1.webp";
import work3 from "../../../public/images/slide1.webp";
import work4 from "../../../public/images/slide1.webp";
import work5 from "../../../public/images/slide1.webp";
import work6 from "../../../public/images/slide1.webp";
import bgTexture from "../../../public/images/services-one-bg.jpg"; // swap path if different

interface WorkItem {
    image: StaticImageData;
}

const works: WorkItem[] = [
    { image: work1 },
    { image: work2 },
    { image: work3 },
    { image: work4 },
    { image: work5 },
    { image: work6 },
];

export default function JoineryWorks() {
    return (
        <section className="relative w-full overflow-hidden py-16 md:py-20">
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src={bgTexture}
                    alt=""
                    fill
                    priority={false}
                    className="object-cover"
                />
                {/* Light wash so the pattern stays visible but text remains readable */}
                <div className="absolute inset-0 bg-[#f7f1ee]/90" />
            </div>

            <div className="mx-auto max-w-[1200px] px-5 md:px-10">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center ">
                    Trusted Joinery Works in Dubai
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                    As a premier joinery company in Dubai, we specialize in delivering
                    high-quality craftsmanship tailored to your unique needs. Our
                    expertise in joinery works in Dubai covers a wide range of services
                    designed for commercial, residential, and hospitality projects. From
                    bespoke furniture and detailed wood paneling to complete fit-out
                    solutions, we combine precision, durability, and aesthetic
                    excellence to transform every space into a statement of style and
                    functionality.
                </p>

                {/* Image grid */}
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
                    {works.map((work, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                            className="group relative h-[260px] w-full overflow-hidden sm:h-[300px] md:h-[380px]"
                        >
                            <Image
                                src={work.image}
                                alt="jj"
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />

                            {/* Dark overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 ease-out group-hover:bg-black/60" />

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}