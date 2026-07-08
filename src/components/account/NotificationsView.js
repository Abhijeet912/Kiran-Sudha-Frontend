"use client";

import { useEffect, useState } from "react";
import {
  emitNotificationsChange,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/user";
import { formatDate } from "@/lib/format";
import { useToast } from "@/context/ToastContext";
import RequireAuth from "@/components/auth/RequireAuth";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { BellIcon } from "@/components/ui/Icons";

const PAGE = 15;
const asList = (data) => (Array.isArray(data) ? data : data?.content || []);
const isUnread = (n) => !(n.isRead ?? n.read ?? false);

function NotificationsContent() {
  const toast = useToast();
  const [notifications, setNotifications] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getNotifications({ page: 0, size: PAGE })
      .then((data) => {
        if (cancelled) return;
        setNotifications(asList(data));
        setPageData(Array.isArray(data) ? null : data);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const data = await getNotifications({ page: next, size: PAGE });
      setNotifications((n) => [...(n || []), ...asList(data)]);
      setPageData(Array.isArray(data) ? null : data);
      setPage(next);
    } catch {
      // keep list as-is
    } finally {
      setLoadingMore(false);
    }
  }

  async function markAll() {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      setNotifications((list) =>
        (list || []).map((n) => ({ ...n, isRead: true, read: true }))
      );
      emitNotificationsChange();
      toast.success("All caught up!");
    } catch (e) {
      toast.error(e.message || "Could not mark notifications as read.");
    } finally {
      setMarkingAll(false);
    }
  }

  function markOne(n) {
    if (!isUnread(n)) return;
    setNotifications((list) =>
      (list || []).map((item) =>
        item.id === n.id ? { ...item, isRead: true, read: true } : item
      )
    );
    markNotificationRead(n.id)
      .then(() => emitNotificationsChange())
      .catch(() => {});
  }

  if (notifications === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
      </div>
    );
  }

  const unreadCount = notifications.filter(isUnread).length;
  const hasMore = pageData ? !pageData.last : false;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Stay in the loop
          </p>
          <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
            Notifications
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            loading={markingAll}
            onClick={markAll}
          >
            Mark all as read
          </Button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No notifications yet"
            body="Order updates and news will appear here."
            action={{ href: "/products", label: "Shop the collection" }}
          />
        </div>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-2.5">
            {notifications.map((n, i) => {
              const unread = isUnread(n);
              return (
                <li key={n.id ?? i}>
                  <button
                    type="button"
                    onClick={() => markOne(n)}
                    className={`flex w-full items-start gap-3 rounded-xl p-4 text-left ring-1 transition-colors ${
                      unread
                        ? "bg-white ring-forest/20 hover:ring-forest/40"
                        : "bg-white/60 ring-ink/5"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        unread
                          ? "bg-forest/10 text-forest"
                          : "bg-ink/5 text-ink/40"
                      }`}
                    >
                      <BellIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={`text-sm ${unread ? "font-semibold text-ink" : "font-medium text-ink/70"}`}
                        >
                          {n.title || "Update"}
                        </span>
                        {unread && (
                          <span
                            aria-hidden
                            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-vermilion"
                          />
                        )}
                      </span>
                      {n.message && (
                        <span className="mt-0.5 block text-sm leading-5 text-ink/60">
                          {n.message}
                        </span>
                      )}
                      {n.createdAt && (
                        <span className="mt-1 block text-xs text-ink/40">
                          {formatDate(n.createdAt)}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hasMore && (
            <div className="mt-6 text-center">
              <Button variant="outline" loading={loadingMore} onClick={loadMore}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function NotificationsView() {
  return (
    <RequireAuth>
      <NotificationsContent />
    </RequireAuth>
  );
}
