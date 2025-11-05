"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { apiRegister } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      await apiRegister({ name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err?.message || "Unable to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg p-6 rounded-xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>
<input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
/>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-3"
/>

<input
  type="password"
  placeholder="Password"
  
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-3"
/>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white font-medium p-2 rounded transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link className="text-yellow-600 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
