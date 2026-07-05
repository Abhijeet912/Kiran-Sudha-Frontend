import Image from "next/image";
import Link from "next/link";

/**
 * Fashion Vault — dark editorial section inviting readers into the
 * stories behind the legacy art forms. Shows up to 3 article previews.
 */
export default function VaultBanner({ articles = [] }) {
  const preview = articles.slice(0, 3);

  return (
    <section className="bg-forest">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            The Fashion Vault
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-ivory sm:text-4xl">
            Stories woven into every thread
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-ivory/70">
            Behind every weave is a state, a lineage, a legacy. Step into the
            vault to discover the history and origin of India&apos;s great art
            forms — and the hands that keep them alive.
          </p>
          <Link
            href="/vault"
            className="mt-6 inline-flex h-11 items-center rounded-full border border-ivory/40 px-6 text-sm font-medium text-ivory transition-colors hover:bg-ivory hover:text-forest"
          >
            Read the stories
          </Link>
        </div>

        {preview.length > 0 && (
          <div className="flex flex-col gap-3">
            {preview.map((a, i) => (
              <Link
                key={a.id ?? i}
                href={`/vault/${a.slug}`}
                className="group flex items-center gap-4 rounded-xl bg-ivory/5 p-3 ring-1 ring-ivory/10 transition-colors hover:bg-ivory/10"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-footer">
                  {a.coverImageUrl && (
                    <Image
                      src={a.coverImageUrl}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  {(a.artForm || a.stateName) && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                      {a.artForm || a.stateName}
                    </p>
                  )}
                  <p className="truncate font-display text-base text-ivory group-hover:underline group-hover:underline-offset-4">
                    {a.title}
                  </p>
                  {a.summary && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-ivory/60">
                      {a.summary}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
