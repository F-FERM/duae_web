"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type SubMenu = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  href: string;
  subItems?: {
    label: string;
    href: string;
    subItems?: SubMenu[];
  }[];
};

const navLinks: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    subItems: [
      { label: "Joinery", href: "/services/joinery" },
      {
        label: "Fit-Out",
        href: "/services/fitout-solutions",
        subItems: [
          { label: "Commercial Fit-Out", href: "/services/commercial-fit-out" },
          { label: "Residential Fit-Out", href: "/services/residential-fit-out" },
        ],
      },
      { label: "Turnkey Fit-Out", href: "/services/turnkey-solutions" },
      {
        label: "Renovation",
        href: "/services/renovation-services",
        subItems: [
          { label: "Villa Renovation", href: "/services/villa-renovations" },
          { label: "Apartment Renovation", href: "/services/apartment-renovations" },
          { label: "Home Renovation", href: "/services/home-renovation" },
          { label: "Kitchen Renovation", href: "/services/kitchen-renovation" },
          { label: "Bathroom Renovation", href: "/services/bathroom-renovation" },
        ],
      },
      { label: "Metal Works", href: "/services/metal-works" },
      { label: "Upholstery", href: "/services/upholstery" },
    ],
  },
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
          const isActive = pathname === link.href || (link.subItems && pathname.startsWith(link.href));
          return (
            <li key={link.href} className="group relative">
              <Link
                href={link.href}
                onClick={(e) => {
                  if (link.subItems) {
                    e.preventDefault();
                  }
                }}
                className={`inline-block py-7 text-[18px] font-medium transition ${
                  isActive
                    ? "text-[#db5e41]"
                    : "text-[#202020] hover:text-[#db5e41]"
                }`}
              >
                {link.label}
              </Link>

              {/* Level 1 Dropdown */}
              {link.subItems && (
                <div className="absolute left-0 top-full z-50 hidden w-[240px] bg-white py-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group-hover:block">
                  <ul className="flex flex-col">
                    {link.subItems.map((subItem) => (
                      <li key={subItem.href} className="group/sub relative transition-colors hover:bg-[#db5e41]">
                        <Link
                          href={subItem.href}
                          className="block px-6 py-3.5 text-[15px] font-medium text-[#202020] transition-colors group-hover/sub:text-white"
                        >
                          {subItem.label}
                        </Link>
                        
                        {/* Level 2 Dropdown */}
                        {subItem.subItems && (
                          <div className="absolute left-full -top-3 z-50 hidden w-[240px] bg-white py-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] group-hover/sub:block">
                            <ul className="flex flex-col">
                              {subItem.subItems.map((nested) => (
                                <li key={nested.href} className="group/nested transition-colors hover:bg-[#db5e41]">
                                  <Link
                                    href={nested.href}
                                    className="block px-6 py-3.5 text-[15px] font-medium text-[#202020] transition-colors group-hover/nested:text-white"
                                  >
                                    {nested.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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