"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const PHONE_NUMBER = "+971527875262";
const WHATSAPP_NUMBER = "https://api.whatsapp.com/send?phone=971527875262&text=Hi%20Wood%20World%20Decor%2C%20I%20would%20like%20to%20schedule%20a%20consultation."; // no leading +

export default function FloatingButtons() {
    return (
        <>
            {/* ── Left bottom: Phone ── */}
            <a
                href={`tel:${PHONE_NUMBER}`}
                aria-label="Call us"
                className="
          group
          fixed bottom-6 left-5 z-[9999]
          flex h-[52px] w-[52px] items-center justify-center
          rounded-full bg-[#EA580C] text-white shadow-[0_6px_24px_rgba(234,88,12,0.45)]
          transition-all duration-300
          hover:scale-110 hover:shadow-[0_10px_32px_rgba(234,88,12,0.6)]
          sm:h-[56px] sm:w-[56px]
        "
            >
                {/* Pulse ring */}
                <span className="
          pointer-events-none absolute inset-0 rounded-full
          animate-ping bg-[#EA580C]/40
          group-hover:animate-none
        " />
                <Phone size={22} strokeWidth={2} className="relative z-10" />
            </a>

            {/* ── Right bottom: WhatsApp ── */}
            <a
                href={WHATSAPP_NUMBER}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="
          group
          fixed bottom-6 right-5 z-[9999]
          flex h-[52px] w-[52px] items-center justify-center
          rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)]
          transition-all duration-300
          hover:scale-110 hover:shadow-[0_10px_32px_rgba(37,211,102,0.6)]
          sm:h-[56px] sm:w-[56px]
        "
            >
                {/* Pulse ring */}
                <span className="
          pointer-events-none absolute inset-0 rounded-full
          animate-ping bg-[#25D366]/40
          group-hover:animate-none
        " />
                <FaWhatsapp size={24} className="relative z-10" />
            </a>
        </>
    );
}
