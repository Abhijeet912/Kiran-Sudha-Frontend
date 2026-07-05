/**
 * KiranSudha API client — core transport layer.
 *
 * - Base URL from NEXT_PUBLIC_API_BASE_URL (default http://localhost:8080)
 * - JSON in/out, Bearer auth injection, normalized ApiError
 * - 401 → refresh-once → retry (per the v9 error contract)
 * - Token storage in localStorage (browser only); server components can
 *   call public endpoints with the same helper.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ACCESS_TOKEN_KEY = "ks_access_token";
const REFRESH_TOKEN_KEY = "ks_refresh_token";
const USER_KEY = "ks_user";

const isBrowser = () => typeof window !== "undefined";

export class ApiError extends Error {
  constructor(status, message, validationErrors = null, raw = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
    this.raw = raw;
  }
}

/** Notify the app (AuthContext, navbar…) that the session changed. */
export function emitAuthChange() {
  if (isBrowser()) window.dispatchEvent(new Event("ks:auth-change"));
}

export const tokenStore = {
  getAccessToken() {
    return isBrowser() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
  },
  getRefreshToken() {
    return isBrowser() ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;
  },
  getUser() {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  /** Raw stored user JSON string — stable reference for store snapshots. */
  getUserRaw() {
    return isBrowser() ? window.localStorage.getItem(USER_KEY) : null;
  },
  setSession({ accessToken, refreshToken, user }) {
    if (!isBrowser()) return;
    if (accessToken) window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken)
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};

function buildUrl(path, params) {
  const url = `${BASE_URL}${path}`;
  if (!params) return url;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, value);
    }
  });
  const qs = search.toString();
  return qs ? `${url}?${qs}` : url;
}

/** Single-flight refresh — concurrent 401s share one refresh call. */
let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = tokenStore.getRefreshToken();
      if (!refreshToken) throw new ApiError(401, "Session expired");
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: refreshToken, // raw refresh token string, per API doc
      });
      if (!res.ok) throw new ApiError(res.status, "Session expired");
      const data = await res.json();
      tokenStore.setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken,
      });
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Core request helper.
 * @param {string} path e.g. "/api/products/best-sellers"
 * @param {object} [options]
 * @param {string} [options.method] HTTP method (default GET)
 * @param {object} [options.body] JSON-serializable request body
 * @param {object} [options.params] query params (null/undefined/"" skipped)
 * @param {boolean} [options.auth] attach Bearer token (default false)
 */
export async function apiFetch(path, options = {}) {
  const { method = "GET", body, params, auth = false, _retry = false } = options;

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    // Expired token → refresh once, then retry the original request.
    if (res.status === 401 && auth && !_retry && tokenStore.getRefreshToken()) {
      try {
        await refreshAccessToken();
        return apiFetch(path, { ...options, _retry: true });
      } catch {
        tokenStore.clear();
        emitAuthChange();
        throw new ApiError(
          401,
          "Your session has expired. Please log in again."
        );
      }
    }
    const message =
      (data && typeof data === "object" && data.message) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(
      res.status,
      message,
      data && typeof data === "object" ? data.validationErrors || null : null,
      data
    );
  }

  return data;
}
