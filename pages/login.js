// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { apiLogin } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiLogin(email, password);
      router.push("/dashboard");   // ✅ SUCCESS → GO TO DASHBOARD
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Log in to HouseHive</h2>

        <form onSubmit={handleSubmit}>
         <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  className="w-full p-3 rounded-md border border-gray-600 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
/>

<input
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
  className="w-full p-3 rounded-md border border-gray-600 bg-white text-black focus:ring-2 focus:ring-[#FFB400]"
/>

  const [showPassword, setShowPassword] = useState(false);
<button
  type="button"
  className="text-sm text-[#FFB400] mt-1"
  onClick={() => setShowPassword(!showPassword)}
>
  {showPassword ? "Hide Password" : "Show Password"}
</button>

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
    <div className="max-w-md mx-auto pt-24 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
      <input
        type="email"
        placeholder="Enter your account email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-md border bg-white text-black"
      />
      <button
        onClick={submit}
        className="w-full mt-4 p-3 bg-[#FFB400] text-black font-semibold rounded-md"
      >
        Send Reset Link
      </button>
      {msg && <p className="mt-3 text-center text-sm text-gray-200">{msg}</p>}
    </div>
  );
}


          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>

        <p style={styles.linkText}>
          Don’t have an account? <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    background: "#fafafa",
  },
  card: {
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },
  title: {
    color: "#D4A018",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#D4A018",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "6px",
  },
  error: {
    color: "red",
    marginBottom: "6px",
    fontSize: "14px",
  },
  linkText: {
    marginTop: "12px",
    fontSize: "14px",
  },
};
