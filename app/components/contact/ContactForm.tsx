"use client";

import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail } from "lucide-react";

type ContactFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function GetInTouch() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // TODO: wire up to actual API endpoint
      console.log("Contact form submitted:", data);
      reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left: Contact Info */}
          <div>
            <h2 className="text-8xl font-bold text-[#0c1526] sm:text-3xl md:text-5xl">
              Get in Touch with Us
            </h2>

            <p className="mt-4 max-w-[420px] text-[18px] leading-7 text-[#232323] sm:text-[18px]">
              With over 10+ years of experience in joinery, fit-out,
              renovation, and upholstery, we deliver high-quality, customized
              interior solutions for homes, offices, and commercial spaces.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#60433e] text-white hover:bg-[#db5e41] cursor-pointer">
                  <MapPin size={29} />
                </span>
                <div>
                  <h3 className="text-[22px] font-bold text-[#0c1526]">Address</h3>
                  <p className="mt-1 text-[18px] leading-7 text-[#232323] sm:text-[18px]">
                    Al Quoz Industrial Area 1,
                    <br />
                    Dubai, UAE
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#60433e] text-white hover:bg-[#db5e41] cursor-pointer">
                  <Phone size={22} />
                </span>
                <div>
                  <h3 className="text-[22px] font-bold text-[#0c1526]">Phone</h3>
                  <a
                    href="tel:+971527875262"
                    className="mt-1 text-[18px] leading-7 text-[#232323] sm:text-[18px] block transition hover:text-[#db5e41] "
                  >
                    +971 52 787 5262
                  </a>
                  <a
                    href="tel:+971565066845"
                    className="mt-1 text-[18px] leading-7 text-[#232323] sm:text-[18px] block transition hover:text-[#db5e41] "
                  >
                    +971 56 506 6845
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#60433e] hover:bg-[#db5e41] cursor-pointer text-white">
                  <Mail size={22} />
                </span>
                <div>
                  <h3 className="text-[22px] font-bold text-[#0c1526]">
                    Email Address
                  </h3>
                  <a
                    href="mailto:info@wwduae.ae"
                    className="mt-1 text-[18px] leading-7 text-[#232323] sm:text-[18px] block transition hover:text-[#db5e41] "
                  >
                    info@wwduae.ae
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="bg-[#f4ede9] p-6 sm:p-10 md:p-12">
            <h3 className="text-7xl font-bold text-[#0c1526] sm:text-3xl md:text-4xl">
              Fill out the form &amp; get a call back!
            </h3>

            <p className="mt-4 text-[18px] leading-7 text-gray-600 sm:text-[18px]">
              Our experts are ready to discuss your requirements and guide
              you with the best joinery, renovation, fit-out, upholstery, and
              other custom interior solutions for your space. We respond
              within 24 hours and look forward to assisting you.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41]"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    {...register("phone", { required: "Phone is required" })}
                    className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41]"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="w-full border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41]"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Type Messages"
                  rows={5}
                  {...register("message", {
                    required: "Message is required",
                  })}
                  className="w-full resize-y border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0c1526] outline-none placeholder:text-gray-400 focus:border-[#db5e41]"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center bg-[#db5e41] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c74f34] disabled:cursor-not-allowed disabled:opacity-60 sm:px-10 sm:py-4"
              >
                {isSubmitting ? "Sending..." : "Send A Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}