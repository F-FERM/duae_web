import { Poppins } from "next/font/google";
import "../globals.css";
import type { Metadata } from "next";
import TopHeader from "../components/layout/TopHeader";
import Footer from "../components/layout/Footer";
import FloatingButtons from "../components/layout/FloatingButtons";
import GoogleAnalytics from "../components/GoogleAnalytics";
import OrganizationJsonLd from "../components/OrganizationJsonLd";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wwduae.com"),
  title: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
  description:
    "Wood World Decor LLC is a leading joinery and fitout company in Dubai, UAE. We specialize in high-quality joinery, fit-out solutions.",
  keywords: [
    "joinery company Dubai",
    "fitout company Dubai",
    "renovation services Dubai",
    "custom joinery",
    "interior fit-out",
    "turnkey solutions",
    "metal works Dubai",
    "upholstery Dubai",
    "kitchen renovation Dubai",
    "commercial fit out Dubai",
    "residential fit out Dubai",
    "Wood World Decor",
  ],
  verification: {
    google: "4Z5KYEL6lRjxu39tA3EqUKsE6WdQRfHkQipVwO49c0g",
  },
  openGraph: {
    title: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
    description:
      "Expert joinery, fit-out, and renovation solutions in Dubai. Transforming spaces with quality and style since 2015.",
    url: "https://wwduae.com/",
    siteName: "Wood World Decor LLC",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "Wood World Decor LLC",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wood World Decor LLC | Leading Joinery & Fitout Company in Dubai",
    description:
      "Expert joinery, fit-out, and renovation solutions in Dubai. Transforming spaces with quality and style.",
    images: ["/icon.jpg"],
  },
  alternates: {
    canonical: "/",
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
  authors: [{ name: "Wood World Decor LLC" }],
  category: "Construction & Interior Design",

  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="llms" href="/llms.txt" />
      </head>
      <body className={`${poppins.variable} bg-white`}>
        <OrganizationJsonLd />
        <GoogleAnalytics />
        <TopHeader />
        {children}
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
