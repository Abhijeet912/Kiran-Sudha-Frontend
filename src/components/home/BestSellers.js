import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/home/SectionHeading";

/** Best-selling apparel — admin-curated or top sellers. */
export default function BestSellers({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Loved across India"
        title="Best Sellers"
        action={{ href: "/products", label: "Shop all" }}
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id ?? p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
