import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://www.wwduae.com";

  const pages = [
    {
      url: "/",
      lastModified: new Date(),
    },
    {
      url: "/about",
      lastModified: new Date(),
    },
    {
      url: "/blogs",
      lastModified: new Date(),
    },
    {
      url: "/contact",
      lastModified: new Date(),
    },
    {
      url: "/our-works",
      lastModified: new Date(),
    },
  ];

  const urls = pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
  </url>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
