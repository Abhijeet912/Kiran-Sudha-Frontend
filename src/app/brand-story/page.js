import Link from "next/link";

export const metadata = {
  title: "Brand Story",
  description:
    "A ray of light, a drop of nectar — the story behind Kiran Sudha and the legacy art forms it carries forward.",
};

const CHAPTERS = [
  {
    eyebrow: "The name",
    title: "A ray of light. A drop of nectar.",
    body: "Kiran — a ray of light. Sudha — nectar. Together they describe what we chase in every collection: that first glint of sunlight on handwoven fabric, and the sweetness of a craft perfected over centuries. The name is a promise that neither will be lost.",
  },
  {
    eyebrow: "The observation",
    title: "Every state dresses differently",
    body: "India doesn't have one fashion — it has dozens. The shadow-work of Lucknow's Chikankari. The tied resist-dyes of Rajasthan's Bandhani. The blooming threads of Punjab's Phulkari. Each state carries a signature that took generations to write. We simply refused to let those signatures fade into occasion-wear cupboards.",
  },
  {
    eyebrow: "The idea",
    title: "Legacy, with a modern touch",
    body: "So we set a simple rule for ourselves: honour the technique, rethink the silhouette. Our artisans keep the craft exactly as their teachers taught them — while our designers cut it for offices, evenings, airports and everyday life. A new testimony, stitched onto an old truth.",
  },
  {
    eyebrow: "The promise",
    title: "From the loom to you",
    body: "Every product page names its art form and home state. Every Vault story credits the tradition. And every order carries a piece of a state's legacy into a new wardrobe — which is exactly where living heritage belongs.",
  },
];

export default function BrandStoryPage() {
  return (
    <main>
      <section className="bg-forest px-4 py-14 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          Our story
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl leading-tight text-ivory sm:text-5xl">
          Why Kiran Sudha exists
          <span
            aria-hidden
            className="ml-2 inline-block h-2 w-2 rounded-full bg-vermilion"
          />
        </h1>
      </section>

      <section className="mx-auto w-full max-w-2xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.title}>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">
                {chapter.eyebrow}
              </p>
              <h2 className="mt-1.5 font-display text-2xl text-forest">
                {chapter.title}
              </h2>
              <p className="mt-3 text-[15px] leading-8 text-ink/75">
                {chapter.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-forest p-6 text-center sm:p-8">
          <h2 className="font-display text-2xl text-ivory">
            Be part of the testimony
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-11 items-center rounded-full bg-ivory px-6 text-sm font-medium text-forest transition-colors hover:bg-cream"
            >
              Shop the collection
            </Link>
            <Link
              href="/vault"
              className="inline-flex h-11 items-center rounded-full border border-ivory/40 px-6 text-sm font-medium text-ivory transition-colors hover:bg-ivory/10"
            >
              Read the craft stories
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
