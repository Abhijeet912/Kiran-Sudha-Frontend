/**
 * Catalog API — categories, states, art forms, products, search (v9 §3–5, 27–28).
 * All product list endpoints return a Spring Page — read `.content` for rows.
 */

import { apiFetch } from "./client";

// ---------- Navigation / taxonomy ----------
export const getTopLevelCategories = () => apiFetch("/api/categories/top-level");
export const getStates = () => apiFetch("/api/states");
export const getArtForms = () => apiFetch("/api/artforms");
export const getArtForm = (slug) =>
  apiFetch(`/api/artforms/${encodeURIComponent(slug)}`);

// ---------- Products ----------
/** All active products — "Shop All". params: { page, size, sortBy, sortDir } */
export const getAllProducts = (params) =>
  apiFetch("/api/products", { params });

export const getProductBySlug = (slug) =>
  apiFetch(`/api/products/slug/${encodeURIComponent(slug)}`);

export const getProductsByCategory = (categoryId, params) =>
  apiFetch(`/api/products/category/${categoryId}`, { params });

export const getProductsByState = (stateId, params) =>
  apiFetch(`/api/products/state/${stateId}`, { params });

/** Art form products are looked up by NAME (e.g. "Chikankari"), not slug. */
export const getProductsByArtForm = (artFormName, params) =>
  apiFetch(`/api/products/artform/${encodeURIComponent(artFormName)}`, {
    params,
  });

export const searchProducts = (keyword, params) =>
  apiFetch("/api/products/search", { params: { keyword, ...params } });

/** params: { categoryId, stateId, minPrice, maxPrice, size, page, ... } */
export const filterProducts = (params) =>
  apiFetch("/api/products/filter", { params });

export const getBestSellers = (size = 8) =>
  apiFetch("/api/products/best-sellers", { params: { size } });

export const getTrending = (params) =>
  apiFetch("/api/products/trending", { params });

export const getOnSale = (params) =>
  apiFetch("/api/products/on-sale", { params });

// ---------- Search autocomplete ----------
/**
 * Live suggestions (min 2 chars) → { query, suggestions: [{ name, slug,
 * type: PRODUCT|CATEGORY|STATE|ART_FORM, imageUrl }] }
 */
export const suggest = (q, limit = 5) =>
  apiFetch("/api/search/suggest", { params: { q, limit } });
