"use client";

import { useState } from "react";
import { addAddress, updateAddress } from "@/lib/api/user";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const EMPTY = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

/** Add/edit address form. Calls onSaved(savedAddress) on success. */
export default function AddressForm({ initial = null, onSaved, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setField = (name, transform) => (e) => {
    const value = transform ? transform(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
  };

  function validate() {
    const errors = {};
    if (!/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = "Enter a 10-digit mobile number";
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      errors.pincode = "Enter a 6-digit pincode";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const clientErrors = validate();
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      };
      const saved = initial?.id
        ? await updateAddress(initial.id, payload)
        : await addAddress(payload);
      toast.success(initial?.id ? "Address updated" : "Address added");
      onSaved?.(saved);
    } catch (err) {
      setError(err.message || "Could not save the address.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="Priya Sharma"
          value={form.fullName}
          onChange={setField("fullName")}
          error={fieldErrors.fullName}
          required
        />
        <Input
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="9876543210"
          value={form.phone}
          onChange={setField("phone", (v) => v.replace(/\D/g, ""))}
          error={fieldErrors.phone}
          required
        />
      </div>
      <Input
        label="Address line 1"
        name="addressLine1"
        autoComplete="address-line1"
        placeholder="House no., street, area"
        value={form.addressLine1}
        onChange={setField("addressLine1")}
        error={fieldErrors.addressLine1}
        required
      />
      <Input
        label="Address line 2 (optional)"
        name="addressLine2"
        autoComplete="address-line2"
        placeholder="Landmark, locality"
        value={form.addressLine2}
        onChange={setField("addressLine2")}
        error={fieldErrors.addressLine2}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="City"
          name="city"
          autoComplete="address-level2"
          placeholder="Lucknow"
          value={form.city}
          onChange={setField("city")}
          error={fieldErrors.city}
          required
        />
        <Input
          label="State"
          name="state"
          autoComplete="address-level1"
          placeholder="Uttar Pradesh"
          value={form.state}
          onChange={setField("state")}
          error={fieldErrors.state}
          required
        />
        <Input
          label="Pincode"
          name="pincode"
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          placeholder="226001"
          value={form.pincode}
          onChange={setField("pincode", (v) => v.replace(/\D/g, ""))}
          error={fieldErrors.pincode}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg bg-vermilion/10 px-3.5 py-2.5 text-sm text-vermilion">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving}>
          {initial?.id ? "Save changes" : "Save address"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
