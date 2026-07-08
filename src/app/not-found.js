import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">404</p>
      <h1 className="font-display text-4xl text-forest">
        This thread has unraveled
        <span
          aria-hidden
          className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
        />
      </h1>
      <p className="max-w-md text-ink/60">
        The page you&apos;re looking for doesn&apos;t exist — but the loom
        never stops. Let&apos;s get you back to the collection.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full bg-forest px-6 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover"
        >
          Back home
        </Link>
        <Link
          href="/products"
          className="inline-flex h-11 items-center rounded-full border border-forest px-6 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-ivory"
        >
          Shop all
        </Link>
      </div>
    </main>
  );
}
