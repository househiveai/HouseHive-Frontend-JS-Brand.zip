import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid login, try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FFB400]/30 blur-3xl" />
        <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/80">
          <img src="/logo.png" alt="HouseHive Logo" className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-200">Sign in to access your HouseHive dashboard</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
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
                placeholder="Enter your password"
                className="w-full border-none bg-transparent py-3 text-white placeholder-slate-300 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold uppercase tracking-wide text-[#FFB400] transition hover:text-[#f39c00]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-white/20 bg-transparent text-[#FFB400] focus:ring-[#FFB400]"
              />
              Remember me
            </label>

            <Link href="/forgot" className="font-medium text-[#FFB400] transition hover:text-[#f39c00]">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#FFB400] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00] disabled:cursor-not-allowed disabled:bg-[#FFB400]/60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-200">
          Don’t have an account?{" "}
          <Link href="/register" className="font-medium text-[#FFB400] transition hover:text-[#f39c00]">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
