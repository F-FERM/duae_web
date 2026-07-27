import AboutUs from "../components/home/AboutUs";
import CallToAction from "../components/home/CallToAction";
import OurClients from "../components/home/ClientLogos";
import ContactFormSection from "../components/home/ContactForm";
import StatsSection from "../components/home/CountingSection";
import Hero from "../components/home/Hero";
import Milestones from "../components/home/MileStone";
import OurTeam from "../components/home/OurTeam";
import Services from "../components/home/ServiceSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Navbar from "../components/layout/Navbar";

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
      <WhyChooseUs />
      <OurTeam />
      <ContactFormSection />
    </>
  );
}
