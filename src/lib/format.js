/** Formatting helpers shared across the storefront. */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(value) {
  if (value == null || Number.isNaN(Number(value))) return "";
  return inr.format(Number(value));
}

/** Percentage off, e.g. discountPercent(2999, 1999) → 33. Null when invalid. */
export function discountPercent(price, discountPrice) {
  const p = Number(price);
  const d = Number(discountPrice);
  if (!p || !d || d >= p) return null;
  return Math.round(((p - d) / p) * 100);
}

/** First (primary) product image URL, defensively. */
export function primaryImageUrl(product) {
  if (!product) return null;
  if (product.primaryImageUrl) return product.primaryImageUrl;
  const images = product.images || [];
  const primary = images.find((i) => i?.isPrimary) || images[0];
  if (!primary) return null;
  return typeof primary === "string" ? primary : primary.imageUrl || null;
}
