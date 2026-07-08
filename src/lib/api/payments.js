/**
 * Payments API — Razorpay flow (v9 §10).
 *
 * 1. POST /api/payments/create-order { orderId }
 *    → { razorpayOrderId, razorpayKeyId, amount, currency? }
 * 2. Open the Razorpay widget (amount in PAISE = amount * 100).
 * 3. POST /api/payments/verify with the widget's response → order PLACED.
 *    Failure/dismiss → POST /api/payments/failure (QUERY params) → retry.
 */

import { apiFetch } from "./client";

export const createPaymentOrder = (orderId) =>
  apiFetch("/api/payments/create-order", {
    method: "POST",
    body: { orderId },
    auth: true,
  });

export const verifyPayment = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) =>
  apiFetch("/api/payments/verify", {
    method: "POST",
    body: { razorpayOrderId, razorpayPaymentId, razorpaySignature },
    auth: true,
  });

/** NOTE: this endpoint takes query params, not a JSON body. */
export const reportPaymentFailure = (razorpayOrderId, reason) =>
  apiFetch("/api/payments/failure", {
    method: "POST",
    params: { razorpayOrderId, reason },
    auth: true,
  });

// ---------- Razorpay checkout.js loader (idempotent) ----------
let razorpayPromise = null;

export function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay is browser-only"));
  }
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!razorpayPromise) {
    razorpayPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => {
        razorpayPromise = null;
        reject(new Error("Could not load the payment window. Check your connection."));
      };
      document.body.appendChild(script);
    });
  }
  return razorpayPromise;
}
