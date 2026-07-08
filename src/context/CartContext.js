"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as cartApi from "@/lib/api/cart";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

/**
 * Server-side cart cache. Every mutation endpoint returns the full updated
 * cart, so the context simply stores the latest response. Only active for
 * logged-in users (the cart icon itself is hidden when logged out).
 */
export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated) {
      // Deferred reset — clears the cart after logout.
      const t = setTimeout(() => {
        if (!cancelled) setCart(null);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }
    cartApi
      .getCart()
      .then((c) => {
        if (!cancelled) setCart(c);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const addItem = useCallback(async (payload) => {
    const updated = await cartApi.addCartItem(payload);
    setCart(updated);
    return updated;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const updated = await cartApi.updateCartItem(itemId, quantity);
    setCart(updated);
    return updated;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const updated = await cartApi.removeCartItem(itemId);
    setCart(updated);
    return updated;
  }, []);

  const clear = useCallback(async () => {
    const updated = await cartApi.clearCart();
    setCart(updated ?? null);
    return updated;
  }, []);

  const refresh = useCallback(async () => {
    const latest = await cartApi.getCart();
    setCart(latest);
    return latest;
  }, []);

  const count = useMemo(() => {
    const items = cart?.items || [];
    const fromItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    return fromItems || cart?.totalItems || 0;
  }, [cart]);

  const value = useMemo(
    () => ({ cart, count, addItem, updateItem, removeItem, clear, refresh }),
    [cart, count, addItem, updateItem, removeItem, clear, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
