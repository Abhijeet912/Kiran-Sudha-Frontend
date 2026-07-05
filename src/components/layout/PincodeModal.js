"use client";

import { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MapPinIcon, XIcon } from "@/components/ui/Icons";

export default function PincodeModal() {
  const {
    modalOpen,
    closeModal,
    submitPincode,
    detectLocation,
    pincode,
    delivery,
    status,
    serviceable,
  } = useLocation();

  const [pin, setPin] = useState("");

  if (!modalOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (submitPincode(pin)) setPin("");
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-4">
      <button
        aria-label="Close"
        onClick={closeModal}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          aria-label="Close pincode dialog"
          onClick={closeModal}
          className="absolute right-4 top-4 text-ink/40 hover:text-ink"
        >
          <XIcon />
        </button>

        <h2 className="font-display text-xl text-forest">
          Where should we deliver?
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Enter your pincode to see delivery time, COD availability and offers
          for your area.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Pincode"
              name="pincode"
              inputMode="numeric"
              maxLength={6}
              placeholder="e.g. 226001"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <Button type="submit" disabled={pin.length !== 6}>
            Apply
          </Button>
        </form>

        <button
          type="button"
          onClick={detectLocation}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          <MapPinIcon className="h-4 w-4" />
          {status === "detecting" ? "Detecting your location…" : "Use my current location"}
        </button>

        {pincode && (
          <div className="mt-5 rounded-xl bg-ivory p-4 text-sm">
            {status === "checking" && (
              <p className="text-ink/60">Checking {pincode}…</p>
            )}
            {status === "ready" && serviceable && (
              <>
                <p className="font-medium text-success">
                  Delivering to {pincode}
                  {delivery?.city ? ` — ${delivery.city}` : ""}
                </p>
                <ul className="mt-1.5 space-y-0.5 text-ink/70">
                  {delivery?.estimatedDeliveryDays != null && (
                    <li>
                      Estimated delivery: {delivery.estimatedDeliveryDays} day
                      {delivery.estimatedDeliveryDays === 1 ? "" : "s"}
                    </li>
                  )}
                  <li>
                    Cash on Delivery:{" "}
                    {delivery?.codAvailable ? "available" : "not available"}
                  </li>
                </ul>
              </>
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
    </div>
  );
}
