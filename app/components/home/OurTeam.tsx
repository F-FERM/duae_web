"use client";

import Image from "next/image";
import team1 from "../../../public/images/service1.webp";
import team2 from "../../../public/images/service1.webp";
import team3 from "../../../public/images/service1.webp";

const teamPhotos = [
  { image: team1, alt: "Craftsman finishing woodwork" },
  { image: team2, alt: "Wood World Decor team group photo" },
  { image: team3, alt: "Craftsman detailing furniture" },
];

export default function OurTeam() {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1220px] px-4">
        {/* Heading */}
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-3xl font-bold text-[#0c1526] sm:text-4xl md:text-5xl">
            Our Team
          </h2>

          <p className="mx-auto mt-3 text-sm  text-gray-600 sm:text-base ">
            Behind every successful project is our dedicated team, known for
            their creativity, precision, and client-focused approach. With
            over 10 years of industry expertise, masterful detailing, and a
            commitment to on-time project delivery, Wood World Decor stands
            among the leading joinery fitout companies in Dubai. Our team of
            100+ creative professionals collaborates closely with clients to
            transform spaces with style and innovation.
          </p>
        </div>

        {/* Photo Row */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6 cursor-pointer">
  {teamPhotos.map((photo, index) => (
    <div
      key={index}
      className="group relative h-[280px] w-full overflow-hidden sm:h-[320px] md:h-[340px]"
    >
      <Image
        src={photo.image}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/50" />
    </div>
  ))}
</div>
      </div>
    </section>
  );
}