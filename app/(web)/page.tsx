import AboutUs from "../components/home/AboutUs";
import CallToAction from "../components/home/CallToAction";
import OurClients from "../components/home/ClientLogos";
import ContactFormSection from "../components/home/ContactForm";
import StatsSection from "../components/home/CountingSection";
import Hero from "../components/home/Hero";
import Milestones from "../components/home/MileStone";
import OurTeam from "../components/home/OurTeam";
import OurWorks from "../components/home/OurWorks";
import Services from "../components/home/ServiceSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Navbar from "../components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
    template: "%s | Wood World Decor LLC",
  },
  description:
    "Wood World Decor LLC is a leading interior fit out company in UAE since 2015, offering turnkey solutions for homes, offices & retail.Call +971 52 787 5262",
  keywords:
    "Interior fit out company in dubai",
  metadataBase: new URL("https://www.wwduae.com"),
  openGraph: {
    title: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
    description:
      "Wood World Decor LLC is a leading interior fit out company in UAE since 2015, offering turnkey solutions for homes, offices & retail. Call +971 52 787 5262.",
    url: "https://www.wwduae.com",
    siteName: "Wood World Decor LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "Wood World Decor - Top Interior Fit Out Company in Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
    description:
      "Wood World Decor LLC is a leading interior fit out company in UAE since 2015, offering turnkey solutions for homes, offices & retail. Call +971 52 787 5262.",
    images: ["/icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.wwduae.com",
  },
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  category: "Interior Design & Fit Out",
  classification: "Interior Fit Out Company in Dubai",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsSection />
      <Services />
      <AboutUs />
      <Milestones />
      <CallToAction />
      <OurClients />
      <OurWorks />
      <WhyChooseUs />
      <OurTeam />
      <ContactFormSection />
    </>
  );
}
