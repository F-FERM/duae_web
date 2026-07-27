"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";
import hero1 from "../../../public/images/slide1.webp";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Leading Joinery Fitout Company in Dubai, UAE",
    description:
      "We specialize in high-quality joinery and fit-out solutions in Dubai, offering turnkey projects, metal works, renovations, and bespoke upholstery.",
  },
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Premium Metal Works & Custom Fabrication",
    description:
      "From structural steel to decorative metal finishes, we deliver precision-engineered solutions built to last.",
  },
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Bespoke Upholstery for Every Space",
    description:
      "Tailored upholstery solutions that combine comfort, durability, and design to elevate any interior.",
  },
];

const SLIDE_DURATION = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, current]);

  return (
    <section className="relative -mt-10 h-[620px] w-full overflow-hidden lg:h-[760px]">
      {/* Backgrounds only — crossfade, no text here */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image.src}')` }}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-[#071423]/90 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-[18%] bg-gradient-to-l from-white/25 to-transparent" />
        </div>
      ))}

      {/* Content — single instance, animates on `current` change */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-5">
        <div className="mx-auto max-w-[900px] text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div key={current}>
              <motion.p
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 text-sm uppercase tracking-[5px] text-white/90 md:text-lg"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.h1
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-4xl font-bold leading-tight md:text-6xl"
              >
                {slides[current].title}
              </motion.h1>

              <motion.p
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mx-auto mt-8 max-w-[900px] text-base leading-8 text-white/90 md:text-2xl"
              >
                {slides[current].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <a
              href="tel:+971527875262"
              className="flex h-16 items-center gap-3 bg-[#db5e41] px-10 text-lg font-semibold text-white transition hover:bg-[#c74f34]"
            >
              <Phone size={22} />
              TALK TO US
            </a>

            <a
              href="https://wa.me/971527875262"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 items-center gap-3 bg-[#5aa64d] px-10 text-lg font-semibold text-white transition hover:bg-[#4a8d41]"
            >
              <MessageCircle size={22} />
              WHATSAPP US
            </a>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-black"
      >
        <ChevronLeft size={36} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-black"
      >
        <ChevronRight size={36} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              index === current ? "w-6 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}