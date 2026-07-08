"use client";

import { useState } from "react";
import { cancelOrder } from "@/lib/api/orders";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price",
  "Delivery is taking too long",
  "Other",
];

/** Cancellation with a required reason (US-13). */
export default function CancelOrderDialog({ order, onClose, onCancelled }) {
  const toast = useToast();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const reasonText = reason === "Other" ? note.trim() : reason;
    if (!reasonText) {
      setError(
        reason === "Other"
          ? "Please tell us the reason."
          : "Please select a reason."
      );
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await cancelOrder(order.id, reasonText);
      toast.success("Order cancelled");
      onCancelled?.(result);
    } catch (err) {
      setError(err.message || "Could not cancel the order.");
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Cancel this order?">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {REASONS.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                reason === r
                  ? "border-forest bg-forest/5 text-forest"
                  : "border-ink/10 text-ink/70 hover:border-forest/40"
              }`}
            >
              <input
                type="radio"
                name="cancel-reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                  reason === r ? "border-forest" : "border-ink/25"
                }`}
              >
                {reason === r && (
                  <span className="h-2 w-2 rounded-full bg-forest" />
                )}
              </span>
              {r}
            </label>
          ))}
        </div>

        {reason === "Other" && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder="Tell us what went wrong…"
            className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-forest"
          />
        )}

        {error && <p className="text-sm text-vermilion">{error}</p>}

        <p className="text-xs text-ink/50">
          If this order was prepaid, the refund will be initiated to your
          original payment method.
        </p>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="danger" loading={submitting}>
            Cancel order
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Keep order
          </Button>
        </div>
      </form>
    </Modal>
  );
}
