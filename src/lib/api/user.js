/**
 * User account API — notifications now; profile, addresses and
 * recently-viewed join in the account phase (v9 §15–17).
 */

import { apiFetch } from "./client";

// ---------- Notifications ----------
export const getNotifications = (params) =>
  apiFetch("/api/notifications", { params, auth: true });

/** → { unreadCount } */
export const getUnreadCount = () =>
  apiFetch("/api/notifications/unread-count", { auth: true });

export const markAllNotificationsRead = () =>
  apiFetch("/api/notifications/read-all", { method: "PATCH", auth: true });

// ---------- Recently viewed ----------
export const getRecentlyViewed = () =>
  apiFetch("/api/recently-viewed", { auth: true });

export const trackProductView = (productId) =>
  apiFetch(`/api/recently-viewed/${productId}`, { method: "POST", auth: true });
