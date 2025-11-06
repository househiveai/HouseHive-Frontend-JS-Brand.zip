import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RequireAuth from "../components/RequireAuth";
import { apiMe, apiGetInsights } from "../lib/api";

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);

    async function loadInsights() {
      try {
        const data = await apiGetInsights();
        setInsights(data);
      } catch (err) {
        console.log("Insights error:", err);
      }
    }

    loadInsights();
  }, [router.pathname]);

  if (!user || !insights) {
    return <div className="text-center text-white pt-20 text-xl">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-center text-3xl mb-8 text-[#FFC230]">
        Welcome, {user.name || user.email}
      </h1>

      {/* Summary Box */}
      <div className="max-w-4xl mx-auto bg-[#111] border border-[#FFC230] p-5 rounded-xl mb-10 text-center">
        <p className="text-[#FFC230] text-lg font-medium">{insights.summary}</p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
        <StatCard label="Properties" value={insights.property_count} />
        <StatCard label="Tenants" value={insights.tenant_count} />
        <StatCard label="Open Tasks" value={insights.open_tasks} />
        <StatCard label="Reminders" value={insights.reminders} />
      </div>

      {/* CTA for new users */}
      {insights.property_count === 0 && (
        <div className="max-w-md mx-auto bg-[#111] p-6 border border-dashed border-[#FFC230] rounded-xl text-center">
          <p className="mb-3">No data yet.</p>
          <button
            className="bg-[#FFC230] text-black font-semibold py-2 px-4 rounded-lg"
            onClick={() => router.push("/properties")}
          >
            + Add Your First Property
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#111] border border-[#333] rounded-xl p-6 text-center">
      <div className="text-[#FFC230] text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-75 mt-1">{label}</div>
    </div>
  );
}
