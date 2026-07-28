"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import fallbackImage from "../../../public/images/service1.webp";

interface WorkImageApiItem {
  _id?: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
}

interface HomeWorksApiResponse {
  images: WorkImageApiItem[];
}

interface GalleryImage {
  id: string;
  src: string;
  title: string;
}

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";
const COLUMN_COUNT = 4;

function resolveImage(path: string): string {
  if (!path) return fallbackImage.src;
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function splitIntoColumns(images: GalleryImage[], columnCount: number): GalleryImage[][] {
  const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
  images.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });
  return columns;
}

const defaultImages: GalleryImage[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  src: fallbackImage.src,
  title: `Project photo ${i + 1}`,
}));

function GalleryGridSkeleton() {
  const skeletonColumns = splitIntoColumns(defaultImages, COLUMN_COUNT);

  return (
    <section className="relative mb-19 w-full bg-white">
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4 sm:gap-x-5">
        {skeletonColumns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((image) => (
              <div
                key={image.id}
                className="relative w-full animate-pulse overflow-hidden bg-gray-200"
                style={{ aspectRatio: "3 / 4" }}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function GalleryGrid() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get<HomeWorksApiResponse>("/home-works");
        const mapped = [...(res.data.images || [])]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((img, index) => ({
            id: img._id || `${img.url}-${index}`,
            src: resolveImage(img.url),
            title: img.title || `Project photo ${index + 1}`,
          }));

        setImages(mapped.length > 0 ? mapped : defaultImages);
      } catch (err) {
        console.error("Failed to fetch our works gallery:", err);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) return <GalleryGridSkeleton />;
  if (!images) return null;

  const columns = splitIntoColumns(images, COLUMN_COUNT);

  return (
    <section className="relative mb-19 w-full bg-white">
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-4 sm:gap-x-5">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col">
            {column.map((image) => (
              <div
                key={image.id}
                className="group relative w-full overflow-hidden"
                style={{ aspectRatio: "3 / 4" }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  unoptimized={
                    image.src.startsWith("http") || image.src.startsWith(IMAGE_BASE_URL)
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/50" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
