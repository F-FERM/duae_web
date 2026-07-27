"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import processImage from "../../../public/images/slide1.webp";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";

interface ProcessStep {
    title: string;
    description: string;
}

const steps: ProcessStep[] = [
    {
        title: "Project Consultation & Briefing",
        description:
            "You share your goals and ideas, and our team listens - defining your requirements and vision. As experts in joinery in Dubai, we translate your needs into a clear, tailored plan.",
    },
    {
        title: "Design & Material Planning",
        description:
            "Our designers sketch layouts and shortlist woods, finishes, and hardware suited to your space, budget, and the demands of Dubai's climate.",
    },
    {
        title: "Quotation & Approval",
        description:
            "We prepare a transparent, itemized quotation covering materials, labor, and timelines, so you can approve every detail before work begins.",
    },
    {
        title: "Precision Crafting & Fabrication",
        description:
            "Skilled craftsmen shape, cut, and finish every piece in our workshop, checking measurements and joinery details at each stage for a flawless result.",
    },
    {
        title: "Delivery & On-Site Installation",
        description:
            "Finished pieces are carefully transported and installed on-site by our own team, with attention to fit, alignment, and finish.",
    },
    {
        title: "Finishing Touches & Final Review",
        description:
            "We inspect every joint and surface alongside you, making final adjustments so the work matches the agreed design exactly.",
    },
    {
        title: "Aftercare & Client Support",
        description:
            "Our relationship continues after handover, with maintenance guidance and responsive support whenever you need us.",
    },
];

function AccordionItem({
    step,
    isOpen,
    onToggle,
}: {
    step: ProcessStep;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="overflow-hidden bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]  ">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center cursor-pointer justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
                <span
                    className={`text-[22px] font-bold sm:text-[22px] ${isOpen ? "text-[#db5e41]" : "text-[#0c1526]"
                        }`}
                >
                    {step.title}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-[#db5e41] text-white" : "bg-[#f6edea] text-[#0c1526]"
                        }`}
                >
                    <ChevronDown size={16} strokeWidth={2.5} />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-[17px] leading-7 text-gray-600 sm:px-6 sm:pb-6 sm:text-[18px]">
                            {step.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function OurProcess() {
    const [openIndex, setOpenIndex] = useState(0);

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

            {/* pattern2 — tucked in the top-right corner */}
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
                    Our Joinery Process
                </h2>

                {/* Description */}
                <p className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                    As a leading joinery company in Dubai, our streamlined process
                    ensures exceptional results in every project. From concept to
                    installation, we deliver outstanding joinery works in Dubai with
                    precision, creativity, and dedication.
                </p>

                {/* Image + Accordion */}
                <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5 }}
                        className="relative lg:self-stretch"
                    >
                        {/* fixed aspect ratio on mobile/tablet (stacked layout), full height matching the accordion column on lg+ */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:w-full">
                            <Image
                                src={processImage}
                                alt="Craftsman measuring wood in our Dubai joinery workshop"
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        {/* decorative accent ring, mirrors the reference screenshot */}
                        <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 rounded-full border-2 border-[#db5e41]/70 sm:left-6 sm:top-6" />
                    </motion.div>

                    {/* Accordion */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col gap-3 sm:gap-4 cursor-pointer"
                    >
                        {steps.map((step, index) => (
                            <AccordionItem
                                key={step.title}
                                step={step}
                                isOpen={openIndex === index}
                                onToggle={() =>
                                    setOpenIndex(openIndex === index ? -1 : index)
                                }
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}