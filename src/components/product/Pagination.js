import Link from "next/link";
import { buildQuery } from "@/lib/listing";

/** Windowed page numbers: 1 … around-current … last. */
function pageWindow(current, total) {
  const pages = new Set([0, total - 1, current - 1, current, current + 1]);
  const list = [...pages]
    .filter((p) => p >= 0 && p < total)
    .sort((a, b) => a - b);
  const out = [];
  let prev = null;
  list.forEach((p) => {
    if (prev != null && p - prev > 1) out.push("gap");
    out.push(p);
    prev = p;
  });
  return out;
}

/**
 * Link-based pagination for Spring Page results.
 * @param page 0-based current page
 * @param totalPages from the Page response
 * @param basePath e.g. "/products" or `/categories/${slug}`
 * @param searchParams normalized plain params (page override handled here)
 */
export default function Pagination({ page, totalPages, basePath, searchParams = {} }) {
  if (!totalPages || totalPages <= 1) return null;

  const href = (p) => `${basePath}${buildQuery(searchParams, { page: p + 1 })}`;
  const items = pageWindow(page, totalPages);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      {page > 0 && (
        <Link href={href(page - 1)} className={`${btn} text-forest hover:bg-forest/10`}>
          ← Prev
        </Link>
      )}

      {items.map((item, i) =>
        item === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-ink/40">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={`${btn} ${
              item === page
                ? "bg-forest text-ivory"
                : "text-ink/70 hover:bg-forest/10 hover:text-forest"
            }`}
          >
            {item + 1}
          </Link>
        )
      )}

      {page < totalPages - 1 && (
        <Link href={href(page + 1)} className={`${btn} text-forest hover:bg-forest/10`}>
          Next →
        </Link>
      )}
    </nav>
  );
}
