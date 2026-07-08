"use client";

import Link from "next/link";
import { formatINR } from "@/lib/format";
import Button from "@/components/ui/Button";

function Row({ label, value, accent }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-ink/60">{label}</span>
      <span className={accent || "text-ink"}>{value}</span>
    </div>
  );
}

/**
 * Bill breakup card (design-system bill pattern):
 * subtotal → coupon discount → GST → delivery → estimated total.
 */
export default function BillSummary({ cart, coupon, subtotal, showCta = true }) {
  const gst = cart?.gst ?? cart?.gstAmount ?? null;
  const delivery = cart?.deliveryCharge ?? null;
  const discount = coupon?.discountAmount || 0;

  const baseTotal =
    cart?.totalAmount ??
    subtotal + (Number(gst) || 0) + (Number(delivery) || 0);
  const estimatedTotal = Math.max(0, baseTotal - discount);

  return (
    <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
      <h2 className="font-display text-lg text-forest">
        Bill Details
        <span
          aria-hidden
          className="ml-1.5 inline-block h-1 w-1 rounded-full bg-vermilion align-middle"
        />
      </h2>

      <div className="mt-4 flex flex-col gap-2.5">
        <Row label="Subtotal" value={formatINR(subtotal)} />
        {discount > 0 && (
          <Row
            label={`Coupon (${coupon.code})`}
            value={`− ${formatINR(discount)}`}
            accent="font-medium text-success"
          />
        )}
        {gst != null && <Row label="GST" value={formatINR(gst)} />}
        {delivery != null && (
          <Row
            label="Delivery"
            value={
              Number(delivery) === 0 ? (
                <span className="font-medium text-success">FREE</span>
              ) : (
                formatINR(delivery)
              )
            }
          />
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-ink/15 pt-4">
        <span className="text-sm font-medium text-ink">Estimated total</span>
        <span className="font-display text-xl text-forest">
          {formatINR(estimatedTotal)}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-4 text-ink/40">
        Final bill (incl. GST &amp; delivery for your address) is confirmed at
        checkout.
      </p>

      {showCta && (
        <Link href="/checkout" className="mt-5 block">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  );
}
