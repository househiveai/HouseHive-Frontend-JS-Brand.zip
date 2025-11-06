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
    <div className="flex justify-center items-center min-h-screen bg-[#F6F6F6]">
      <form
        onSubmit={submit}
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center mb-4 text-[#FFB400]">Reset Password</h1>

        <label className="block text-left text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            placeholder="Enter your account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#FFB400]"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full p-3 bg-[#FFB400] text-black font-semibold rounded-md transition hover:bg-[#e0a000] disabled:cursor-not-allowed disabled:bg-[#ffdc7a]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>

        {msg && <p className="text-center text-sm text-gray-700">{msg}</p>}
      </form>
    </div>
  );
}
