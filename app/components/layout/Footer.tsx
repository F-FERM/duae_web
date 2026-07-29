import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaXTwitter,
  FaPinterest,
} from "react-icons/fa6";

import footerBg from "../../../public/images/site-footer-bg.jpg";

const API_BASE = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

/* -------------------------------------------------------------------------- */
/*  Types — mirror the API response shape                                     */
/* -------------------------------------------------------------------------- */

interface LinkItem {
  label: string;
  url: string;
  order: number;
  _id: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  order: number;
  _id: string;
}

interface FooterData {
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  logo: string;
  logoAlt: string;
  servicesTitle: string;
  services: LinkItem[];
  quickLinksTitle: string;
  quickLinks: LinkItem[];
  socialTitle: string;
  socialLinks: SocialLink[];
  email: string;
  phone1: string;
  phone2?: string;
  address: string;
  creditText: string;
  creditLink: string;
  bottomLinks: LinkItem[];
  isActive: boolean;
}

/* Map platform name -> icon component. lucide-react dropped all brand/logo
   icons in its v1 line, so brand icons come from react-icons/fa6 instead;
   Globe (lucide) is the fallback for anything not explicitly mapped. */
type SocialIconComponent = ComponentType<{ size?: number; className?: string }>;

const SOCIAL_ICON_MAP: Record<string, SocialIconComponent> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  pinterest: FaPinterest,
};

function getSocialIcon(platform: string): SocialIconComponent {
  return SOCIAL_ICON_MAP[platform.toLowerCase()] ?? Globe;
}

async function getFooterData(): Promise<FooterData | null> {
  try {
    const res = await fetch(`${API_BASE}/footer`, {
      // Use ISR to allow static building while keeping data fresh (e.g., revalidate every 60s)
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[Footer] API returned ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("[Footer] Failed to fetch footer data:", err);
    return null;
  }
}

export default async function Footer() {
  const data = await getFooterData();

  if (!data) return null;

  const sortedServices = [...data.services].sort((a, b) => a.order - b.order);
  const sortedQuickLinks = [...data.quickLinks].sort((a, b) => a.order - b.order);
  const sortedSocialLinks = [...data.socialLinks].sort((a, b) => a.order - b.order);
  const sortedBottomLinks = [...data.bottomLinks].sort((a, b) => a.order - b.order);

  return (
    <footer
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${footerBg.src})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#241f1d]/95" />

      <div className="relative z-10">
        {/* ========================= */}
        {/* Main Footer               */}
        {/* ========================= */}

        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-14">
            {/* Logo & description */}
            <div>
              <div className="inline-block bg-white p-3 shadow-xl sm:p-4">
                <Image
                  src={data.logo}
                  alt={data.logoAlt || data.companyName}
                  width={280}
                  height={150}
                  className="h-auto w-[160px] object-contain sm:w-[200px] lg:w-[280px]"
                />
              </div>

              <p className="mt-6 max-w-[340px] text-[15px] leading-7 text-white/80 sm:mt-7 sm:text-[17px] sm:leading-8">
                {data.companyDescription}
              </p>
            </div>

            {/* Services */}
            <div className="lg:border-white/10 lg:pl-10">
              <h3 className="relative inline-block text-[26px] font-bold text-white sm:text-[30px] lg:text-[34px]">
                <span className="absolute -left-5 top-2 h-2.5 w-2.5 bg-[#db5e41]" />
                {data.servicesTitle}
              </h3>

              <ul className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                {sortedServices.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={item.url}
                      className="text-[15px] text-white/60 transition duration-300 hover:translate-x-2 hover:text-[#db5e41] sm:text-[17px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="lg:border-white/10 lg:pl-10">
              <h3 className="relative inline-block text-[26px] font-bold text-white sm:text-[30px] lg:text-[34px]">
                <span className="absolute -left-5 top-2 h-2.5 w-2.5 bg-[#db5e41]" />
                {data.quickLinksTitle}
              </h3>

              <ul className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                {sortedQuickLinks.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={item.url}
                      className="text-[15px] text-white/60 transition duration-300 hover:translate-x-2 hover:text-[#db5e41] sm:text-[17px]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="lg:border-white/10 lg:pl-10">
              <span className="text-[18px] font-semibold text-white sm:text-[20px]">
                {data.socialTitle}
              </span>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {sortedSocialLinks.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2c2725] text-white transition hover:bg-[#db5e41] sm:h-11 sm:w-11"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 space-y-4 sm:mt-10">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2c2725] sm:h-12 sm:w-12">
                    <Mail className="text-[#db5e41]" size={18} />
                  </div>

                  <a
                    href={`mailto:${data.email}`}
                    className="break-all pt-2 text-[15px] text-white/70 transition hover:text-[#db5e41] sm:text-[17px]"
                  >
                    {data.email}
                  </a>
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2c2725] sm:h-12 sm:w-12">
                    <Phone className="text-[#db5e41]" size={18} />
                  </div>

                  <div>
                    <a
                      href={`tel:${data.phone1}`}
                      className="block text-[15px] text-white/70 hover:text-[#db5e41] sm:text-[17px]"
                    >
                      {data.phone1}
                    </a>

                  
                      <a
                        href={`tel:${data.phone2}`}
                        className="mt-2 block text-[15px] text-white/70 hover:text-[#db5e41] sm:text-[17px]"
                      >
                        {data.phone2}
                      </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2c2725] sm:h-12 sm:w-12">
                    <MapPin className="text-[#db5e41]" size={18} />
                  </div>

                  <p className="text-[15px] leading-7 text-white/70 sm:text-[17px] sm:leading-8">
                    {data.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* Bottom bar                */}
        {/* ========================= */}

        <div className="border-t border-white/10 bg-[#211c1a]">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:px-6 lg:flex-row lg:gap-4">
            <p className="text-[13px] text-white/70 sm:text-[15px]">
              &copy; {new Date().getFullYear()} {data.companyName} All Rights Reserved
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-white/70 sm:gap-3 sm:text-[15px]">
              {sortedBottomLinks.map((link, i) => (
                <span key={link._id} className="flex items-center gap-2 sm:gap-3">
                  <Link href={link.url} className="hover:text-[#db5e41]">
                    {link.label}
                  </Link>
                  {i < sortedBottomLinks.length - 1 && <span>|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}