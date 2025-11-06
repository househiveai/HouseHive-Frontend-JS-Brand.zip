import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { API_BASE } from "../lib/api";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; 
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = async () => {
    if (isSubmitting) return;
    if (!token) {
      setError("Reset link is missing or invalid.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await axios.post(`${API_BASE}/auth/reset`, {
        token,
        new_password: password,
      });
      setDone(true);
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Reset link invalid or expired.";
      setError(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white px-4">
      <div className="bg-[#111111] p-8 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
        {!done ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Set New Password</h1>

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-white text-black focus:ring-[#FFB400] focus:ring-2"
              minLength={8}
            />

            <button
              onClick={handleReset}
              disabled={!password || isSubmitting}
              className="w-full mt-6 p-3 bg-[#FFB400] text-black font-semibold rounded-md hover:bg-[#d89c00] transition disabled:bg-[#d5b763] disabled:text-gray-700 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save New Password"}
            </button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </>
        ) : (
          <div className="text-center">
            <div className="animate-bounce text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">Password Reset Successful</h2>
            <p className="text-gray-300">You can now sign in with your new password.</p>

            <a
              href="/login"
              className="inline-block mt-6 p-3 text-black bg-[#FFB400] rounded-md font-semibold"
            >
              Return to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
