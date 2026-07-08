"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { checkWishlist, toggleWishlist } from "@/lib/api/wishlist";
import Button from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/Icons";

const LOW_STOCK_AT = 5;

/**
 * The interactive purchase island: size selection (required before
 * add-to-cart, per spec), stock states, add-to-cart, wishlist heart.
 */
export default function PurchasePanel({ product }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const router = useRouter();

  const sizes = product.sizes || [];
  const stock = product.stockQuantity;
  const outOfStock = stock != null && stock <= 0;
  const lowStock = !outOfStock && stock != null && stock <= LOW_STOCK_AT;

  const [size, setSize] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    checkWishlist(product.id)
      .then((d) => {
        if (!cancelled) setWishlisted(Boolean(d?.wishlisted));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, product.id]);

  function requireLogin(message) {
    toast.info(message);
    router.push(`/login?next=${encodeURIComponent(`/products/${product.slug}`)}`);
  }

  async function handleAdd() {
    if (outOfStock) return;
    if (!isAuthenticated) {
      requireLogin("Login to add items to your cart");
      return;
    }
    if (!size) {
      setError("Please select a size first");
      return;
    }
    setError("");
    setAdding(true);
    try {
      await addItem({ productId: product.id, size, quantity: 1 });
      toast.success(`Added to cart — size ${size}`);
    } catch (e) {
      toast.error(e.message || "Could not add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleWishlist() {
    if (!isAuthenticated) {
      requireLogin("Login to save items to your wishlist");
      return;
    }
    const next = !wishlisted;
    setWishlisted(next); // optimistic
    try {
      await toggleWishlist(product.id, wishlisted);
      toast.success(next ? "Added to wishlist" : "Removed from wishlist");
    } catch (e) {
      setWishlisted(!next);
      toast.error(e.message || "Could not update wishlist.");
    }
  }

  return (
    <div className="mt-6">
      {/* Size selection */}
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-ink">Select size</p>
        {lowStock && (
          <p className="text-xs font-medium text-vermilion">
            Only {stock} left
          </p>
        )}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            disabled={outOfStock}
            onClick={() => {
              setSize(s);
              setError("");
            }}
            aria-pressed={size === s}
            className={`h-10 min-w-12 rounded-full border px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              size === s
                ? "border-forest bg-forest text-ivory"
                : "border-ink/15 bg-white text-ink/70 hover:border-forest hover:text-forest"
            }`}
          >
            {s}
          </button>
        ))}
        {sizes.length === 0 && (
          <p className="text-sm text-ink/50">Size information coming soon.</p>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-vermilion">{error}</p>}

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        <Button
          size="lg"
          loading={adding}
          disabled={outOfStock}
          onClick={handleAdd}
          className="flex-1"
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
            wishlisted
              ? "border-vermilion bg-vermilion/10 text-vermilion"
              : "border-ink/15 bg-white text-ink/50 hover:border-vermilion hover:text-vermilion"
          }`}
        >
          <HeartIcon filled={wishlisted} className="h-5 w-5" />
        </button>
      </div>

      {outOfStock && (
        <p className="mt-3 text-sm text-ink/60">
          This piece is currently out of stock — save it to your wishlist and
          we&apos;ll keep it close.
        </p>
      )}
    </div>
  );
}
