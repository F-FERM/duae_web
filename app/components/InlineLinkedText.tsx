"use client";

import React from "react";

interface InlineLink {
  text: string;
  url: string;
  type: string;
  openInNewTab: boolean;
  position: number;
}

interface InlineLinkedTextProps {
  text: string;
  links?: InlineLink[];
  className?: string;
  linkClassName?: string;
}

export function InlineLinkedText({
  text,
  links = [],
  className = "",
  linkClassName = "",
}: InlineLinkedTextProps) {
  if (!links || links.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Sort links by position (use position field if available, otherwise find in text)
  const sortedLinks = [...links].sort((a, b) => {
    // Use position field if available and both have it
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    // Otherwise find position in text
    const posA = text.indexOf(a.text);
    const posB = text.indexOf(b.text);
    return posA - posB;
  });

  // Create a map of positions to links, handling overlapping links
  const linkMap = new Map<number, InlineLink>();
  const usedPositions = new Set<number>();

  for (const link of sortedLinks) {
    // Find all occurrences of the link text
    let startIndex = 0;
    let found = false;

    while (startIndex < text.length) {
      const pos = text.indexOf(link.text, startIndex);
      if (pos === -1) break;

      // Check if this position is already used by another link
      let isOverlapping = false;
      for (const usedPos of usedPositions) {
        const usedLink = linkMap.get(usedPos);
        if (usedLink) {
          const usedEnd = usedPos + usedLink.text.length;
          const linkEnd = pos + link.text.length;
          // Check if links overlap
          if (
            (pos >= usedPos && pos < usedEnd) ||
            (usedPos >= pos && usedPos < linkEnd)
          ) {
            isOverlapping = true;
            break;
          }
        }
      }

      if (!isOverlapping) {
        linkMap.set(pos, link);
        usedPositions.add(pos);
        found = true;
        break;
      }

      startIndex = pos + 1;
    }
  }

  // If no links found in text, return plain text
  if (linkMap.size === 0) {
    return <span className={className}>{text}</span>;
  }

  // Build the linked text
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Get sorted positions
  const positions = Array.from(linkMap.keys()).sort((a, b) => a - b);

  for (const pos of positions) {
    const link = linkMap.get(pos)!;
    const linkStart = pos;
    const linkEnd = pos + link.text.length;

    // Add text before the link
    if (linkStart > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, linkStart)}
        </span>,
      );
    }

    // Add the linked text
    const defaultLinkClass =
      "inline-block cursor-pointer font-semibold text-[#db5e41] underline decoration-[#db5e41]/30 underline-offset-2 transition-all duration-200 hover:text-[#c94f35] hover:decoration-[#db5e41] focus:outline-none focus:ring-2 focus:ring-[#db5e41] focus:ring-offset-2 rounded";

    parts.push(
      <button
        key={`link-${pos}`}
        onClick={() => {
          if (link.openInNewTab) {
            window.open(link.url, "_blank", "noopener,noreferrer");
          } else {
            window.location.href = link.url;
          }
        }}
        className={linkClassName || defaultLinkClass}
        title={`Link to: ${link.url}`}
        aria-label={`${link.text} (link)`}
      >
        {link.text}
      </button>,
    );

    lastIndex = linkEnd;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>,
    );
  }

  return <span className={className}>{parts}</span>;
}
