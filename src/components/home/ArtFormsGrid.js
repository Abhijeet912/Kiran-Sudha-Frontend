import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/home/SectionHeading";

/**
 * "Explore Art Forms" — the homepage grid of legacy art forms
 * (Chikankari, Bandhani…). Clicking opens that art form's products.
 */
export default function ArtFormsGrid({ artForms = [] }) {
  if (!artForms.length) return null;

  const sorted = [...artForms].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <section className="bg-cream/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="Legacy, by hand"
          title="Explore Art Forms"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {sorted.slice(0, 8).map((a) => (
            <Link
              key={a.id ?? a.slug}
              href={`/artforms/${a.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-forest"
            >
              {a.imageUrl && (
                <Image
                  src={a.imageUrl}
                  alt={a.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-footer/90 via-footer/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                {a.stateName && (
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
                    {a.stateName}
                  </p>
                )}
                <h3 className="mt-0.5 font-display text-lg text-ivory">
                  {a.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-ivory/80 underline-offset-4 group-hover:underline">
                  Explore now →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
