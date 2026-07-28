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

export default async function Works({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  // If we have a nested slug like ["fit-out", "commercial"], we join them with a slash
  // If no slug is provided, we default to "joinery"
  const slugPath = resolvedParams.slug ? resolvedParams.slug.join("/") : "joinery";

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
