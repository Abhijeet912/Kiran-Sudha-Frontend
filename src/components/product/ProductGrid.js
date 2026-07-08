import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

/** Responsive product grid with a friendly empty state. */
export default function ProductGrid({
  products = [],
  emptyTitle = "Nothing here yet",
  emptyBody = "Try adjusting your filters, or explore the full collection.",
  emptyAction = { href: "/products", label: "Shop all products" },
}) {
  if (!products.length) {
    return (
      <EmptyState title={emptyTitle} body={emptyBody} action={emptyAction} />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id ?? p.slug} product={p} />
      ))}
    </div>
  );
}
