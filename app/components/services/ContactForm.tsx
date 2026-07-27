"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, FormEvent } from "react";

export default function ContactFormSection() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: wire this up to your actual submit endpoint / API route.
        console.log("Form submitted:", formData);
    };

    return (
        <section className="bg-white py-16 sm:py-20 md:py-28">
            <div className="mx-auto max-w-[1220px] px-4">
                <div className="grid grid-cols-1 border border-gray-200 lg:grid-cols-2">
                    {/* Left column — info panel */}
                    <div className="relative overflow-hidden border-b border-gray-200 p-6 sm:p-15 lg:border-b-0 lg:border-r">
                        {/* Decorative corner shape */}
                        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44">
                            <div className="absolute h-40 w-40 rounded-full bg-[#eeb7a4]" />
                            <div className="absolute left-8 top-10 h-30 w-30 rounded-full bg-[#db5e41]" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center ">
                                Need Expert Joinery Services in Dubai?
                            </h2>

                            <p className="mx-auto mt-10 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                                We&apos;re here to help you create joinery that truly fits
                                your space and style. Whether it&apos;s custom furniture,
                                wardrobes, doors, kitchens, or office fittings – our skilled
                                craftsmen turn your ideas into reality. With quality
                                materials and careful attention to detail, we make sure
                                every piece is built to last and designed to impress.
                            </p>

                            <motion.div>
                                <motion.a
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.25 }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    href="https://wa.me/971527875262"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative mt-8 flex h-14 w-fit items-center overflow-hidden bg-[#5aa64d] px-8 text-sm font-bold tracking-wide text-white md:text-base"
                                >
                                    <span className="absolute inset-0 translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                                    <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black">
                                        <MessageCircle size={20} />
                                        WHATSAPP US
                                    </span>
                                </motion.a>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right column — form */}
                    <form onSubmit={handleSubmit} className="flex flex-col p-6 sm:p-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:border-r-0"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="border border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41]"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-t-0 border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41]"
                        />

                        <textarea
                            name="message"
                            placeholder="Type Messages"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="resize-y border border-t-0 border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41]"
                        />

                        <button
                            type="submit"
                            className="mt-4 w-full bg-[#453a30] py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#db5e41] sm:text-base"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}