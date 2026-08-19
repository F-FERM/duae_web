import Navbar from "../../components/layout/Navbar";
import HeroOurWorks from "../../components/our-works/HeroOurWorks";
import GalleryGrid from "../../components/our-works/StackedImages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Works | Wood World Decor LLC",
  description:
    "Explore our portfolio of joinery, fit-out, and turnkey projects in Dubai.Wood World Decor LLC delivers quality craftsmanship for homes & retail spaces.",
  keywords:
    "joinery projects Dubai, fitout works, turnkey solutions, woodwork portfolio, interior fitout, renovation projects Dubai",
  metadataBase: new URL("https://www.wwduae.com"),
  alternates: {
    canonical: "/our-works",
  },
  openGraph: {
    title:
      "Our Works | Wood World Decor LLC | Joinery & Fitout Projects in Dubai",
    description:
      "Explore our portfolio of joinery, fit-out, and turnkey projects in Dubai. Wood World Decor LLC delivers quality craftsmanship for homes, & retail spaces.",
    url: "https://www.wwduae.com/our-works",
    siteName: "Wood World Decor LLC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Works | Wood World Decor LLC",
    description:
      "Explore our portfolio of joinery, fit-out, and turnkey projects in Dubai. Wood World Decor LLC delivers quality craftsmanship.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Works() {
  return (
    <>
      <Navbar />
      <HeroOurWorks />
      <GalleryGrid />
    </>
  );
}
