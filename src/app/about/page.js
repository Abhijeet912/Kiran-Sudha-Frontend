import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Kiran Sudha brings traditional fashion from the states of India — reimagined with a modern touch.",
};

const VALUES = [
  {
    title: "Rooted in legacy",
    body: "Every piece begins with a state's living tradition — Chikankari from Lucknow, Bandhani from Rajasthan, Phulkari from Punjab — crafted the way it has been for generations.",
  },
  {
    title: "Tailored for today",
    body: "Heritage doesn't mean old-fashioned. We cut, drape and finish each design for the modern wardrobe, so the legacy walks with you every day.",
  },
  {
    title: "Honest to the hand",
    body: "We name the art form and its origin on every product, because the craft — and the hands behind it — deserve the credit.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-forest px-4 py-14 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">
          About Kiran Sudha
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl leading-tight text-ivory sm:text-5xl">
          India&apos;s legacy, worn anew
          <span
            aria-hidden
            className="ml-2 inline-block h-2 w-2 rounded-full bg-vermilion"
          />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ivory/70">
          Kiran Sudha is a fashion house that carries the legacy art forms of
          India&apos;s states into the present — each collection a new
          testimony to an old mastery.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-white p-6 ring-1 ring-ink/5"
            >
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-vermilion"
              />
              <h2 className="mt-3 font-display text-xl text-forest">
                {value.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-ink/70">{value.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-ink/60">
            Curious how it all began?
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/brand-story"
              className="inline-flex h-11 items-center rounded-full bg-forest px-6 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover"
            >
              Read our story
            </Link>
            <Link
              href="/vault"
              className="inline-flex h-11 items-center rounded-full border border-forest px-6 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-ivory"
            >
              Explore the Fashion Vault
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
