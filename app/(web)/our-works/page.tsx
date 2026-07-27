import HeroAbout from "../../components/about/about-us";
import Navbar from "../../components/layout/Navbar";
import HeroOurWorks from "../../components/our-works/HeroOurWorks";
import GalleryGrid from "../../components/our-works/StackedImages";

export default function Works() {
  return (
    <>
      <Navbar />
      <HeroOurWorks />
      <GalleryGrid />
    </>
  );
}
