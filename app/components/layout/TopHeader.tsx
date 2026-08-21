"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

import logo from "../../../public/images/duae_logo.jpg";

export default function TopHeader() {
  return (
    <header className="relative bg-white">
      <div className="mx-auto w-full max-w-[1220px] px-4">
        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-8
            py-8
            sm:py-9
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-10
            lg:py-10
          "
        >
          {/* =========================================================
              LOGO
              Mobile/Tablet  : Logo only and centered
              Desktop/Laptop : Logo stays on the left
          ========================================================= */}

          <div className="flex w-full flex-shrink-0 items-center justify-center lg:w-auto lg:justify-start">
            <Link
              href="/"
              aria-label="Wood World Decor Home"
              className="flex items-center justify-center"
            >
              <Image
                src={logo}
                alt="Wood World Decor L.L.C."
                width={185}
                height={140}
                priority
                className="
                  h-auto
                  w-[175px]
                  sm:w-[185px]
                  lg:w-[190px]
                "
              />
            </Link>
          </div>

          {/* =========================================================
              CONTACT INFORMATION

              Mobile  : Hidden
              Tablet  : Hidden
              Desktop : Visible
          ========================================================= */}

          <div
            className="
              hidden
              items-center
              gap-6
              lg:flex
              xl:gap-10
            "
          >
            {/* =======================================================
                LOCATION
            ======================================================= */}

            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f8f6f4]
                "
              >
                <MapPin
                  className="text-[#db5e41]"
                  size={26}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-[17px] text-gray-500">Location</p>

                <h4 className="font-semibold leading-7 text-[#202020]">
                  Al Quoz Industrial Area 1,
                  <br />
                  Dubai, UAE
                </h4>
              </div>
            </div>

            {/* =======================================================
                DIVIDER
            ======================================================= */}

            <div className="hidden h-16 w-px bg-gray-200 xl:block" />

            {/* =======================================================
                EMAIL
            ======================================================= */}

            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f8f6f4]
                "
              >
                <Mail className="text-[#db5e41]" size={26} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[17px] text-gray-500">Email Now!</p>

                <a
                  href="mailto:marketing@wwduae.ae"
                  className="
                    font-semibold
                    text-[#202020]
                    transition-colors
                    hover:text-[#db5e41]
                  "
                >
                  marketing@wwduae.ae
                </a>
              </div>
            </div>

            {/* =======================================================
                DIVIDER
            ======================================================= */}

            <div className="hidden h-16 w-px bg-gray-200 xl:block" />

            {/* =======================================================
                PHONE
            ======================================================= */}

            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-14
                  w-14
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#f8f6f4]
                "
              >
                <Phone className="text-[#db5e41]" size={26} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[17px] text-gray-500">Phone Number</p>

                <a
                  href="tel:+971565066845"
                  className="
                    block
                    font-semibold
                    text-[#202020]
                    transition-colors
                    hover:text-[#db5e41]
                  "
                >
                  +971 56 506 6845
                </a>

                <a
                  href="tel:+971527875262"
                  className="
                    block
                    font-semibold
                    text-[#202020]
                    transition-colors
                    hover:text-[#db5e41]
                  "
                >
                  +971 52 787 5262
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
