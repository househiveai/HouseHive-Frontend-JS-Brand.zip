import { useState } from "react";
import { apiRegister } from "../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      const res = await apiRegister({ email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        window.location.href = "/dashboard";
      }
    } catch {
      setMsg("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-700 max-w-md w-full">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Create Account
        </h1>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-4"
        />
        <button
          onClick={register}
          className="w-full bg-yellow-400 text-black py-3 font-semibold rounded hover:opacity-90"
        >
          Register
        </button>
        {msg && <p className="text-red-400 text-center mt-3">{msg}</p>}
        <p className="text-zinc-500 text-center mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
