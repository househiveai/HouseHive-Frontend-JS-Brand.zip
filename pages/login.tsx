import { useState } from "react";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setStatus("Logging in...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setStatus(data.detail || "Invalid email or password");
      }
    } catch (err) {
      setStatus("Error connecting to server");
    }
  };

  return (
    <>
      <Head>
        <title>Login | HouseHive.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold text-[#FFB400] mb-8">
          Login to HouseHive
        </h1>

        <form
          onSubmit={handleLogin}
          className="bg-[#111111] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#2a2a2a]"
        >
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-4 rounded bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FFB400]"
            placeholder="you@example.com"
          />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-6 rounded bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FFB400]"
            placeholder="••••••••"
          />

          <button
            type="submit"
            className="w-full bg-[#FFB400] text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Login
          </button>

          {status && (
            <p className="text-gray-400 text-center text-sm mt-4">{status}</p>
          )}
        </form>

        <p className="mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-[#FFB400] hover:underline font-medium"
          >
            Register here
          </a>
        </p>

        <footer className="mt-12 text-gray-500 text-sm">
          © {new Date().getFullYear()} HouseHive.ai
        </footer>
      </div>
    </>
  );
}
