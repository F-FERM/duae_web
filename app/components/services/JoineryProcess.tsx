"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import api from "@/lib/axios";
import processImage from "../../../public/images/joinery13.webp";
import imagepattern1 from "../../../public/images/patter3.png";
import pattern2 from "../../../public/images/pattern4.png";
import { useServiceAltText } from "@/app/(web)/services/useServiceAltText";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ProcessStepApi {
  step: string;
  title: string;
  description: string;
  icon: string;
  inlineLinks?: InlineLink[];
}

interface ProcessApi {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  steps: ProcessStepApi[];
  inlineLinks?: InlineLink[];
}

interface ServiceDetailApiResponse {
  process: ProcessApi;
}

interface OurProcessData {
  title: string;
  description: string;
  image?: string;
  alt?: string;
  steps: ProcessStepApi[];
  inlineLinks?: InlineLink[];
}

const defaultData: OurProcessData = {
  title: "Our Fit-Out Process",
  description:
    "Our streamlined process ensures exceptional results in every project. From consultation to handover, we deliver outstanding solutions with precision and dedication.",
  image: "",
  alt: "",
  inlineLinks: [],
  steps: [
    {
      step: "01",
      title: "Project Consultation & Briefing",
      description:
        "You share your goals and ideas, and our team listens - defining your requirements and vision.",
      icon: "",
      inlineLinks: [],
    },
    {
      step: "02",
      title: "Design & Material Planning",
      description:
        "Our designers sketch layouts and shortlist materials suited to your space and budget.",
      icon: "",
      inlineLinks: [],
    },
    {
      step: "03",
      title: "Quotation & Approval",
      description:
        "We prepare a transparent, itemized quotation covering materials, labor, and timelines.",
      icon: "",
      inlineLinks: [],
    },
    {
      step: "04",
      title: "Execution & Installation",
      description:
        "Our skilled team executes all works with precision, quality, and attention to detail.",
      icon: "",
      inlineLinks: [],
    },
  ],
};

function AccordionItem({
  step,
  isOpen,
  onToggle,
}: {
  step: ProcessStepApi;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center cursor-pointer justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span
          className={`text-[22px] font-bold sm:text-[22px] ${
            isOpen ? "text-[#db5e41]" : "text-[#0c1526]"
          }`}
        >
          {step.title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
            isOpen ? "bg-[#db5e41] text-white" : "bg-[#f6edea] text-[#0c1526]"
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
            <div className="px-5 pb-5 text-[17px] leading-7 text-gray-600 sm:px-6 sm:pb-6 sm:text-[18px]">
              <InlineLinkedText
                text={step.description}
                links={step.inlineLinks || []}
                linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OurProcessSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-20 md:py-28">
      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="mx-auto h-9 w-64 animate-pulse rounded-md bg-white/60" />
        <div className="mx-auto mt-3 h-4 w-3/4 max-w-[700px] animate-pulse rounded-md bg-white/60" />

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-2 lg:gap-10">
          <div className="aspect-[4/3] w-full animate-pulse bg-gray-300 sm:aspect-[16/11] lg:aspect-auto lg:h-full" />
          <div className="flex flex-col gap-3 sm:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 w-full animate-pulse bg-white" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OurProcess({ slug }: { slug: string }) {
  const [data, setData] = useState<OurProcessData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0);
  const altText = useServiceAltText(slug);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );
        setData({
          title: res.data.process.title,
          description: res.data.process.description,
          image: res.data.process.image || "",
          alt: res.data.process.alt || "",
          steps: res.data.process.steps.map((step) => ({
            ...step,
            inlineLinks: step.inlineLinks || [],
          })),
          inlineLinks: res.data.process.inlineLinks || [],
        });
      } catch (err) {
        console.error("Failed to fetch process section:", err);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchServiceDetail();
  }, [slug]);

  if (isLoading) return <OurProcessSkeleton />;

  const imageToUse = data.image || processImage;
  const imageAlt = data.alt || "Our process - Wood World Decor";

  return (
    <section className="relative overflow-hidden bg-[#f6edea] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={imagepattern1}
            alt={altText}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-0 opacity-80">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -12, 0, 12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={pattern2}
            alt={altText}
            priority
            className="object-cover"
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1220px] px-4">
        <div className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
          <InlineLinkedText
            text={data.title}
            links={data.inlineLinks || []}
            linkClassName="inline-block cursor-pointer font-bold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
          />
        </div>

        <div className="mx-auto mt-3 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg text-center max-w-3xl">
          <InlineLinkedText
            text={data.description}
            links={data.inlineLinks || []}
            linkClassName="inline-block cursor-pointer font-medium text-gray-600 underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-2 lg:gap-10 lg:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative lg:self-stretch"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:w-full">
              <Image
                src={
                  typeof imageToUse === "string" ? imageToUse : imageToUse.src
                }
                alt={imageAlt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 rounded-full border-2 border-[#db5e41]/70 sm:left-6 sm:top-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3 sm:gap-4 cursor-pointer"
          >
            {data.steps.map((step, index) => (
              <AccordionItem
                key={step.step}
                step={step}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
