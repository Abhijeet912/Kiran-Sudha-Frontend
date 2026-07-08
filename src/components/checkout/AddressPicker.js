"use client";

import { useEffect, useState } from "react";
import { getAddresses } from "@/lib/api/user";
import AddressForm from "@/components/checkout/AddressForm";

const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

/** Radio-card list of saved addresses + inline "add new" form. */
export default function AddressPicker({ selectedId, onSelect }) {
  const [addresses, setAddresses] = useState(null); // null = loading
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAddresses()
      .then((data) => {
        if (cancelled) return;
        const list = asList(data);
        setAddresses(list);
        // Preselect the default (or the only) address.
        const preferred =
          list.find((a) => a.isDefault || a.default) || list[0] || null;
        if (preferred) onSelect?.(preferred.id);
        if (list.length === 0) setShowForm(true);
      })
      .catch(() => {
        if (!cancelled) {
          setAddresses([]);
          setShowForm(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSaved(saved) {
    setShowForm(false);
    setAddresses((list) => [...(list || []), saved]);
    if (saved?.id) onSelect?.(saved.id);
  }

  if (addresses === null) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-ink/50">
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
        Loading your addresses…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((a) => {
        const active = selectedId === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect?.(a.id)}
            aria-pressed={active}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
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
            <span className="min-w-0 text-sm">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-ink">{a.fullName}</span>
                {(a.isDefault || a.default) && (
                  <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-forest">
                    Default
                  </span>
                )}
              </span>
              <span className="mt-1 block text-ink/60">
                {[a.addressLine1, a.addressLine2, a.city, a.state]
                  .filter(Boolean)
                  .join(", ")}
                {a.pincode ? ` — ${a.pincode}` : ""}
              </span>
              {a.phone && (
                <span className="mt-0.5 block text-xs text-ink/50">
                  Mobile: {a.phone}
                </span>
              )}
            </span>
          </button>
        );
      })}

      {showForm ? (
        <div className="rounded-xl border border-ink/10 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-ink">
            {addresses.length === 0 ? "Add a delivery address" : "New address"}
          </p>
          <AddressForm
            onSaved={handleSaved}
            onCancel={
              addresses.length > 0 ? () => setShowForm(false) : undefined
            }
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-xl border border-dashed border-forest/40 px-4 py-3 text-left text-sm font-medium text-forest transition-colors hover:bg-forest/5"
        >
          + Add new address
        </button>
      )}
    </div>
  );
}
