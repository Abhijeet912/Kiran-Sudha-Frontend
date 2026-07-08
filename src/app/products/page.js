import {
  filterProducts,
  getAllProducts,
  getStates,
  getTopLevelCategories,
} from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  filterApiParams,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";

export const metadata = {
  title: "Shop All",
  description:
    "The full Kiran Sudha collection — traditional fashion from the states of India with a modern touch.",
};

const asList = (r) =>
  r.status === "fulfilled"
    ? Array.isArray(r.value)
      ? r.value
      : r.value?.content || []
    : [];

export default async function ProductsPage({ searchParams }) {
  const sp = normalizeParams(await searchParams);
  const { page, sort, filters, hasFilters } = parseListing(sp);

  const [catsRes, statesRes, dataRes] = await Promise.allSettled([
    getTopLevelCategories(),
    getStates(),
    hasFilters
      ? filterProducts(filterApiParams({ filters, page, sort }))
      : getAllProducts({ page, size: PAGE_SIZE, ...sortToApi(sort) }),
  ]);

  const categories = asList(catsRes);
  const states = asList(statesRes);
  const data = dataRes.status === "fulfilled" ? dataRes.value : null;
  const products = data?.content || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          The collection
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          Shop All
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Every piece, every state, every art form — browse the entire Kiran
          Sudha collection.
        </p>
      </header>

      <div className="mt-8 lg:flex lg:items-start lg:gap-8">
        <FilterSidebar
          categories={categories}
          states={states}
          showCategory
          showState
          current={filters}
        />
        <div className="min-w-0 flex-1">
          <SortBar sort={sort} total={data?.totalElements} />
          <ProductGrid
            products={products}
            emptyTitle="No products match these filters"
            emptyBody="Try clearing a filter or two — the collection is waiting."
          />
          <Pagination
            page={data?.number ?? page}
            totalPages={data?.totalPages}
            basePath="/products"
            searchParams={sp}
          />
        </div>
      </div>
    </main>
  );
}
