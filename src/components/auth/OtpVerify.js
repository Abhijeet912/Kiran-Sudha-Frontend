"use client";

import { useEffect, useRef, useState } from "react";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const RESEND_COOLDOWN = 30; // seconds

export default function OtpVerify({ phoneNumber, onVerified, onSkip }) {
  const toast = useToast();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const sentRef = useRef(false);

  // Send the OTP once on mount (ref guards React Strict Mode double-run).
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    sendOtp(phoneNumber).catch((err) =>
      toast.error(err.message || "Could not send OTP. Try resending.")
    );
  }, [phoneNumber, toast]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await verifyOtp(phoneNumber, otp.trim());
      toast.success("Phone number verified!");
      onVerified?.();
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await sendOtp(phoneNumber);
      toast.info(`OTP re-sent to ${phoneNumber}`);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      toast.error(err.message || "Could not resend OTP.");
    }
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-ink/70">
        We&apos;ve sent a 6-digit code to{" "}
        <span className="font-medium text-ink">{phoneNumber}</span>. Enter it
        below to verify your phone number.
      </p>

      <Input
        label="OTP code"
        name="otp"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="••••••"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        error={error}
        className="text-center text-lg tracking-[0.5em]"
        required
      />

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        disabled={otp.length < 4}
      >
        Verify phone
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="font-medium text-forest underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-ink/40 disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-ink/50 underline-offset-4 hover:underline"
          >
            Verify later
          </button>
        )}
      </div>
    </form>
  );
}
