import Link from "next/link";
import { notFound } from "next/navigation";
import {
  filterProducts,
  getProductsByCategory,
  getStates,
  getTopLevelCategories,
} from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  decodeParam,
  filterApiParams,
  findCategoryBySlug,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import FilterSidebar from "@/components/product/FilterSidebar";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  try {
    const category = findCategoryBySlug(await getTopLevelCategories(), slug);
    if (category) {
      return {
        title: category.name,
        description:
          category.description ||
          `Shop ${category.name} — traditional fashion from the states of India, by Kiran Sudha.`,
      };
    }
  } catch {
    // metadata falls back below
  }
  return { title: "Category" };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  const sp = normalizeParams(await searchParams);
  const { page, sort, filters } = parseListing(sp);

  let categories = [];
  try {
    categories = await getTopLevelCategories();
  } catch {
    categories = [];
  }
  const category = findCategoryBySlug(categories, slug);
  if (!category) notFound();

  // Category is pinned by the route — sidebar offers the remaining filters.
  const scoped = { ...filters, category: null };
  const hasExtraFilters = Boolean(
    scoped.state || scoped.size || scoped.minPrice || scoped.maxPrice
  );

  const [statesRes, dataRes] = await Promise.allSettled([
    getStates(),
    hasExtraFilters
      ? filterProducts(
          filterApiParams({
            filters: scoped,
            page,
            sort,
            pinned: { categoryId: category.id },
          })
        )
      : getProductsByCategory(category.id, {
          page,
          size: PAGE_SIZE,
          ...sortToApi(sort),
        }),
  ]);

  const states =
    statesRes.status === "fulfilled"
      ? Array.isArray(statesRes.value)
        ? statesRes.value
        : statesRes.value?.content || []
      : [];
  const data = dataRes.status === "fulfilled" ? dataRes.value : null;
  const products = data?.content || [];
  const subCategories = category.subCategories || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Category</p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          {category.name}
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            {category.description}
          </p>
        )}
        {subCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {subCategories.map((sub) => (
              <Link
                key={sub.id ?? sub.slug}
                href={`/categories/${sub.slug}`}
                className="rounded-full border border-forest/25 px-3.5 py-1.5 text-sm text-forest transition-colors hover:bg-forest hover:text-ivory"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="mt-8 lg:flex lg:items-start lg:gap-8">
        <FilterSidebar
          categories={[]}
          states={states}
          showCategory={false}
          showState
          current={scoped}
        />
        <div className="min-w-0 flex-1">
          <SortBar sort={sort} total={data?.totalElements} />
          <ProductGrid
            products={products}
            emptyTitle={`Nothing in ${category.name} yet`}
            emptyBody="New pieces arrive often — or explore the rest of the collection."
          />
          <Pagination
            page={data?.number ?? page}
            totalPages={data?.totalPages}
            basePath={`/categories/${slug}`}
            searchParams={sp}
          />
        </div>
      </div>
    </main>
  );
}
