"use client";

import { useEffect } from "react";

export default function OrganizationJsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Wood World Decor LLC",
      url: "https://www.wwduae.com",
      logo: "https://www.wwduae.com/images/logo.webp",
      alternateName: "Wood World Decor",
      sameAs: [
        "https://www.instagram.com/wwduae.ae",
        "https://www.facebook.com/people/WOOD-WORLD-DECOR-LLC/61574052253916/",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+971527875262",
          contactType: "sales",
          email: "info@wwduae.ae",
          areaServed: "AE",
          availableLanguage: "en",
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
