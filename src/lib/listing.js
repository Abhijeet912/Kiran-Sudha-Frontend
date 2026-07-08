/**
 * Shared helpers for listing pages (/products, categories, states,
 * art forms, search, offers). URL params are the source of truth so
 * filtered/sorted/paged views are shareable links.
 *
 * URL model: ?page=2&sort=price-asc&category=1&state=2&size=M&minPrice=500&maxPrice=3000&q=...
 * Pages are 1-based in the URL, 0-based toward the Spring backend.
 */

export const PAGE_SIZE = 12;

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "New Arrivals" },
];

/** Map a sort key to Spring sortBy/sortDir params ({} = backend default). */
export function sortToApi(sort) {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", sortDir: "asc" };
    case "price-desc":
      return { sortBy: "price", sortDir: "desc" };
    case "newest":
      return { sortBy: "createdAt", sortDir: "desc" };
    default:
      return {};
  }
}

/** searchParams values may be string | string[] — always take the first. */
export function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * App Router dynamic params arrive URL-ENCODED (e.g. "Test%20slag").
 * Decode before using them for API lookups or display — otherwise the
 * API helper re-encodes and the backend sees a double-encoded slug.
 */
export function decodeParam(value) {
  if (typeof value !== "string") return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value; // malformed escape sequence — use as-is
  }
}

/** Normalize a Next searchParams object into a plain {key: string} map. */
export function normalizeParams(sp) {
  const out = {};
  Object.keys(sp || {}).forEach((key) => {
    const v = firstParam(sp[key]);
    if (v != null && v !== "") out[key] = String(v);
  });
  return out;
}

/** Parse the listing state out of normalized params. */
export function parseListing(sp) {
  const pageRaw = parseInt(sp.page, 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 1 ? pageRaw - 1 : 0;

  const sort = SORT_OPTIONS.some((o) => o.value === sp.sort)
    ? sp.sort
    : "featured";

  const filters = {
    category: sp.category || null,
    state: sp.state || null,
    size: CLOTHING_SIZES.includes(sp.size) ? sp.size : null,
    minPrice: /^\d+$/.test(sp.minPrice || "") ? sp.minPrice : null,
    maxPrice: /^\d+$/.test(sp.maxPrice || "") ? sp.maxPrice : null,
  };
  const hasFilters = Object.values(filters).some((v) => v != null);

  return { page, sort, filters, hasFilters };
}

const KNOWN_KEYS = [
  "q",
  "sort",
  "page",
  "category",
  "state",
  "size",
  "minPrice",
  "maxPrice",
];

/** Build a query string from current params + overrides (null deletes). */
export function buildQuery(sp, overrides = {}) {
  const merged = { ...sp, ...overrides };
  const qs = new URLSearchParams();
  KNOWN_KEYS.forEach((key) => {
    const v = merged[key];
    if (v != null && v !== "" && !(key === "sort" && v === "featured")) {
      qs.set(key, String(v));
    }
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/** Build the /api/products/filter params for the active scope + filters. */
export function filterApiParams({ filters, page, sort, pinned = {} }) {
  return {
    categoryId: pinned.categoryId ?? filters.category ?? undefined,
    stateId: pinned.stateId ?? filters.state ?? undefined,
    size: filters.size ?? undefined,
    minPrice: filters.minPrice ?? undefined,
    maxPrice: filters.maxPrice ?? undefined,
    page,
    ...sortToApi(sort),
  };
}

/** Recursively find a category by slug in the top-level tree. */
export function findCategoryBySlug(categories, slug) {
  for (const c of categories || []) {
    if (c.slug === slug) return c;
    const hit = findCategoryBySlug(c.subCategories, slug);
    if (hit) return hit;
  }
  return null;
}
