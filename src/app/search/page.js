import { searchProducts } from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";
import EmptyState from "@/components/ui/EmptyState";

export async function generateMetadata({ searchParams }) {
  const sp = normalizeParams(await searchParams);
  const q = (sp.q || "").trim();
  return {
    title: q ? `Search “${q}”` : "Search",
    description: `Search Kiran Sudha for products, states and art forms.`,
  };
}

export default async function SearchPage({ searchParams }) {
  const sp = normalizeParams(await searchParams);
  const { page, sort } = parseListing(sp);
  const q = (sp.q || "").trim();

  if (q.length < 2) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Search</p>
          <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
            What are you looking for?
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
        </header>
        <div className="mt-10">
          <EmptyState
            title="Start typing in the search bar"
            body="Search for dresses, states, or the fashion name of a state — like Chikankari."
            action={{ href: "/products", label: "Or browse everything" }}
          />
        </div>
      </main>
    );
  }

  let data = null;
  try {
    data = await searchProducts(q, {
      page,
      size: PAGE_SIZE,
      ...sortToApi(sort),
    });
  } catch {
    data = null;
  }
  const products = data?.content || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Search</p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          Results for “{q}”
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      <div className="mt-8">
        <SortBar sort={sort} total={data?.totalElements} />
        <ProductGrid
          products={products}
          emptyTitle={`No matches for “${q}”`}
          emptyBody="Try a different spelling — or discover fashion by state and art form instead."
        />
        <Pagination
          page={data?.number ?? page}
          totalPages={data?.totalPages}
          basePath="/search"
          searchParams={sp}
        />
      </div>
    </main>
  );
}
