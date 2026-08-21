"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceTreeChild {
  _id: string;
  title: string;
  slug: string;
}

interface ServiceTreeNode {
  _id: string;
  title: string;
  slug: string;
  children: ServiceTreeChild[];
}

interface NavSubItem {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

interface MenuItem {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

// ─── Static nav links (non-services) ─────────────────────────────────────────

const staticLinks: Omit<MenuItem, "subItems">[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Works", href: "/our-works" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

// ─── API endpoint ─────────────────────────────────────────────────────────────

const SERVICES_TREE_URL = "https://api.wwduae.com/api/services/tree";

// ─── Build the Services menu entry from the tree API data ────────────────────

function buildServicesMenu(tree: ServiceTreeNode[]): MenuItem {
  const subItems: NavSubItem[] = tree.map((parent) => {
    const entry: NavSubItem = {
      label: parent.title,
      href: `/services/${parent.slug}`,
    };

    if (parent.children && parent.children.length > 0) {
      entry.subItems = parent.children.map((child) => ({
        label: child.title,
        href: `/services/${child.slug}`,
      }));
    }

    return entry;
  });

  return {
    label: "Services",
    href: "/services",
    subItems,
  };
}

// ─── Fallback services nav (shown while loading or on API error) ──────────────

const fallbackServicesMenu: MenuItem = {
  label: "Services",
  href: "/services",
  subItems: [
    { label: "Joinery", href: "/services/joinery" },
    { label: "Fit-Out Solutions", href: "/services/fitout-solutions" },
    { label: "Turnkey Solutions", href: "/services/turnkey-solutions" },
    { label: "Renovation Services", href: "/services/renovation-services" },
    { label: "Metal Works", href: "/services/metal-works" },
    { label: "Upholstery", href: "/services/upholstery" },
  ],
};

// ─── Social icons (inline SVG to avoid extra deps) ───────────────────────────

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PinterestIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<Set<string>>(
    new Set(),
  );
  const [servicesMenu, setServicesMenu] =
    useState<MenuItem>(fallbackServicesMenu);

  // Fetch real services tree from API to build the dropdown
  useEffect(() => {
    let cancelled = false;

    fetch(SERVICES_TREE_URL)
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch services tree: ${res.status}`);
        return res.json() as Promise<ServiceTreeNode[]>;
      })
      .then((tree) => {
        if (cancelled) return;
        if (Array.isArray(tree) && tree.length > 0) {
          setServicesMenu(buildServicesMenu(tree));
        }
      })
      .catch(() => {
        // Keep fallback on error — already set as default state
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close the mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenMobileGroups(new Set());
  }, [pathname]);

  // Build final nav links array with Services injected at position 2
  const navLinks: MenuItem[] = [
    staticLinks[0], // Home
    staticLinks[1], // About Us
    servicesMenu, // Services (dynamic)
    staticLinks[2], // Our Works
    staticLinks[3], // Blogs
    staticLinks[4], // Contact Us
  ];

  const toggleMobileGroup = (key: string) => {
    setOpenMobileGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const desktopNav = (
    <nav className="hidden items-stretch justify-between bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] lg:flex">
      {/* Nav Links */}
      <ul className="flex items-center gap-6 pl-6 xl:gap-10 xl:pl-8">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.subItems &&
              pathname.startsWith("/services") &&
              link.href === "/services");
          return (
            <li key={link.href} className="group relative">
              <Link
                href={link.href}
                onClick={(e) => {
                  if (link.subItems) {
                    e.preventDefault();
                  }
                }}
                className={`inline-block py-7 text-[16px] font-medium transition xl:text-[18px] ${
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
                      <li
                        key={subItem.href}
                        className="group/sub relative transition-colors hover:bg-[#db5e41]"
                      >
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
                                <li
                                  key={nested.href}
                                  className="group/nested transition-colors hover:bg-[#db5e41]"
                                >
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

      {/* WhatsApp CTA */}
      <div className="flex items-center bg-[#db5e41] p-3">
        <a
          href="https://wa.me/+971565066845"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center gap-3 bg-[#5aa64d] px-4 text-[16px] font-semibold text-white transition hover:bg-[#4a8d41]"
        >
          <MessageCircle size={20} />
          WHATSAPP US
        </a>
      </div>
    </nav>
  );

  const mobileBar = (
    <nav className="flex items-center justify-between bg-white px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] lg:hidden">
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center text-[#202020]"
      >
        <Menu size={26} />
      </button>

      <a
        href="https://wa.me/+971565066845"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#db5e41] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c4512e]"
      >
        <div
          className="flex items-center gap-2 bg-[#5aa64d] px-3 py-1.5 -mx-4 -my-2.5 h-full transition hover:bg-[#4a8d41]"
          style={{ margin: "-10px -16px", padding: "10px 16px" }}
        >
          <MessageCircle size={18} />
          <span>WHATSAPP US</span>
        </div>
      </a>
    </nav>
  );

  const mobileDrawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in panel — dark navy background matching screenshots */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] flex w-[85vw] max-w-[360px] flex-col overflow-y-auto bg-[#0f1623] shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header with logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center text-white/80 transition hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <ul className="flex flex-col border-b border-white/10">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.subItems &&
                pathname.startsWith("/services") &&
                link.href === "/services");
            const isOpen = openMobileGroups.has(link.href);

            return (
              <li
                key={link.href}
                className="border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.subItems) e.preventDefault();
                      else setIsMobileOpen(false);
                    }}
                    className={`flex-1 px-5 py-4 text-[15px] font-medium tracking-wide transition ${
                      isActive
                        ? "text-[#db5e41]"
                        : "text-white hover:text-[#db5e41]"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.subItems && (
                    <button
                      type="button"
                      onClick={() => toggleMobileGroup(link.href)}
                      aria-label={`Toggle ${link.label} submenu`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center text-white/70 transition hover:text-white"
                    >
                      {/* Arrow icon: ChevronRight when closed, ChevronDown when open */}
                      {isOpen ? (
                        <ChevronDown size={18} className="text-[#db5e41]" />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                  )}
                </div>

                {/* Level 1 accordion */}
                {link.subItems && (
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ${
                      isOpen ? "max-h-[1200px]" : "max-h-0"
                    }`}
                  >
                    <ul className="flex flex-col border-t border-white/10 bg-[#0a0f1a]">
                      {link.subItems.map((subItem) => {
                        const subKey = subItem.href;
                        const isSubOpen = openMobileGroups.has(subKey);
                        return (
                          <li
                            key={subKey}
                            className="border-b border-white/10 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={subItem.href}
                                onClick={(e) => {
                                  if (subItem.subItems) e.preventDefault();
                                  else setIsMobileOpen(false);
                                }}
                                className="flex-1 px-7 py-3.5 text-sm font-medium text-white/70 transition hover:text-[#db5e41]"
                              >
                                {subItem.label}
                              </Link>
                              {subItem.subItems && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileGroup(subKey)}
                                  aria-label={`Toggle ${subItem.label} submenu`}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center text-white/50 transition hover:text-white"
                                >
                                  {isSubOpen ? (
                                    <ChevronDown
                                      size={15}
                                      className="text-[#db5e41]"
                                    />
                                  ) : (
                                    <ChevronRight size={15} />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Level 2 accordion */}
                            {subItem.subItems && (
                              <div
                                className={`overflow-hidden transition-[max-height] duration-300 ${
                                  isSubOpen ? "max-h-[600px]" : "max-h-0"
                                }`}
                              >
                                <ul className="flex flex-col border-t border-white/10 bg-[#060a12]">
                                  {subItem.subItems.map((nested) => (
                                    <li
                                      key={nested.href}
                                      className="border-b border-white/10 last:border-b-0"
                                    >
                                      <Link
                                        href={nested.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className="block px-10 py-3 text-sm text-white/50 transition hover:text-[#db5e41]"
                                      >
                                        {nested.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Contact info + social links at the bottom of drawer */}
        <div className="mt-auto px-5 pb-8 pt-6">
          {/* Email */}
          <a
            href="mailto:info@wwduae.ae"
            className="mb-3 flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#db5e41]">
              <Mail size={15} />
            </span>
            info@wwduae.ae
          </a>

          {/* Phone */}
          <a
            href="tel:+971527875262"
            className="mb-6 flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#db5e41]">
              <Phone size={15} />
            </span>
            +971 52 787 5262
          </a>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Original navbar (shows when at the top) */}
      <div className="relative z-20 mx-auto -mb-10 max-w-[1220px] px-4">
        {desktopNav}
        {mobileBar}
      </div>
      {mobileDrawer}

      {/* Fixed navbar (slides in when scrolled) */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 w-full transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-[1220px] px-4 pt-4">{desktopNav}</div>
      </div>
    </>
  );
}
