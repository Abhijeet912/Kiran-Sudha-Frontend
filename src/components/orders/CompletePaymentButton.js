"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  createPaymentOrder,
  loadRazorpayScript,
  reportPaymentFailure,
  verifyPayment,
} from "@/lib/api/payments";
import Button from "@/components/ui/Button";

/**
 * Retry/complete payment for a PENDING_PAYMENT order (US-16).
 * Same Razorpay loop as checkout: create-order → widget → verify.
 */
export default function CompletePaymentButton({ order, onPaid }) {
  const { user } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function pay() {
    setBusy(true);
    try {
      const payData = await createPaymentOrder(order.id);
      const Razorpay = await loadRazorpayScript();
      const rzp = new Razorpay({
        key: payData.razorpayKeyId,
        amount: Math.round(Number(payData.amount) * 100),
        currency: payData.currency || "INR",
        name: "Kiran Sudha",
        description: `Order ${order.orderNumber || `#${order.id}`}`,
        order_id: payData.razorpayOrderId,
        prefill: {
          name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
          email: user?.email || "",
        },
        theme: { color: "#2C4727" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            onPaid?.();
          } catch (e) {
            toast.error(e.message || "Payment verification failed — try again.");
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            reportPaymentFailure(payData.razorpayOrderId, "dismissed").catch(
              () => {}
            );
            toast.info("Payment cancelled — you can retry anytime.");
            setBusy(false);
          },
        },
      });
      if (typeof rzp.on === "function") {
        rzp.on("payment.failed", (resp) => {
          const reason = resp?.error?.description || "failed";
          reportPaymentFailure(payData.razorpayOrderId, reason).catch(() => {});
          toast.error(resp?.error?.description || "Payment failed — try again.");
          setBusy(false);
        });
      }
      rzp.open();
    } catch (e) {
      toast.error(e.message || "Could not start the payment.");
      setBusy(false);
    }
  }

  return (
    <Button loading={busy} onClick={pay}>
      Complete Payment
    </Button>
  );
}
