"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  applyCoupon,
  getServerCouponSnapshot,
  getStoredCouponSnapshot,
  storeCoupon,
  subscribeCoupon,
} from "@/lib/api/coupons";
import RequireAuth from "@/components/auth/RequireAuth";
import CartItemRow from "@/components/cart/CartItemRow";
import CouponBox from "@/components/cart/CouponBox";
import BillSummary from "@/components/cart/BillSummary";
import EmptyState from "@/components/ui/EmptyState";

function CartContent() {
  const { cart, clear } = useCart();
  const toast = useToast();

  const coupon = useSyncExternalStore(
    subscribeCoupon,
    getStoredCouponSnapshot,
    getServerCouponSnapshot
  );

  const items = useMemo(() => cart?.items || [], [cart]);

  const subtotal = useMemo(() => {
    if (cart?.subtotal != null) return Number(cart.subtotal);
    return items.reduce((sum, it) => {
      const unit = it.discountPrice ?? it.price ?? 0;
      return sum + Number(it.totalPrice ?? it.itemTotal ?? unit * (it.quantity || 1));
    }, 0);
  }, [cart, items]);

  // Keep the coupon honest: re-validate when the subtotal changes,
  // drop it when the cart empties.
  useEffect(() => {
    if (!coupon || !cart) return undefined;
    if (items.length === 0) {
      storeCoupon(null);
      return undefined;
    }
    if (coupon.orderAmount === subtotal) return undefined;

    let cancelled = false;
    applyCoupon(coupon.code, subtotal)
      .then((res) => {
        if (cancelled) return;
        if (res?.valid) {
          storeCoupon({
            code: coupon.code,
            discountAmount: res.discountAmount,
            finalAmount: res.finalAmount,
            orderAmount: subtotal,
          });
        } else {
          storeCoupon(null);
        }
      })
      .catch(() => {
        if (!cancelled) storeCoupon(null);
      });
    return () => {
      cancelled = true;
    };
  }, [coupon, cart, items.length, subtotal]);

  async function handleClear() {
    if (!window.confirm("Remove all items from your cart?")) return;
    try {
      await clear();
      storeCoupon(null);
      toast.info("Cart cleared");
    } catch (e) {
      toast.error(e.message || "Could not clear the cart.");
    }
  }

  // Cart not yet loaded
  if (!cart) {
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
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Almost yours
          </p>
          <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
            Your Cart
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-vermilion underline-offset-4 hover:underline"
          >
            Clear cart
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your cart is waiting to be filled"
            body="Every piece carries a story from one of India's states — go find yours."
            action={{ href: "/products", label: "Shop the collection" }}
          />
        </div>
      ) : (
        <div className="mt-8 gap-8 lg:grid lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Items */}
          <div className="divide-y divide-ink/10 rounded-xl bg-white px-5 ring-1 ring-ink/10">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Rail */}
          <div className="mt-6 flex flex-col gap-4 lg:sticky lg:top-24 lg:mt-0">
            <CouponBox subtotal={subtotal} coupon={coupon} />
            <BillSummary cart={cart} coupon={coupon} subtotal={subtotal} />
          </div>
        </div>
      )}
    </main>
  );
}

export default function CartView() {
  return (
    <RequireAuth>
      <CartContent />
    </RequireAuth>
  );
}
