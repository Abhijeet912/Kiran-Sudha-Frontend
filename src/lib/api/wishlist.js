/**
 * Wishlist API (v9 §7) — auth required.
 * POST adds, DELETE removes; use toggleWishlist with the CURRENT state.
 */

import { apiFetch } from "./client";

export const addToWishlist = (productId) =>
  apiFetch(`/api/wishlist/${productId}`, { method: "POST", auth: true });

export const removeFromWishlist = (productId) =>
  apiFetch(`/api/wishlist/${productId}`, { method: "DELETE", auth: true });

/** Pass the item's CURRENT wishlisted state; the right verb is chosen. */
export const toggleWishlist = (productId, currentlyWishlisted) =>
  currentlyWishlisted
    ? removeFromWishlist(productId)
    : addToWishlist(productId);

/** → { wishlisted: true|false } */
export const checkWishlist = (productId) =>
  apiFetch(`/api/wishlist/check/${productId}`, { auth: true });

export const getWishlist = () => apiFetch("/api/wishlist", { auth: true });
