/**
 * Orders & Returns API (v9 §9, 14) — auth required.
 * COD orders go straight to PLACED; online orders start as PENDING_PAYMENT
 * and move to PLACED after Razorpay verification (see payments.js).
 */

import { apiFetch } from "./client";

/** payload: { addressId, paymentMethod, couponCode? } */
export const createOrder = ({ addressId, paymentMethod, couponCode }) =>
  apiFetch("/api/orders", {
    method: "POST",
    body: {
      addressId,
      paymentMethod,
      ...(couponCode ? { couponCode } : {}),
    },
    auth: true,
  });

export const getOrders = (params) =>
  apiFetch("/api/orders", { params, auth: true });

export const getOrder = (id) => apiFetch(`/api/orders/${id}`, { auth: true });

export const cancelOrder = (id, reason) =>
  apiFetch(`/api/orders/${id}/cancel`, {
    method: "POST",
    body: { reason },
    auth: true,
  });

// ---------- Returns / Exchanges ----------
/** payload: { orderId, orderItemId, requestType: RETURN|EXCHANGE, reason, exchangeSize? } */
export const createReturn = (payload) =>
  apiFetch("/api/returns", { method: "POST", body: payload, auth: true });

export const getReturns = (params) =>
  apiFetch("/api/returns", { params, auth: true });
