// pages/forgot.js
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      await axios.post("https://househive-backend-v3.onrender.com/api/auth/forgot", { email });
      setMsg("If that email exists, a reset link has been sent.");
    } catch {
      setMsg("Unable to process request.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#111111] px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[#FFB400] mb-6">Reset Password</h1>

        <input
          type="email"
          placeholder="Enter your account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
        />

        <button
          onClick={submit}
          className="w-full mt-4 p-3 bg-[#FFB400] text-black font-semibold rounded-md hover:opacity-90"
        >
          Send Reset Link
        </button>

        {msg && <p className="text-center text-sm text-black mt-3">{msg}</p>}
      </div>
    </div>
  );
}
