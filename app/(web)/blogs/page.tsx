import Blogs from "../../components/blog/Blogs";
import HeroOurblogs from "../../components/blog/OurBlogs";
import Navbar from "../../components/layout/Navbar";

export default function Blog() {
  return (
    <>
      <Navbar />
      <HeroOurblogs />
      <Blogs />
    </>
  );
}
