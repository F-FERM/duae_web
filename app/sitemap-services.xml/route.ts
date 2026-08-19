import { NextResponse } from "next/server";

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

type ServiceSitemapItem = {
  slug: string;
  lastModified: string | Date;
};

async function getServiceSlugs(): Promise<ServiceSitemapItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${apiUrl}/services`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch services for sitemap: ${response.status}`);

      return [];
    }

    const services = await response.json();

    if (!Array.isArray(services)) {
      console.error("Invalid services response for sitemap");

      return [];
    }

    return services
      .filter((service: any) => service?.slug && service?.isActive !== false)
      .map((service: any) => ({
        slug: service.slug,
        lastModified: service.updatedAt || service.createdAt || new Date(),
      }));
  } catch (error) {
    console.error("Error fetching services for sitemap:", error);

    return [];
  }
}

export async function GET() {
  let services = await getServiceSlugs();

  if (services.length === 0) {
    services = fallbackServiceSlugs.map((slug) => ({
      slug,
      lastModified: new Date(),
    }));
  }

  const baseUrl = "https://www.wwduae.com";

  const urls = services
    .map(
      ({ slug, lastModified }) => `
  <url>
    <loc>${baseUrl}/services/${encodeURIComponent(slug)}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
  </url>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
