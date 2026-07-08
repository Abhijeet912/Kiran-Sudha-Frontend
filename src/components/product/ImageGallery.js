"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

/** PDP gallery — main image + thumbnail strip. */
export default function ImageGallery({ images = [], name = "Product" }) {
  const sorted = useMemo(() => {
    return [...images]
      .filter((img) => img && (img.imageUrl || typeof img === "string"))
      .sort((a, b) => {
        const pa = a.isPrimary ? -1 : 0;
        const pb = b.isPrimary ? -1 : 0;
        if (pa !== pb) return pa - pb;
        return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
      })
      .map((img) =>
        typeof img === "string"
          ? { imageUrl: img, altText: name }
          : img
      );
  }, [images, name]);

  const [idx, setIdx] = useState(0);
  const current = sorted[Math.min(idx, sorted.length - 1)] || null;

  if (!current) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-cream ring-1 ring-ink/5">
        <span className="flex items-baseline gap-1 font-display text-4xl text-forest/30">
          KS
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-vermilion/40"
          />
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/5">
        <Image
          key={current.imageUrl}
          src={current.imageUrl}
          alt={current.altText || name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.imageUrl ?? i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === idx}
              className={`relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-lg bg-cream transition-shadow sm:w-20 ${
                i === idx
                  ? "ring-2 ring-forest"
                  : "ring-1 ring-ink/10 hover:ring-forest/50"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
