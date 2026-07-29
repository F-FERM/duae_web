
import LocationMap from "@/app/components/contact/LocationMap";
import GetInTouch from "../../components/contact/ContactForm";
import HeroContactUs from "../../components/contact/OurContact";
import Navbar from "../../components/layout/Navbar";

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
