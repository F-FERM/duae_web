import { Metadata } from "next";
import Blogs from "../../components/blog/Blogs";
import HeroOurblogs from "../../components/blog/OurBlogs";
import Navbar from "../../components/layout/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Blogs | Wood World Decor LLC",
    template: "%s | Wood World Decor LLC",
  },
  description:
    "Read our latest blogs on joinery,fit-out solutions,and interior design trends in Dubai.Expert insights from Wood World Decor LLC for homes & retail spaces",
  keywords: "joinery blog Dubai",
  metadataBase: new URL("https://wwduae.com"),
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Blogs | Wood World Decor LLC | Joinery & Fitout Insights Dubai",
    description:
      "Read our latest blogs on joinery, fit-out solutions, and interior design trends in Dubai.Expert insights from Wood World Decor LLC for homes, & retail spaces.",
    url: "https://wwduae.com/blogs",
    siteName: "Wood World Decor LLC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | Wood World Decor LLC | Joinery & Fitout Insights Dubai",
    description:
      "Read our latest blogs on joinery, fit-out solutions, and interior design trends in Dubai. Expert insights from Wood World Decor LLC.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Blog() {
  return (
    <>
      <Navbar />
      <HeroOurblogs />
      <Blogs />
    </>
  );
}
