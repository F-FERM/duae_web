export interface ServiceMetadata {
  title: string;
  description: string;
  keywords: string;
  altText: string;
  openGraph?: {
    title?: string;
    description?: string;
  };
}

export const serviceMetadataMap: Record<string, ServiceMetadata> = {
  // Joinery
  joinery: {
    title: "Custom Joinery Company in Dubai | Bespoke Woodwork",
    description:
      "Looking for a trusted joinery company in Dubai? We deliver bespoke joinery, custom furniture, cabinetry, woodwork, and interior solutions. Call +971 52 787 5262 today.",
    keywords: "Joinery Company in dubai",
    altText:
      "Joinery Company in Dubai - Custom woodwork and bespoke furniture solutions",
    openGraph: {
      title: "Custom Joinery Company in Dubai | Bespoke Woodwork",
      description:
        "Looking for a trusted joinery company in Dubai? We deliver bespoke joinery, custom furniture, cabinetry, woodwork, and interior solutions. Call +971 52 787 5262 today.",
    },
  },

  // Fitout Solutions
  "fitout-solutions": {
    title: "Fit Out Company in Dubai | In-House Workshop, since 2015",
    description:
      "Experienced fit out company in Dubai providing turnkey interior fit-out solutions for commercial, hospitality, retail, and residential spaces.",
    keywords: "fit out company in dubai",
    altText:
      "Fit Out Company in Dubai - Professional interior fit out services with in-house workshop",
    openGraph: {
      title: "Fit Out Company in Dubai | In-House Workshop, since 2015",
      description:
        "Experienced fit out company in Dubai providing turnkey interior fit-out solutions for commercial, hospitality, retail, and residential spaces.",
    },
  },

  // Commercial Fit Out
  "commercial-fit-out": {
    title: "Commercial Fit Out Dubai | Offices, Retail & Hospitality",
    description:
      "Trusted commercial fit-out contractors in Dubai delivering turnkey interior solutions for offices, retail & hospitality spaces. Request your free quote now!",
    keywords: "Commercial Fit Out",
    altText:
      "Commercial Fit Out Dubai - Office, retail and hospitality interior solutions",
    openGraph: {
      title: "Commercial Fit Out Dubai | Offices, Retail & Hospitality",
      description:
        "Trusted commercial fit-out contractors in Dubai delivering turnkey interior solutions for offices, retail & hospitality spaces.",
    },
  },

  // Residential Fit Out
  "residential-fit-out": {
    title: "Residential Fit Out Dubai | Villa & Home Interiors",
    description:
      "Residential fit out experts in Dubai creating functional, beautifully finished villa and home interiors tailored to your lifestyle. Book a consultation!",
    keywords: "Residential Fit Out Dubai",
    altText: "Residential Fit Out Dubai - Villa and home interior solutions",
    openGraph: {
      title: "Residential Fit Out Dubai | Villa & Home Interiors",
      description:
        "Residential fit out experts in Dubai creating functional, beautifully finished villa and home interiors tailored to your lifestyle.",
    },
  },

  // Turnkey Solutions
  "turnkey-solutions": {
    title: "Turnkey Fitout Dubai | Luxury Interior Execution Experts",
    description:
      "Looking for turnkey fitout Dubai solutions? We deliver end-to-end interior design and execution for commercial and residential projects across Dubai.",
    keywords: "Turnkey Fitout Dubai",
    altText:
      "Turnkey Fitout Dubai - End-to-end interior design and execution solutions",
    openGraph: {
      title: "Turnkey Fitout Dubai | Luxury Interior Execution Experts",
      description:
        "Looking for turnkey fitout Dubai solutions? We deliver end-to-end interior design and execution for commercial and residential projects across Dubai.",
    },
  },

  // Renovation Services
  "renovation-services": {
    title: "Renovation Company in Dubai | Premium Fit-Out Experts",
    description:
      "Trusted renovation company in Dubai offering home, villa, office, and commercial renovation services with quality craftsmanship. Call +971 52 787 5262 today.",
    keywords: "Renovation Company in Dubai",
    altText:
      "Renovation Company in Dubai - Premium home, villa and commercial renovation services",
    openGraph: {
      title: "Renovation Company in Dubai | Premium Fit-Out Experts",
      description:
        "Trusted renovation company in Dubai offering home, villa, office, and commercial renovation services with quality craftsmanship.",
    },
  },

  // Villa Renovations
  "villa-renovations": {
    title: "Villa Renovation Dubai | Luxury Home Upgrade Experts",
    description:
      "Expert villa renovation Dubai services for luxury home upgrades. Trusted specialists deliver premium finishes & quality craftsmanship. Book a consultation!",
    keywords: "villa renovation Dubai",
    altText:
      "Villa Renovation Dubai - Luxury home upgrades and premium finishes",
    openGraph: {
      title: "Villa Renovation Dubai | Luxury Home Upgrade Experts",
      description:
        "Expert villa renovation Dubai services for luxury home upgrades. Trusted specialists deliver premium finishes & quality craftsmanship.",
    },
  },

  // Apartment Renovations
  "apartment-renovations": {
    title: "Apartment Renovation Dubai | Premium Remodeling Experts",
    description:
      "Looking for apartment renovation Dubai services? Transform your space with trusted renovation experts, quality finishes & custom designs. Call us today!",
    keywords: "Apartment Renovation Dubai",
    altText:
      "Apartment Renovation Dubai - Premium remodeling and custom designs",
    openGraph: {
      title: "Apartment Renovation Dubai | Premium Remodeling Experts",
      description:
        "Looking for apartment renovation Dubai services? Transform your space with trusted renovation experts, quality finishes & custom designs.",
    },
  },

  // Home Renovation
  "home-renovation": {
    title: "Home Renovation Company in Dubai | Expert Home Upgrades",
    description:
      "Planning a home renovation in Dubai? Our experts provide complete remodeling and modern interior upgrades to refresh your space quickly and efficiently.",
    keywords: "Home Renovation Company in Dubai",
    altText:
      "Home Renovation Company in Dubai - Complete home remodeling and upgrades",
    openGraph: {
      title: "Home Renovation Company in Dubai | Expert Home Upgrades",
      description:
        "Planning a home renovation in Dubai? Our experts provide complete remodeling and modern interior upgrades to refresh your space quickly and efficiently.",
    },
  },

  // Kitchen Renovation
  "kitchen-renovation": {
    title: "Kitchen Renovation Dubai | Custom Kitchen Design Experts",
    description:
      "Transform your kitchen with our expert renovation services in Dubai. Discover innovative designs and quality craftsmanship tailored to your needs.",
    keywords: "Kitchen Renovation Dubai",
    altText:
      "Kitchen Renovation Dubai - Custom kitchen design and remodeling solutions",
    openGraph: {
      title: "Kitchen Renovation Dubai | Custom Kitchen Design Experts",
      description:
        "Transform your kitchen with our expert renovation services in Dubai. Discover innovative designs and quality craftsmanship tailored to your needs.",
    },
  },

  // Bathroom Renovation
  "bathroom-renovation": {
    title: "Bathroom Renovation Dubai | Transform Your Bathroom Space",
    description:
      "Bathroom renovation Dubai specialists delivering modern designs, quality fittings and skilled craftsmanship to transform your space. Book a consultation!",
    keywords: "Bathroom Renovation Dubai",
    altText: "Bathroom Renovation Dubai - Modern bathroom designs and fittings",
    openGraph: {
      title: "Bathroom Renovation Dubai | Transform Your Bathroom Space",
      description:
        "Bathroom renovation Dubai specialists delivering modern designs, quality fittings and skilled craftsmanship to transform your space.",
    },
  },

  // Metal Works
  "metal-works": {
    title: "Metal Fabrication in Dubai|Custom Metal Works UAE Experts",
    description:
      "Discover top-notch metal fabrication services in Dubai. Our expert team delivers precision and quality for all your custom metal needs. Get a quote today!",
    keywords: "Metal Fabrication in Dubai",
    altText:
      "Metal Fabrication in Dubai - Custom metal works and precision fabrication",
    openGraph: {
      title: "Metal Fabrication in Dubai | Custom Metal Works UAE Experts",
      description:
        "Discover top-notch metal fabrication services in Dubai. Our expert team delivers precision and quality for all your custom metal needs.",
    },
  },

  // Upholstery
  upholstery: {
    title: "Upholstery in Dubai | Sofa Repair & Fabric Restoration",
    description:
      "Looking for upholstery in Dubai? We offer custom sofa repair, fabric replacement & furniture restoration with premium craftsmanship. Enquire now!",
    keywords: "Upholstery in Dubai",
    altText:
      "Upholstery in Dubai - Sofa repair, fabric replacement and furniture restoration",
    openGraph: {
      title: "Upholstery in Dubai | Sofa Repair & Fabric Restoration",
      description:
        "Looking for upholstery in Dubai? We offer custom sofa repair, fabric replacement & furniture restoration with premium craftsmanship.",
    },
  },
};

// Fallback metadata for unknown slugs
export const fallbackMetadata: ServiceMetadata = {
  title: "Interior Fit Out Services in Dubai | Wood World Decor",
  description:
    "Wood World Decor provides premium interior fit-out, joinery, and renovation services in Dubai. Expert craftsmanship for residential, commercial, and hospitality projects. Call +971 52 787 5262.",
  keywords: "Interior fit out company in Dubai",
  altText: "Wood World Decor - Interior fit out company in Dubai",
  openGraph: {
    title: "Interior Fit Out Services in Dubai | Wood World Decor",
    description:
      "Wood World Decor provides premium interior fit-out, joinery, and renovation services in Dubai. Expert craftsmanship for residential, commercial, and hospitality projects.",
  },
};

export function getServiceMetadata(slug: string): ServiceMetadata {
  return serviceMetadataMap[slug] || fallbackMetadata;
}
