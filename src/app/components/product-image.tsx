"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useEffect } from "react";

type ProductImageProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  query?: string;
  className?: string;
};

export function ProductImage({ src, fallbackSrc, alt, query, className }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    if (!query || !currentSrc.startsWith("data:image")) return;

    let cancelled = false;
    fetch(`/api/product-image?q=${encodeURIComponent(query)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { imageUrl?: string } | null) => {
        if (!cancelled && data?.imageUrl) setCurrentSrc(data.imageUrl);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [currentSrc, query]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
