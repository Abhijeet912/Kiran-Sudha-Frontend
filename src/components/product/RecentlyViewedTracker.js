"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { trackProductView } from "@/lib/api/user";

/** Fire-and-forget: records the product view for logged-in users. */
export default function RecentlyViewedTracker({ productId }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !productId) return;
    trackProductView(productId).catch(() => {});
  }, [isAuthenticated, productId]);

  return null;
}
