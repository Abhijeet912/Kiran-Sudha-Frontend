"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "@/lib/api/user";
import { useToast } from "@/context/ToastContext";
import AddressForm from "@/components/checkout/AddressForm";

const asList = (data) => (Array.isArray(data) ? data : data?.content || []);

/** Address book: list, add, edit, delete, set default. */
export default function AddressManager() {
  const toast = useToast();
  const [addresses, setAddresses] = useState(null);
  const [editing, setEditing] = useState(null); // address being edited
  const [adding, setAdding] = useState(false);

  const reload = useCallback(() => {
    getAddresses()
      .then((data) => setAddresses(asList(data)))
      .catch(() => setAddresses([]));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function makeDefault(id) {
    try {
      await setDefaultAddress(id);
      toast.success("Default address updated");
      reload();
    } catch (e) {
      toast.error(e.message || "Could not update the default address.");
    }
  }

  async function remove(addr) {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteAddress(addr.id);
      setAddresses((list) => (list || []).filter((a) => a.id !== addr.id));
      toast.info("Address deleted");
    } catch (e) {
      toast.error(e.message || "Could not delete the address.");
    }
  }

  if (addresses === null) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-ink/50">
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
        Loading addresses…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.length === 0 && !adding && (
        <p className="text-sm text-ink/50">
          No saved addresses yet — add one to breeze through checkout.
        </p>
      )}

      {addresses.map((a) =>
        editing?.id === a.id ? (
          <div key={a.id} className="rounded-xl border border-ink/10 bg-ivory/50 p-4">
            <p className="mb-3 text-sm font-medium text-ink">Edit address</p>
            <AddressForm
              initial={editing}
              onSaved={() => {
                setEditing(null);
                reload();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        ) : (
          <div
            key={a.id}
            className="rounded-xl border border-ink/10 bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-ink">{a.fullName}</p>
              {(a.isDefault || a.default) && (
                <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-forest">
                  Default
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink/60">
              {[a.addressLine1, a.addressLine2, a.city, a.state]
                .filter(Boolean)
                .join(", ")}
              {a.pincode ? ` — ${a.pincode}` : ""}
            </p>
            {a.phone && (
              <p className="mt-0.5 text-xs text-ink/50">Mobile: {a.phone}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
              {!(a.isDefault || a.default) && (
                <button
                  type="button"
                  onClick={() => makeDefault(a.id)}
                  className="text-forest underline-offset-4 hover:underline"
                >
                  Set as default
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setEditing(a);
                }}
                className="text-forest underline-offset-4 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(a)}
                className="text-vermilion underline-offset-4 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <div className="rounded-xl border border-ink/10 bg-ivory/50 p-4">
          <p className="mb-3 text-sm font-medium text-ink">New address</p>
          <AddressForm
            onSaved={() => {
              setAdding(false);
              reload();
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setAdding(true);
          }}
          className="rounded-xl border border-dashed border-forest/40 px-4 py-3 text-left text-sm font-medium text-forest transition-colors hover:bg-forest/5"
        >
          + Add new address
        </button>
      )}
    </div>
  );
}
