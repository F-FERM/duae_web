import CoreValues from "@/app/components/about/CoreValues";
import Vision from "@/app/components/about/Vision";
import AboutDetailSection from "../../components/about/about-section";
import HeroAbout from "../../components/about/about-us";
import WhatWeDo from "../../components/about/WhatWeDo";
import WhyChooseUsLight from "../../components/about/Why-choose-us";
import Navbar from "../../components/layout/Navbar";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Top Interior Fit Out Companies in UAE | Wood World Decor",
  description:
    "Discover one of the leading interior fit out companies in UAE. Wood World Decor provides quality residential, commercial, and turnkey fit-out solutions.",
  keywords: "interior fit out companies in uae",
  openGraph: {
    title: "Top Interior Fit Out Companies in UAE | Wood World Decor",
    description:
      "Discover one of the leading interior fit out companies in UAE. Wood World Decor provides quality residential, commercial, and turnkey fit-out solutions.",
    url: "https://wwduae.com/about",
    siteName: "Wood World Decor LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "Wood World Decor - Interior Fit Out Company in UAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Interior Fit Out Companies in UAE | Wood World Decor",
    description:
      "Discover one of the leading interior fit out companies in UAE. Wood World Decor provides quality residential, commercial, and turnkey fit-out solutions.",
  },
  alternates: {
    canonical: "https://wwduae.com/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function About() {
  return (
    <>
      {/* About Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "AboutPage",
                "@id": "https://wwduae.com/about/#aboutpage",
                url: "https://wwduae.com/about/",
                name: "About Wood World Decor LLC",
                description:
                  "Learn about Wood World Decor LLC, a Dubai-based company providing joinery, interior fit-out, turnkey solutions, renovation, metal works and upholstery services.",
                isPartOf: {
                  "@id": "https://wwduae.com/#website",
                },
                about: {
                  "@id": "https://wwduae.com/#organization",
                },
                publisher: {
                  "@id": "https://wwduae.com/#organization",
                },
                breadcrumb: {
                  "@id": "https://wwduae.com/about/#breadcrumb",
                },
                inLanguage: "en-AE",
              },
              {
                "@type": "Organization",
                "@id": "https://wwduae.com/#organization",
                name: "Wood World Decor LLC",
                legalName: "Wood World Decor LLC",
                url: "https://wwduae.com/",
                logo: {
                  "@type": "ImageObject",
                  "@id": "https://wwduae.com/#logo",
                  url: "https://wwduae.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fduae_logo.2md5ll8d8fekt.jpg&w=256&q=75",
                  contentUrl:
                    "https://wwduae.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fduae_logo.2md5ll8d8fekt.jpg&w=256&q=75",
                },
                description:
                  "Wood World Decor LLC is a Dubai-based joinery, interior fit-out and renovation company with over 10 years of experience delivering quality interior solutions.",
                telephone: ["+971565066845", "+971527875262"],
                email: "info@wwduae.ae",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Al Quoz Industrial Area 1",
                  addressLocality: "Dubai",
                  addressRegion: "Dubai",
                  addressCountry: "AE",
                },
                sameAs: [
                  "https://www.instagram.com/wwduae.ae",
                  "https://www.facebook.com/people/WOOD-WORLD-DECOR-LLC/61574052253916/",
                  "https://www.linkedin.com/company/wood-world-decor-llc/",
                ],
                knowsAbout: [
                  "Custom Joinery",
                  "Interior Fit-Out",
                  "Turnkey Fit-Out",
                  "Renovation",
                  "Metal Works",
                  "Upholstery",
                  "Interior Design",
                  "Custom Furniture",
                ],
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://wwduae.com/about/#breadcrumb",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://wwduae.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "About Us",
                    item: "https://wwduae.com/about/",
                  },
                ],
              },
            ],
          }),
        }}
      />

      <Navbar />
      <HeroAbout />
      <AboutDetailSection />
      <WhatWeDo />
      <Vision />
      <CoreValues />
      <WhyChooseUsLight />
    </>
  );
}
