/**
 * Coupons API (v9 §8) + the "applied coupon" store.
 *
 * The backend applies coupons at ORDER time (POST /api/orders {couponCode}),
 * so the cart page previews a coupon via /api/coupons/apply and carries the
 * accepted code to checkout in sessionStorage.
 */

import { apiFetch } from "./client";

export const getValidCoupons = () =>
  apiFetch("/api/coupons/valid", { auth: true });

/** → { valid, discountAmount, finalAmount, message } */
export const applyCoupon = (code, orderAmount) =>
  apiFetch("/api/coupons/apply", {
    method: "POST",
    body: { code, orderAmount },
    auth: true,
  });

// ---------- Applied-coupon store (sessionStorage) ----------
const COUPON_KEY = "ks_coupon";
const isBrowser = () => typeof window !== "undefined";

/** Persist { code, discountAmount, finalAmount, orderAmount } or null. */
export function storeCoupon(coupon) {
  if (!isBrowser()) return;
  if (coupon) {
    window.sessionStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  } else {
    window.sessionStorage.removeItem(COUPON_KEY);
  }
  window.dispatchEvent(new Event("ks:coupon-change"));
}

export function subscribeCoupon(callback) {
  window.addEventListener("ks:coupon-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("ks:coupon-change", callback);
    window.removeEventListener("storage", callback);
  };
}

// Cache the parsed value so store snapshots stay referentially stable.
let cachedRaw = null;
let cachedCoupon = null;

export function getStoredCouponSnapshot() {
  const raw = isBrowser()
    ? window.sessionStorage.getItem(COUPON_KEY)
    : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedCoupon = raw ? JSON.parse(raw) : null;
    } catch {
      cachedCoupon = null;
    }
  }
  return cachedCoupon;
}

export const getServerCouponSnapshot = () => null;
