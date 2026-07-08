/**
 * Product reviews & ratings API (v9 §26).
 * One review per product per user; verifiedPurchase set automatically
 * when the user has a DELIVERED order containing the product.
 */

import { apiFetch } from "./client";

/** → { averageRating, totalReviews, distribution: {"5": n, …, "1": n} } */
export const getRatingSummary = (productId) =>
  apiFetch(`/api/products/${productId}/rating-summary`);

/** Paged reviews (Spring Page). params: { page, size } */
export const getProductReviews = (productId, params) =>
  apiFetch(`/api/products/${productId}/reviews`, { params });

export const submitReview = (productId, { rating, title, comment }) =>
  apiFetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    body: { rating, title, comment },
    auth: true,
  });

export const updateReview = (productId, reviewId, body) =>
  apiFetch(`/api/products/${productId}/reviews/${reviewId}`, {
    method: "PUT",
    body,
    auth: true,
  });

export const deleteReview = (productId, reviewId) =>
  apiFetch(`/api/products/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
    auth: true,
  });
