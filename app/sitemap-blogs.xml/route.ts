import { NextResponse } from "next/server";

export const revalidate = 3600;

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_URL = "https://www.wwduae.com";

interface Blog {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  isPublished?: boolean;
}

interface BlogsResponse {
  data: Blog[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

async function getAllBlogs(): Promise<Blog[]> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not configured");
    return [];
  }

  try {
    const firstResponse = await fetch(`${API_URL}/blogs?page=1&limit=100`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!firstResponse.ok) {
      throw new Error(`Failed to fetch blogs: ${firstResponse.status}`);
    }

    const firstPage: BlogsResponse = await firstResponse.json();

    let allBlogs = firstPage.data || [];

    const totalPages = firstPage.meta?.totalPages || 1;

    if (totalPages > 1) {
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) => index + 2).map(
          async (page) => {
            const response = await fetch(
              `${API_URL}/blogs?page=${page}&limit=100`,
              {
                next: {
                  revalidate: 3600,
                },
              },
            );

            if (!response.ok) {
              throw new Error(
                `Failed to fetch blogs page ${page}: ${response.status}`,
              );
            }

            const result: BlogsResponse = await response.json();

            return result.data || [];
          },
        ),
      );

      allBlogs = [...allBlogs, ...remainingPages.flat()];
    }

    return allBlogs;
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    return [];
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const blogs = await getAllBlogs();

  const publishedBlogs = blogs.filter((blog) => blog.isPublished !== false);

  const urls = publishedBlogs
    .filter((blog) => blog.slug)
    .map((blog) => {
      const lastModified =
        blog.updatedAt || blog.createdAt || new Date().toISOString();

      return `
  <url>
    <loc>${escapeXml(`${BASE_URL}/blogs/${blog.slug}`)}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
