"use client";

import { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { MapPinIcon } from "@/components/ui/Icons";

/** Compact pincode/deliverability block for the product page. */
export default function DeliveryCheck() {
  const { pincode, delivery, serviceable, status, submitPincode } =
    useLocation();
  const [pin, setPin] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (submitPincode(pin)) setPin("");
  }

  return (
    <div className="mt-6 rounded-xl bg-white p-4 ring-1 ring-ink/10">
      <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
        <MapPinIcon className="h-4 w-4 text-forest" />
        Delivery
      </p>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          inputMode="numeric"
          maxLength={6}
          placeholder={pincode ? `Change from ${pincode}` : "Enter pincode"}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-label="Delivery pincode"
          className="h-10 w-full rounded-lg border border-ink/15 bg-white px-3 text-sm outline-none transition-colors focus:border-forest"
        />
        <button
          type="submit"
          disabled={pin.length !== 6}
          className="h-10 shrink-0 rounded-full bg-forest px-4 text-sm font-medium text-ivory transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check
        </button>
      </form>

      {pincode && (
        <div className="mt-3 text-sm">
          {status === "checking" && (
            <p className="text-ink/60">Checking {pincode}…</p>
          )}
          {status === "ready" && serviceable && (
            <div className="text-ink/70">
              <p className="font-medium text-success">
                Delivers to {pincode}
                {delivery?.city ? ` — ${delivery.city}` : ""}
              </p>
              <p className="mt-0.5">
                {delivery?.estimatedDeliveryDays != null &&
                  `Estimated ${delivery.estimatedDeliveryDays} day${
                    delivery.estimatedDeliveryDays === 1 ? "" : "s"
                  } · `}
                COD {delivery?.codAvailable ? "available" : "not available"}
              </p>
            </div>
          )}
          {status === "ready" && serviceable === false && (
            <p className="font-medium text-vermilion">
              Sorry — we don&apos;t deliver to {pincode} yet.
            </p>
          )}
          {status === "error" && (
            <p className="text-vermilion">
              Couldn&apos;t check {pincode}. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
