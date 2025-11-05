// pages/forgot.js
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    try {
      await axios.post("https://househive-backend-v3.onrender.com/api/auth/forgot", {
        email,
      });
      setMsg("If that email exists, a reset link has been sent.");
    } catch {
      setMsg("Unable to process request.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F6F6F6]">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-xl font-bold text-center mb-4 text-[#FFB400]">Reset Password</h1>

        <input
          type="email"
          placeholder="Enter your account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-400 bg-white text-black"
        />

        <button
          onClick={submit}
          className="w-full mt-4 p-3 bg-[#FFB400] text-black font-semibold rounded-md"
        >
          Send Reset Link
        </button>

        {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}
