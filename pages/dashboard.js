// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiMe, apiGetProperties, apiGetInsights } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");   // ✅ Redirect if not logged in
      return;
    }

    async function load() {
      try {
        const u = await apiMe();
        setUser(u);

        const p = await apiGetProperties();
        setProperties(p);

        const i = await apiGetInsights();
        setInsights(i);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    }

    load();
  }, []);

  if (!user || !insights) {
    return <div style={styles.loading}>Loading Dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Welcome back, {user.name || user.email}</h1>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>AI Assistant Insights</h2>
        <p style={styles.insightText}>{insights.summary}</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Your Properties</h2>

        {properties.length === 0 ? (
          <p>No properties yet. Add one!</p>
        ) : (
          properties.map((p) => (
            <div key={p.id} style={styles.propertyItem}>
              <strong>{p.name}</strong>
              <div>{p.address}</div>
            </div>
          ))
        )}

        <button
          onClick={() => router.push("/properties")}
          style={styles.button}
        >
          Manage Properties
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px", fontFamily: "sans-serif" },
  title: { color: "#D4A018", marginBottom: "20px" },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "25px",
  },
  sectionTitle: { marginBottom: "10px" },
  insightText: { marginBottom: "10px", color: "#444" },
  propertyItem: {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 15px",
    background: "#D4A018",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    fontSize: "20px",
    color: "#666",
  }
};
