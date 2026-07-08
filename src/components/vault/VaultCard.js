import Image from "next/image";
import Link from "next/link";

/** Fashion Vault article card. */
export default function VaultCard({ article }) {
  return (
    <Link
      href={`/vault/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/5 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="flex items-baseline gap-1 font-display text-3xl text-ivory/30">
              KS
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion/50"
              />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {(article.artForm || article.stateName) && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
            {[article.artForm, article.stateName].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="mt-1.5 font-display text-lg leading-snug text-forest group-hover:underline group-hover:underline-offset-4">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
            {article.summary}
          </p>
        )}
        <p className="mt-auto pt-3 text-xs font-medium text-forest">
          Read the story →
        </p>
      </div>
    </Link>
  );
}
