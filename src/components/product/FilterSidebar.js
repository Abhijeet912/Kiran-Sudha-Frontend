"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CLOTHING_SIZES } from "@/lib/listing";
import { ChevronDownIcon } from "@/components/ui/Icons";

function Section({ title, children }) {
  return (
    <details open className="group border-b border-ink/10 py-4 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
        {title}
        <ChevronDownIcon className="h-4 w-4 text-ink/40 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function OptionRow({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
        active ? "font-medium text-forest" : "text-ink/70 hover:text-forest"
      }`}
    >
      <span
        aria-hidden
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
          active ? "border-forest" : "border-ink/25"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-forest" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function FilterControls({ categories, states, showCategory, showState, current }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(current.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice || "");

  function pushWith(overrides) {
    const qs = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([key, value]) => {
      if (value == null || value === "") qs.delete(key);
      else qs.set(key, String(value));
    });
    qs.delete("page");
    const s = qs.toString();
    router.push(`${pathname}${s ? `?${s}` : ""}`);
  }

  /** Radio-style: clicking the active value clears it. */
  const toggle = (key, value) =>
    pushWith({ [key]: current[key] === String(value) ? null : value });

  function applyPrice(e) {
    e.preventDefault();
    pushWith({
      minPrice: /^\d+$/.test(minPrice) ? minPrice : null,
      maxPrice: /^\d+$/.test(maxPrice) ? maxPrice : null,
    });
  }

  const hasAny =
    current.category || current.state || current.size || current.minPrice || current.maxPrice;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-forest">Filters</h2>
        {hasAny && (
          <button
            type="button"
            onClick={() =>
              pushWith({
                category: null,
                state: null,
                size: null,
                minPrice: null,
                maxPrice: null,
              })
            }
            className="text-xs font-medium text-vermilion underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {showCategory && categories.length > 0 && (
        <Section title="Category">
          {categories.map((c) => (
            <OptionRow
              key={c.id ?? c.slug}
              label={c.name}
              active={current.category === String(c.id)}
              onClick={() => toggle("category", c.id)}
            />
          ))}
        </Section>
      )}

      {showState && states.length > 0 && (
        <Section title="State">
          <div className="max-h-56 overflow-y-auto pr-1">
            {states.map((s) => (
              <OptionRow
                key={s.id ?? s.slug}
                label={s.name}
                active={current.state === String(s.id)}
                onClick={() => toggle("state", s.id)}
              />
            ))}
          </div>
        </Section>
      )}

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {CLOTHING_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle("size", s)}
              className={`h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors ${
                current.size === s
                  ? "border-forest bg-forest text-ivory"
                  : "border-ink/15 bg-white text-ink/70 hover:border-forest hover:text-forest"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <form onSubmit={applyPrice} className="flex items-center gap-2">
          <input
            inputMode="numeric"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ""))}
            aria-label="Minimum price"
            className="h-9 w-full rounded-lg border border-ink/15 bg-white px-2.5 text-sm outline-none focus:border-forest"
          />
          <span className="text-ink/40">–</span>
          <input
            inputMode="numeric"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
            aria-label="Maximum price"
            className="h-9 w-full rounded-lg border border-ink/15 bg-white px-2.5 text-sm outline-none focus:border-forest"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-full bg-forest px-3.5 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover"
          >
            Go
          </button>
        </form>
      </Section>
    </div>
  );
}

/**
 * Listing filters — desktop: sticky sidebar; mobile: collapsible block.
 * Values map straight to /api/products/filter params (single-select each).
 */
export default function FilterSidebar(props) {
  return (
    <>
      {/* Mobile */}
      <details className="mb-5 rounded-xl bg-white p-4 ring-1 ring-ink/10 lg:hidden">
        <summary className="cursor-pointer list-none text-sm font-medium text-forest">
          Filters ▾
        </summary>
        <div className="mt-3">
          <FilterControls {...props} />
        </div>
      </details>

      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-xl bg-white p-5 ring-1 ring-ink/10">
          <FilterControls {...props} />
        </div>
      </aside>
    </>
  );
}
