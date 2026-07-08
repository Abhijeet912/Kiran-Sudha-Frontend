import Link from "next/link";

/** Friendly empty state with the brand dot motif. */
export default function EmptyState({ title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-ink/5">
      <span
        aria-hidden
        className="mb-4 inline-block h-2.5 w-2.5 rounded-full bg-vermilion"
      />
      <h3 className="font-display text-xl text-forest">{title}</h3>
      {body && <p className="mt-2 max-w-sm text-sm text-ink/60">{body}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-10 items-center rounded-full bg-forest px-5 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
