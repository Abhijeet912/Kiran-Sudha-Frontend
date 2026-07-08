"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getProductReviews,
  getRatingSummary,
  submitReview,
} from "@/lib/api/reviews";
import RatingStars from "@/components/product/RatingStars";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { StarIcon } from "@/components/ui/Icons";

const PAGE = 5;

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className={`transition-colors ${
            n <= value ? "text-gold" : "text-ink/20 hover:text-gold/60"
          }`}
        >
          <StarIcon filled className="h-6 w-6" />
        </button>
      ))}
    </div>
  );
}

function DistributionBars({ distribution = {}, total = 0 }) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = Number(distribution[String(star)] || 0);
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs text-ink/60">
            <span className="w-3 text-right">{star}</span>
            <StarIcon filled className="h-3 w-3 text-gold" />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-gold"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-7">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * PDP reviews: summary (average + distribution), paged list with
 * load-more, and a write-review form for logged-in customers.
 */
export default function ReviewsSection({
  productId,
  initialSummary,
  initialReviews,
}) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const pathname = usePathname();

  const [summary, setSummary] = useState(initialSummary || null);
  const [reviews, setReviews] = useState(initialReviews?.content || []);
  const [pageData, setPageData] = useState(initialReviews || null);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = summary?.totalReviews ?? pageData?.totalElements ?? reviews.length;
  const average = summary?.averageRating ?? 0;
  const hasMore = pageData ? !pageData.last : false;

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getProductReviews(productId, {
        page: next,
        size: PAGE,
      });
      setReviews((r) => [...r, ...(data?.content || [])]);
      setPageData(data);
      setPage(next);
    } catch {
      toast.error("Couldn't load more reviews.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) {
      setFormError("Please pick a star rating.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const created = await submitReview(productId, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });
      setReviews((r) => [created, ...r]);
      setRating(0);
      setTitle("");
      setComment("");
      toast.success("Thank you — your review is live!");
      getRatingSummary(productId)
        .then((s) => setSummary(s))
        .catch(() => {});
    } catch (err) {
      setFormError(err.message || "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-14 border-t border-ink/10 pt-10" id="reviews">
      <h2 className="font-display text-2xl text-forest">
        Ratings &amp; Reviews
        <span
          aria-hidden
          className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
        />
      </h2>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-14">
        {/* Summary */}
        <div className="shrink-0">
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl text-forest">
              {average ? Number(average).toFixed(1) : "–"}
            </span>
            <div className="pb-1.5">
              <RatingStars rating={average} />
              <p className="mt-0.5 text-xs text-ink/50">
                {total} review{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          {summary?.distribution && (
            <div className="mt-4">
              <DistributionBars
                distribution={summary.distribution}
                total={total}
              />
            </div>
          )}
        </div>

        {/* List + form */}
        <div className="min-w-0 flex-1">
          {isAuthenticated ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl bg-white p-5 ring-1 ring-ink/10"
            >
              <p className="text-sm font-medium text-ink">Write a review</p>
              <div className="mt-3">
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <Input
                  name="reviewTitle"
                  placeholder="Title (e.g. “Beautiful embroidery!”)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                />
                <textarea
                  name="reviewComment"
                  placeholder="How was the fabric, the fit, the finish?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={800}
                  className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-forest focus:ring-2 focus:ring-forest/20"
                />
              </div>
              {formError && (
                <p className="mt-2 text-sm text-vermilion">{formError}</p>
              )}
              <Button type="submit" loading={submitting} className="mt-4">
                Submit review
              </Button>
              <p className="mt-2 text-xs text-ink/40">
                One review per product — purchases get a Verified badge.
              </p>
            </form>
          ) : (
            <p className="rounded-xl bg-white p-5 text-sm text-ink/60 ring-1 ring-ink/10">
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="font-medium text-forest underline-offset-4 hover:underline"
              >
                Login
              </Link>{" "}
              to write a review.
            </p>
          )}

          {/* Reviews */}
          <ul className="mt-6 flex flex-col gap-5">
            {reviews.length === 0 && (
              <li className="text-sm text-ink/50">
                No reviews yet — be the first to share your thoughts.
              </li>
            )}
            {reviews.map((r, i) => (
              <li
                key={r.id ?? i}
                className="border-b border-ink/5 pb-5 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <RatingStars rating={r.rating} />
                  {r.title && (
                    <p className="text-sm font-medium text-ink">{r.title}</p>
                  )}
                  {r.verifiedPurchase && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-success">
                      Verified purchase
                    </span>
                  )}
                </div>
                {r.comment && (
                  <p className="mt-1.5 text-sm leading-6 text-ink/70">
                    {r.comment}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-ink/40">
                  {r.reviewerName || "Kiran Sudha customer"}
                  {r.createdAt
                    ? ` · ${new Date(r.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}`
                    : ""}
                </p>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-4">
              <Button variant="outline" size="sm" loading={loadingMore} onClick={loadMore}>
                Load more reviews
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
