"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Clock, Phone, Mail } from "lucide-react";
import api from "@/lib/axios";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ContentBlock {
  type: string;
  content: string;
  items?: string[];
  isNumbered?: boolean;
  level?: number;
  inlineLinks?: InlineLink[];
}

interface BlogApiItem {
  _id?: string;
  title: string;
  slug: string;
  image: string;
  date: string;
  content?: ContentBlock[] | string;
  description?: string | Record<string, unknown>[] | unknown;
  category?: string;
  tags?: string[];
  order?: number;
  inlineLinks?: InlineLink[];
}

interface RelatedBlog {
  id: string;
  title: string;
  date: string;
  href: string;
}

interface ContactPageData {
  phone1: string;
  email: string;
}

/**
 * Converts content blocks into renderable React nodes with inline link support
 */
function renderContentBlocks(
  blocks: ContentBlock[] | string | undefined,
): React.ReactNode {
  if (!blocks) return null;

  // If it's a string, render as plain text
  if (typeof blocks === "string") {
    return <p>{blocks}</p>;
  }

  // If it's an array of content blocks
  if (Array.isArray(blocks)) {
    return blocks.map((block, index) => {
      const inlineLinks = block.inlineLinks || [];
      const linkClassName =
        "inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded";

      switch (block.type) {
        case "heading": {
          const level = block.level || 2;
          // Use a map of heading levels to components
          const HeadingComponent = ({
            children,
            className,
          }: {
            children: React.ReactNode;
            className?: string;
          }) => {
            switch (level) {
              case 1:
                return (
                  <h1
                    className={
                      className || "text-3xl font-bold mt-8 mb-4 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h1>
                );
              case 2:
                return (
                  <h2
                    className={
                      className || "text-2xl font-bold mt-8 mb-4 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h2>
                );
              case 3:
                return (
                  <h3
                    className={
                      className || "text-xl font-bold mt-6 mb-3 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h3>
                );
              case 4:
                return (
                  <h4
                    className={
                      className || "text-lg font-bold mt-4 mb-2 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h4>
                );
              default:
                return (
                  <h2
                    className={
                      className || "text-2xl font-bold mt-8 mb-4 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h2>
                );
            }
          };

          return (
            <HeadingComponent
              key={index}
              className="text-2xl font-bold mt-8 mb-4 text-[#0c1526]"
            >
              <InlineLinkedText
                text={block.content}
                links={inlineLinks}
                linkClassName="inline-block cursor-pointer font-bold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </HeadingComponent>
          );
        }

        case "subheading": {
          const level = block.level || 3;
          const SubHeadingComponent = ({
            children,
            className,
          }: {
            children: React.ReactNode;
            className?: string;
          }) => {
            switch (level) {
              case 3:
                return (
                  <h3
                    className={
                      className || "text-xl font-bold mt-6 mb-3 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h3>
                );
              case 4:
                return (
                  <h4
                    className={
                      className || "text-lg font-bold mt-4 mb-2 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h4>
                );
              default:
                return (
                  <h3
                    className={
                      className || "text-xl font-bold mt-6 mb-3 text-[#0c1526]"
                    }
                  >
                    {children}
                  </h3>
                );
            }
          };

          return (
            <SubHeadingComponent
              key={index}
              className="text-xl font-bold mt-6 mb-3 text-[#0c1526]"
            >
              <InlineLinkedText
                text={block.content}
                links={inlineLinks}
                linkClassName="inline-block cursor-pointer font-bold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </SubHeadingComponent>
          );
        }

        case "paragraph":
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              <InlineLinkedText
                text={block.content}
                links={inlineLinks}
                linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </p>
          );

        case "list": {
          const ListTag = block.isNumbered ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={`${block.isNumbered ? "list-decimal" : "list-disc"} pl-6 mb-4 space-y-2`}
            >
              {block.items?.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700">
                  <InlineLinkedText
                    text={item}
                    links={inlineLinks}
                    linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
                  />
                </li>
              ))}
            </ListTag>
          );
        }

        case "quote":
          return (
            <blockquote
              key={index}
              className="border-l-4 border-[#db5e41] pl-4 italic my-6 text-gray-700"
            >
              <InlineLinkedText
                text={block.content}
                links={inlineLinks}
                linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </blockquote>
          );

        case "image":
          return (
            <div key={index} className="my-6">
              <Image
                src={block.content}
                alt="Blog image"
                width={800}
                height={400}
                className="rounded-lg object-cover w-full"
                unoptimized={block.content.startsWith("http")}
              />
            </div>
          );

        default:
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              <InlineLinkedText
                text={block.content}
                links={inlineLinks}
                linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
              />
            </p>
          );
      }
    });
  }

  return null;
}

function ContentSkeleton() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex-1 min-w-0">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200 mb-4" />
            <div className="h-[400px] w-full animate-pulse rounded bg-gray-200 mb-8" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-gray-200"
                />
              ))}
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-6" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 mb-6">
                <div className="h-20 w-20 shrink-0 animate-pulse rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BlogDetailContent({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogApiItem | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [contact, setContact] = useState<ContactPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<BlogApiItem>(`/blogs/detail/${slug}`);
        setBlog(res.data);

        const relatedRes = await api.get<
          BlogApiItem[] | { data?: BlogApiItem[]; blogs?: BlogApiItem[] }
        >("/blogs", {
          params: { limit: 5 },
        });

        const raw = Array.isArray(relatedRes.data)
          ? relatedRes.data
          : (relatedRes.data.data ?? relatedRes.data.blogs ?? []);

        const mapped: RelatedBlog[] = raw
          .filter((b) => b.slug !== slug)
          .slice(0, 4)
          .map((b, i) => ({
            id: b._id || `${b.slug}-${i}`,
            title: b.title,
            date: b.date,
            href: `/blogs/${b.slug}`,
          }));

        setRelatedBlogs(mapped);

        api
          .get("/contact-page")
          .then((contactRes) => {
            const contactRaw = Array.isArray(contactRes.data)
              ? contactRes.data[0]
              : contactRes.data;
            if (contactRaw) setContact(contactRaw);
          })
          .catch((err) => {
            console.error("Failed to load contact page content:", err);
          });
      } catch (err) {
        console.error("Failed to fetch blog detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) return <ContentSkeleton />;
  if (!blog) {
    return (
      <section className="bg-white py-24 text-center">
        <p className="text-lg text-gray-500">Blog post not found.</p>
        <Link
          href="/blogs"
          className="mt-4 inline-block text-[#db5e41] hover:underline"
        >
          ← Back to Blogs
        </Link>
      </section>
    );
  }

  // Check if content is array of blocks or string
  const isBlockArray = Array.isArray(blog.content);
  const renderedContent = isBlockArray
    ? renderContentBlocks(blog.content as ContentBlock[])
    : renderContentBlocks(blog.content as string);

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* ── Main Article ── */}
          <article className="flex-1 min-w-0">
            {/* Orange pill date badge */}
            <div className="mb-6">
              <span className="inline-block rounded-full bg-[#db5e41] px-5 py-1.5 text-sm font-semibold text-white">
                {blog.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl mb-6">
              {blog.title}
            </h1>

            {/* Decorative divider with gear icon */}
            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-px bg-gray-200" />
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#db5e41]">
                <Settings size={18} />
              </span>
            </div>

            {/* Blog content with inline link support */}
            <div className="prose prose-lg max-w-none">
              {renderedContent || (
                <p className="text-gray-500 italic">
                  No content available for this post.
                </p>
              )}
            </div>
          </article>

          {/* ── Sidebar ── */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-6">
            {/* ── Latest Blogs Card ── */}
            {relatedBlogs.length > 0 && (
              <div className="border border-gray-200 p-6 relative">
                <span className="absolute left-4 top-4 h-3 w-3 rounded-full bg-[#f5c5b8]" />

                <h3 className="mb-1 text-xl font-bold text-[#0c1526]">
                  Latest Blogs
                </h3>
                <div className="mb-6 h-[3px] w-10 bg-[#db5e41]" />

                <ul className="space-y-5">
                  {relatedBlogs.map((related) => (
                    <li key={related.id} className="relative">
                      <span className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f5c5b8] opacity-50" />

                      <Link href={related.href} className="group block">
                        <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock
                            size={13}
                            className="shrink-0 text-[#db5e41]"
                          />
                          <span>{related.date}</span>
                        </div>
                        <p className="text-sm font-semibold leading-snug text-[#db5e41] transition group-hover:text-[#c44e31] line-clamp-2">
                          {related.title}
                        </p>
                      </Link>

                      {relatedBlogs.indexOf(related) <
                        relatedBlogs.length - 1 && (
                        <div className="mt-4 border-t border-gray-100" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── Contact Us Box ── */}
            <div className="overflow-hidden bg-[#db5e41] px-8 py-12 text-center text-white relative">
              <span className="pointer-events-none absolute -left-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10" />
              <span className="pointer-events-none absolute -right-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-white/10" />

              <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Phone size={26} className="text-[#db5e41]" />
              </div>

              <h4 className="relative z-10 mb-5 text-xl font-semibold tracking-wide">
                Contact Us
              </h4>

              <a
                href={`tel:${contact?.phone1 ?? "+971565066845"}`}
                className="relative z-10 mb-2 block text-lg font-bold tracking-wider hover:underline"
              >
                {contact?.phone1 ?? "+971 56 506 6845"}
              </a>

              <a
                href={`mailto:${contact?.email ?? "marketing@wwduae.ae"}`}
                className="relative z-10 flex items-center justify-center gap-1.5 text-sm text-white/85 hover:text-white hover:underline"
              >
                <Mail size={14} />
                {contact?.email ?? "marketing@wwduae.ae"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
