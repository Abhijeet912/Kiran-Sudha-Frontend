"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api/orders";
import RequireAuth from "@/components/auth/RequireAuth";
import OrderCard from "@/components/orders/OrderCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

const PAGE = 10;

function OrdersContent() {
  const [orders, setOrders] = useState(null); // null = loading
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrders({ page: 0, size: PAGE })
      .then((data) => {
        if (cancelled) return;
        setOrders(data?.content || []);
        setPageData(data);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getOrders({ page: next, size: PAGE });
      setOrders((o) => [...(o || []), ...(data?.content || [])]);
      setPageData(data);
      setPage(next);
    } catch {
      // leave list as-is
    } finally {
      setLoadingMore(false);
    }
  }

  if (orders === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
      </div>
    );
  }

  const hasMore = pageData ? !pageData.last : false;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Your journey
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          My Orders
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No orders yet"
            body="Your first piece of legacy fashion is waiting."
            action={{ href: "/products", label: "Shop the collection" }}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <Button variant="outline" loading={loadingMore} onClick={loadMore}>
                Load more orders
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function OrdersView() {
  return (
    <RequireAuth>
      <OrdersContent />
    </RequireAuth>
  );
}
