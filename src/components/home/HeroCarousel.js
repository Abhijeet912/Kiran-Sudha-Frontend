"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

const isExternal = (url) => /^https?:\/\//i.test(url || "");

function SlideLink({ href, children, className }) {
  if (!href) return <div className={className}>{children}</div>;
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * Homepage hero carousel — admin-managed HERO banners (4–8 active),
 * auto-scrolls every 5s, pauses on hover. Branded fallback when empty.
 */
export default function HeroCarousel({ banners = [] }) {
  const slides = useMemo(
    () =>
      [...banners].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      ),
    [banners]
  );

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return undefined;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(t);
  }, [slides.length, paused]);

  // Branded fallback hero until the admin publishes banners.
  if (slides.length === 0) {
    return (
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-forest px-6 py-20 text-center">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, #F8F3EA 1.5px, transparent 1.5px), radial-gradient(circle at 75% 70%, #F8F3EA 1.5px, transparent 1.5px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Kiran Sudha
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ivory sm:text-5xl">
            India&apos;s legacy, worn anew
            <span
              aria-hidden
              className="ml-2 inline-block h-2 w-2 rounded-full bg-vermilion"
            />
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-ivory/70">
            Chikankari, Bandhani, Phulkari and more — the legacy art forms of
            India&apos;s states, tailored with a modern touch.
          </p>
          <Link href="/products" className="mt-8 inline-block">
            <Button size="lg" className="bg-ivory text-forest hover:bg-cream">
              Shop the collection
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="group relative h-[340px] overflow-hidden sm:h-[440px] lg:h-[540px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((b, i) => (
        <div
          key={b.id ?? i}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === idx ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <SlideLink href={b.linkUrl} className="block h-full w-full">
            <Image
              src={b.imageUrl}
              alt={b.altText || b.title || "Banner"}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            {b.title && (
              <>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/60 to-transparent" />
                <p className="absolute bottom-6 left-6 max-w-lg font-display text-2xl text-ivory sm:bottom-10 sm:left-10 sm:text-4xl">
                  {b.title}
                </p>
              </>
            )}
          </SlideLink>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          {/* Arrows */}
          <button
            aria-label="Previous banner"
            onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/80 p-2.5 text-forest opacity-0 shadow transition-opacity hover:bg-ivory group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="Next banner"
            onClick={() => setIdx((i) => (i + 1) % slides.length)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/80 p-2.5 text-forest opacity-0 shadow transition-opacity hover:bg-ivory group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((b, i) => (
              <button
                key={b.id ?? i}
                aria-label={`Go to banner ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${
                  i === idx ? "w-6 bg-ivory" : "w-2 bg-ivory/50 hover:bg-ivory/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
