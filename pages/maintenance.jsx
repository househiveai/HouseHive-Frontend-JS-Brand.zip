import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function Maintenance() {
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());
  const [metricsError, setMetricsError] = useState("");
  const [vendors, setVendors] = useState([
    { name: "BrightFix Plumbing", service: "Plumbing" },
    { name: "Evergreen HVAC", service: "Climate Control" },
    { name: "Skyline Electrical", service: "Electrical" },
  ]);
  const [newVendor, setNewVendor] = useState({ name: "", service: "" });

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await fetchPortfolioSnapshot();
        if (!active) return;
        setMetrics(snapshot.metrics);
        if (snapshot.errors?.length) {
          setMetricsError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
        } else {
          setMetricsError("");
        }
      } catch (err) {
        if (!active) return;
        setMetricsError(err?.message || "Unable to load dashboard metrics.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleVendorFieldChange = (field, value) => {
    setNewVendor((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVendor = (event) => {
    event.preventDefault();
    if (!newVendor.name.trim() || !newVendor.service.trim()) {
      return;
    }

    setVendors((current) => [
      { name: newVendor.name.trim(), service: newVendor.service.trim() },
      ...current,
    ]);
    setNewVendor({ name: "", service: "" });
  };

  const handleRemoveVendor = (indexToRemove) => {
    setVendors((current) => current.filter((_, index) => index !== indexToRemove));
  };

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Maintenance HQ</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Coordinated upkeep made elegant</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Triage requests, assign vendors, and keep residents informed — all within a modern interface that mirrors your new
          auth experience.
        </p>
      </header>

      <DashboardBridge metrics={metrics} focus="Maintenance" />

      {metricsError && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{metricsError}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Active requests</h2>
            <p className="mt-1 text-sm text-slate-200">High-priority items surfaced automatically by HiveBot.</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-white">Leaking faucet in Unit 203</p>
                  <p className="text-xs text-slate-400">Reported 2 days ago</p>
                </div>
                <span className="rounded-full bg-[#FFB400]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
                  In progress
                </span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-white">HVAC not cooling — Townhome 104</p>
                  <p className="text-xs text-slate-400">Technician scheduled today</p>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Resolved
                </span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-white">Lobby lighting retrofit</p>
                  <p className="text-xs text-slate-400">Awaiting vendor confirmation</p>
                </div>
                <span className="rounded-full bg-sky-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                  Scheduled
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-200">Automated updates streaming in from resident requests and vendor outreach.</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="pr-4">
                  <p className="font-semibold text-white">HiveBot nudged Skyline Electrical</p>
                  <p className="text-xs text-slate-400">Follow-up sent 12 minutes ago</p>
                </div>
                <span className="rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
                  Outreach
                </span>
              </li>
              <li className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="pr-4">
                  <p className="font-semibold text-white">Unit 203 leak photos auto-uploaded</p>
                  <p className="text-xs text-slate-400">Maintenance request updated 34 minutes ago</p>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Synced
                </span>
              </li>
              <li className="flex items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="pr-4">
                  <p className="font-semibold text-white">Vendor ETA auto-confirmed</p>
                  <p className="text-xs text-slate-400">Evergreen HVAC accepted updated schedule</p>
                </div>
                <span className="rounded-full bg-sky-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                  Update
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Log a request</h2>
            <p className="mt-1 text-sm text-slate-200">Collect all the context your vendors need to respond quickly.</p>
            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Task title"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />
              <textarea
                placeholder="Describe the issue…"
                rows={4}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <button
                  type="button"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Submit request
                </button>
                <span>or</span>
                <Link href="/messages" className="font-semibold text-[#FFB400] hover:text-[#f39c00]">
                  Ask HiveBot to notify the tenant
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#FFB400]/10 p-6 text-sm text-slate-900 shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Automation spotlight</h2>
            <p className="mt-2 text-sm text-slate-800">
              Auto-create maintenance reminders after every resolved ticket to ensure follow-up surveys and inspection photos are captured.
            </p>
            <Link
              href="/reminders"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-slate-800"
            >
              Manage reminders
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Vendor log</h2>
            <p className="mt-1 text-sm text-slate-200">Keep an auditable roster of partners and prune it as your network evolves.</p>
            <form onSubmit={handleAddVendor} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(event) => handleVendorFieldChange("name", event.target.value)}
                  placeholder="Vendor name"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                />
                <input
                  type="text"
                  value={newVendor.service}
                  onChange={(event) => handleVendorFieldChange("service", event.target.value)}
                  placeholder="Specialty"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
              >
                Add vendor
              </button>
            </form>
            <ul className="mt-6 space-y-3 text-sm text-slate-200">
              {vendors.map((vendor, index) => (
                <li
                  key={`${vendor.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{vendor.name}</p>
                    <p className="text-xs text-slate-400">{vendor.service}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVendor(index)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-red-400 hover:text-red-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
