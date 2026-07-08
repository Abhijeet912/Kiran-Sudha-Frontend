import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/api/catalog";
import { getProductReviews, getRatingSummary } from "@/lib/api/reviews";
import { discountPercent, formatINR, primaryImageUrl } from "@/lib/format";
import ImageGallery from "@/components/product/ImageGallery";
import PurchasePanel from "@/components/product/PurchasePanel";
import DeliveryCheck from "@/components/product/DeliveryCheck";
import ReviewsSection from "@/components/product/ReviewsSection";
import RecentlyViewedTracker from "@/components/product/RecentlyViewedTracker";
import RatingStars from "@/components/product/RatingStars";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const p = await getProductBySlug(slug);
    if (p) {
      const img = primaryImageUrl(p);
      return {
        title: p.name,
        description:
          (p.description || "").slice(0, 155) ||
          `${p.name} — traditional fashion by Kiran Sudha.`,
        openGraph: img ? { images: [img] } : undefined,
      };
    }
  } catch {
    // metadata falls back below
  }
  return { title: "Product" };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    product = null;
  }
  if (!product) notFound();

  const [summaryRes, reviewsRes] = await Promise.allSettled([
    getRatingSummary(product.id),
    getProductReviews(product.id, { page: 0, size: 5 }),
  ]);
  const summary = summaryRes.status === "fulfilled" ? summaryRes.value : null;
  const reviews = reviewsRes.status === "fulfilled" ? reviewsRes.value : null;

  const hasDiscount =
    product.discountPrice != null &&
    Number(product.discountPrice) < Number(product.price);
  const pct =
    product.discountPercent ??
    discountPercent(product.price, product.discountPrice);
  const avgRating = summary?.averageRating ?? product.averageRating ?? 0;
  const totalReviews = summary?.totalReviews ?? product.totalReviews ?? 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-ink/50">
        <Link href="/" className="hover:text-forest">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/products" className="hover:text-forest">
          Shop
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} name={product.name} />

        <div className="min-w-0">
          {(product.artForm || product.stateName) && (
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              {[product.artForm, product.stateName]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}

          <h1 className="mt-1.5 font-display text-3xl leading-tight text-forest sm:text-4xl">
            {product.name}
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>

          {avgRating > 0 && (
            <a href="#reviews" className="mt-2 inline-block">
              <RatingStars rating={avgRating} count={totalReviews} />
            </a>
          )}

          {/* Price */}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-semibold text-vermilion">
                  {formatINR(product.discountPrice)}
                </span>
                <span className="text-base text-ink/40 line-through">
                  {formatINR(product.price)}
                </span>
                {pct != null && (
                  <span className="text-sm font-medium text-vermilion">
                    {pct}% off
                  </span>
                )}
              </>
            ) : (
              <span className="text-2xl font-semibold text-ink">
                {formatINR(product.price)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/40">Inclusive of all taxes</p>

          <PurchasePanel product={product} />
          <DeliveryCheck />

          {product.description && (
            <div className="mt-8">
              <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
                About this piece
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink/70">
                {product.description}
              </p>
            </div>
          )}

          {(product.artForm || product.stateName) && (
            <div className="mt-8 rounded-xl bg-forest p-5 text-ivory">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                The origin
              </p>
              <p className="mt-2 text-sm leading-6 text-ivory/80">
                {product.artForm && (
                  <>
                    Crafted in the <strong>{product.artForm}</strong> tradition
                  </>
                )}
                {product.artForm && product.stateName && " of "}
                {product.stateName && <strong>{product.stateName}</strong>}
                {" — "}a legacy art form carried forward by Kiran Sudha.
              </p>
              <Link
                href="/vault"
                className="mt-3 inline-block text-sm font-medium text-ivory underline-offset-4 hover:underline"
              >
                Read its story in the Fashion Vault →
              </Link>
            </div>
          )}
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        initialSummary={summary}
        initialReviews={reviews}
      />

      <RecentlyViewedTracker productId={product.id} />
    </main>
  );
}
