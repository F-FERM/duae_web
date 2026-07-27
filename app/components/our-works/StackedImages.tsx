"use client";

import Image from "next/image";
import gallery1 from "../../../public/images/service1.webp";
import gallery2 from "../../../public/images/service1.webp";
import gallery3 from "../../../public/images/service1.webp";
import gallery4 from "../../../public/images/service1.webp";
import gallery5 from "../../../public/images/service1.webp";
import gallery6 from "../../../public/images/service1.webp";
import gallery7 from "../../../public/images/service1.webp";
import gallery8 from "../../../public/images/service1.webp";
import gallery9 from "../../../public/images/service1.webp";
import gallery10 from "../../../public/images/service1.webp";

// 10 images split into 4 columns (masonry-style, uneven column lengths)
const columns = [
  [gallery1, gallery5, gallery9],
  [gallery2, gallery6, gallery10],
  [gallery3, gallery7],
  [gallery4, gallery8],
];

export default function GalleryGrid() {
  return (
    <section className="relative w-full bg-white mb-19">
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4 sm:gap-x-5">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((image, imgIndex) => (
              <div
                key={imgIndex}
                className="group relative w-full overflow-hidden"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={image}
                  alt={`Project photo ${colIndex * 10 + imgIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/50" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}