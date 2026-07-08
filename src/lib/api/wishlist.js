/**
 * Wishlist API (v9 §7) — auth required.
 * POST /api/wishlist/{productId} toggles (heart icon behavior).
 */

import { apiFetch } from "./client";

export const toggleWishlist = (productId) =>
  apiFetch(`/api/wishlist/${productId}`, { method: "POST", auth: true });

/** → { wishlisted: true|false } */
export const checkWishlist = (productId) =>
  apiFetch(`/api/wishlist/check/${productId}`, { auth: true });

export const getWishlist = () => apiFetch("/api/wishlist", { auth: true });
