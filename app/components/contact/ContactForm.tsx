"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail } from "lucide-react";
import api from "@/lib/axios";

type FormFieldConfig = {
  name: "name" | "phone" | "email" | "message";
  type: "text" | "tel" | "email" | "textarea";
  placeholder: string;
  required: boolean;
};

type ContactPageData = {
  title: string;
  description: string;
  infoTitle: string;
  infoDescription: string;
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  formButtonText: string;
  formFields: FormFieldConfig[];
};

type ContactFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GetInTouch() {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loadError, setLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  useEffect(() => {
    let cancelled = false;

    api.get("/contact-page")
      .then((res) => {
        let jsonData = null;
        if (Array.isArray(res.data)) {
          jsonData = res.data.length > 0 ? res.data[0] : null;
        } else if (res.data && typeof res.data === 'object') {
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

  const onSubmit = async (formValues: ContactFormValues) => {
    try {
      await api.post("/contact-submissions", {
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        message: formValues.message,
      });
      reset();
      alert("Your message has been sent! We will get back to you shortly.");
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  if (loadError) {
    return (
      <section className="bg-white py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-[1220px] px-4 text-center text-[#232323]">
          Unable to load contact information right now. Please try again
          later.
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="bg-white py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-[1220px] animate-pulse px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-gray-200 sm:h-12" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
            </div>
            <div className="h-96 rounded bg-gray-100" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: Contact Info */}
          <div>
            <h2 className="text-3xl font-bold leading-tight text-[#0c1526] sm:text-4xl md:text-5xl">
              {data.title}
            </h2>

            <p className="mt-4 max-w-[420px] text-base leading-7 text-[#232323] sm:text-[18px]">
              {data.description}
            </p>

            <div className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#60433e] text-white transition hover:bg-[#db5e41] cursor-pointer sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
                  <MapPin size={24} className="sm:hidden" />
                  <MapPin size={29} className="hidden sm:block" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0c1526] sm:text-xl md:text-[22px]">
                    Address
                  </h3>
                  <p className="mt-1 text-base leading-7 text-[#232323] sm:text-[18px]">
                    {data.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#60433e] text-white transition hover:bg-[#db5e41] cursor-pointer sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
                  <Phone size={20} className="sm:hidden" />
                  <Phone size={22} className="hidden sm:block" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0c1526] sm:text-xl md:text-[22px]">
                    Phone
                  </h3>
                  <a
                    href={`tel:${data.phone1}`}
                    className="mt-1 block text-base leading-7 text-[#232323] transition hover:text-[#db5e41] sm:text-[18px]"
                  >
                    {data.phone1}
                  </a>
                  {data.phone2 && (
                    <a
                      href={`tel:${data.phone2}`}
                      className="mt-1 block text-base leading-7 text-[#232323] transition hover:text-[#db5e41] sm:text-[18px]"
                    >
                      {data.phone2}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#60433e] text-white transition hover:bg-[#db5e41] cursor-pointer sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]">
                  <Mail size={20} className="sm:hidden" />
                  <Mail size={22} className="hidden sm:block" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#0c1526] sm:text-xl md:text-[22px]">
                    Email Address
                  </h3>
                  <a
                    href={`mailto:${data.email}`}
                    className="mt-1 block text-base leading-7 text-[#232323] transition hover:text-[#db5e41] sm:text-[18px]"
                  >
                    {data.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="bg-[#f4ede9] p-5 sm:p-8 md:p-10 lg:p-12">
            <h3 className="text-2xl font-bold leading-tight text-[#0c1526] sm:text-3xl md:text-4xl">
              {data.infoTitle}
            </h3>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-[18px]">
              {data.infoDescription}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4 sm:mt-8 sm:space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {data.formFields
                  .filter((f) => f.type !== "textarea")
                  .map((field) => (
                    <div key={field.name}>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name, {
                          required: field.required
                            ? `${field.placeholder} is required`
                            : false,
                          pattern:
                            field.type === "email"
                              ? {
                                  value: EMAIL_PATTERN,
                                  message: "Enter a valid email address",
                                }
                              : undefined,
                        })}
                        className="w-full border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41] sm:py-3.5"
                      />
                      {errors[field.name] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors[field.name]?.message}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {data.formFields
                .filter((f) => f.type === "textarea")
                .map((field) => (
                  <div key={field.name}>
                    <textarea
                      placeholder={field.placeholder}
                      rows={5}
                      {...register(field.name, {
                        required: field.required
                          ? `${field.placeholder} is required`
                          : false,
                      })}
                      className="w-full resize-y border border-gray-200 bg-white px-4 py-3 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41] sm:py-3.5"
                    />
                    {errors[field.name] && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center bg-[#db5e41] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c74f34] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10 sm:py-4"
              >
                {isSubmitting ? "Sending..." : data.formButtonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}