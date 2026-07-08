/**
 * Cart API (v9 §6) — server-side cart, auth required.
 * Every mutation returns the FULL updated cart (no extra GET needed).
 * Cart shape: { items: [...], subtotal, gst, deliveryCharge, totalAmount, … }
 */

import { apiFetch } from "./client";

export const getCart = () => apiFetch("/api/cart", { auth: true });

/** payload: { productId, size, quantity } — size is required by the backend. */
export const addCartItem = ({ productId, size, quantity = 1 }) =>
  apiFetch("/api/cart/items", {
    method: "POST",
    body: { productId, size, quantity },
    auth: true,
  });

export const updateCartItem = (itemId, quantity) =>
  apiFetch(`/api/cart/items/${itemId}`, {
    method: "PUT",
    params: { quantity },
    auth: true,
  });

export const removeCartItem = (itemId) =>
  apiFetch(`/api/cart/items/${itemId}`, { method: "DELETE", auth: true });

export const clearCart = () =>
  apiFetch("/api/cart", { method: "DELETE", auth: true });
