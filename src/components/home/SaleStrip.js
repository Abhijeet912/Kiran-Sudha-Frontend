import Image from "next/image";
import Link from "next/link";

const isExternal = (url) => /^https?:\/\//i.test(url || "");

function BannerLink({ href, children, className }) {
  const target = href || "/offers";
  if (isExternal(target)) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}

/** Offer strip below the hero — admin-managed SALE banners. */
export default function SaleStrip({ banners = [] }) {
  if (!banners.length) return null;

  const sorted = [...banners].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <section aria-label="Current offers" className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {sorted.map((b, i) => (
          <BannerLink
            key={b.id ?? i}
            href={b.linkUrl}
            className="relative h-28 w-72 shrink-0 snap-start overflow-hidden rounded-xl bg-cream ring-1 ring-ink/5 transition-shadow hover:shadow-md sm:h-36 sm:w-96"
          >
            <Image
              src={b.imageUrl}
              alt={b.altText || b.title || "Offer"}
              fill
              sizes="(max-width: 640px) 288px, 384px"
              className="object-cover"
            />
          </BannerLink>
        ))}
      </div>
    </section>
  );
}
