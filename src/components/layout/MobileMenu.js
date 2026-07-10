"use client";

import Link from "next/link";
import { useLocation } from "@/context/LocationContext";
import SearchBar from "@/components/layout/SearchBar";
import { ChevronDownIcon, MapPinIcon, XIcon } from "@/components/ui/Icons";

/**
 * Mobile drawer — NAVIGATION ONLY. Account actions (wishlist, orders,
 * profile, notifications, logout) live under the profile icon in the top
 * bar, so they are deliberately not repeated here.
 */
export default function MobileMenu({ open, onClose, categories, states }) {
  const { pincode, openModal } = useLocation();

  if (!open) return null;

  const itemClass =
    "block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-forest/5 hover:text-forest";

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
        tabIndex={-1}
      />
      <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-ivory p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" className="h-8 w-8 rounded-full" />
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-xl text-forest">
                Kiran Sudha
              </span>
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion"
              />
            </span>
          </span>
          <button aria-label="Close" onClick={onClose} className="text-ink/60">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <SearchBar onNavigate={onClose} className="mb-4" />

        <button
          onClick={() => {
            onClose();
            openModal();
          }}
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-forest/5 px-3 py-2.5 text-sm font-medium text-forest"
        >
          <MapPinIcon className="h-4 w-4" />
          {pincode ? `Delivering to ${pincode}` : "Set delivery pincode"}
        </button>

        <nav className="flex flex-col gap-1">
          <Link href="/products" onClick={onClose} className={itemClass}>
            Shop All
          </Link>

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-forest/5 hover:text-forest">
              Categories
              <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-2 border-l border-ink/10 pl-2">
              {categories.map((c) => (
                <Link
                  key={c.id ?? c.slug}
                  href={`/categories/${c.slug}`}
                  onClick={onClose}
                  className={itemClass}
                >
                  {c.name}
                </Link>
              ))}
              {categories.length === 0 && (
                <p className="px-3 py-2 text-sm text-ink/50">No categories yet</p>
              )}
            </div>
          </details>

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-forest/5 hover:text-forest">
              Browse by State
              <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-2 border-l border-ink/10 pl-2">
              {states.map((s) => (
                <Link
                  key={s.id ?? s.slug}
                  href={`/states/${s.slug}`}
                  onClick={onClose}
                  className={itemClass}
                >
                  {s.name}
                </Link>
              ))}
              {states.length === 0 && (
                <p className="px-3 py-2 text-sm text-ink/50">No states yet</p>
              )}
            </div>
          </details>

          <Link href="/offers" onClick={onClose} className={itemClass}>
            Offers
          </Link>
          <Link href="/vault" onClick={onClose} className={itemClass}>
            Fashion Vault
          </Link>
        </nav>

        <p className="mt-6 border-t border-ink/10 pt-4 text-xs leading-5 text-ink/50">
          Wishlist, orders &amp; profile live under the profile icon in the
          top bar.
        </p>
      </div>
    </div>
  );
}
