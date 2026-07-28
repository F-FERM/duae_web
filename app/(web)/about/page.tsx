import CoreValues from "@/app/components/about/CoreValues";
import Vision from "@/app/components/about/Vision";
import AboutDetailSection from "../../components/about/about-section";
import HeroAbout from "../../components/about/about-us";
import WhatWeDo from "../../components/about/WhatWeDo";
import WhyChooseUsLight from "../../components/about/Why-choose-us";
import Navbar from "../../components/layout/Navbar";

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
