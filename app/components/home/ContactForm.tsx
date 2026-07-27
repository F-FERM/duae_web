"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState, FormEvent } from "react";

const contactItems = [
    {
        icon: Phone,
        label: "Phone Number",
        lines: ["+971 52 787 5262", "+971 56 506 6845"],
    },
    {
        icon: Mail,
        label: "Mail",
        lines: ["info@wwduae.ae"],
    },
    {
        icon: MapPin,
        label: "Address",
        lines: ["Al Quoz Industrial Area 1, Dubai, UAE"],
    },
];

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
        <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
            <div className="mx-auto max-w-[1220px] px-4 sm:px-6">
                <div className="grid grid-cols-1 border border-gray-200 lg:grid-cols-2">
                    {/* Left column — info panel */}
                    <div className="relative overflow-hidden border-b border-gray-200 p-6 sm:p-10 md:p-14 lg:border-b-0 lg:border-r">
                        {/* Decorative corner shape */}
                        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 sm:-left-14 sm:-top-14 sm:h-36 sm:w-36 md:-left-16 md:-top-16 md:h-44 md:w-44">
                            <div className="absolute h-full w-full rounded-full bg-[#eeb7a4]" />
                            <div className="absolute left-[22%] top-[26%] h-[70%] w-[70%] rounded-full bg-[#db5e41]" />
                        </div>

                        <div className="relative">
                            <h2 className="text-2xl font-bold leading-tight text-[#0c1526] sm:text-3xl md:text-4xl lg:text-[2.5rem]">
                                Create your dream space with us. Get Started Now!
                            </h2>

                            <div className="mt-8 flex flex-col sm:mt-10">
                                {contactItems.map(({ icon: Icon, label, lines }, i) => (
                                    <div
                                        key={label}
                                        className={`flex items-start gap-4 py-4 sm:py-5 ${i !== 0 ? "border-t border-gray-200" : ""
                                            }`}
                                    >
                                        <span className="flex h-18 w-18 flex-none items-center justify-center rounded-full bg-[#453a30] sm:h-18 sm:w-18">
                                            <Icon
                                                size={22}
                                                className="text-white"
                                                strokeWidth={2}
                                            />
                                        </span>
                                        <div className="min-w-0 pt-1">
                                            <p className="text-[16px] text-gray-500 sm:text-[18px]">
                                                {label}
                                            </p>
                                            {lines.map((line) => (
                                                <p
                                                    key={line}
                                                    className="break-words text-[16px] font-semibold text-[#0c1526] sm:text-[18px]"
                                                >
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column — form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col p-6 sm:p-8 md:p-10"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4 sm:border-r-0"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="border border-t-0 border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4 sm:border-t-0"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-t-0 border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4"
                        />

                        <textarea
                            name="message"
                            placeholder="Type Messages"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="resize-y border border-t-0 border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4"
                        />

                        <button
                            type="submit"
                            className="mt-8 w-full bg-[#453a30] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#db5e41] sm:py-4 sm:text-base"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}