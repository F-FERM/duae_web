"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Phone, MessageCircle } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import hero1 from "../../../public/images/slide1.webp";
import { AnimatePresence, motion } from "framer-motion";

import api from "@/lib/axios";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface Slide {
  image: string | StaticImageData;
  subtitle: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  wpButtonText?: string;
  wpButtonLink?: string;
  isActive?: boolean;
  order?: number;
  alt?: string;
  inlineLinks?: InlineLink[];
}

// Fallback slides, only used if the API call fails or returns nothing
const defaultSlides: Slide[] = [
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Leading Joinery Fitout Company in Dubai, UAE",
    description:
      "We specialize in high-quality joinery and fit-out solutions in Dubai, offering turnkey projects, metal works, renovations, and bespoke upholstery.",
    buttonText: "TALK TO US",
    buttonLink: "tel:+971565066845",
    wpButtonText: "WHATSAPP US",
    wpButtonLink: "971527875262",
  },
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Premium Metal Works & Custom Fabrication",
    description:
      "From structural steel to decorative metal finishes, we deliver precision-engineered solutions built to last.",
    buttonText: "TALK TO US",
    buttonLink: "tel:+971565066845",
    wpButtonText: "WHATSAPP US",
    wpButtonLink: "971527875262",
  },
  {
    image: hero1,
    subtitle: "WOOD WORLD DECOR LLC",
    title: "Bespoke Upholstery for Every Space",
    description:
      "Tailored upholstery solutions that combine comfort, durability, and design to elevate any interior.",
    buttonText: "TALK TO US",
    buttonLink: "tel:+971565066845",
    wpButtonText: "WHATSAPP US",
    wpButtonLink: "971527875262",
  },
];

const SLIDE_DURATION = 5000;

function HeroSkeleton() {
  return (
    <section className="relative -mt-10 h-[440px] w-full overflow-hidden bg-[#0b1a2b] xs:h-[480px] sm:h-[560px] md:h-[620px] lg:h-[700px] xl:h-[760px]">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#0b1a2b] via-[#132538] to-[#0b1a2b]" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-6 md:px-8 lg:px-5">
        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-4 text-center">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/15 sm:h-4 sm:w-56" />
          <div className="h-8 w-4/5 animate-pulse rounded-md bg-white/15 sm:h-10 md:h-12" />
          <div className="h-8 w-3/5 animate-pulse rounded-md bg-white/15 sm:h-10 md:h-12" />
          <div className="mt-4 h-4 w-11/12 animate-pulse rounded-md bg-white/10 sm:h-5" />
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-white/10 sm:h-5" />

          <div className="mt-6 flex w-full flex-col items-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
            <div className="h-12 w-full animate-pulse rounded-full bg-white/15 sm:h-14 sm:w-40" />
            <div className="h-12 w-full animate-pulse rounded-full bg-white/15 sm:h-14 sm:w-44" />
          </div>
        </div>
      </div>

      {/* Dots placeholder */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2 md:bottom-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-pulse rounded-full bg-white/30 sm:h-2.5 sm:w-2.5"
          />
        ))}
      </div>
    </section>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const IMAGE_ALT =
    "Interior fit out company in Dubai – craftsman sanding custom-made furniture";

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get<Slide[]>("/home-hero/slides");
        const activeSlides = res.data
          .filter((s) => s.isActive)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setSlides(activeSlides.length > 0 ? activeSlides : defaultSlides);
      } catch (err) {
        console.error("Failed to fetch hero slides:", err);
        setSlides(defaultSlides);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide, current, slides.length]);

  if (isLoading) return <HeroSkeleton />;
  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative -mt-10 h-[440px] w-full overflow-hidden xs:h-[480px] sm:h-[560px] md:h-[620px] lg:h-[700px] xl:h-[760px]">
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
            style={{
              backgroundImage: `url('${
                typeof slide.image === "string" ? slide.image : slide.image.src
              }')`,
            }}
            role="img"
            aria-label={IMAGE_ALT}
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-[#071423]/90 to-transparent sm:w-[55%] md:w-[40%]" />
          <div className="absolute right-0 top-0 hidden h-full w-[18%] bg-gradient-to-l from-white/25 to-transparent sm:block" />
        </div>
      ))}

      {/* Content — single instance, animates on `current` change */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-6 md:px-8 lg:px-5">
        <div className="mx-auto max-w-[900px] text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtitle - now with inline links support */}
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-3 text-[11px] uppercase tracking-[3px] text-white/90 sm:mb-4 sm:text-sm sm:tracking-[4px] md:mb-6 md:text-base lg:text-lg lg:tracking-[5px]"
              >
                <InlineLinkedText
                  text={slides[current].title}
                  links={slides[current].inlineLinks || []}
                  linkClassName="inline-block cursor-pointer font-semibold text-white/90 underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#071423] rounded"
                />
              </motion.div>

              {/* Title - with inline links support */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              >
                <InlineLinkedText
                  text={slides[current].subtitle}
                  links={slides[current].inlineLinks || []}
                  linkClassName="inline-block cursor-pointer font-bold text-white underline decoration-white/30 underline-offset-8 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#071423] rounded"
                />
              </motion.div>

              {/* Description - with inline links support */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mx-auto mt-4 max-w-[900px] text-sm leading-6 text-white/90 sm:mt-6 sm:text-base sm:leading-7 md:mt-8 md:text-lg md:leading-8 lg:text-xl xl:text-2xl"
              >
                <InlineLinkedText
                  text={slides[current].description}
                  links={slides[current].inlineLinks || []}
                  linkClassName="inline-block cursor-pointer font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 focus:ring-offset-[#071423] rounded"
                />
              </motion.div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:gap-5 md:mt-12">
                <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
                  {/* Call */}
                  {slides[current].buttonText && (
                    <motion.a
                      initial={{ y: 70, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 70, opacity: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.55,
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      href={slides[current].buttonLink || "tel:+971565066845"}
                      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-[#db5e41] px-6 text-sm font-semibold text-white shadow-lg shadow-[#db5e41]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#db5e41]/30 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                    >
                      <span className="absolute inset-0 -translate-x-full rounded-full bg-black transition-transform duration-500 ease-out group-hover:translate-x-0" />

                      <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                        <Phone size={18} className="sm:h-5 sm:w-5" />
                        {slides[current].buttonText}
                      </span>
                    </motion.a>
                  )}

                  {/* WhatsApp */}
                  {slides[current].wpButtonText && (
                    <motion.a
                      initial={{ y: 70, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 70, opacity: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.7,
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      href={
                        slides[current].wpButtonLink
                          ? slides[current].wpButtonLink.startsWith("+")
                            ? `https://wa.me/${slides[current].wpButtonLink.replace("+", "")}`
                            : slides[current].wpButtonLink.startsWith("http")
                              ? slides[current].wpButtonLink
                              : `https://wa.me/${slides[current].wpButtonLink}`
                          : "https://wa.me/971527875262"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full bg-[#5aa64d] px-6 text-sm font-semibold text-white shadow-lg shadow-[#5aa64d]/20 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#5aa64d]/30 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                    >
                      <span className="absolute inset-0 translate-x-full rounded-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />

                      <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black sm:gap-3">
                        <MessageCircle size={18} className="sm:h-5 sm:w-5" />
                        {slides[current].wpButtonText}
                      </span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-black sm:left-4 sm:h-11 sm:w-11 md:left-5 md:h-14 md:w-14"
      >
        <ChevronLeft size={20} className="sm:hidden" />
        <ChevronLeft size={28} className="hidden sm:block md:hidden" />
        <ChevronLeft size={36} className="hidden md:block" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-white/40 bg-white/10 text-white transition hover:bg-white hover:text-black sm:right-4 sm:h-11 sm:w-11 md:right-5 md:h-14 md:w-14"
      >
        <ChevronRight size={20} className="sm:hidden" />
        <ChevronRight size={28} className="hidden sm:block md:hidden" />
        <ChevronRight size={36} className="hidden md:block" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2 md:bottom-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all sm:h-2.5 ${
              index === current
                ? "w-5 bg-white sm:w-6"
                : "w-2 bg-white/50 sm:w-2.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
