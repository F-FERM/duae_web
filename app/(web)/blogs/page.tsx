import { Metadata } from "next";
import Blogs from "../../components/blog/Blogs";
import HeroOurblogs from "../../components/blog/OurBlogs";
import Navbar from "../../components/layout/Navbar";

export const metadata: Metadata = {
  title: "Blogs | Wood World Decor LLC",
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
      {/* Blog Collection Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": "https://wwduae.com/blogs/#webpage",
                url: "https://wwduae.com/blogs/",
                name: "Blogs | Wood World Decor LLC",
                description:
                  "Explore the latest insights, ideas and expert guidance from Wood World Decor LLC on joinery, interior fit-out, renovation, furniture, metal works and interior solutions in Dubai.",
                isPartOf: {
                  "@id": "https://wwduae.com/#website",
                },
                about: {
                  "@id": "https://wwduae.com/#organization",
                },
                publisher: {
                  "@id": "https://wwduae.com/#organization",
                },
                breadcrumb: {
                  "@id": "https://wwduae.com/blogs/#breadcrumb",
                },
                inLanguage: "en-AE",
              },
              {
                "@type": "Blog",
                "@id": "https://wwduae.com/blogs/#blog",
                url: "https://wwduae.com/blogs/",
                name: "Wood World Decor LLC Blog",
                description:
                  "Insights and expert guidance from Wood World Decor LLC covering joinery, interior fit-out, renovation, furniture, metal works, upholstery and interior design in Dubai.",
                publisher: {
                  "@id": "https://wwduae.com/#organization",
                },
                isPartOf: {
                  "@id": "https://wwduae.com/blogs/#webpage",
                },
                inLanguage: "en-AE",
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://wwduae.com/blogs/#breadcrumb",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://wwduae.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Blogs",
                    item: "https://wwduae.com/blogs/",
                  },
                ],
              },
            ],
          }),
        }}
      />

      <Navbar />
      <HeroOurblogs />
      <Blogs />
    </>
  );
}
