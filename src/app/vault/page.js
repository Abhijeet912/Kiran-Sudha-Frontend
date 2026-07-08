import { getVaultArticles } from "@/lib/api/content";
import { normalizeParams, parseListing } from "@/lib/listing";
import VaultCard from "@/components/vault/VaultCard";
import Pagination from "@/components/product/Pagination";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = {
  title: "The Fashion Vault",
  description:
    "Stories of India's legacy art forms — Chikankari, Bandhani, Phulkari and more — and the hands that keep them alive.",
};

const PAGE_SIZE = 9;

export default async function VaultPage({ searchParams }) {
  const sp = normalizeParams(await searchParams);
  const { page } = parseListing(sp);

  let data = null;
  try {
    data = await getVaultArticles({ page, size: PAGE_SIZE });
  } catch {
    data = null;
  }
  const articles = Array.isArray(data) ? data : data?.content || [];

  return (
    <main>
      {/* Editorial hero */}
      <section className="bg-forest px-4 py-14 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          The Fashion Vault
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl leading-tight text-ivory sm:text-5xl">
          Stories woven into every thread
          <span
            aria-hidden
            className="ml-2 inline-block h-2 w-2 rounded-full bg-vermilion"
          />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ivory/70">
          Behind every weave is a state, a lineage, a legacy. These are the
          histories and origins of the art forms we carry forward.
        </p>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <EmptyState
            title="The stories are being written"
            body="Vault articles will appear here soon — meanwhile, the collection awaits."
            action={{ href: "/products", label: "Shop the collection" }}
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <VaultCard key={a.id ?? a.slug} article={a} />
              ))}
            </div>
            <Pagination
              page={data?.number ?? page}
              totalPages={data?.totalPages}
              basePath="/vault"
              searchParams={sp}
            />
          </>
        )}
      </div>
    </main>
  );
}
