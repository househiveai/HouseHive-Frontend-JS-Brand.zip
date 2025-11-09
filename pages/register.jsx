"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Auth } from "../lib/api";
import { useAuth } from "../components/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleRegister = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    try {
      await Auth.register({ name, email, password });
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Unable to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#FFB400]/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-4rem] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="grid w-full max-w-5xl gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl md:grid-cols-[1.1fr_1fr]">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-white">Join HouseHive</h1>
            <p className="mt-2 text-sm text-slate-200">
              Create an account to streamline property management and keep every tenant informed.
            </p>
          </div>

          <label className="block text-sm font-medium text-slate-200">
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              autoComplete="name"
              placeholder="Jane Doe"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Password
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-none bg-transparent py-3 text-white placeholder-slate-300 focus:outline-none"
                autoComplete="new-password"
                placeholder="Create a strong password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-semibold uppercase tracking-wide text-[#FFB400] transition hover:text-[#f39c00]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    passwordScore >= level ? "bg-[#FFB400]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Use at least 8 characters, including a number, a capital letter, and a symbol.
            </p>
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Confirm Password
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              placeholder="Retype your password"
              required
            />
          </label>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FFB400] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00] disabled:cursor-not-allowed disabled:bg-[#FFB400]/60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-200">
            Already have an account?{" "}
            <Link className="font-medium text-[#FFB400] transition hover:text-[#f39c00]" href="/login">
              Sign in
            </Link>
          </p>
        </form>

        <div className="hidden flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-white/10 p-8 text-white shadow-lg md:flex">
          <div>
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-[#FFB400]">Why HouseHive?</h2>
            <p className="mt-4 text-sm text-slate-200">
              We bring transparency to property management with collaborative tools that keep landlords, tenants, and maintenance crews on the same page.
            </p>
          </div>

          <ul className="space-y-6 text-sm text-slate-100">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[#FFB400]" />
              Automated rent reminders and payment tracking.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[#FFB400]" />
              Real-time maintenance requests with status updates.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-[#FFB400]" />
              Unified messaging that keeps every conversation organized.
            </li>
          </ul>

          <div className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Need assistance?</p>
            <p className="mt-1">
              Our onboarding team is ready to migrate your data and get your community live in days, not weeks.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
