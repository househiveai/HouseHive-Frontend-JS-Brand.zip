"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../lib/auth";
import { api } from "../lib/api";

export default function LandlordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    properties: [],
    leases: [],
    openTasks: [],
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const properties = await api.get("/properties/").catch(() => []);
        // The following endpoints 404 for now → default to empty arrays
        const leases = await api.get("/leases").catch(() => []);
        const openTasks = await api.get("/tasks?status=open").catch(() => []);

        setOverview({ properties, leases, openTasks });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Preparing your landlord workspace...
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Landlord command hub</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Operational clarity in every lease</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Surface property metrics, manage leasing workflows, and dispatch maintenance — all with the same polished experience as
          your authentication screens.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <HighlightCard
          title="Properties"
          count={overview.properties?.length || 0}
          href="/properties"
          accent="from-[#FFB400]/40 to-transparent"
        />
        <HighlightCard
          title="Leases"
          count={overview.leases?.length || 0}
          href="/leases"
          accent="from-sky-400/30 to-transparent"
        />
        <HighlightCard
          title="Open tasks"
          count={overview.openTasks?.length || 0}
          href="/tasks"
          accent="from-emerald-400/30 to-transparent"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Quick launch workflows</h2>
          <p className="mt-2 text-sm text-slate-200">Everything you need to keep landlords and tenants aligned.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ActionCard title="Add tenant" href="/tenants" description="Capture leases and welcome packets in one step." />
            <ActionCard title="Upload lease" href="/leases" description="Store and version agreements with reminders." />
            <ActionCard title="Record payment" href="/billing" description="Track invoices, settlements, and payouts." />
            <ActionCard title="Message tenant" href="/messages" description="Send AI-crafted updates across email & SMS." />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Portfolio pulse</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Two renewals require review this week. Generate offers with AI-assisted comparables.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Maintenance backlog trimmed by 35% after automations were enabled.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                New co-host invite awaiting approval — keep collaborators aligned in one workspace.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#FFB400]/10 p-6 text-sm text-slate-900 shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Pro tip</h2>
            <p className="mt-2 text-sm text-slate-800">
              Connect your Stripe account to automate rent collection, reconciliation, and payout forecasting.
            </p>
            <Link
              href="/billing"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-slate-800"
            >
              Set up billing
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}

function HighlightCard({ title, count, href, accent }) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#FFB400]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} aria-hidden />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200">{title}</p>
        <h3 className="mt-3 text-4xl font-semibold text-white">{count}</h3>
        <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
          View details <span>↗</span>
        </p>
      </div>
    </Link>
  );
}

function ActionCard({ title, href, description }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:border-[#FFB400] hover:shadow-2xl"
    >
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-xs text-slate-300">{description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
        Open <span className="transition group-hover:translate-x-1">↗</span>
      </span>
    </Link>
  );
}
