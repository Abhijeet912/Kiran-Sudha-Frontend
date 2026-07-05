"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import SearchBar from "@/components/layout/SearchBar";
import {
  ChevronDownIcon,
  MapPinIcon,
  XIcon,
} from "@/components/ui/Icons";

export default function MobileMenu({ open, onClose, categories, states }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { pincode, openModal } = useLocation();
  const router = useRouter();

  if (!open) return null;

  const itemClass =
    "block rounded-lg px-3 py-2.5 text-sm font-medium text-ink hover:bg-forest/5 hover:text-forest";

  function handleLogout() {
    logout();
    onClose();
    router.push("/");
  }

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
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-xl text-forest">Kiran Sudha</span>
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion"
            />
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

        <div className="mt-6 border-t border-ink/10 pt-4">
          {isAuthenticated ? (
            <>
              <p className="px-3 pb-2 text-sm font-medium text-forest">
                Hi, {user?.firstName || "there"}
              </p>
              {[
                { href: "/wishlist", label: "Wishlist" },
                { href: "/orders", label: "My Orders" },
                { href: "/cart", label: "Cart" },
                { href: "/profile", label: "Profile & Addresses" },
                { href: "/notifications", label: "Notifications" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={itemClass}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-vermilion hover:bg-vermilion/5"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest text-sm font-medium text-ivory hover:bg-forest-hover"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
