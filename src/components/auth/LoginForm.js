"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const { login, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → bounce away from the login page.
  useEffect(() => {
    if (!loading && isAuthenticated && !submitting) {
      router.replace(next);
    }
  }, [loading, isAuthenticated, submitting, next, router]);

  const setField = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const data = await login(form.email.trim(), form.password);
      toast.success(
        data.firstName ? `Welcome back, ${data.firstName}!` : "Welcome back!"
      );
      router.replace(next);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      setFieldErrors(err.validationErrors || {});
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={form.password}
        onChange={setField("password")}
        error={fieldErrors.password}
        required
      />

      {error && (
        <p className="rounded-lg bg-vermilion/10 px-3.5 py-2.5 text-sm text-vermilion">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" loading={submitting} className="mt-1">
        Login
      </Button>

      <p className="text-center text-sm text-ink/60">
        New to Kiran Sudha?{" "}
        <Link
          href={next !== "/" ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          className="font-medium text-forest underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
