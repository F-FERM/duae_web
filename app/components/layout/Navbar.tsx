"use client";

import Link from "next/link";
import { MessageCircle, Menu, X, ChevronDown } from "lucide-react";
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
// ASSUMPTION: this is a separate host from your shared `api` axios instance,
// so calling it directly with fetch rather than going through `api.get`.
// If `api`'s baseURL already points at duae-api-production, swap this back to
// `api.get<ServiceTreeNode[]>("/services/tree")`.
const SERVICES_TREE_URL = "https://duae-api-production.up.railway.app/api/services/tree";

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<Set<string>>(new Set());
  const [servicesMenu, setServicesMenu] = useState<MenuItem>(fallbackServicesMenu);

  // Fetch real services tree from API to build the dropdown
  useEffect(() => {
    let cancelled = false;

    fetch(SERVICES_TREE_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch services tree: ${res.status}`);
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
    servicesMenu,   // Services (dynamic)
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
            (link.subItems && pathname.startsWith("/services") && link.href === "/services");
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
        className="flex items-center gap-2 bg-[#5aa64d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a8d41]"
      >
        <MessageCircle size={18} />
        <span className="hidden sm:inline">WHATSAPP US</span>
      </a>
    </nav>
  );

  const mobileDrawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] w-[85vw] max-w-[360px] overflow-y-auto bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-base font-semibold text-[#202020]">Menu</span>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center text-[#202020]"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col px-2 py-2">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.subItems && pathname.startsWith("/services") && link.href === "/services");
            const isOpen = openMobileGroups.has(link.href);

            return (
              <li key={link.href} className="border-b border-gray-50 last:border-b-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.subItems) e.preventDefault();
                      else setIsMobileOpen(false);
                    }}
                    className={`flex-1 px-3 py-3.5 text-[15px] font-medium transition ${
                      isActive ? "text-[#db5e41]" : "text-[#202020]"
                    }`}
                  >
                    {link.label}
                  </Link>
                  {link.subItems && (
                    <button
                      type="button"
                      onClick={() => toggleMobileGroup(link.href)}
                      aria-label={`Toggle ${link.label} submenu`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center text-[#202020]"
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {/* Level 1 accordion */}
                {link.subItems && (
                  <div
                    className={`overflow-hidden bg-gray-50 transition-[max-height] duration-300 ${
                      isOpen ? "max-h-[1200px]" : "max-h-0"
                    }`}
                  >
                    <ul className="flex flex-col py-1">
                      {link.subItems.map((subItem) => {
                        const subKey = subItem.href;
                        const isSubOpen = openMobileGroups.has(subKey);
                        return (
                          <li key={subKey}>
                            <div className="flex items-center justify-between">
                              <Link
                                href={subItem.href}
                                onClick={(e) => {
                                  if (subItem.subItems) e.preventDefault();
                                  else setIsMobileOpen(false);
                                }}
                                className="flex-1 px-6 py-3 text-sm font-medium text-[#4a4a4a]"
                              >
                                {subItem.label}
                              </Link>
                              {subItem.subItems && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileGroup(subKey)}
                                  aria-label={`Toggle ${subItem.label} submenu`}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center text-[#4a4a4a]"
                                >
                                  <ChevronDown
                                    size={16}
                                    className={`transition-transform ${isSubOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Level 2 accordion */}
                            {subItem.subItems && (
                              <div
                                className={`overflow-hidden bg-white transition-[max-height] duration-300 ${
                                  isSubOpen ? "max-h-[600px]" : "max-h-0"
                                }`}
                              >
                                <ul className="flex flex-col py-1">
                                  {subItem.subItems.map((nested) => (
                                    <li key={nested.href}>
                                      <Link
                                        href={nested.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className="block px-9 py-2.5 text-sm text-[#6b6b6b] transition hover:text-[#db5e41]"
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
        <div className="mx-auto max-w-[1220px] px-4 pt-4">
          {desktopNav}
        </div>
      </div>
    </>
  );
}