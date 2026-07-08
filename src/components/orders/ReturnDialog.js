"use client";

import { useState } from "react";
import { createReturn } from "@/lib/api/orders";
import { CLOTHING_SIZES } from "@/lib/listing";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const REASONS = [
  "Size or fit issue",
  "Damaged or defective",
  "Different from description",
  "Received wrong item",
  "Other",
];

/** Return/exchange request for one delivered item (US-14). */
export default function ReturnDialog({ order, item, onClose, onSubmitted }) {
  const toast = useToast();
  const [type, setType] = useState("RETURN");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [exchangeSize, setExchangeSize] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const reasonText = reason === "Other" ? note.trim() : reason;
    if (!reasonText) {
      setError("Please select a reason.");
      return;
    }
    if (type === "EXCHANGE" && !exchangeSize) {
      setError("Please pick the size you'd like instead.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await createReturn({
        orderId: order.id,
        orderItemId: item.id,
        requestType: type,
        reason: reasonText,
        ...(type === "EXCHANGE" ? { exchangeSize } : {}),
      });
      toast.success(
        type === "EXCHANGE" ? "Exchange requested" : "Return requested"
      );
      onSubmitted?.(result);
    } catch (err) {
      setError(err.message || "Could not submit the request.");
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={onClose} title="Return or exchange">
      <p className="text-sm text-ink/60">
        {item.productName || item.name}
        {item.size ? ` · Size ${item.size}` : ""}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Type */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "RETURN", label: "Return", body: "Refund to my payment method" },
            { id: "EXCHANGE", label: "Exchange", body: "Different size, same piece" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setType(opt.id)}
              aria-pressed={type === opt.id}
              className={`rounded-xl border p-3 text-left transition-colors ${
                type === opt.id
                  ? "border-forest bg-forest/5"
                  : "border-ink/10 hover:border-forest/40"
              }`}
            >
              <span className="block text-sm font-medium text-ink">
                {opt.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink/50">
                {opt.body}
              </span>
            </button>
          ))}
        </div>

        {/* Exchange size */}
        {type === "EXCHANGE" && (
          <div>
            <p className="text-sm font-medium text-ink">New size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CLOTHING_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setExchangeSize(s)}
                  aria-pressed={exchangeSize === s}
                  className={`h-9 min-w-11 rounded-full border px-3 text-sm font-medium transition-colors ${
                    exchangeSize === s
                      ? "border-forest bg-forest text-ivory"
                      : "border-ink/15 bg-white text-ink/70 hover:border-forest hover:text-forest"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <p className="text-sm font-medium text-ink">Reason</p>
          <div className="mt-2 flex flex-col gap-2">
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
                  name="return-reason"
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
        </div>

        {reason === "Other" && (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={200}
            placeholder="Tell us more…"
            className="rounded-lg border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-forest"
          />
        )}

        {error && <p className="text-sm text-vermilion">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" loading={submitting}>
            Submit request
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Never mind
          </Button>
        </div>
      </form>
    </Modal>
  );
}
