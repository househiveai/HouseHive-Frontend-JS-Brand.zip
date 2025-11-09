import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { apiResetPassword } from "../lib/api";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (event) => {
    event.preventDefault();
    if (!token) {
      setError("Reset link invalid or expired.");
      return;
    }
    if (!password) return;
    try {
      await apiResetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err?.message || "Reset link invalid or expired.");
    }
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-80 w-80 -translate-x-1/2 rounded-full bg-[#FFB400]/15 blur-3xl" />
        <div className="absolute right-[10%] bottom-[-80px] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        {!done ? (
          <>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Secure reset</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Choose a fresh password</h1>
              <p className="mt-2 text-sm text-slate-200">
                Keep it unique, with at least 8 characters — a mix of letters, numbers, and symbols is best.
              </p>
            </div>

            <form onSubmit={handleReset} className="mt-8 space-y-5">
              <label className="block text-left text-sm font-medium text-slate-200">
                New password
                <input
                  type="password"
                  placeholder="Create a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  required
                  minLength={8}
                />
              </label>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#FFB400] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00]"
              >
                Save new password
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl">✅</div>
            <h2 className="text-2xl font-semibold text-white">Password reset!</h2>
            <p className="mt-2 text-sm text-slate-200">
              Your new password is ready. You can now sign back in and continue where you left off.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00]"
            >
              Return to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
