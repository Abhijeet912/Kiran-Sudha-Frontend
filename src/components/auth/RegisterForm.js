"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import OtpVerify from "@/components/auth/OtpVerify";

/**
 * Two-step registration:
 *  1. details → POST /api/auth/register (returns tokens, user is logged in)
 *  2. OTP verification of the registered phone (skippable)
 */
export default function RegisterForm() {
  const { register, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [step, setStep] = useState("details"); // details | otp
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (and not mid-registration) → bounce away.
  useEffect(() => {
    if (!loading && isAuthenticated && step === "details" && !submitting) {
      router.replace(next);
    }
  }, [loading, isAuthenticated, step, submitting, next, router]);

  const setField = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  function validate() {
    const errors = {};
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = "Enter a 10-digit mobile number";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const clientErrors = validate();
    setFieldErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });
      toast.success("Account created! One last step —");
      setStep("otp");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      setFieldErrors(err.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  }

  function finish() {
    router.replace(next);
  }

  if (step === "otp") {
    return (
      <OtpVerify
        phoneNumber={form.phone.trim()}
        onVerified={finish}
        onSkip={finish}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          name="firstName"
          autoComplete="given-name"
          placeholder="Priya"
          value={form.firstName}
          onChange={setField("firstName")}
          error={fieldErrors.firstName}
          required
        />
        <Input
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          placeholder="Sharma"
          value={form.lastName}
          onChange={setField("lastName")}
          error={fieldErrors.lastName}
          required
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={setField("email")}
        error={fieldErrors.email}
        required
      />
      <Input
        label="Mobile number"
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        placeholder="9876543210"
        value={form.phone}
        onChange={(e) =>
          setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))
        }
        error={fieldErrors.phone}
        hint="We'll send an OTP to verify this number"
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={setField("password")}
          error={fieldErrors.password}
          required
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat password"
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

      <Button type="submit" size="lg" loading={submitting} className="mt-1">
        Create account
      </Button>

      <p className="text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link
          href={next !== "/" ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-medium text-forest underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
