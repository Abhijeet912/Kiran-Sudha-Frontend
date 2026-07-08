import { getOnSale } from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";

export const metadata = {
  title: "Offers & Sale",
  description:
    "Every Kiran Sudha piece currently on sale — discounts on legacy fashion from the states of India.",
};

export default async function OffersPage({ searchParams }) {
  const sp = normalizeParams(await searchParams);
  const { page, sort } = parseListing(sp);

  let data = null;
  try {
    data = await getOnSale({ page, size: PAGE_SIZE, ...sortToApi(sort) });
  } catch {
    data = null;
  }
  const products = data?.content || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-vermilion">
          Limited time
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          Offers &amp; Sale
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Handpicked pieces at their kindest prices — while they last.
        </p>
      </header>

      <div className="mt-8">
        <SortBar sort={sort} total={data?.totalElements} />
        <ProductGrid
          products={products}
          emptyTitle="No offers right now"
          emptyBody="Sales come and go like festival season — check back soon."
        />
        <Pagination
          page={data?.number ?? page}
          totalPages={data?.totalPages}
          basePath="/offers"
          searchParams={sp}
        />
      </div>
    </main>
  );
}
