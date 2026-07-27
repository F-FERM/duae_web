import AboutUs from "../../components/home/AboutUs";
import StatsSection from "../../components/home/CountingSection";
import Navbar from "../../components/layout/Navbar";
import ContactFormSection from "../../components/services/ContactForm";
import FAQSection from "../../components/services/FaqSection";
import HeroService from "../../components/services/HeroServices";
import WhatIncluded from "../../components/services/IncludedJoinery";
import OurJoineryMaterials from "../../components/services/JoineryMaterials";
import OurProcess from "../../components/services/JoineryProcess";
import JoineryWorks from "../../components/services/JoiningWorks";
import CallToAction from "../../components/services/TalktoUs";
import WhoWeServe from "../../components/services/WhoWeServe";
import WhyChooseUsService from "../../components/services/WhyChooseService";

export default function Works() {
  return (
    <>
      <Navbar />
      <HeroService />
      <StatsSection />
      <JoineryWorks />
      <WhoWeServe />
      <WhatIncluded />
      <CallToAction />
      <AboutUs />
      <OurProcess />
      <OurJoineryMaterials />
      <WhyChooseUsService />
      <FAQSection />
      <ContactFormSection />
    </>
  );
}
