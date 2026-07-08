import { formatDate } from "@/lib/format";

const STEPS = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

/**
 * Order journey timeline (design-system order-timeline pattern).
 * CANCELLED renders as a terminal banner; PENDING_PAYMENT shows step 0.
 */
export default function StatusTimeline({ status, estimatedDeliveryDate }) {
  if (status === "CANCELLED") {
    return (
      <div className="rounded-xl border border-vermilion/25 bg-vermilion/5 px-4 py-3 text-sm">
        <p className="font-medium text-vermilion">This order was cancelled</p>
        <p className="mt-0.5 text-ink/60">
          If the order was prepaid, the refund is initiated to the original
          payment method.
        </p>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status);
  // PENDING_PAYMENT (or unknown) → nothing reached yet.
  const reached = (i) => currentIdx >= 0 && i <= currentIdx;

  return (
    <div>
      <ol className="flex items-start">
        {STEPS.map((step, i) => (
          <li
            key={step.key}
            className={`flex items-start ${i > 0 ? "flex-1" : ""}`}
          >
            {i > 0 && (
              <span
                aria-hidden
                className={`mt-3 h-0.5 flex-1 rounded-full ${
                  reached(i) ? "bg-forest" : "bg-ink/15"
                }`}
              />
            )}
            <span className="flex flex-col items-center gap-1.5 px-1.5">
              <span
                aria-hidden
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                  reached(i)
                    ? "bg-forest text-ivory"
                    : i === currentIdx + 1 && currentIdx >= 0
                      ? "border-2 border-forest/40 text-forest/60"
                      : "border-2 border-ink/15 text-ink/30"
                }`}
              >
                {reached(i) ? "✓" : i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-[11px] font-medium ${
                  reached(i) ? "text-forest" : "text-ink/40"
                }`}
              >
                {step.label}
              </span>
            </span>
          </li>
        ))}
      </ol>

      {status === "PENDING_PAYMENT" && (
        <p className="mt-3 text-sm text-ink/60">
          The journey begins once the payment is completed.
        </p>
      )}
      {estimatedDeliveryDate && status !== "DELIVERED" && (
        <p className="mt-3 text-sm text-ink/60">
          Estimated delivery:{" "}
          <span className="font-medium text-ink">
            {formatDate(estimatedDeliveryDate)}
          </span>
        </p>
      )}
    </div>
  );
}
