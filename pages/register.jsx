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

  const handleRegister = async (event) => {
    event.preventDefault();
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Create Account
        </h1>
        <p className="text-center text-sm text-gray-500">
          Start managing your properties with HouseHive today.
        </p>

        <label className="block text-left text-sm font-medium text-gray-700">
          Full Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoComplete="name"
            placeholder="Jane Doe"
            required
          />
        </label>

        <label className="block text-left text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block text-left text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white p-3 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            minLength={8}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-yellow-500 p-3 font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-yellow-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link className="font-medium text-yellow-600 hover:underline" href="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
