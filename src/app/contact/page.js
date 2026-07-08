import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/static-content";
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  YoutubeIcon,
} from "@/components/ui/Icons";

export const metadata = {
  title: "Contact Us",
  description: "Questions, feedback or a size dilemma — we're listening.",
};

const SOCIALS = [
  { href: "https://www.facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://www.instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://www.youtube.com", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://www.pinterest.com", label: "Pinterest", Icon: PinterestIcon },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Contact us
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          We&apos;re listening
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/60">
          A question about your order, a size dilemma, or a story about a craft
          we should tell — write to us.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
          <h2 className="font-display text-lg text-forest">Email</h2>
          <p className="mt-2 text-sm text-ink/70">
            For orders, returns and everything else:
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-2 inline-block text-sm font-medium text-forest underline-offset-4 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-3 text-xs text-ink/40">
            We reply within 1–2 business days.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-ink/5">
          <h2 className="font-display text-lg text-forest">Find us</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Kiran Sudha
            <br />
            Lucknow, Uttar Pradesh, India
          </p>
          <ul className="mt-4 flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-forest ring-1 ring-forest/20 transition-colors hover:bg-forest hover:text-ivory"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-8 text-center text-sm text-ink/60">
        Order-specific issue? The fastest route is{" "}
        <Link
          href="/orders"
          className="font-medium text-forest underline-offset-4 hover:underline"
        >
          My Orders
        </Link>{" "}
        — cancel, track, return or retry payment right there.
      </p>
    </main>
  );
}
