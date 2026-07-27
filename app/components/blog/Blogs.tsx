"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import blog1 from "../../../public/images/service1.webp";
import blog2 from "../../../public/images/service1.webp";
import blog3 from "../../../public/images/service1.webp";
import blog4 from "../../../public/images/service1.webp";
import blog5 from "../../../public/images/service1.webp";
import blog6 from "../../../public/images/service1.webp";

const blogs = [
  {
    image: blog1,
    date: "05 Feb, 2026",
    title: "How Much Does Furniture Upholstery Cost in Dubai",
    href: "/blogs/furniture-upholstery-cost-dubai",
  },
  {
    image: blog2,
    date: "05 Feb, 2026",
    title: "Is Villa Renovation in Dubai Cheaper Than Buying New",
    href: "/blogs/villa-renovation-vs-buying-new",
  },
  {
    image: blog3,
    date: "16 Jan, 2026",
    title: "Bedroom Joinery Ideas for Modern Dubai Apartments",
    href: "/blogs/bedroom-joinery-ideas-dubai",
  },
  {
    image: blog4,
    date: "10 Jan, 2026",
    title: "Top Fit-Out Trends for Commercial Spaces in Dubai",
    href: "/blogs/fit-out-trends-commercial-dubai",
  },
  {
    image: blog5,
    date: "02 Jan, 2026",
    title: "Choosing the Right Wood for Custom Joinery Projects",
    href: "/blogs/choosing-wood-custom-joinery",
  },
  {
    image: blog6,
    date: "28 Dec, 2025",
    title: "A Complete Guide to Turnkey Fit-Out Solutions",
    href: "/blogs/turnkey-fit-out-guide",
  },
];

const TOTAL_PAGES = 5;

export default function Blogs() {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    if (page < 1 || page > TOTAL_PAGES) return;
    setCurrentPage(page);
  };

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <Link
              key={index}
              href={blog.href}
              className="group flex h-full flex-col bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image + Date Badge */}
              <div className="relative h-[340px] w-full overflow-hidden sm:h-[380px] md:h-[400px]">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/50" />

                {/* Date badge — ribbon shape, notched right edge */}
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

              {/* Content */}
              <div className="flex min-h-[130px] flex-1 flex-col justify-center px-6 py-6">
                <h3 className="text-lg font-bold leading-7 text-[#0c1526] transition-colors duration-500 group-hover:text-[#db5e41] sm:text-xl">
                  {blog.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-2 sm:mt-16">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-11 w-11 items-center justify-center bg-[#d9c5bd] text-white transition hover:bg-[#db5e41] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center text-sm font-semibold transition ${
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
            disabled={currentPage === TOTAL_PAGES}
            aria-label="Next page"
            className="flex h-11 w-11 items-center justify-center bg-[#d9c5bd] text-white transition hover:bg-[#db5e41] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}