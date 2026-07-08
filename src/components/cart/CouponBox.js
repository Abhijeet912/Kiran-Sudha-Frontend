"use client";

import { useState } from "react";
import { applyCoupon, getValidCoupons, storeCoupon } from "@/lib/api/coupons";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/format";

/**
 * Coupon preview on the cart page. A valid coupon is stored in
 * sessionStorage and carried to checkout (backend applies it at order time).
 */
export default function CouponBox({ subtotal, coupon }) {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);

  const [available, setAvailable] = useState(null); // null = not loaded
  const [loadingList, setLoadingList] = useState(false);

  async function apply(rawCode) {
    const trimmed = String(rawCode || "").trim().toUpperCase();
    if (!trimmed) return;
    setError("");
    setApplying(true);
    try {
      const res = await applyCoupon(trimmed, subtotal);
      if (res?.valid) {
        storeCoupon({
          code: trimmed,
          discountAmount: res.discountAmount,
          finalAmount: res.finalAmount,
          orderAmount: subtotal,
        });
        setCode("");
        toast.success(res.message || `Coupon ${trimmed} applied!`);
      } else {
        setError(res?.message || "This coupon can't be applied.");
      }
    } catch (e) {
      setError(e.message || "This coupon can't be applied.");
    } finally {
      setApplying(false);
    }
  }

  function removeCoupon() {
    storeCoupon(null);
    toast.info("Coupon removed");
  }

  async function loadAvailable() {
    if (available || loadingList) return;
    setLoadingList(true);
    try {
      const data = await getValidCoupons();
      setAvailable(Array.isArray(data) ? data : data?.content || []);
    } catch {
      setAvailable([]);
    } finally {
      setLoadingList(false);
    }
  }

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
      <p className="text-sm font-medium text-ink">Coupon</p>

      {coupon ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-success/10 px-3.5 py-2.5">
          <div className="min-w-0 text-sm">
            <p className="font-semibold tracking-wide text-success">
              {coupon.code}
            </p>
            <p className="text-xs text-ink/60">
              You save {formatINR(coupon.discountAmount)}
            </p>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="shrink-0 text-xs font-medium text-vermilion underline-offset-4 hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply(code);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className="h-10 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm uppercase tracking-wide outline-none transition-colors placeholder:normal-case focus:border-forest"
            />
            <button
              type="submit"
              disabled={!code.trim() || applying}
              className="h-10 shrink-0 rounded-full bg-forest px-4 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? "…" : "Apply"}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-vermilion">{error}</p>}
        </>
      )}

      {/* Available coupons */}
      <details className="mt-3" onToggle={(e) => e.target.open && loadAvailable()}>
        <summary className="cursor-pointer list-none text-xs font-medium text-forest underline-offset-4 hover:underline">
          View available coupons
        </summary>
        <div className="mt-2 flex flex-col gap-2">
          {loadingList && <p className="text-xs text-ink/50">Loading…</p>}
          {available && available.length === 0 && !loadingList && (
            <p className="text-xs text-ink/50">
              No coupons available right now.
            </p>
          )}
          {(available || []).map((c) => (
            <button
              key={c.id ?? c.code}
              type="button"
              onClick={() => apply(c.code)}
              className="rounded-lg border border-dashed border-gold/60 bg-gold/5 px-3 py-2 text-left transition-colors hover:border-gold"
            >
              <span className="text-xs font-semibold tracking-wider text-gold">
                {c.code}
              </span>
              {c.description && (
                <span className="mt-0.5 block text-xs text-ink/60">
                  {c.description}
                </span>
              )}
              {c.minimumOrderAmount != null && c.minimumOrderAmount > 0 && (
                <span className="mt-0.5 block text-[10px] text-ink/40">
                  Min. order {formatINR(c.minimumOrderAmount)}
                </span>
              )}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
