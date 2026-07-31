// app/sitemap.ts
import { MetadataRoute } from "next";

// Define all static routes
const staticRoutes = [
  {
    url: "/",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  {
    url: "/blogs",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    url: "/contact",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/our-works",
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
];

// Function to fetch all service slugs from your API
async function getServiceSlugs() {
  try {
    // Fetch from your API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch services for sitemap");
      return [];
    }

    const services = await response.json();
    return services.map((service: any) => ({
      slug: service.slug,
      lastModified: service.updatedAt || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching services for sitemap:", error);
    return [];
  }
}

// Fallback service slugs if API is not available
const fallbackServiceSlugs = [
  "joinery",
  "renovation-services",
  "turnkey-solutions",
  "fitout-solutions",
  "metal-works",
  "upholstery",
  "villa-renovations",
  "apartment-renovations",
  "home-renovation",
  "kitchen-renovation",
  "bathroom-renovation",
  "commercial-fit-out",
  "residential-fit-out",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic service slugs
  let serviceSlugs = await getServiceSlugs();

  // Use fallback if API fetch fails or returns empty
  if (serviceSlugs.length === 0) {
    serviceSlugs = fallbackServiceSlugs.map((slug) => ({
      slug,
      lastModified: new Date(),
    }));
  }

  // Generate service routes
  const serviceRoutes = serviceSlugs.map(
    ({ slug, lastModified }: { slug: string; lastModified: Date }) => ({
      url: `/services/${slug}`,
      lastModified: new Date(lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  // Combine all routes
  return [...staticRoutes, ...serviceRoutes];
}
