"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Client-side guard for authenticated pages (/cart, /checkout, /orders…).
 * Redirects to /login?next={current path} when there is no session.
 */
export default function RequireAuth({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      fallback ?? (
        <div className="flex flex-1 items-center justify-center py-24">
          <span
            aria-hidden
            className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
          />
        </div>
      )
    );
  }

  return children;
}
