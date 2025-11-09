"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { apiDashboardSummary } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    tasks: 0,
    reminders: 0,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const data = await apiDashboardSummary();
        if (data) setStats(data);
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-8 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-gray-400 mt-1">Your smart co-host overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <StatCard label="Properties" value={stats.properties} />
        <StatCard label="Tenants / Guests" value={stats.tenants} />
        <StatCard label="Active Tasks" value={stats.tasks} />
        <StatCard label="Reminders" value={stats.reminders} />
      </div>
    </div>
  );
}

function StatCard(props) {
  const { label, value } = props;
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">{value}</h2>
    </div>
  );
}
