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
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid login, try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F6F6F6]">
      <div className="bg-white shadow-lg p-8 rounded-xl w-[360px] text-center">
        <h2 className="text-xl font-bold mb-6 text-[#FFB400]">Log in to HouseHive</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
            required
          />

          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-md border border-gray-400 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#FFB400] text-sm mt-1"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-[#FFB400] hover:bg-[#e0a000] text-black font-semibold rounded-md"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm">
          <a href="/forgot" className="text-[#FFB400] hover:underline">
            Forgot password?
          </a>
        </p>

        <p className="mt-3 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#FFB400] hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
