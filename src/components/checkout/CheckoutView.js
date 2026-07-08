"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  applyCoupon,
  getServerCouponSnapshot,
  getStoredCouponSnapshot,
  storeCoupon,
  subscribeCoupon,
} from "@/lib/api/coupons";
import { createOrder } from "@/lib/api/orders";
import {
  createPaymentOrder,
  loadRazorpayScript,
  reportPaymentFailure,
  verifyPayment,
} from "@/lib/api/payments";
import { formatINR } from "@/lib/format";
import RequireAuth from "@/components/auth/RequireAuth";
import AddressPicker from "@/components/checkout/AddressPicker";
import PaymentMethodPicker from "@/components/checkout/PaymentMethodPicker";
import BillSummary from "@/components/cart/BillSummary";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

function SectionCard({ step, title, children }) {
  return (
    <section className="rounded-xl bg-white p-5 ring-1 ring-ink/10 sm:p-6">
      <h2 className="flex items-center gap-2.5 font-display text-lg text-forest">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-semibold text-ivory">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CheckoutContent() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const toast = useToast();

  const coupon = useSyncExternalStore(
    subscribeCoupon,
    getStoredCouponSnapshot,
    getServerCouponSnapshot
  );

  const [addressId, setAddressId] = useState(null);
  const [method, setMethod] = useState("ONLINE");
  const [placing, setPlacing] = useState(false);
  // payment: null | { order, status: "processing"|"failed", error? }
  const [payment, setPayment] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const items = useMemo(() => cart?.items || [], [cart]);
  const subtotal = useMemo(() => {
    if (cart?.subtotal != null) return Number(cart.subtotal);
    return items.reduce((sum, it) => {
      const unit = it.discountPrice ?? it.price ?? 0;
      return sum + Number(it.totalPrice ?? it.itemTotal ?? unit * (it.quantity || 1));
    }, 0);
  }, [cart, items]);

  function finishSuccess(order) {
    storeCoupon(null);
    refresh().catch(() => {});
    setPayment(null);
    setPlacedOrder(order);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  async function verify(order, response) {
    try {
      await verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
      toast.success("Payment successful!");
      finishSuccess(order);
    } catch (e) {
      setPayment({
        order,
        status: "failed",
        error: e.message || "Payment verification failed. You can retry below.",
      });
    }
  }

  async function startPayment(order) {
    setPayment({ order, status: "processing" });
    try {
      const pay = await createPaymentOrder(order.id);
      const Razorpay = await loadRazorpayScript();
      const rzp = new Razorpay({
        key: pay.razorpayKeyId,
        amount: Math.round(Number(pay.amount) * 100), // rupees → paise
        currency: pay.currency || "INR",
        name: "Kiran Sudha",
        description: `Order ${order.orderNumber || `#${order.id}`}`,
        order_id: pay.razorpayOrderId,
        prefill: {
          name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
          email: user?.email || "",
        },
        theme: { color: "#2C4727" },
        handler: (response) => verify(order, response),
        modal: {
          ondismiss: () => {
            reportPaymentFailure(pay.razorpayOrderId, "dismissed").catch(
              () => {}
            );
            setPayment({
              order,
              status: "failed",
              error: "Payment was cancelled before completing.",
            });
          },
        },
      });
      if (typeof rzp.on === "function") {
        rzp.on("payment.failed", (resp) => {
          const reason = resp?.error?.description || "failed";
          reportPaymentFailure(pay.razorpayOrderId, reason).catch(() => {});
          setPayment({
            order,
            status: "failed",
            error: resp?.error?.description || "Payment failed.",
          });
        });
      }
      rzp.open();
    } catch (e) {
      setPayment({
        order,
        status: "failed",
        error: e.message || "Could not start the payment.",
      });
    }
  }

  async function placeOrder() {
    if (!addressId) {
      toast.error("Please select a delivery address.");
      return;
    }
    setPlacing(true);
    try {
      // Re-validate the coupon at the last second.
      let couponCode;
      if (coupon) {
        try {
          const res = await applyCoupon(coupon.code, subtotal);
          if (res?.valid) {
            couponCode = coupon.code;
          } else {
            storeCoupon(null);
            toast.info("Your coupon is no longer valid and was removed.");
          }
        } catch {
          storeCoupon(null);
          toast.info("Your coupon is no longer valid and was removed.");
        }
      }

      // Backend PaymentMethod: COD, or the online method (doc example: UPI —
      // the actual instrument is chosen inside the Razorpay widget).
      const order = await createOrder({
        addressId,
        paymentMethod: method === "COD" ? "COD" : "UPI",
        couponCode,
      });

      if (method === "COD") {
        toast.success("Order placed!");
        finishSuccess(order);
      } else {
        await startPayment(order);
      }
    } catch (e) {
      toast.error(e.message || "Could not place the order.");
    } finally {
      setPlacing(false);
    }
  }

  // ----- Success screen -----
  if (placedOrder) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
        <span
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success"
        >
          ✓
        </span>
        <h1 className="mt-5 font-display text-3xl text-forest sm:text-4xl">
          Order placed!
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
        <p className="mt-3 text-ink/70">
          Thank you, {user?.firstName || "friend"} — your order{" "}
          <span className="font-medium text-ink">
            {placedOrder.orderNumber || `#${placedOrder.id}`}
          </span>{" "}
          is confirmed.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl bg-white p-5 text-left text-sm ring-1 ring-ink/10">
          <div className="flex justify-between">
            <span className="text-ink/60">Total</span>
            <span className="font-semibold text-ink">
              {formatINR(placedOrder.totalAmount)}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-ink/60">Payment</span>
            <span className="text-ink">
              {placedOrder.paymentMethod === "COD"
                ? "Cash on Delivery"
                : "Paid online"}
            </span>
          </div>
          {placedOrder.estimatedDeliveryDate && (
            <div className="mt-2 flex justify-between">
              <span className="text-ink/60">Estimated delivery</span>
              <span className="text-ink">
                {placedOrder.estimatedDeliveryDate}
              </span>
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/orders">
            <Button size="lg">Track my orders</Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline">
              Continue shopping
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // ----- Cart not loaded / empty -----
  if (!cart) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <span
          aria-hidden
          className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Nothing to check out yet"
          body="Your cart is empty — add a few pieces first."
          action={{ href: "/products", label: "Shop the collection" }}
        />
      </main>
    );
  }

  const paymentFailed = payment?.status === "failed";
  const paymentProcessing = payment?.status === "processing";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Nearly there
        </p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          Checkout
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      {/* Payment failed / retry panel (US-16: order kept, retry available) */}
      {paymentFailed && (
        <div className="mt-6 rounded-xl border border-vermilion/30 bg-vermilion/5 p-5">
          <p className="font-medium text-vermilion">
            Payment didn&apos;t go through
          </p>
          <p className="mt-1 text-sm text-ink/70">
            {payment.error} Your order{" "}
            <span className="font-medium">
              {payment.order.orderNumber || `#${payment.order.id}`}
            </span>{" "}
            is saved as pending — no money was taken, and your cart is safe.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => startPayment(payment.order)}>
              Retry payment
            </Button>
            <Button variant="ghost" onClick={() => setPayment(null)}>
              Back to checkout
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 gap-8 lg:grid lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Steps */}
        <div className="flex flex-col gap-5">
          <SectionCard step="1" title="Delivery address">
            <AddressPicker selectedId={addressId} onSelect={setAddressId} />
          </SectionCard>

          <SectionCard step="2" title="Payment method">
            <PaymentMethodPicker value={method} onChange={setMethod} />
          </SectionCard>

          <Button
            size="lg"
            loading={placing || paymentProcessing}
            onClick={placeOrder}
            className="w-full sm:w-auto"
          >
            {method === "COD" ? "Place order" : "Place order & pay"}
          </Button>
        </div>

        {/* Order summary rail */}
        <div className="mt-8 flex flex-col gap-4 lg:sticky lg:top-24 lg:mt-0">
          <div className="rounded-xl bg-white p-5 ring-1 ring-ink/10">
            <h2 className="font-display text-lg text-forest">
              Your order ({items.length} item{items.length === 1 ? "" : "s"})
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {items.map((it) => {
                const unit = it.discountPrice ?? it.price ?? 0;
                const line = it.totalPrice ?? it.itemTotal ?? unit * (it.quantity || 1);
                return (
                  <li
                    key={it.id}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="min-w-0 truncate text-ink/70">
                      {it.productName || it.name}
                      <span className="text-ink/40">
                        {" "}
                        × {it.quantity || 1}
                        {it.size ? ` (${it.size})` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-ink">{formatINR(line)}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <BillSummary
            cart={cart}
            coupon={coupon}
            subtotal={subtotal}
            showCta={false}
          />
          <p className="text-center text-xs text-ink/40">
            🔒 Online payments are secured by Razorpay.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutView() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}
