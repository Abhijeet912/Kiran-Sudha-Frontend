export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.35em] text-gold">
        Kiran Sudha
      </p>
      <h1 className="font-display text-4xl text-forest md:text-5xl">
        India&apos;s legacy, worn anew.
      </h1>
      <p className="max-w-md text-lg text-ink/70">
        The storefront is being handcrafted — one thread at a time.
      </p>
      <span
        className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-vermilion"
        aria-hidden
      />
    </main>
  );
}
