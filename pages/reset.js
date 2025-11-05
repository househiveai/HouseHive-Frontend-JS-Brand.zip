import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; 
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const API_BASE = "https://househive-backend-v3.onrender.com";

  const handleReset = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/reset`, {
        token,
        new_password: password,
      });
      setDone(true);
    } catch (err) {
      alert("Reset link invalid or expired.");
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
            />

            <button
              onClick={handleReset}
              className="w-full mt-6 p-3 bg-[#FFB400] text-black font-semibold rounded-md hover:bg-[#d89c00] transition"
            >
              Save New Password
            </button>
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
