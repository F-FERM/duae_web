"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What types of projects do you handle?",
        answer:
            "We provide complete joinery works in Dubai for residential, commercial, and hospitality spaces, from small custom pieces to large-scale fit-outs.",
    },
    {
        question: "Do you offer custom furniture design?",
        answer:
            "Yes, every piece of furniture we build is designed around your space, style, and functional needs, from concept sketches to the finished product.",
    },
    {
        question: "What materials do you use in your joinery services?",
        answer:
            "We work with a wide range of hardwoods, softwoods, engineered woods, laminates, veneers, and specialty finishes to suit any budget and design vision.",
    },
    {
        question: "Can you handle both modern and traditional designs?",
        answer:
            "Absolutely. Our team is experienced across a full spectrum of styles, from sleek contemporary interiors to intricate traditional detailing.",
    },
    {
        question: "Do you offer joinery services for commercial spaces?",
        answer:
            "Yes, we deliver joinery solutions for offices, retail stores, showrooms, and other commercial spaces, including reception counters and fit-outs.",
    },
    {
        question: "How long does a typical joinery project take?",
        answer:
            "Timelines vary depending on scope and complexity, but most projects are completed within a few weeks to a few months, and we always confirm a clear schedule upfront.",
    },
    {
        question: "Do you provide installation along with fabrication?",
        answer:
            "Yes, our service covers everything from fabrication in our workshop to professional on-site installation by our own skilled team.",
    },
    {
        question: "Can you create bespoke joinery for hotels and restaurants?",
        answer:
            "Yes, we regularly design and build bespoke joinery for the hospitality sector, including bars, reception desks, seating, and feature walls.",
    },
    {
        question: "Why should I choose your company for joinery in Dubai?",
        answer:
            "With over 10 years of experience, skilled craftsmen, premium materials, and a proven track record, we deliver reliable, high-quality joinery on time.",
    },
    {
        question: "Do you offer eco-friendly joinery options?",
        answer:
            "Yes, we offer sustainable wood and finish options for clients who want their joinery to reflect both quality and environmental responsibility.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className="bg-white py-16 sm:py-20 md:py-28">
            <div className="mx-auto max-w-[1220px] px-4">
                {/* Heading */}
                <h2 className="text-2xl font-bold text-[#0c1526] sm:text-3xl md:text-4xl">
                    Frequently Asked Questions and Answers
                </h2>

                {/* Accordion */}
                <div className="mt-8 flex flex-col gap-3 sm:mt-10">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={faq.question} className="overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 sm:px-6 sm:py-5 ${isOpen
                                            ? "bg-[#0c1526] text-white"
                                            : "bg-[#e8e5e1] text-[#0c1526] hover:bg-[#ddd9d4]"
                                        }`}
                                >
                                    <span className="text-sm font-bold sm:text-base md:text-lg">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        strokeWidth={2.5}
                                        className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            key="content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="bg-white"
                                        >
                                            <p className="px-4 pb-5 pt-4 text-sm leading-7 text-gray-600 sm:px-6 sm:text-base">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}