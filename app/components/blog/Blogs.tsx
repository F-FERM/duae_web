"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import fallbackImage from "../../../public/images/service1.webp";

interface BlogApiItem {
  _id?: string;
  title: string;
  slug: string;
  image: string;
  date: string;
  order?: number;
}

interface BlogsPaginatedResponse {
  data?: BlogApiItem[];
  blogs?: BlogApiItem[];
  items?: BlogApiItem[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

interface BlogItem {
  id: string;
  image: string;
  date: string;
  title: string;
  href: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";
const BLOGS_PER_PAGE = 6;

function resolveImage(path: string): string {
  if (!path) return fallbackImage.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function mapApiToBlogItem(blog: BlogApiItem, index: number): BlogItem {
  return {
    id: blog._id || `${blog.slug}-${index}`,
    image: resolveImage(blog.image),
    date: blog.date,
    title: blog.title,
    href: `/blogs/${blog.slug}`,
  };
}

function parseBlogsResponse(
  payload: BlogApiItem[] | BlogsPaginatedResponse,
  page: number
) {
  if (Array.isArray(payload)) {
    const hasNextPage = payload.length === BLOGS_PER_PAGE;
    return {
      items: payload,
      totalPages: hasNextPage ? Math.max(page + 1, 2) : page,
      hasNextPage,
    };
  }

  const items = payload.data ?? payload.blogs ?? payload.items ?? [];
  const hasNextPage =
    payload.hasMore ??
    (payload.totalPages != null
      ? page < payload.totalPages
      : payload.total != null
        ? page * BLOGS_PER_PAGE < payload.total
        : items.length === BLOGS_PER_PAGE);

  const totalPages =
    payload.totalPages ??
    (payload.total != null
      ? Math.max(1, Math.ceil(payload.total / BLOGS_PER_PAGE))
      : hasNextPage
        ? page + 1
        : page);

  return { items, totalPages, hasNextPage };
}

const defaultBlogs: BlogItem[] = [
  {
    id: "1",
    image: fallbackImage.src,
    date: "05 Feb, 2026",
    title: "How Much Does Furniture Upholstery Cost in Dubai",
    href: "/blogs/furniture-upholstery-cost-dubai",
  },
  {
    id: "2",
    image: fallbackImage.src,
    date: "05 Feb, 2026",
    title: "Is Villa Renovation in Dubai Cheaper Than Buying New",
    href: "/blogs/villa-renovation-vs-buying-new",
  },
  {
    id: "3",
    image: fallbackImage.src,
    date: "16 Jan, 2026",
    title: "Bedroom Joinery Ideas for Modern Dubai Apartments",
    href: "/blogs/bedroom-joinery-ideas-dubai",
  },
  {
    id: "4",
    image: fallbackImage.src,
    date: "10 Jan, 2026",
    title: "Top Fit-Out Trends for Commercial Spaces in Dubai",
    href: "/blogs/fit-out-trends-commercial-dubai",
  },
  {
    id: "5",
    image: fallbackImage.src,
    date: "02 Jan, 2026",
    title: "Choosing the Right Wood for Custom Joinery Projects",
    href: "/blogs/choosing-wood-custom-joinery",
  },
  {
    id: "6",
    image: fallbackImage.src,
    date: "28 Dec, 2025",
    title: "A Complete Guide to Turnkey Fit-Out Solutions",
    href: "/blogs/turnkey-fit-out-guide",
  },
];

function BlogsSkeleton() {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: BLOGS_PER_PAGE }, (_, i) => (
            <div key={i} className="flex h-full flex-col bg-white shadow-sm">
              <div className="relative h-[340px] w-full animate-pulse bg-gray-200 sm:h-[380px] md:h-[400px]" />
              <div className="flex min-h-[130px] flex-1 flex-col justify-center px-6 py-6">
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-200" />
                <div className="mt-3 h-6 w-4/5 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const fetchBlogs = useCallback(async (page: number) => {
    setIsFetching(true);

    try {
      const res = await api.get<BlogApiItem[] | BlogsPaginatedResponse>("/blogs", {
        params: {
          page,
          limit: BLOGS_PER_PAGE,
        },
      });

      const { items, totalPages: pages, hasNextPage: nextPage } = parseBlogsResponse(
        res.data,
        page
      );

      const mapped = items
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(mapApiToBlogItem);

      if (mapped.length === 0) {
        if (page === 1) {
          setBlogs(defaultBlogs);
          setTotalPages(1);
          setHasNextPage(false);
          setUseFallback(true);
        } else {
          setTotalPages(Math.max(1, page - 1));
          setHasNextPage(false);
          setCurrentPage(Math.max(1, page - 1));
        }
        return;
      }

      setUseFallback(false);
      setBlogs(mapped);
      setTotalPages((prev) => Math.max(prev, pages));
      setHasNextPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);

      if (page === 1) {
        setBlogs(defaultBlogs);
        setTotalPages(1);
        setHasNextPage(false);
        setUseFallback(true);
      }
    } finally {
      setIsInitialLoading(false);
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage, fetchBlogs]);

  const goToPage = (page: number) => {
    if (useFallback || isFetching || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isInitialLoading) return <BlogsSkeleton />;

  const showPagination = !useFallback && (totalPages > 1 || hasNextPage || currentPage > 1);

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div
          className={`grid grid-cols-1 gap-x-8 gap-y-10 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3 ${
            isFetching ? "pointer-events-none opacity-50" : "opacity-100"
          }`}
        >
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={blog.href}
              className="group flex h-full flex-col bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-[340px] w-full overflow-hidden sm:h-[380px] md:h-[400px]">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  unoptimized={
                    blog.image.startsWith("http") || blog.image.startsWith(IMAGE_BASE_URL)
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/50" />

                <span
                  className="absolute bottom-4 left-0 bg-[#db5e41] py-1.5 pl-4 pr-6 text-xs font-semibold text-white sm:text-sm"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)",
                  }}
                >
                  {blog.date}
                </span>
              </div>

              <div className="flex min-h-[130px] flex-1 flex-col justify-center px-6 py-6">
                <h3 className="text-lg font-bold leading-7 text-[#0c1526] transition-colors duration-500 group-hover:text-[#db5e41] sm:text-xl">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {showPagination && (
          <div className="mt-12 flex items-center justify-center gap-2 sm:mt-16">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={isFetching || currentPage === 1}
              aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center bg-[#d9c5bd] text-white transition hover:bg-[#db5e41] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                disabled={isFetching}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`flex h-11 w-11 items-center justify-center text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  currentPage === page
                    ? "bg-[#db5e41] text-white"
                    : "bg-[#d9c5bd] text-white hover:bg-[#c9a99d]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={isFetching || (!hasNextPage && currentPage >= totalPages)}
              aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center bg-[#d9c5bd] text-white transition hover:bg-[#db5e41] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
