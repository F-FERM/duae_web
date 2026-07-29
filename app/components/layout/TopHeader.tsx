"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

import logo from "../../../public/images/duae_logo.jpg";

export default function TopHeader() {
  return (
    <header className="relative bg-white">
      <div className="mx-auto max-w-[1220px] px-4">
        <div className="flex flex-col items-center justify-between gap-8 py-10 lg:flex-row lg:gap-10">

          {/* Logo */}

          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={logo}
                alt="Wood World Decor"
                width={185}
                height={140}
                priority
                className="h-auto w-[170px] lg:w-[190px]"
              />
            </Link>
          </div>

          {/* Contact */}

          <div className="flex flex-col gap-6 md:flex-row md:gap-10 lg:gap-14">

            {/* Location */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f4]">
                <MapPin
                  className="text-[#db5e41]"
                  size={26}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-[17px] text-gray-500">
                  Location
                </p>

                <h4 className="font-semibold text-[#202020] leading-7">
                  Al Quoz Industrial Area 1,
                  <br />
                  Dubai, UAE
                </h4>
              </div>

            </div>

            <div className="hidden h-16 w-px bg-gray-200 lg:block" />

            {/* Email */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f4]">
                <Mail
                  className="text-[#db5e41]"
                  size={26}
                  strokeWidth={1.8}
                />
              </div>

              <div>

                <p className="text-[17px] text-gray-500">
                  Email Now!
                </p>

                <a
                  href="mailto:info@wwduae.ae"
                  className="font-semibold text-[#202020] hover:text-[#db5e41]"
                >
                  info@wwduae.ae
                </a>

              </div>

            </div>

            <div className="hidden h-16 w-px bg-gray-200 lg:block" />

            {/* Phone */}

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f6f4]">
                <Phone
                  className="text-[#db5e41]"
                  size={26}
                  strokeWidth={1.8}
                />
              </div>

              <div>

                <p className="text-[17px] text-gray-500">
                  Phone Number
                </p>

                <a
                  href="tel:+971527875262"
                  className="block font-semibold text-[#202020] hover:text-[#db5e41]"
                >
                  +971 52 787 5262
                </a>

                <a
                  href="tel:+971565066845"
                  className="block font-semibold text-[#202020] hover:text-[#db5e41]"
                >
                  +971 56 506 6845
                </a>

              </div>

            </div>

          </div>

        </div>
      </div>
    </header>
  );
}