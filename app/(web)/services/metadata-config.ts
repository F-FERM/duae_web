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
    title: "Joinery Company in Dubai | Bespoke Cabinetry & Woodwork",
    description:
      "Trusted joinery company in Dubai since 2015, delivering bespoke furniture, cabinetry and woodwork. Explore our joinery solutions or call +971 52 787 5262.",
    keywords: "Joinery Company in dubai",
    altText:
      "Joinery Company in Dubai - Custom woodwork and bespoke furniture solutions",
    openGraph: {
      title: "Joinery Company in Dubai | Bespoke Cabinetry & Woodwork",
      description:
        "Trusted joinery company in Dubai since 2015, delivering bespoke furniture, cabinetry and woodwork. Explore our joinery solutions or call +971 52 787 5262.",
    },
  },

  // Fitout Solutions
  "fitout-solutions": {
    title: "Fit Out Company in Dubai Since 2015 | Wood World Decor",
    description:
      "Get expert fit out solutions in Dubai from Wood World Decor. Quality interiors, custom joinery and professional execution backed by experience since 2015.",
    keywords: "fit out company in dubai",
    altText:
      "Fit Out Company in Dubai - Professional interior fit out services with in-house workshop",
    openGraph: {
      title: "Fit Out Company in Dubai Since 2015 | Wood World Decor",
      description:
        "Get expert fit out solutions in Dubai from Wood World Decor. Quality interiors, custom joinery and professional execution backed by experience since 2015.",
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
        "Trusted commercial fit-out contractors in Dubai delivering turnkey interior solutions for offices, retail & hospitality spaces. Request your free quote now!",
    },
  },

  // Residential Fit Out
  "residential-fit-out": {
    title: "Residential Fit Out Dubai | Best Bespoke Villa & Home Interiors",
    description:
      "Residential fit out experts in Dubai creating functional, beautifully finished villa and home interiors tailored to your lifestyle. Book a consultation!",
    keywords: "Residential Fit Out Dubai",
    altText: "Residential Fit Out Dubai - Villa and home interior solutions",
    openGraph: {
      title: "Residential Fit Out Dubai | Best Bespoke Villa & Home Interiors",
      description:
        "Residential fit out experts in Dubai creating functional, beautifully finished villa and home interiors tailored to your lifestyle. Book a consultation!",
    },
  },

  // Turnkey Solutions
  "turnkey-solutions": {
    title: "Turnkey Fit Out Company in Dubai | Wood World Decor",
    description:
      "Looking for turnkey fitout Dubai solutions? We deliver end-to-end interior design and execution for commercial and residential projects across Dubai.",
    keywords: "Turnkey Fitout Dubai",
    altText:
      "Turnkey Fitout Dubai - End-to-end interior design and execution solutions",
    openGraph: {
      title: "Turnkey Fit Out Company in Dubai | Wood World Decor",
      description:
        "Looking for turnkey fitout Dubai solutions? We deliver end-to-end interior design and execution for commercial and residential projects across Dubai.",
    },
  },

  // Renovation Services
  "renovation-services": {
    title: "Renovation Company in Dubai | Premium Fit-Out Experts",
    description:
      "Transform homes, villas and commercial spaces with bespoke renovation in Dubai. Get tailored solutions from planning to finishing. Call +971 52 787 5262.",
    keywords: "Renovation Company in Dubai",
    altText:
      "Renovation Company in Dubai - Premium home, villa and commercial renovation services",
    openGraph: {
      title: "Renovation Company in Dubai | Premium Fit-Out Experts",
      description:
        "Transform homes, villas and commercial spaces with bespoke renovation in Dubai. Get tailored solutions from planning to finishing. Call +971 52 787 5262.",
    },
  },

  // Villa Renovations
  "villa-renovations": {
    title: "Villa Renovation Dubai | Give Your Villa a New Look",
    description:
      "Expert villa renovation Dubai services for luxury home upgrades. Trusted specialists deliver premium finishes & quality craftsmanship. Book a consultation!",
    keywords: "villa renovation Dubai",
    altText:
      "Villa Renovation Dubai - Luxury home upgrades and premium finishes",
    openGraph: {
      title: "Villa Renovation Dubai | Give Your Villa a New Look",
      description:
        "Expert villa renovation Dubai services for luxury home upgrades. Trusted specialists deliver premium finishes & quality craftsmanship. Book a consultation!",
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
        "Looking for apartment renovation Dubai services? Transform your space with trusted renovation experts, quality finishes & custom designs. Call us today!",
    },
  },

  // Home Renovation
  "home-renovation": {
    title: "Bespoke Home Renovation Services in Dubai Since 2015",
    description:
      "Refresh your space with home renovation in Dubai, from modern upgrades to complete makeovers. Explore your renovation options with Wood World Decor.",
    keywords: "Home Renovation Company in Dubai",
    altText:
      "Home Renovation Company in Dubai - Complete home remodeling and upgrades",
    openGraph: {
      title: "Bespoke Home Renovation Services in Dubai Since 2015",
      description:
        "Refresh your space with home renovation in Dubai, from modern upgrades to complete makeovers. Explore your renovation options with Wood World Decor.",
    },
  },

  // Kitchen Renovation
  "kitchen-renovation": {
    title: "Best Kitchen Renovation Company for Modern Dubai Homes",
    description:
      "Transform your kitchen with our expert renovation services in Dubai. Discover innovative designs and quality craftsmanship tailored to your needs.",
    keywords: "Kitchen Renovation Dubai",
    altText:
      "Kitchen Renovation Dubai - Custom kitchen design and remodeling solutions",
    openGraph: {
      title: "Best Kitchen Renovation Company for Modern Dubai Homes",
      description:
        "Transform your kitchen with our expert renovation services in Dubai. Discover innovative designs and quality craftsmanship tailored to your needs.",
    },
  },

  // Bathroom Renovation
  "bathroom-renovation": {
    title: "Modern Bathroom Renovation Dubai | Wood World Decor",
    description:
      "Bathroom renovation Dubai specialists delivering modern designs, quality fittings and skilled craftsmanship to transform your space. Book a consultation!",
    keywords: "Bathroom Renovation Dubai",
    altText: "Bathroom Renovation Dubai - Modern bathroom designs and fittings",
    openGraph: {
      title: "Modern Bathroom Renovation Dubai | Wood World Decor",
      description:
        "Bathroom renovation Dubai specialists delivering modern designs, quality fittings and skilled craftsmanship to transform your space. Book a consultation!",
    },
  },

  // Metal Works
  "metal-works": {
    title: "Metal Fabrication in Dubai for Custom Structures & Works",
    description:
      "Metal fabrication in Dubai for custom structures and architectural metalwork. Get quality fabrication tailored to your project. Call +971 52 787 5262.",
    keywords: "Metal Fabrication in Dubai",
    altText:
      "Metal Fabrication in Dubai - Custom metal works and precision fabrication",
    openGraph: {
      title: "Metal Fabrication in Dubai for Custom Structures & Works",
      description:
        "Metal fabrication in Dubai for custom structures and architectural metalwork. Get quality fabrication tailored to your project. Call +971 52 787 5262.",
    },
  },

  // Upholstery
  upholstery: {
    title: "Upholstery in Dubai for Sofa Repair & Fabric Restoration",
    description:
      "Looking for upholstery in Dubai? We offer custom sofa repair, fabric replacement & furniture restoration with premium craftsmanship. Enquire now!",
    keywords: "Upholstery in Dubai",
    altText:
      "Upholstery in Dubai - Sofa repair, fabric replacement and furniture restoration",
    openGraph: {
      title: "Upholstery in Dubai for Sofa Repair & Fabric Restoration",
      description:
        "Looking for upholstery in Dubai? We offer custom sofa repair, fabric replacement & furniture restoration with premium craftsmanship. Enquire now!",
    },
  },
};

// Fallback metadata for unknown slugs
export const fallbackMetadata: ServiceMetadata = {
  title: "Interior Fit Out Company in Dubai | Wood World Decor",
  description:
    "Wood World Decor is a leading interior fit out company in UAE since 2015, offering turnkey solutions for homes, offices & retail. Call +971 52 787 5262.",
  keywords: "Interior fit out company in Dubai",
  altText: "Wood World Decor - Interior fit out company in Dubai",
  openGraph: {
    title: "Interior Fit Out Company in Dubai | Wood World Decor",
    description:
      "Wood World Decor is a leading interior fit out company in UAE since 2015, offering turnkey solutions for homes, offices & retail. Call +971 52 787 5262.",
  },
};

export function getServiceMetadata(slug: string): ServiceMetadata {
  return serviceMetadataMap[slug] || fallbackMetadata;
}
