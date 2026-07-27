"use client";

import Image from "next/image";
import Link from "next/link";
import {
 
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import footerBg from "../../../public/images/site-footer-bg.jpg";
import logo from "../../../public/images/duae_logo.jpg";

const services = [
  "Joinery",
  "Fit-Out",
  "Turnkey Fit-Out",
  "Renovation",
  "Metal Works",
  "Upholstery",
];

const quickLinks = [
  "Home",
  "About Us",
  "Our Works",
  "Blogs",
  "Contact Us",
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${footerBg.src})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#241f1d]/95" />

      <div className="relative z-10">

        {/* ========================= */}
        {/* Main Footer */}
        {/* ========================= */}

        <div className="mx-auto max-w-[1280px] px-6 py-20">

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-4">

            {/* Logo */}
            <div>

              <div className="inline-block bg-white p-4 shadow-xl">

                <Image
                  src={logo}
                  alt="Wood World Decor"
                  width={280}
                  height={150}
                  className="object-contain"
                />

              </div>

              <p className="mt-7 max-w-[310px] text-[17px] leading-8 text-white/80">
                Wood World Decor LLC delivers expert joinery,
                fit-out, and renovation solutions with over
                10 years of excellence, transforming spaces
                with quality and style.
              </p>

            </div>

            {/* Services */}

            <div className=" lg:border-white/10 lg:pl-10">

              <h3 className="relative inline-block text-[34px] font-bold text-white">

                <span className="absolute -left-5 top-2 h-2.5 w-2.5 bg-[#db5e41]" />

                Services

              </h3>

              <ul className="mt-8 space-y-5">

                {services.map((item) => (

                  <li key={item}>

                    <Link
                      href="/"
                      className="text-[17px] text-white/60 transition duration-300 hover:translate-x-2 hover:text-[#db5e41]"
                    >
                      {item}
                    </Link>

                  </li>

                ))}

              </ul>

            </div>

            {/* Quick Links */}

            <div className=" lg:border-white/10 lg:pl-10">

              <h3 className="relative inline-block text-[34px] font-bold text-white">

                <span className="absolute -left-5 top-2 h-2.5 w-2.5 bg-[#db5e41]" />

                Quick Links

              </h3>

              <ul className="mt-8 space-y-5">

                {quickLinks.map((item) => (

                  <li key={item}>

                    <Link
                      href="/"
                      className="text-[17px] text-white/60 transition duration-300 hover:translate-x-2 hover:text-[#db5e41]"
                    >
                      {item}
                    </Link>

                  </li>

                ))}

              </ul>

            </div>

            {/* Contact */}

            <div className=" lg:border-white/10 lg:pl-10">

                <span className="text-[20px] font-semibold text-white">
                  Follow us on:
                </span>
              <div className="flex items-center gap-2">


                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c2725] text-white transition hover:bg-[#db5e41]"
                >
                  <Mail size={18} />
                </a>

                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2c2725] text-white transition hover:bg-[#db5e41]"
                >
                  <Mail size={18} />
                </a>

              </div>

              <div className="mt-10 space-y-4">

                <div className="flex items-start gap-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2725]">

                    <Mail
                      className="text-[#db5e41]"
                      size={18}
                    />

                  </div>

                  <a
                    href="mailto:info@wwduae.ae"
                    className="pt-2 text-[17px] text-white/70 transition hover:text-[#db5e41]"
                  >
                    info@wwduae.ae
                  </a>

                </div>

                <div className="flex items-start gap-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2725]">

                    <Phone
                      className="text-[#db5e41]"
                      size={18}
                    />

                  </div>

                  <div>

                    <a
                      href="tel:+971527875262"
                      className="block text-[17px] text-white/70 hover:text-[#db5e41]"
                    >
                      +971527875262
                    </a>

                    <a
                      href="tel:+971527875262"
                      className="mt-2 block text-[17px] text-white/70 hover:text-[#db5e41]"
                    >
                      +971527875262
                    </a>

                  </div>

                </div>

                <div className="flex items-start gap-5">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2725]">

                    <MapPin
                      className="text-[#db5e41]"
                      size={18}
                    />

                  </div>

                  <p className="text-[17px] leading-8 text-white/70">
                    Al Quoz Industrial Area 1,
                    <br />
                    Dubai, UAE
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 bg-[#211c1a]">

          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-6 text-center lg:flex-row">

            <p className="text-[15px] text-white/70">
              © 2025 Wood World Decor LLC All Rights Reserved
            </p>

            <div className="flex gap-3 text-[15px] text-white/70">

              <Link
                href="/terms"
                className="hover:text-[#db5e41]"
              >
                Terms and Conditions
              </Link>

              <span>|</span>

              <Link
                href="/privacy"
                className="hover:text-[#db5e41]"
              >
                Privacy Policy
              </Link>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}