import { notFound } from "next/navigation";
import { POLICIES } from "@/lib/static-content";
import { decodeParam } from "@/lib/listing";

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = POLICIES[decodeParam(slug)];
  return {
    title: policy?.title || "Policy",
    description: policy?.intro,
  };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const policy = POLICIES[decodeParam(slug)];
  if (!policy) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Kiran Sudha
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          {policy.title}
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        {policy.intro && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">
            {policy.intro}
          </p>
        )}
      </header>

      <div className="mt-8 flex flex-col gap-6">
        {policy.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-xl bg-white p-5 ring-1 ring-ink/10 sm:p-6"
          >
            <h2 className="font-display text-lg text-forest">
              {section.heading}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink/70">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
