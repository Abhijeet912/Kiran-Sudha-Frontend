"use client";

import { useLocation } from "@/context/LocationContext";

/**
 * Payment method choice. "ONLINE" opens Razorpay (UPI/cards/netbanking);
 * "COD" is gated by the pincode's codAvailable flag. The admin's global
 * COD toggle is enforced server-side — order creation surfaces that error.
 */
export default function PaymentMethodPicker({ value, onChange }) {
  const { pincode, delivery } = useLocation();

  const codBlocked = delivery ? delivery.codAvailable === false : false;

  const options = [
    {
      id: "ONLINE",
      title: "Pay Online",
      body: "UPI, cards, netbanking — secured by Razorpay",
      disabled: false,
    },
    {
      id: "COD",
      title: "Cash on Delivery",
      body: codBlocked
        ? `COD isn't available for ${pincode}`
        : pincode
          ? `Available for ${pincode}`
          : "Set your pincode to confirm availability",
      disabled: codBlocked,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={opt.disabled}
            onClick={() => onChange?.(opt.id)}
            aria-pressed={active}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "border-forest bg-forest/5"
                : "border-ink/10 bg-white hover:border-forest/40"
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                active ? "border-forest" : "border-ink/25"
              }`}
            >
              {active && <span className="h-2 w-2 rounded-full bg-forest" />}
            </span>
            <span className="text-sm">
              <span className="font-medium text-ink">{opt.title}</span>
              <span className="mt-0.5 block text-ink/60">{opt.body}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
