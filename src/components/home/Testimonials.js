import RatingStars from "@/components/product/RatingStars";
import SectionHeading from "@/components/home/SectionHeading";

/** Featured customer testimonials, curated in the admin portal. */
export default function Testimonials({ reviews = [] }) {
  if (!reviews.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow="Word of mouth" title="What our customers say" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((r, i) => (
          <figure
            key={r.id ?? i}
            className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5"
          >
            <span aria-hidden className="font-display text-4xl leading-none text-gold">
              “
            </span>
            <blockquote className="mt-1 text-sm leading-6 text-ink/80">
              {r.comment}
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-ink/5 pt-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {r.customerName || r.reviewerName || "Kiran Sudha customer"}
                </p>
                {r.productName && (
                  <p className="truncate text-xs text-ink/50">
                    on {r.productName}
                  </p>
                )}
              </div>
              {(r.rating ?? 0) > 0 && <RatingStars rating={r.rating} />}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
