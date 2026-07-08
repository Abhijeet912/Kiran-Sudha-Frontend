import { notFound } from "next/navigation";
import {
  filterProducts,
  getProductsByState,
  getStates,
  getTopLevelCategories,
} from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  decodeParam,
  filterApiParams,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";

const findState = (states, slug) => states.find((s) => s.slug === slug) || null;

const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  try {
    const state = findState(asList(await getStates()), slug);
    if (state) {
      return {
        title: `${state.name} Collection`,
        description:
          state.description ||
          `Legacy fashion from ${state.name}, reimagined by Kiran Sudha.`,
      };
    }
  } catch {
    // metadata falls back below
  }
  return { title: "State Collection" };
}

export default async function StatePage({ params, searchParams }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  const sp = normalizeParams(await searchParams);
  const { page, sort, filters } = parseListing(sp);

  let states = [];
  try {
    states = asList(await getStates());
  } catch {
    states = [];
  }
  const state = findState(states, slug);
  if (!state) notFound();

  // State is pinned by the route — sidebar offers the remaining filters.
  const scoped = { ...filters, state: null };
  const hasExtraFilters = Boolean(
    scoped.category || scoped.size || scoped.minPrice || scoped.maxPrice
  );

  const [catsRes, dataRes] = await Promise.allSettled([
    getTopLevelCategories(),
    hasExtraFilters
      ? filterProducts(
          filterApiParams({
            filters: scoped,
            page,
            sort,
            pinned: { stateId: state.id },
          })
        )
      : getProductsByState(state.id, {
          page,
          size: PAGE_SIZE,
          ...sortToApi(sort),
        }),
  ]);

  const categories = catsRes.status === "fulfilled" ? asList(catsRes.value) : [];
  const data = dataRes.status === "fulfilled" ? dataRes.value : null;
  const products = data?.content || [];
  const artForms = state.artForms || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Fashion of
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          {state.name}
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        {state.description && (
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            {state.description}
          </p>
        )}
        {artForms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {artForms.map((name) => (
              <span
                key={name}
                className="rounded-full bg-forest/10 px-3.5 py-1.5 text-sm text-forest"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-8 lg:flex lg:items-start lg:gap-8">
        <FilterSidebar
          categories={categories}
          states={[]}
          showCategory
          showState={false}
          current={scoped}
        />
        <div className="min-w-0 flex-1">
          <SortBar sort={sort} total={data?.totalElements} />
          <ProductGrid
            products={products}
            emptyTitle={`Nothing from ${state.name} yet`}
            emptyBody="New pieces arrive often — or explore the rest of the collection."
          />
          <Pagination
            page={data?.number ?? page}
            totalPages={data?.totalPages}
            basePath={`/states/${slug}`}
            searchParams={sp}
          />
        </div>
      </div>
    </main>
  );
}
