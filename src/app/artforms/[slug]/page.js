import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtForm, getProductsByArtForm } from "@/lib/api/catalog";
import {
  PAGE_SIZE,
  normalizeParams,
  parseListing,
  sortToApi,
} from "@/lib/listing";
import SortBar from "@/components/product/SortBar";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/product/Pagination";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const art = await getArtForm(slug);
    if (art) {
      return {
        title: art.name,
        description:
          art.description ||
          `${art.name} — a legacy art form of India, reimagined by Kiran Sudha.`,
      };
    }
  } catch {
    // metadata falls back below
  }
  return { title: "Art Form" };
}

export default async function ArtFormPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = normalizeParams(await searchParams);
  const { page, sort } = parseListing(sp);

  let art = null;
  try {
    art = await getArtForm(slug);
  } catch {
    art = null;
  }
  if (!art) notFound();

  let data = null;
  try {
    data = await getProductsByArtForm(art.name, {
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
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {art.imageUrl && (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/10 sm:h-36 sm:w-36">
            <Image
              src={art.imageUrl}
              alt={art.name}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          {art.stateName && (
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              {art.stateName}
            </p>
          )}
          <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
            {art.name}
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
          {art.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
              {art.description}
            </p>
          )}
          <Link
            href="/vault"
            className="mt-3 inline-block text-sm font-medium text-forest underline-offset-4 hover:underline"
          >
            Read its story in the Fashion Vault →
          </Link>
        </div>
      </header>

      <div className="mt-10">
        <SortBar sort={sort} total={data?.totalElements} />
        <ProductGrid
          products={products}
          emptyTitle={`No ${art.name} pieces yet`}
          emptyBody="The artisans are at work — check back soon, or explore the collection."
        />
        <Pagination
          page={data?.number ?? page}
          totalPages={data?.totalPages}
          basePath={`/artforms/${slug}`}
          searchParams={sp}
        />
      </div>
    </main>
  );
}
