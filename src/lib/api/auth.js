/**
 * Auth + OTP API (v9 sections 1–2).
 * POST /api/auth/register · POST /api/auth/login · POST /api/auth/refresh
 * POST /api/otp/send · POST /api/otp/verify
 */

import { apiFetch, tokenStore, emitAuthChange } from "./client";

function persistSession(data) {
  tokenStore.setSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    },
  });
  emitAuthChange();
}

/** payload: { firstName, lastName, email, password, phone } */
export async function register(payload) {
  const data = await apiFetch("/api/auth/register", {
    method: "POST",
    body: payload,
  });
  persistSession(data);
  return data;
}

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  persistSession(data);
  return data;
}

export function logout() {
  tokenStore.clear();
  emitAuthChange();
}

export function getStoredUser() {
  return tokenStore.getUser();
}

export function isLoggedIn() {
  return Boolean(tokenStore.getAccessToken());
}

export function sendOtp(phoneNumber) {
  return apiFetch("/api/otp/send", {
    method: "POST",
    body: { phoneNumber },
  });
}

export function verifyOtp(phoneNumber, otp) {
  return apiFetch("/api/otp/verify", {
    method: "POST",
    body: { phoneNumber, otp },
  });
}
