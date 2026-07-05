/**
 * Content API — banners, testimonials, Fashion Vault (v9 §12, 13, 19).
 * Banner types: HERO = homepage carousel (4–8 active), SALE = offer strip.
 */

import { apiFetch } from "./client";

export const getHeroBanners = () => apiFetch("/api/banners/hero");
export const getSaleBanners = () => apiFetch("/api/banners/sale");

/** Featured admin testimonials for the homepage. */
export const getFeaturedTestimonials = () => apiFetch("/api/reviews/featured");

/** Vault articles — paginated. params: { page, size } */
export const getVaultArticles = (params) => apiFetch("/api/vault", { params });

export const getVaultArticle = (slug) =>
  apiFetch(`/api/vault/${encodeURIComponent(slug)}`);

export const getVaultByArtForm = (artForm) =>
  apiFetch(`/api/vault/art-form/${encodeURIComponent(artForm)}`);

export const getVaultByState = (stateName) =>
  apiFetch(`/api/vault/state/${encodeURIComponent(stateName)}`);
