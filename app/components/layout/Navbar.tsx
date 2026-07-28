"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Works", href: "/our-works" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the fixed navbar after scrolling past 150px
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navContent = (
    <nav className="flex items-stretch justify-between bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
      {/* Nav Links */}
      <ul className="flex items-center gap-10 pl-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-block py-7 text-[18px] font-medium transition ${
                  isActive
                    ? "text-[#db5e41]"
                    : "text-[#202020] hover:text-[#db5e41]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* WhatsApp CTA with orange padding frame */}
      <div className="flex items-center bg-[#db5e41] p-3 ">
        <a
          href="https://wa.me/971527875262"
          target="_blank"
          className="flex h-full items-center gap-3 bg-[#5aa64d] px-4  text-[16px] font-semibold text-white transition hover:bg-[#4a8d41]"
        >
          <MessageCircle size={20} />
          WHATSAPP US
        </a>
      </div>
    </nav>
  );

  return (
    <>
      {/* Original navbar (shows when at the top) */}
      <div className="relative z-20 mx-auto -mb-10 max-w-[1220px] px-4">
        {navContent}
      </div>

      {/* Fixed navbar (slides in when scrolled) */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-[1220px] px-4 pt-4">
          {navContent}
        </div>
      </div>
    </>
  );
}