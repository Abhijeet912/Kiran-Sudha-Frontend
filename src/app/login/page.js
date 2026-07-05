import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to your Kiran Sudha account.",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-ink/5 sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">
            Kiran Sudha
          </p>
          <h1 className="mt-2 font-display text-3xl text-forest">
            Welcome back
            <span
              aria-hidden
              className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-vermilion align-middle"
            />
          </h1>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
