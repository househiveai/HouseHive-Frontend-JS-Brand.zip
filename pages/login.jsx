"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { apiLogin } from "../lib/api";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
  setError("");
  try {
    await apiLogin(email, password);
    router.push("/dashboard");
  } catch (e) {
    setError(e.message || "Login failed");
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-6 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Log in to HouseHive</h1>
     <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-3 mb-3 rounded-md bg-[#EAF0FF] text-black placeholder-gray-600 border border-gray-300 focus:border-yellow-400 focus:outline-none"
/>

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full p-3 mb-3 rounded-md bg-[#EAF0FF] text-black placeholder-gray-600 border border-gray-300 focus:border-yellow-400 focus:outline-none"
/>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white font-medium p-2 rounded transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link className="text-yellow-600 hover:underline" href="/register">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
