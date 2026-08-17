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
