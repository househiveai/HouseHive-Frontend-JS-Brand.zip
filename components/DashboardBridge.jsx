"use client";

import Link from "next/link";
import { formatCurrency } from "../lib/portfolio";

export default function DashboardBridge({ metrics: metricsProp, dashboardMetrics, focus, className = "" }) {
  const snapshot = metricsProp ?? dashboardMetrics ?? {};
  const items = [
    { key: "properties", label: "Properties", value: snapshot.propertyCount },
    { key: "tenants", label: "Tenants", value: snapshot.tenantCount },
    { key: "tasks", label: "Tasks", value: snapshot.taskCount },
    { key: "reminders", label: "Reminders", value: snapshot.reminderCount },
  ].filter((item) => item.value !== undefined && item.value !== null);

  const financialNet = snapshot.financials?.net;
  const occupancyRate = snapshot.occupancy?.rate;

  const detailItems = [
    financialNet !== undefined && financialNet !== null
      ? { key: "net", label: "Net monthly", value: formatCurrency(financialNet) }
      : null,
    occupancyRate !== undefined && occupancyRate !== null
      ? { key: "occupancy", label: "Occupancy", value: `${occupancyRate}%` }
      : null,
  ].filter(Boolean);

  return (
    <section
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Dashboard sync</p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {focus ? `${focus} impact your overview` : "This data fuels your dashboard"}
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Updates here instantly roll into the metrics on your central dashboard.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-2xl border border-[#FFB400] bg-[#FFB400]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-[#FFB400]/20"
        >
          Open dashboard ↗
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const focusKey = typeof focus === "string" ? focus.toLowerCase() : null;

          return (
            <div
              key={item.key}
              className={`rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 ${
                focusKey && item.key.startsWith(focusKey) ? "border-[#FFB400] text-white" : ""
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.value ?? "—"}</p>
            </div>
          );
        })}

        {detailItems.map((item) => (
          <div key={item.key} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
