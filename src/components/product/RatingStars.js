import { StarIcon } from "@/components/ui/Icons";

/** Five gold stars + optional review count. */
export default function RatingStars({ rating = 0, count, className = "" }) {
  const rounded = Math.round(Number(rating) || 0);
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex text-gold" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} filled={n <= rounded} className="h-3.5 w-3.5" />
        ))}
      </span>
      <span className="sr-only">{rating ? `${rating} out of 5 stars` : "Not yet rated"}</span>
      {count != null && count > 0 && (
        <span className="text-xs text-ink/50">({count})</span>
      )}
    </span>
  );
}
