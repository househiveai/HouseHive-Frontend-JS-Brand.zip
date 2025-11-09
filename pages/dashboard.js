"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAccessToken } from "../lib/auth";
import { api } from "../lib/api";


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

    async function fetchStats() {
      try {
        const summary = await api("/dashboard/summary", token);
        setStats(summary);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-10 bg-[#111111] text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, Dan</h1>
        <p className="text-gray-400 mt-1">Here’s what’s happening today:</p>
      </div>

      {/* QUICK ACTION BAR */}
      <div className="flex flex-wrap gap-3 mt-8">
        <ActionButton label="+ Add Property" onClick={() => router.push("/properties/add")} />
        <ActionButton label="+ Add Task" onClick={() => router.push("/tasks/add")} />
        <ActionButton label="Message Tenant" onClick={() => router.push("/messages")} />
        <ActionButton label="Record Rent Payment" onClick={() => router.push("/payments")} />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        <StatCard label="Properties" value={stats.properties} />
        <StatCard label="Tenants / Guests" value={stats.tenants} />
        <StatCard label="Active Tasks" value={stats.tasks} />
        <StatCard label="Reminders" value={stats.reminders} />
      </div>

    </div>
  );
}

/* COMPONENTS */

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-gray-200 hover:border-[#FFB400] transition"
    >
      {label}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-[#1A1A1A] p-6 border border-[#2A2A2A] hover:border-[#FFB400] transition">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">{value}</h2>
    </div>
  );
}
