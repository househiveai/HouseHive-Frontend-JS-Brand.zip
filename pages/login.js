// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { apiLogin } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiLogin(email, password);
      router.push("/dashboard"); // ✅ SUCCESS → DASHBOARD
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#111111] px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-[#FFB400] mb-6">
          Log in to HouseHive
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-[#FFB400]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-center">
            <a href="/forgot" className="text-[#FFB400] text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {error && <p className="text-red-600 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-[#FFB400] text-black font-semibold rounded-md hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-black text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#FFB400] font-medium">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
