import Image from "next/image";
import Link from "next/link";
import RatingStars from "@/components/product/RatingStars";
import { discountPercent, formatINR, primaryImageUrl } from "@/lib/format";

function Tag({ children, className = "" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Product card used in every listing (home rows, category/state/artform,
 * search, offers). Presentational — safe in server and client trees.
 */
export default function ProductCard({ product, priority = false }) {
  if (!product) return null;

  const img = primaryImageUrl(product);
  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) < Number(product.price);
  const pct =
    product.discountPercent ??
    discountPercent(product.price, product.discountPrice);
  const eyebrow = product.artForm || product.stateName || product.categoryName;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        {img ? (
          <Image
            src={img}
            alt={product.name || "Product"}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="flex items-baseline gap-1 font-display text-2xl text-forest/30">
              KS
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion/40"
              />
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {product.isBestSeller && <Tag className="bg-forest">Bestseller</Tag>}
          {(product.isOnSale || hasDiscount) && (
            <Tag className="bg-vermilion">Sale</Tag>
          )}
          {product.isTrending && <Tag className="bg-gold">Trending</Tag>}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
        )}
        <h3 className="truncate text-sm font-medium text-ink group-hover:text-forest">
          {product.name}
        </h3>
        {(product.averageRating ?? 0) > 0 && (
          <RatingStars
            rating={product.averageRating}
            count={product.totalReviews}
          />
        )}
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          {hasDiscount ? (
            <>
              <span className="text-base font-semibold text-vermilion">
                {formatINR(product.discountPrice)}
              </span>
              <span className="text-xs text-ink/40 line-through">
                {formatINR(product.price)}
              </span>
              {pct != null && (
                <span className="text-xs font-medium text-vermilion">
                  {pct}% off
                </span>
              )}
            </>
          ) : (
            <span className="text-base font-semibold text-ink">
              {formatINR(product.price)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
