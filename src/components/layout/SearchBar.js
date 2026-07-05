"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { suggest } from "@/lib/api/catalog";
import { SearchIcon } from "@/components/ui/Icons";

/** Frontend routes per suggestion type (v9 §28). */
const TYPE_ROUTES = {
  PRODUCT: (slug) => `/products/${slug}`,
  CATEGORY: (slug) => `/categories/${slug}`,
  STATE: (slug) => `/states/${slug}`,
  ART_FORM: (slug) => `/artforms/${slug}`,
};

const TYPE_LABELS = {
  PRODUCT: "Product",
  CATEGORY: "Category",
  STATE: "State",
  ART_FORM: "Art form",
};

export default function SearchBar({ className = "", onNavigate }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // Debounced live suggestions (300ms, min 2 chars).
  useEffect(() => {
    const term = q.trim();
    let cancelled = false;
    const t = setTimeout(() => {
      if (term.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      suggest(term, 6)
        .then((data) => {
          if (cancelled) return;
          setResults(data?.suggestions || []);
          setOpen(true);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  // Close when clicking outside.
  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(path) {
    setOpen(false);
    setQ("");
    onNavigate?.();
    router.push(path);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const term = q.trim();
    if (term.length < 2) return;
    go(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="flex h-10 items-center gap-2 rounded-full border border-ink/15 bg-white px-3.5 transition-colors focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/15">
          <SearchIcon className="h-4 w-4 shrink-0 text-ink/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search Chikankari, kurtas, states…"
            aria-label="Search products, states and art forms"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl bg-white py-1.5 shadow-lg ring-1 ring-ink/10">
          {results.map((s) => {
            const route = TYPE_ROUTES[s.type];
            return (
              <li key={`${s.type}-${s.slug}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => route && go(route(s.slug))}
                  className="flex w-full items-center gap-3 px-3.5 py-2 text-left hover:bg-ivory"
                >
                  {s.imageUrl ? (
                    <Image
                      src={s.imageUrl}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ivory text-ink/40">
                      <SearchIcon className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">
                    {s.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-forest">
                    {TYPE_LABELS[s.type] || s.type}
                  </span>
                </button>
              </li>
            );
          })}
          <li className="border-t border-ink/5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSubmit}
              className="w-full px-3.5 py-2 text-left text-sm font-medium text-forest hover:bg-ivory"
            >
              See all results for “{q.trim()}”
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
