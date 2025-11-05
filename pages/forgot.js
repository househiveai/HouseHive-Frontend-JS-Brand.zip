import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const API_BASE = "https://househive-backend-v3.onrender.com";

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/forgot`, { email });
      setSent(true);
    } catch {
      setSent(true); // We still show success for security
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black text-white px-4">
      <div className="bg-[#111111] p-8 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
        {!sent ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-600 bg-white text-black focus:ring-[#FFB400] focus:ring-2"
            />

            <button
              onClick={handleSubmit}
              className="w-full mt-6 p-3 bg-[#FFB400] text-black font-semibold rounded-md hover:bg-[#d89c00] transition"
            >
              Send Reset Link
            </button>

            <p className="text-center mt-4">
              <a href="/login" className="text-[#FFB400] hover:underline text-sm">
                Back to Login
              </a>
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-bounce text-5xl mb-4">📩</div>
            <h2 className="text-xl font-semibold mb-2">Check Your Email</h2>
            <p className="text-gray-300">
              If the email is registered, a reset link has been sent.
            </p>
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
