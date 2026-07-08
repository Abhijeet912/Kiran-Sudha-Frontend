/**
 * User account API — profile, password, addresses, notifications,
 * recently-viewed (v9 §15–17).
 */

import { apiFetch } from "./client";

// ---------- Profile ----------
export const getProfile = () => apiFetch("/api/users/profile", { auth: true });

export const updateProfile = (payload) =>
  apiFetch("/api/users/profile", { method: "PUT", body: payload, auth: true });

export const changePassword = ({ currentPassword, newPassword, confirmPassword }) =>
  apiFetch("/api/users/change-password", {
    method: "PUT",
    body: { currentPassword, newPassword, confirmPassword },
    auth: true,
  });

// ---------- Notifications ----------
export const getNotifications = (params) =>
  apiFetch("/api/notifications", { params, auth: true });

/** → { unreadCount } */
export const getUnreadCount = () =>
  apiFetch("/api/notifications/unread-count", { auth: true });

export const markAllNotificationsRead = () =>
  apiFetch("/api/notifications/read-all", { method: "PATCH", auth: true });

export const markNotificationRead = (id) =>
  apiFetch(`/api/notifications/${id}/read`, { method: "PATCH", auth: true });

/** Tell listeners (navbar bell) the unread count changed. */
export function emitNotificationsChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ks:notifications-change"));
  }
}

// ---------- Recently viewed ----------
export const getRecentlyViewed = () =>
  apiFetch("/api/recently-viewed", { auth: true });

export const trackProductView = (productId) =>
  apiFetch(`/api/recently-viewed/${productId}`, { method: "POST", auth: true });

// ---------- Addresses ----------
export const getAddresses = () => apiFetch("/api/addresses", { auth: true });

export const addAddress = (payload) =>
  apiFetch("/api/addresses", { method: "POST", body: payload, auth: true });

export const updateAddress = (id, payload) =>
  apiFetch(`/api/addresses/${id}`, { method: "PUT", body: payload, auth: true });

export const deleteAddress = (id) =>
  apiFetch(`/api/addresses/${id}`, { method: "DELETE", auth: true });

export const setDefaultAddress = (id) =>
  apiFetch(`/api/addresses/${id}/set-default`, { method: "PATCH", auth: true });
