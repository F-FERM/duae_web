import AboutDetailSection from "../components/about/about-section";
import HeroAbout from "../components/about/about-us";
import WhatWeDo from "../components/about/WhatWeDo";
import WhyChooseUsLight from "../components/about/Why-choose-us";
import Milestones from "../components/home/MileStone";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Navbar from "../components/layout/Navbar";


export default function About() {
  return (
    <>
 
   
      <Navbar />
      <HeroAbout/>
        <AboutDetailSection/>
        <WhatWeDo/>
        <WhyChooseUs/>
        <Milestones/>
        <WhyChooseUsLight/>
    
     
    </>
  );
}