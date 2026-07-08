"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/listing";

/** Result count + sort select. Sorting resets to page 1. */
export default function SortBar({ sort = "featured", total }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e) {
    const qs = new URLSearchParams(searchParams.toString());
    if (e.target.value === "featured") qs.delete("sort");
    else qs.set("sort", e.target.value);
    qs.delete("page");
    const s = qs.toString();
    router.push(`${pathname}${s ? `?${s}` : ""}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink/60">
        {total != null
          ? `${total} product${total === 1 ? "" : "s"}`
          : " "}
      </p>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        Sort by
        <select
          value={sort}
          onChange={handleChange}
          className="h-9 rounded-full border border-ink/15 bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-forest"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
