"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axios";

interface FAQItemApi {
  question: string;
  answer: string;
}

interface ServiceDetailApiResponse {
  faqs: FAQItemApi[];
}

const defaultFaqs: FAQItemApi[] = [
  { question: "What services do fit-out contractors provide?", answer: "Fit-out contractors handle interior design, construction, joinery, electrical installations, flooring, painting, and finishing touches." },
  { question: "Can you customize designs for my space?", answer: "Yes, we create tailor-made interiors that combine style, functionality, and innovation to reflect your unique vision and requirements." },
  { question: "Do you provide turnkey fit-out solutions?", answer: "Yes, we deliver complete turnkey solutions, managing every stage of your project from concept design to final execution." },
];

function FAQSkeleton() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="h-8 w-72 animate-pulse rounded-md bg-gray-200 sm:h-9" />

        <div className="mt-8 flex flex-col gap-3 sm:mt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function FAQSection({ slug }: { slug: string }) {
  const [faqs, setFaqs] = useState<FAQItemApi[]>(defaultFaqs);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`
        );
        setFaqs(res.data.faqs);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
        setFaqs(defaultFaqs);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (isLoading) return <FAQSkeleton />;

  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <h2 className="text-2xl font-bold text-[#0c1526] sm:text-3xl md:text-4xl">
          Frequently Asked Questions and Answers
        </h2>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors duration-300 sm:px-6 sm:py-5 ${
                    isOpen
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
                    className={`shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
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