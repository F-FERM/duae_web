"use client";

import { useEffect } from "react";

export default function OrganizationJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": "https://wwduae.com/#localbusiness",
          name: "Wood World Decor LLC",
          legalName: "Wood World Decor LLC",
          url: "https://wwduae.com/",
          image:
            "https://wwduae.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fduae_logo.2md5ll8d8fekt.jpg&w=256&q=75",
          logo: {
            "@type": "ImageObject",
            "@id": "https://wwduae.com/#logo",
            url: "https://wwduae.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fduae_logo.2md5ll8d8fekt.jpg&w=256&q=75",
            contentUrl:
              "https://wwduae.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fduae_logo.2md5ll8d8fekt.jpg&w=256&q=75",
          },
          description:
            "Wood World Decor LLC is an interior design, joinery and fit-out company based in Al Quoz, Dubai, providing custom joinery, interior fit-out, furniture, turnkey interior solutions, renovation, upholstery, wall cladding, painting and polishing, sculpture fabrication and metal fabrication services.",
          telephone: ["+971527875262", "+971565066845"],
          email: "info@wwduae.ae",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Al Quoz Industrial Area 1",
            addressLocality: "Dubai",
            addressRegion: "Dubai",
            addressCountry: "AE",
          },
          areaServed: [
            {
              "@type": "City",
              name: "Dubai",
            },
            {
              "@type": "Country",
              name: "United Arab Emirates",
            },
          ],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ],
              opens: "07:00",
              closes: "17:30",
            },
          ],
          hasMap: "https://share.google/wu8bOgkiQTAhXYRU3",
          sameAs: [
            "https://www.instagram.com/wwduae.ae",
            "https://www.facebook.com/people/WOOD-WORLD-DECOR-LLC/61574052253916/",
            "https://www.linkedin.com/company/wood-world-decor-llc/",
          ],
          parentOrganization: {
            "@id": "https://wwduae.com/#organization",
          },
          knowsAbout: [
            "Interior Design",
            "Interior Fit-Out",
            "Custom Joinery",
            "Custom Furniture",
            "Turnkey Interior Solutions",
            "Renovation",
            "Upholstery",
            "Wall Cladding",
            "Painting and Polishing",
            "Sculpture Fabrication",
            "Metal Fabrication",
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Wood World Decor LLC Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Interior Design",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Joinery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Interior Fit-Out",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Custom Furniture",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Turnkey Interior Solutions",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Renovation",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Upholstery",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Wall Cladding",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Painting and Polishing",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Sculpture Fabrication",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Metal Fabrication",
                },
              },
            ],
          },
        },
        {
          "@type": "Organization",
          "@id": "https://wwduae.com/#organization",
          name: "Wood World Decor LLC",
          legalName: "Wood World Decor LLC",
          url: "https://wwduae.com/",
          logo: {
            "@id": "https://wwduae.com/#logo",
          },
          email: "info@wwduae.ae",
          telephone: "+971527875262",
          sameAs: [
            "https://www.instagram.com/wwduae.ae",
            "https://www.facebook.com/people/WOOD-WORLD-DECOR-LLC/61574052253916/",
            "https://www.linkedin.com/company/wood-world-decor-llc/",
          ],
        },
        {
          "@type": "WebSite",
          "@id": "https://wwduae.com/#website",
          url: "https://wwduae.com/",
          name: "Wood World Decor LLC",
          publisher: {
            "@id": "https://wwduae.com/#organization",
          },
          inLanguage: "en-AE",
        },
      ],
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
