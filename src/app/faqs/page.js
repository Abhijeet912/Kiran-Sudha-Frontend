import Link from "next/link";
import { FAQS } from "@/lib/static-content";
import { ChevronDownIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about shopping with Kiran Sudha — sizes, delivery, payments, returns and more.",
};

export default function FaqsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          We&apos;re listening
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          Frequently Asked Questions
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      <div className="mt-8 flex flex-col gap-3">
        {FAQS.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl bg-white p-5 ring-1 ring-ink/10"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              {faq.q}
              <ChevronDownIcon className="h-4 w-4 shrink-0 text-ink/40 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-ink/70">{faq.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        Still curious? Reach us on the{" "}
        <Link
          href="/contact"
          className="font-medium text-forest underline-offset-4 hover:underline"
        >
          contact page
        </Link>
        .
      </p>
    </main>
  );
}
