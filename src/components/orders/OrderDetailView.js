"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOrder, getReturns } from "@/lib/api/orders";
import { formatDate, formatINR } from "@/lib/format";
import RequireAuth from "@/components/auth/RequireAuth";
import OrderStatusPill, {
  RETURN_STATUS_META,
} from "@/components/orders/OrderStatusPill";
import StatusTimeline from "@/components/orders/StatusTimeline";
import CancelOrderDialog from "@/components/orders/CancelOrderDialog";
import ReturnDialog from "@/components/orders/ReturnDialog";
import CompletePaymentButton from "@/components/orders/CompletePaymentButton";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

/** Frozen shipping address, whatever shape the backend uses. */
function shippingInfo(order) {
  const a = order.shippingAddress || order.address || null;
  if (a && typeof a === "object") {
    return {
      name: a.fullName || a.name || "",
      phone: a.phone || "",
      lines: [
        a.addressLine1,
        a.addressLine2,
        [a.city, a.state].filter(Boolean).join(", "),
        a.pincode,
      ].filter(Boolean),
    };
  }
  return {
    name: order.shippingFullName || order.customerName || "",
    phone: order.shippingPhone || "",
    lines: [
      order.shippingAddressLine1,
      order.shippingAddressLine2,
      [order.shippingCity, order.shippingState].filter(Boolean).join(", "),
      order.shippingPincode,
    ].filter(Boolean),
  };
}

function BillRow({ label, value, accent }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className={accent || "text-ink"}>{value}</span>
    </div>
  );
}

function OrderDetailContent({ orderId }) {
  const [order, setOrder] = useState(null); // null loading | false error
  const [returns, setReturns] = useState([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [returnItem, setReturnItem] = useState(null);

  const reload = useCallback(() => {
    getOrder(orderId)
      .then((data) => setOrder(data || false))
      .catch(() => setOrder(false));
    getReturns()
      .then((data) => setReturns(asList(data)))
      .catch(() => {});
  }, [orderId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const returnsByItem = useMemo(() => {
    const map = {};
    returns.forEach((r) => {
      if (r.orderItemId != null) map[r.orderItemId] = r;
    });
    return map;
  }, [returns]);

  if (order === null) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
      </div>
    );
  }

  if (order === false) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <EmptyState
          title="We couldn't find that order"
          body="It may belong to another account, or the link is old."
          action={{ href: "/orders", label: "Back to my orders" }}
        />
      </main>
    );
  }

  const status = order.orderStatus;
  const items = order.items || [];
  const address = shippingInfo(order);
  const canCancel = status === "PLACED" || status === "CONFIRMED";
  const canReturn = status === "DELIVERED";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/orders"
        className="text-xs font-medium text-forest underline-offset-4 hover:underline"
      >
        ← All orders
      </Link>

      {/* Header */}
      <header className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-forest sm:text-3xl">
            {order.orderNumber || `Order #${order.id}`}
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
          <p className="mt-1 text-xs text-ink/50">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusPill status={status} />
      </header>

      {/* Pending payment banner */}
      {status === "PENDING_PAYMENT" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4">
          <p className="text-sm text-ink/80">
            This order is reserved — complete the payment to confirm it.
          </p>
          <CompletePaymentButton order={order} onPaid={reload} />
        </div>
      )}

      {/* Timeline */}
      <section className="mt-6 rounded-xl bg-white p-5 ring-1 ring-ink/10">
        <StatusTimeline
          status={status}
          estimatedDeliveryDate={order.estimatedDeliveryDate}
        />
      </section>

      {/* Items */}
      <section className="mt-5 rounded-xl bg-white px-5 ring-1 ring-ink/10">
        {items.map((item) => {
          const image = item.imageUrl || item.productImageUrl || null;
          const unit = item.discountPrice ?? item.price ?? 0;
          const line =
            item.totalPrice ?? item.itemTotal ?? unit * (item.quantity || 1);
          const request = returnsByItem[item.id];
          return (
            <div
              key={item.id}
              className="flex gap-4 border-b border-ink/5 py-4 last:border-b-0"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream ring-1 ring-ink/5">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-sm text-forest/30">
                    KS
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-ink">
                    {item.productName || item.name}
                    <span className="ml-1.5 text-xs font-normal text-ink/50">
                      × {item.quantity || 1}
                      {item.size ? ` · ${item.size}` : ""}
                    </span>
                  </p>
                  <p className="shrink-0 text-sm font-semibold text-ink">
                    {formatINR(line)}
                  </p>
                </div>

                {request ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink/60">
                    <OrderStatusPill
                      status={request.status}
                      meta={RETURN_STATUS_META}
                    />
                    <span>
                      {request.requestType === "EXCHANGE"
                        ? `Exchange${request.exchangeSize ? ` (size ${request.exchangeSize})` : ""}`
                        : "Return"}
                      {request.reason ? ` — ${request.reason}` : ""}
                    </span>
                  </div>
                ) : (
                  canReturn && (
                    <button
                      type="button"
                      onClick={() => setReturnItem(item)}
                      className="mt-2 text-xs font-medium text-forest underline-offset-4 hover:underline"
                    >
                      Return / Exchange
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {/* Address */}
        <section className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Delivering to
          </h2>
          <div className="mt-2.5 text-sm text-ink/70">
            {address.name && (
              <p className="font-medium text-ink">{address.name}</p>
            )}
            {address.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {address.phone && (
              <p className="mt-1 text-xs text-ink/50">
                Mobile: {address.phone}
              </p>
            )}
            {!address.name && address.lines.length === 0 && (
              <p className="text-ink/40">Address unavailable</p>
            )}
          </div>
        </section>

        {/* Bill */}
        <section className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Bill details
          </h2>
          <div className="mt-2.5 flex flex-col gap-2">
            {order.subtotal != null && (
              <BillRow
                label="Subtotal (incl. GST)"
                value={formatINR(order.subtotal)}
              />
            )}
            {Number(order.couponDiscount) > 0 && (
              <BillRow
                label={`Coupon${order.couponCode ? ` (${order.couponCode})` : ""}`}
                value={`− ${formatINR(order.couponDiscount)}`}
                accent="font-medium text-success"
              />
            )}
            {order.deliveryCharge != null && (
              <BillRow
                label="Delivery"
                value={
                  Number(order.deliveryCharge) === 0 ? (
                    <span className="font-medium text-success">FREE</span>
                  ) : (
                    formatINR(order.deliveryCharge)
                  )
                }
              />
            )}
            <div className="mt-1 flex items-baseline justify-between border-t border-dashed border-ink/15 pt-2.5">
              <span className="text-sm font-medium text-ink">Total</span>
              <span className="font-display text-lg text-forest">
                {formatINR(order.totalAmount)}
              </span>
            </div>
            {order.gst != null && Number(order.gst) > 0 && (
              <p className="text-[11px] text-ink/50">
                Includes GST of {formatINR(order.gst)} · Prices inclusive of
                all taxes
              </p>
            )}
            <p className="text-xs text-ink/50">
              {order.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Paid online"}
              {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
            </p>
            {status !== "PENDING_PAYMENT" && status !== "CANCELLED" && (
              <Link
                href={`/orders/${order.id}/invoice`}
                className="mt-1 inline-block text-xs font-medium text-forest underline-offset-4 hover:underline"
              >
                Download invoice ↓
              </Link>
            )}
          </div>
        </section>
      </div>

      {/* Actions */}
      {canCancel && (
        <div className="mt-6">
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            Cancel order
          </Button>
          <p className="mt-2 text-xs text-ink/50">
            Orders can be cancelled until they&apos;re shipped.
          </p>
        </div>
      )}

      {/* Dialogs */}
      {cancelOpen && (
        <CancelOrderDialog
          order={order}
          onClose={() => setCancelOpen(false)}
          onCancelled={() => {
            setCancelOpen(false);
            reload();
          }}
        />
      )}
      {returnItem && (
        <ReturnDialog
          order={order}
          item={returnItem}
          onClose={() => setReturnItem(null)}
          onSubmitted={() => {
            setReturnItem(null);
            reload();
          }}
        />
      )}
    </main>
  );
}

export default function OrderDetailView({ orderId }) {
  return (
    <RequireAuth>
      <OrderDetailContent orderId={orderId} />
    </RequireAuth>
  );
}
