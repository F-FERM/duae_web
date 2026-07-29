"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import api from "@/lib/axios";

type FormFieldConfig = {
  name: "name" | "phone" | "email" | "message";
  type: "text" | "tel" | "email" | "textarea";
  placeholder: string;
  required: boolean;
};

type ContactPageData = {
  title: string; // used as fallback only, this section has its own headline
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  formFields: FormFieldConfig[];
};

type FormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function ContactFormSection() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const [formData, setFormData] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/contact-page")
      .then((res) => {
        let jsonData = null;
        if (Array.isArray(res.data)) {
          jsonData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === "object") {
          jsonData = res.data;
        }
        if (!cancelled) setData(jsonData);
      })
      .catch((err) => {
        console.error("Failed to load contact page content:", err);
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (fields: FormFieldConfig[]) => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    fields.forEach((field) => {
      const value = formData[field.name]?.trim();
      if (field.required && !value) {
        nextErrors[field.name] = `${field.placeholder} is required`;
        return;
      }
      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        nextErrors[field.name] = "Enter a valid email address";
      }
    });
    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data) return;

    const nextErrors = validate(data.formFields);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: wire this up to your actual submit endpoint / API route.
      console.log("Form submitted:", formData);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[1220px] px-4 text-center text-[#232323] sm:px-6">
          Unable to load contact information right now. Please try again
          later.
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-[1220px] px-4 sm:px-6">
          <div className="grid animate-pulse grid-cols-1 border border-gray-200 lg:grid-cols-2">
            <div className="space-y-4 border-b border-gray-200 p-6 sm:p-10 md:p-14 lg:border-b-0 lg:border-r">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-24 w-full rounded bg-gray-100" />
            </div>
            <div className="h-72 rounded bg-gray-100 p-6 sm:p-8 md:p-10" />
          </div>
        </div>
      </section>
    );
  }

  const contactItems = [
    {
      icon: Phone,
      label: "Phone Number",
      lines: [data.phone1, data.phone2].filter(Boolean),
    },
    {
      icon: Mail,
      label: "Mail",
      lines: [data.email],
    },
    {
      icon: MapPin,
      label: "Address",
      lines: [data.address],
    },
  ];

  const textFields = data.formFields.filter((f) => f.type !== "textarea");
  const textareaFields = data.formFields.filter((f) => f.type === "textarea");

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6">
        <div className="grid grid-cols-1 border border-gray-200 lg:grid-cols-2">
          {/* Left column — info panel */}
          <div className="relative overflow-hidden border-b border-gray-200 p-6 sm:p-10 md:p-14 lg:border-b-0 lg:border-r">
            {/* Decorative corner shape */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 sm:-left-14 sm:-top-14 sm:h-36 sm:w-36 md:-left-16 md:-top-16 md:h-44 md:w-44">
              <div className="absolute h-full w-full rounded-full bg-[#eeb7a4]" />
              <div className="absolute left-[22%] top-[26%] h-[70%] w-[70%] rounded-full bg-[#db5e41]" />
            </div>

            <div className="relative">
              <h2 className="text-2xl font-bold leading-tight text-[#0c1526] sm:text-3xl md:text-4xl lg:text-[2.5rem]">
                Create your dream space with us. Get Started Now!
              </h2>

              <div className="mt-8 flex flex-col sm:mt-10">
                {contactItems.map(({ icon: Icon, label, lines }, i) => (
                  <div
                    key={label}
                    className={`flex items-start gap-4 py-4 sm:py-5 ${
                      i !== 0 ? "border-t border-gray-200" : ""
                    }`}
                  >
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#453a30] sm:h-16 sm:w-16 md:h-18 md:w-18">
                      <Icon size={20} className="text-white sm:hidden" strokeWidth={2} />
                      <Icon
                        size={22}
                        className="hidden text-white sm:block"
                        strokeWidth={2}
                      />
                    </span>
                    <div className="min-w-0 pt-1">
                      <p className="text-sm text-gray-500 sm:text-[18px]">
                        {label}
                      </p>
                      {lines.map((line) => (
                        <p
                          key={line}
                          className="break-words text-sm font-semibold text-[#0c1526] sm:text-[18px]"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col p-6 sm:p-8 md:p-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {textFields.map((field, i) => (
                <div key={field.name}>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`w-full border border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4 ${
                      i === 0 ? "sm:border-r-0" : ""
                    } ${i > 0 ? "border-t-0 sm:border-t" : ""}`}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {textareaFields.map((field) => (
              <div key={field.name}>
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-y border border-t-0 border-gray-200 px-4 py-3.5 text-sm text-[#0c1526] placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#db5e41] sm:py-4"
                />
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full bg-[#453a30] py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors duration-300 hover:bg-[#db5e41] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}