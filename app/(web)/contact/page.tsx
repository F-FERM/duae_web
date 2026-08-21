import LocationMap from "@/app/components/contact/LocationMap";
import GetInTouch from "../../components/contact/ContactForm";
import HeroContactUs from "../../components/contact/OurContact";
import Navbar from "../../components/layout/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Wood World Decor LLC",
  description:
    "Get in touch with Wood World Decor LLC for expert joinery, fit-out in Dubai. Call +971 52 787 5262 or fill out our contact form for a free consultation",
  keywords: "contact joinery Dubai",
  metadataBase: new URL("https://wwduae.com"),
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Wood World Decor LLC | Joinery & Fitout Dubai",
    description:
      "Get in touch with Wood World Decor LLC for expert renovation services in Dubai.Call +971 52 787 5262 or fill out our contact form for a free consultation",
    url: "https://wwduae.com/contact",
    siteName: "Wood World Decor LLC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Wood World Decor LLC | Joinery & Fitout Dubai",
    description:
      "Get in touch with Wood World Decor LLC for expert joinery, fit-out, and renovation services in Dubai.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <HeroContactUs />
      <GetInTouch />
      <LocationMap />
    </>
  );
}
