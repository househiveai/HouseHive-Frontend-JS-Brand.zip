"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { apiDashboardSummary } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    tasks: 0,
    reminders: 0,
    occupancy_rate: 0,
    monthly_income: 0,
    upcoming_renewals: [],
    recent_tasks: [],
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
        if (data) setStats({ ...stats, ...data });
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-6 md:px-10 py-10 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <p className="text-gray-400">Your smart co-host overview & alerts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Properties" value={stats.properties} />
        <StatCard label="Tenants / Guests" value={stats.tenants} />
        <StatCard label="Active Tasks" value={stats.tasks} />
        <StatCard label="Reminders" value={stats.reminders} />
      </div>

      {/* Occupancy & Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Occupancy Rate">
          <h2 className="text-4xl font-bold text-[#FFB400]">
            {Math.round(stats.occupancy_rate || 0)}%
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Aim for 95%+ occupancy. Keep renewal reminders active.
          </p>
        </Card>

        <Card title="Projected Monthly Income">
          <h2 className="text-4xl font-bold text-[#FFB400]">
            ${Number(stats.monthly_income || 0).toLocaleString()}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Based on active leases + scheduled stays.
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            ["Add Property", "/properties/new"],
            ["Add Tenant", "/tenants/new"],
            ["Create Lease", "/leases/new"],
            ["Record Payment", "/billing/new"],
            ["New Task", "/tasks/new"],
            ["Message Tenant", "/messages"],
          ].map(([label, href]) => (
            <QuickAction key={label} label={label} href={href} />
          ))}
        </div>
      </div>

      {/* Bottom Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Tasks */}
        <Card title="Recent Tasks" link="/tasks">
          {stats.recent_tasks?.length ? (
            <ul className="divide-y divide-[#2a2a2a]">
              {stats.recent_tasks.slice(0, 6).map((t) => (
                <li key={t.id} className="py-3">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-gray-400 text-xs">{t.property_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent tasks.</p>
          )}
        </Card>

        {/* Renewal Reminders */}
        <Card title="Upcoming Lease Renewals" link="/leases">
          {stats.upcoming_renewals?.length ? (
            <ul className="divide-y divide-[#2a2a2a]">
              {stats.upcoming_renewals.slice(0, 6).map((r) => (
                <li key={r.id} className="py-3 flex justify-between">
                  <div>
                    <p className="font-medium">{r.tenant_name}</p>
                    <p className="text-gray-400 text-xs">{r.property_name}</p>
                  </div>
                  <p className="text-[#FFB400] text-sm">{new Date(r.end_date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming renewals.</p>
          )}
        </Card>

      </div>
    </div>
  );
}

/* Components */

function StatCard({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className="text-3xl font-bold text-[#FFB400] mt-1">{value}</h2>
    </div>
  );
}

function Card({ title, link, children }) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {link && <Link href={link} className="text-[#FFB400] text-sm">View All</Link>}
      </div>
      {children}
    </div>
  );
}

function QuickAction({ label, href }) {
  return (
    <Link
      href={href}
      className="bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] hover:border-[#FFB400] text-center text-sm font-medium transition"
    >
      {label}
    </Link>
  );
}
