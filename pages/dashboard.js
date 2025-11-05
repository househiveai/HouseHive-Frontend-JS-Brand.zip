// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiMe, apiGetInsights } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function load() {
      try {
        const u = await apiMe();
        setUser(u);

      } catch {
        router.push("/login");
      }
    }

    load();
  }, []);

  if (!user || !insights) return <div style={styles.loading}>Loading Dashboard...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Welcome, {user.name || user.email}</h1>

      <div style={styles.summaryBox}>
        <div style={styles.summaryText}>{insights.summary}</div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard label="Properties" value={insights.property_count} />
        <StatCard label="Tenants" value={insights.tenant_count} />
        <StatCard label="Open Tasks" value={insights.open_tasks} />
        <StatCard label="Reminders" value={insights.reminders} />
      </div>

      {insights.property_count === 0 && (
        <div style={styles.ctaBox}>
          <p style={{ marginBottom: "12px" }}>No data yet.</p>
          <button style={styles.ctaButton} onClick={() => router.push("/properties")}>
            + Add Your First Property
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardValue}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

const styles = {
  page: { padding: "40px", minHeight: "100vh", background: "#000", color: "#fff" },
  title: { fontSize: "30px", marginBottom: "25px", color: "#FFC230" },

  summaryBox: {
    background: "#111",
    border: "1px solid #FFC230",
    padding: "18px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  summaryText: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#FFC230",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  },

  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #333",
    textAlign: "center",
  },

  cardValue: { fontSize: "32px", fontWeight: "bold", color: "#FFC230" },
  cardLabel: { fontSize: "14px", opacity: 0.75 },

  ctaBox: {
    background: "#111",
    padding: "25px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px dashed #FFC230",
  },
  ctaButton: {
    background: "#FFC230",
    color: "#000",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    border: "none",
  },

  loading: {
    color: "white",
    textAlign: "center",
    paddingTop: "80px",
    fontSize: "22px",
  },
};
