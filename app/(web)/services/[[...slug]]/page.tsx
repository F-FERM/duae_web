import AboutUs from "../../../components/home/AboutUs";
import StatsSection from "../../../components/home/CountingSection";
import Navbar from "../../../components/layout/Navbar";
import ContactFormSection from "../../../components/services/ContactForm";
import FAQSection from "../../../components/services/FaqSection";
import HeroService from "../../../components/services/HeroServices";
import WhatIncluded from "../../../components/services/IncludedJoinery";
import OurJoineryMaterials from "../../../components/services/JoineryMaterials";
import OurProcess from "../../../components/services/JoineryProcess";
import JoineryWorks from "../../../components/services/JoiningWorks";
import CallToAction from "../../../components/services/TalktoUs";
import WhoWeServe from "../../../components/services/WhoWeServe";
import WhyChooseUsService from "../../../components/services/WhyChooseService";
import type { Metadata } from "next";
import { getServiceMetadata } from "../metadata-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug
    ? resolvedParams.slug.join("/")
    : "joinery";
  const metadata = getServiceMetadata(slugPath);

  const pageUrl = `https://wwduae.com/services/${slugPath}`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: pageUrl,
      siteName: "Wood World Decor LLC",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `/`,
          width: 1200,
          height: 630,
          alt: metadata.altText,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Works({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  // If we have a nested slug like ["fit-out", "commercial"], we join them with a slash
  // If no slug is provided, we default to "joinery"
  const slugPath = resolvedParams.slug
    ? resolvedParams.slug.join("/")
    : "joinery";
  const metadata = getServiceMetadata(slugPath);

  return (
    <>
      <Navbar />
      <HeroService slug={slugPath} />
      <StatsSection />
      <JoineryWorks slug={slugPath} />
      <WhoWeServe slug={slugPath} />
      <WhatIncluded slug={slugPath} />
      <CallToAction slug={slugPath} />
      <AboutUs />
      <OurProcess slug={slugPath} />
      <OurJoineryMaterials slug={slugPath} />
      <WhyChooseUsService slug={slugPath} />
      <FAQSection slug={slugPath} />
      <ContactFormSection />
    </>
  );
}
