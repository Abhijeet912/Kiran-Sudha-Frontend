"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import * as authApi from "@/lib/api/auth";
import { tokenStore } from "@/lib/api/client";

const AuthContext = createContext(null);

/**
 * The session lives in localStorage (written by lib/api/auth), so we treat it
 * as an external store. Every login/logout/refresh-failure emits
 * "ks:auth-change", which re-reads the snapshot — no manual setState needed.
 */
function subscribe(callback) {
  window.addEventListener("ks:auth-change", callback);
  window.addEventListener("storage", callback); // cross-tab sync
  return () => {
    window.removeEventListener("ks:auth-change", callback);
    window.removeEventListener("storage", callback);
  };
}

// Cache parsed user by raw string so snapshots stay referentially stable.
let cachedRaw = null;
let cachedUser = null;

function getUserSnapshot() {
  const raw = tokenStore.getUserRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

const getServerUserSnapshot = () => null;

// SSR-safe hydration flag: false on the server, true after hydration.
const emptySubscribe = () => () => {};
const getHydrated = () => true;
const getServerHydrated = () => false;

export function AuthProvider({ children }) {
  const user = useSyncExternalStore(
    subscribe,
    getUserSnapshot,
    getServerUserSnapshot
  );
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    getHydrated,
    getServerHydrated
  );

  const login = useCallback(
    (email, password) => authApi.login({ email, password }),
    []
  );
  const register = useCallback((payload) => authApi.register(payload), []);
  const logout = useCallback(() => authApi.logout(), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading: !hydrated,
      login,
      register,
      logout,
    }),
    [user, hydrated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
