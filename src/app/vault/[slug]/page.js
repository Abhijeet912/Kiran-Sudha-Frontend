import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVaultArticle } from "@/lib/api/content";
import { decodeParam } from "@/lib/listing";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);
  try {
    const article = await getVaultArticle(slug);
    if (article) {
      return {
        title: article.title,
        description:
          article.summary ||
          `${article.title} — a story from the Kiran Sudha Fashion Vault.`,
        openGraph: article.coverImageUrl
          ? { images: [article.coverImageUrl] }
          : undefined,
      };
    }
  } catch {
    // fall through
  }
  return { title: "Fashion Vault" };
}

/** Split long text content into paragraphs. */
function paragraphs(content) {
  return String(content || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function VaultArticlePage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeParam(rawSlug);

  let article = null;
  try {
    article = await getVaultArticle(slug);
  } catch {
    article = null;
  }
  if (!article) notFound();

  const tags = Array.isArray(article.tags)
    ? article.tags
    : typeof article.tags === "string"
      ? article.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/vault"
        className="text-xs font-medium text-forest underline-offset-4 hover:underline"
      >
        ← The Fashion Vault
      </Link>

      <header className="mt-4">
        {(article.artForm || article.stateName) && (
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {[article.artForm, article.stateName].filter(Boolean).join(" · ")}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl leading-tight text-forest sm:text-5xl">
          {article.title}
          <span
            aria-hidden
            className="ml-2 inline-block h-2 w-2 rounded-full bg-vermilion"
          />
        </h1>
        <p className="mt-3 text-sm text-ink/50">
          {article.author && <span>By {article.author}</span>}
          {article.author && article.createdAt && <span> · </span>}
          {article.createdAt && <span>{formatDate(article.createdAt)}</span>}
        </p>
      </header>

      {article.coverImageUrl && (
        <div className="relative mt-8 aspect-[21/10] overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/5">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {article.summary && (
        <p className="mt-8 border-l-2 border-gold pl-4 font-display text-lg leading-8 text-ink/80">
          {article.summary}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-5">
        {paragraphs(article.content).map((para, i) => (
          <p key={i} className="whitespace-pre-line text-[15px] leading-8 text-ink/80">
            {para}
          </p>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-forest/10 px-3 py-1 text-xs text-forest"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-forest p-6 text-center sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          From the loom to you
        </p>
        <h2 className="mt-2 font-display text-2xl text-ivory">
          Wear the {article.artForm || "legacy"} story
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href={
              article.artForm
                ? `/search?q=${encodeURIComponent(article.artForm)}`
                : "/products"
            }
            className="inline-flex h-11 items-center rounded-full bg-ivory px-6 text-sm font-medium text-forest transition-colors hover:bg-cream"
          >
            Shop the pieces
          </Link>
          <Link
            href="/vault"
            className="inline-flex h-11 items-center rounded-full border border-ivory/40 px-6 text-sm font-medium text-ivory transition-colors hover:bg-ivory/10"
          >
            More stories
          </Link>
        </div>
      </div>
    </main>
  );
}
