"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { formatINR, primaryImageUrl } from "@/lib/format";
import { useToast } from "@/context/ToastContext";
import RequireAuth from "@/components/auth/RequireAuth";
import EmptyState from "@/components/ui/EmptyState";
import { HeartIcon } from "@/components/ui/Icons";

const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

/** Wishlist entries may be products or wrappers around a product. */
function normalizeEntry(entry) {
  const p = entry.product || entry;
  return {
    key: entry.id ?? p.id,
    productId: p.productId ?? p.id ?? entry.productId,
    name: p.productName || p.name || "Product",
    slug: p.productSlug || p.slug || null,
    image: p.imageUrl || p.productImageUrl || primaryImageUrl(p),
    price: p.discountPrice ?? p.price ?? null,
    originalPrice:
      p.discountPrice != null &&
      p.price != null &&
      Number(p.discountPrice) < Number(p.price)
        ? p.price
        : null,
  };
}

function WishlistContent() {
  const toast = useToast();
  const [items, setItems] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    getWishlist()
      .then((data) => {
        if (!cancelled) setItems(asList(data).map(normalizeEntry));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function remove(item) {
    try {
      await removeFromWishlist(item.productId);
      setItems((list) => list.filter((i) => i.key !== item.key));
      toast.info(`Removed ${item.name} from wishlist`);
    } catch (e) {
      toast.error(e.message || "Could not remove the item.");
    }
  }

  if (items === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Saved with love
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          My Wishlist
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your wishlist is empty"
            body="Tap the heart on any piece you love and it will wait for you here."
            action={{ href: "/products", label: "Discover pieces" }}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const href = item.slug ? `/products/${item.slug}` : null;
            const ImageBlock = (
              <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-2xl text-forest/30">
                    KS
                  </div>
                )}
              </div>
            );
            return (
              <div
                key={item.key}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-ink/5"
              >
                {href ? <Link href={href}>{ImageBlock}</Link> : ImageBlock}
                <div className="flex flex-1 flex-col gap-1 p-3.5">
                  {href ? (
                    <Link
                      href={href}
                      className="truncate text-sm font-medium text-ink hover:text-forest"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-medium text-ink">
                      {item.name}
                    </p>
                  )}
                  {item.price != null && (
                    <p className="flex items-baseline gap-2">
                      <span className="text-base font-semibold text-ink">
                        {formatINR(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-ink/40 line-through">
                          {formatINR(item.originalPrice)}
                        </span>
                      )}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-medium text-vermilion underline-offset-4 hover:underline"
                  >
                    <HeartIcon filled className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function WishlistView() {
  return (
    <RequireAuth>
      <WishlistContent />
    </RequireAuth>
  );
}
