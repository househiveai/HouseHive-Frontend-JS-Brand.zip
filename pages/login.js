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
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"   // ✅ Shows typed dots, not invisible
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

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
