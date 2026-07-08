"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrder } from "@/lib/api/orders";
import { formatDate, formatINR } from "@/lib/format";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { SUPPORT_EMAIL } from "@/lib/static-content";
import { useToast } from "@/context/ToastContext";
import RequireAuth from "@/components/auth/RequireAuth";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

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

function InvoiceContent({ orderId }) {
  const toast = useToast();
  const [order, setOrder] = useState(null); // null loading | false error
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((data) => {
        if (!cancelled) setOrder(data || false);
      })
      .catch(() => {
        if (!cancelled) setOrder(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

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
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <EmptyState
          title="We couldn't find that order"
          body="It may belong to another account, or the link is old."
          action={{ href: "/orders", label: "Back to my orders" }}
        />
      </main>
    );
  }

  if (
    order.orderStatus === "PENDING_PAYMENT" ||
    order.orderStatus === "CANCELLED"
  ) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Invoice not available"
          body={
            order.orderStatus === "PENDING_PAYMENT"
              ? "The invoice is generated once the payment is completed."
              : "This order was cancelled, so no invoice was issued."
          }
          action={{ href: `/orders/${order.id}`, label: "Back to the order" }}
        />
      </main>
    );
  }

  const address = shippingInfo(order);
  const items = order.items || [];

  async function handleDownload() {
    setDownloading(true);
    try {
      await generateInvoicePdf(order);
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      {/* Screen-only actions */}
      <div className="mb-5 flex items-center justify-between print:hidden">
        <Link
          href={`/orders/${order.id}`}
          className="text-xs font-medium text-forest underline-offset-4 hover:underline"
        >
          ← Back to order
        </Link>
        <Button size="sm" loading={downloading} onClick={handleDownload}>
          Download PDF
        </Button>
      </div>

      {/* Invoice paper */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-ink/10 sm:p-10 print:rounded-none print:p-0 print:ring-0">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" className="h-12 w-12 rounded-full" />
            <div>
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl leading-none text-forest">
                  Kiran Sudha
                </span>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion"
                />
              </p>
              <p className="mt-1 text-xs text-ink/50">
                India&apos;s legacy, worn anew
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-xl tracking-wide text-ink">
              TAX INVOICE
            </p>
            <p className="mt-1 text-xs text-ink/50">
              Prices inclusive of GST
            </p>
          </div>
        </div>

        {/* Meta + address */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="text-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Invoice details
            </p>
            <dl className="mt-2.5 space-y-1 text-ink/70">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-ink/50">Invoice no.</dt>
                <dd className="font-medium text-ink">
                  {order.orderNumber || `KS-${order.id}`}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-ink/50">Order date</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 text-ink/50">Payment</dt>
                <dd>
                  {order.paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Paid online"}
                  {order.paymentStatus ? ` (${order.paymentStatus})` : ""}
                </dd>
              </div>
            </dl>
          </div>

          <div className="text-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Billed & shipped to
            </p>
            <div className="mt-2.5 text-ink/70">
              {address.name && (
                <p className="font-medium text-ink">{address.name}</p>
              )}
              {address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {address.phone && (
                <p className="mt-0.5 text-xs text-ink/50">
                  Mobile: {address.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items */}
        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="pb-2 pr-2 font-medium">Item</th>
              <th className="pb-2 pr-2 font-medium">Size</th>
              <th className="pb-2 pr-2 text-right font-medium">Qty</th>
              <th className="pb-2 pr-2 text-right font-medium">Rate</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const unit = item.discountPrice ?? item.price ?? 0;
              const line =
                item.totalPrice ?? item.itemTotal ?? unit * (item.quantity || 1);
              return (
                <tr key={item.id} className="border-b border-ink/5">
                  <td className="py-2.5 pr-2 text-ink">
                    {item.productName || item.name}
                  </td>
                  <td className="py-2.5 pr-2 text-ink/60">
                    {item.size || "—"}
                  </td>
                  <td className="py-2.5 pr-2 text-right text-ink/60">
                    {item.quantity || 1}
                  </td>
                  <td className="py-2.5 pr-2 text-right text-ink/60">
                    {formatINR(unit)}
                  </td>
                  <td className="py-2.5 text-right font-medium text-ink">
                    {formatINR(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-5 flex justify-end">
          <div className="w-full max-w-xs text-sm">
            {order.subtotal != null && (
              <div className="flex justify-between py-1">
                <span className="text-ink/60">Subtotal (incl. GST)</span>
                <span className="text-ink">{formatINR(order.subtotal)}</span>
              </div>
            )}
            {Number(order.couponDiscount) > 0 && (
              <div className="flex justify-between py-1">
                <span className="text-ink/60">
                  Coupon{order.couponCode ? ` (${order.couponCode})` : ""}
                </span>
                <span className="font-medium text-success">
                  − {formatINR(order.couponDiscount)}
                </span>
              </div>
            )}
            {order.deliveryCharge != null && (
              <div className="flex justify-between py-1">
                <span className="text-ink/60">Delivery</span>
                <span className="text-ink">
                  {Number(order.deliveryCharge) === 0
                    ? "FREE"
                    : formatINR(order.deliveryCharge)}
                </span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-ink/15 pt-2">
              <span className="font-medium text-ink">Grand total</span>
              <span className="font-display text-lg text-forest">
                {formatINR(order.totalAmount)}
              </span>
            </div>
            {order.gst != null && Number(order.gst) > 0 && (
              <p className="mt-1 text-right text-[11px] text-ink/50">
                Includes GST of {formatINR(order.gst)}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-ink/10 pt-4 text-center text-[11px] leading-4 text-ink/40">
          <p>
            Kiran Sudha · {SUPPORT_EMAIL} · This is a computer-generated
            invoice and does not require a signature.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function InvoiceView({ orderId }) {
  return (
    <RequireAuth>
      <InvoiceContent orderId={orderId} />
    </RequireAuth>
  );
}
