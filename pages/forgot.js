import Link from "next/link";
import { useState } from "react";
import { apiForgotPassword } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setMsg("");
    setIsSubmitting(true);
    try {
      await apiForgotPassword(email);
      setMsg("If that email exists, a reset link has been sent.");
    } catch {
      setMsg("Unable to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-[#FFB400]/10 blur-3xl" />
        <div className="absolute right-10 top-1/3 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Password help</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Forgot your access?</h1>
          <p className="mt-2 text-sm text-slate-200">
            Enter the email associated with your account and we&apos;ll send a secure link to reset your password.
          </p>
        </div>

        <label className="block text-left text-sm font-medium text-slate-200">
          Email address
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            required
          />
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-[#FFB400] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00] disabled:cursor-not-allowed disabled:bg-[#FFB400]/60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending link..." : "Email reset link"}
        </button>

        {msg && <p className="mt-4 text-center text-sm text-slate-100">{msg}</p>}

        <p className="mt-6 text-center text-sm text-slate-300">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-[#FFB400] hover:text-[#f39c00]">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
