"use client";

import { useEffect, useState } from "react";
import { changePassword, getProfile, updateProfile } from "@/lib/api/user";
import { emitAuthChange, tokenStore } from "@/lib/api/client";
import { useToast } from "@/context/ToastContext";
import RequireAuth from "@/components/auth/RequireAuth";
import AddressManager from "@/components/account/AddressManager";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function Card({ title, children }) {
  return (
    <section className="rounded-xl bg-white p-5 ring-1 ring-ink/10 sm:p-6">
      <h2 className="font-display text-lg text-forest">
        {title}
        <span
          aria-hidden
          className="ml-1.5 inline-block h-1 w-1 rounded-full bg-vermilion align-middle"
        />
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ProfileDetailsCard() {
  const toast = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((data) => {
        if (cancelled || !data) return;
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
        });
        setEmail(data.email || "");
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (name, transform) => (e) => {
    const value = transform ? transform(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setSaving(true);
    try {
      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
      });
      // Keep the stored session (navbar greeting) in sync.
      const current = tokenStore.getUser();
      if (current) {
        tokenStore.setSession({
          user: {
            ...current,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
          },
        });
        emitAuthChange();
      }
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update your profile.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-ink/50">
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent"
        />
        Loading profile…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          name="firstName"
          value={form.firstName}
          onChange={setField("firstName")}
          error={fieldErrors.firstName}
          required
        />
        <Input
          label="Last name"
          name="lastName"
          value={form.lastName}
          onChange={setField("lastName")}
          error={fieldErrors.lastName}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          name="email"
          value={email}
          disabled
          hint="Email can't be changed"
          className="opacity-60"
        />
        <Input
          label="Mobile number"
          name="phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={form.phone}
          onChange={setField("phone", (v) => v.replace(/\D/g, ""))}
          error={fieldErrors.phone}
        />
      </div>
      <div>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function PasswordCard() {
  const toast = useToast();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const setField = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    setFieldErrors({});
    setSaving(true);
    try {
      await changePassword(form);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed");
    } catch (err) {
      setError(err.message || "Could not change the password.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={setField("currentPassword")}
        error={fieldErrors.currentPassword}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={form.newPassword}
          onChange={setField("newPassword")}
          error={fieldErrors.newPassword}
          required
        />
        <Input
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={setField("confirmPassword")}
          error={fieldErrors.confirmPassword}
          required
        />
      </div>
      {error && (
        <p className="rounded-lg bg-vermilion/10 px-3.5 py-2.5 text-sm text-vermilion">
          {error}
        </p>
      )}
      <div>
        <Button type="submit" loading={saving}>
          Change password
        </Button>
      </div>
    </form>
  );
}

function ProfileContent() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Account</p>
        <h1 className="mt-1.5 font-display text-3xl text-forest sm:text-4xl">
          My Profile
          <span
            aria-hidden
            className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
          />
        </h1>
      </header>

      <div className="mt-8 flex flex-col gap-5">
        <Card title="Profile details">
          <ProfileDetailsCard />
        </Card>
        <Card title="Addresses">
          <AddressManager />
        </Card>
        <Card title="Change password">
          <PasswordCard />
        </Card>
      </div>
    </main>
  );
}

export default function ProfileView() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
