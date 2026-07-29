"use client";

import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface LocationMapProps {
    /** Business name shown in the card, e.g. "WOOD WORLD DECOR LLC" */
    name?: string;
    /** Full address shown under the name */
    address?: string;
    /** Anything Google Maps can resolve: a place name + address works fine */
    mapQuery?: string;
    /** Optional rating shown next to the name, e.g. 4.1 */
    rating?: number;
    /** Optional review count, e.g. 25 */
    reviewCount?: number;
}

export default function LocationMap({
    name = "WOOD WORLD DECOR LLC",
    address = "Al Qouz Ind. First, Al Quoz, Dubai, United Arab Emirates",
    mapQuery = "Wood World Decor LLC, Al Quoz Industrial Area 1, Dubai, UAE",
    rating,
    reviewCount,
}: LocationMapProps) {
    const encodedQuery = encodeURIComponent(mapQuery);
    const embedSrc = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;
    const viewUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    return (
        <section className="relative w-full">
            {/* Map frame — height steps up per breakpoint, full width always */}
            <div className="relative h-[280px] w-full overflow-hidden sm:h-[380px] md:h-[440px] lg:h-[520px]">
                <iframe
                    title={`Map showing ${name}`}
                    src={embedSrc}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />

                {/* Location card — top-left on larger screens, stacks full-width on mobile */}



                {rating !== undefined && (
                    <div className="mt-2 flex items-center gap-1.5 text-[13px] text-neutral-700">
                        <span className="font-medium">{rating.toFixed(1)}</span>
                        <span className="text-[#f2b600]">★</span>
                        {reviewCount !== undefined && (
                            <span className="text-neutral-500">({reviewCount})</span>
                        )}
                    </div>
                )}
            </div>


        </section >
    );
}