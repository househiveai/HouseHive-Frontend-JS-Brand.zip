"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../lib/auth";
import { api } from "../lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ properties: 0, tenants: 0, tasks: 0, reminders: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        // me
        const me = await api.get("/auth/me");
        setUser(me);

        // properties (your backend prefers a trailing slash; both will work due to 307)
        const props = await api.get("/properties/").catch(() => []);
        const propCount = Array.isArray(props) ? props.length : (props?.count ?? 0);

        // for now, tenants/tasks/reminders not available → 0
        setStats({ properties: propCount, tenants: 0, tasks: 0, reminders: 0 });
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
    <div className="min-h-screen bg-[#111111] text-white px-6 py-8">
      <header className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your smart co-host overview.</p>
        </div>
        {user?.email && (
          <div className="text-sm text-gray-400">
            Signed in as <span className="text-white">{user.email}</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <StatCard label="Properties" value={stats.properties} />
        <StatCard label="Tenants / Guests" value={stats.tenants} />
        <StatCard label="Active Tasks" value={stats.tasks} />
        <StatCard label="Reminders" value={stats.reminders} />
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction href="/properties" label="Add Property" />
        <QuickAction href="/tasks" label="Create Task" />
        <QuickAction href="/messages" label="Message Tenant" />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">{value}</h2>
    </div>
  );
}

function QuickAction({ href, label }) {
  return (
    <a
      href={href}
      className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 hover:border-[#3a3a3a] transition hover:-translate-y-1 hover:scale-105 hover:brightness-110 hover:shadow-[0_12px_24px_rgba(255,255,255,0.1)]"
    >
      <div className="text-white">{label} →</div>
      <div className="text-xs text-gray-400 mt-1">Open</div>
    </a>
  );
}
