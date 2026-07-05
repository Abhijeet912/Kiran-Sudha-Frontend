import Link from "next/link";

/** Consistent section header: gold eyebrow, Fraunces title, optional action. */
export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 font-display text-2xl text-forest sm:text-3xl">
          {title}
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
