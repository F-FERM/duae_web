"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import api from "@/lib/axios";
import { InlineLinkedText } from "../InlineLinkedText";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface ContactField {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface ContactData {
  title: string;
  description: string;
  fields: ContactField[];
  inlineLinks?: InlineLink[];
}

interface ServiceDetailApiResponse {
  contact: ContactData;
}

// Fallback data
const defaultContact: ContactData = {
  title: "Need Expert Joinery Services in Dubai?",
  description:
    "We're here to help you create joinery that truly fits your space and style. Whether it's custom furniture, wardrobes, doors, kitchens, or office fittings – our skilled craftsmen turn your ideas into reality. With quality materials and careful attention to detail, we make sure every piece is built to last and designed to impress.",
  fields: [
    { name: "name", type: "text", placeholder: "Name", required: true },
    { name: "phone", type: "tel", placeholder: "Phone", required: true },
    { name: "email", type: "email", placeholder: "Email", required: true },
    {
      name: "message",
      type: "textarea",
      placeholder: "Type Messages",
      required: true,
    },
  ],
  inlineLinks: [],
};

function ContactFormSkeleton() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-1 border border-gray-200 lg:grid-cols-2">
          <div className="border-b border-gray-200 p-6 sm:p-15 lg:border-b-0 lg:border-r">
            <div className="h-10 w-3/4 animate-pulse rounded-md bg-gray-200" />
            <div className="mt-6 h-20 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-8 h-14 w-48 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="flex flex-col p-6 sm:p-10">
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-4 h-32 w-full animate-pulse rounded-md bg-gray-200" />
            <div className="mt-4 h-12 w-full animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactFormSection({ slug }: { slug?: string }) {
  const [contactData, setContactData] = useState<ContactData>(defaultContact);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        if (!slug) {
          setContactData(defaultContact);
          setIsLoading(false);
          return;
        }

        const res = await api.get<ServiceDetailApiResponse>(
          `/services/detail/${slug}`,
        );

        if (res.data.contact) {
          setContactData({
            title: res.data.contact.title || defaultContact.title,
            description:
              res.data.contact.description || defaultContact.description,
            fields: res.data.contact.fields || defaultContact.fields,
            inlineLinks: res.data.contact.inlineLinks || [],
          });
        } else {
          setContactData(defaultContact);
        }
      } catch (err) {
        console.error("Failed to fetch contact section:", err);
        setContactData(defaultContact);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();
  }, [slug]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Sending..." });

    try {
      // TODO: Replace with your actual API endpoint
      const response = await api.post("/contact", formData);
      setFormStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({});

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus({ type: "idle", message: "" });
      }, 5000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setFormStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    }
  };

  if (isLoading) return <ContactFormSkeleton />;

  const { title, description, fields, inlineLinks } = contactData;

  // Get the WhatsApp number from environment or use default
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "971527875262";

  return (
    <section className="bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-1 border border-gray-200 lg:grid-cols-2">
          {/* Left column — info panel */}
          <div className="relative overflow-hidden border-b border-gray-200 p-6 sm:p-15 lg:border-b-0 lg:border-r">
            {/* Decorative corner shape */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44">
              <div className="absolute h-40 w-40 rounded-full bg-[#eeb7a4]" />
              <div className="absolute left-8 top-10 h-30 w-30 rounded-full bg-[#db5e41]" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl text-center">
                <InlineLinkedText
                  text={title}
                  links={inlineLinks || []}
                  className="inline"
                  linkClassName="inline-block cursor-pointer font-bold text-[#0c1526] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#db5e41] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
                />
              </h2>

              <div className="mx-auto mt-10 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
                <InlineLinkedText
                  text={description}
                  links={inlineLinks || []}
                  className="inline"
                  linkClassName="inline-block cursor-pointer font-medium text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-4 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded"
                />
              </div>

              <motion.div>
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-8 flex h-14 w-fit items-center overflow-hidden bg-[#5aa64d] px-8 text-sm font-bold tracking-wide text-white md:text-base"
                >
                  <span className="absolute inset-0 translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-black">
                    <MessageCircle size={20} />
                    WHATSAPP US
                  </span>
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* Right column — form */}
          <form onSubmit={handleSubmit} className="flex flex-col p-6 sm:p-10">
            {fields.length > 0 && (
              <>
                {/* Name and Phone - side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {fields.slice(0, 2).map((field, index) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      className={`border border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] ${
                        index === 0 ? "sm:border-r-0" : ""
                      }`}
                    />
                  ))}
                </div>

                {/* Email */}
                {fields.length > 2 && (
                  <input
                    type="email"
                    name={fields[2].name}
                    placeholder={fields[2].placeholder}
                    value={formData[fields[2].name] || ""}
                    onChange={handleChange}
                    required={fields[2].required}
                    className="border border-t-0 border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41]"
                  />
                )}

                {/* Message (textarea) */}
                {fields.length > 3 && (
                  <textarea
                    name={fields[3].name}
                    placeholder={fields[3].placeholder}
                    value={formData[fields[3].name] || ""}
                    onChange={handleChange}
                    required={fields[3].required}
                    rows={5}
                    className="resize-y border border-t-0 border-gray-200 px-4 py-4 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41]"
                  />
                )}
              </>
            )}

            {/* Status Message */}
            {formStatus.type === "success" && (
              <div className="mt-3 text-sm font-medium text-green-600">
                {formStatus.message}
              </div>
            )}
            {formStatus.type === "error" && (
              <div className="mt-3 text-sm font-medium text-red-600">
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus.type === "loading"}
              className={`mt-4 w-full py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 sm:text-base ${
                formStatus.type === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#453a30] hover:bg-[#db5e41]"
              }`}
            >
              {formStatus.type === "loading" ? "SENDING..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
