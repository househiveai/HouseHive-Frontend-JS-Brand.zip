"use client";

import Link from "next/link";
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
      <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Loading your portfolio insights...
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Operations overview</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">
              Monitor every property, tenant, and task in one glass-smooth command center. Your AI copilot highlights what needs
              attention so you stay proactive.
            </p>
          </div>

          {user?.email && (
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Signed in</p>
              <p className="mt-1 font-semibold text-white">{user.email}</p>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Properties" value={stats.properties} trend="▲" accent="emerald" />
        <StatCard label="Tenants & guests" value={stats.tenants} trend="―" accent="sky" />
        <StatCard label="Active tasks" value={stats.tasks} trend="●" accent="amber" />
        <StatCard label="Reminders" value={stats.reminders} trend="●" accent="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quick create</p>
                <h2 className="mt-1 text-lg font-semibold text-white">Jump into common workflows</h2>
              </div>
            </header>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <QuickAction href="/properties" label="Add a property" description="Assign owners, upload photos, and invite collaborators." />
              <QuickAction href="/tasks" label="Schedule a task" description="Dispatch maintenance with SLAs and notifications." />
              <QuickAction href="/messages" label="Message a resident" description="Send AI-drafted replies directly to any tenant." />
              <QuickAction href="/reminders" label="Set a reminder" description="Keep your team aligned on renewals and inspections." />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">AI signal feed</h2>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-200">Live</span>
            </div>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                HVAC vendor confirmed for <span className="font-semibold text-white">Loft 32B</span>. Estimated arrival 2:30pm.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Rent reminder sent to <span className="font-semibold text-white">Avery Chen</span> — due in 48 hours.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                AI drafted follow-up for guest inquiry in <span className="font-semibold text-white">Canary Wharf Flat</span>.
              </li>
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">This week&apos;s focus</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Prepare renewal offers</p>
                  <p className="text-xs text-slate-400">3 leases expiring soon</p>
                </div>
                <span className="rounded-full bg-[#FFB400]/10 px-3 py-1 text-xs font-medium text-[#FFB400]">Due Friday</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Sync maintenance backlog</p>
                  <p className="text-xs text-slate-400">4 outstanding follow-ups</p>
                </div>
                <span className="rounded-full bg-sky-400/20 px-3 py-1 text-xs font-medium text-sky-200">In review</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold">Host onboarding</p>
                  <p className="text-xs text-slate-400">Invite teammates to HouseHive</p>
                </div>
                <Link href="/register" className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
                  Send invites
                </Link>
              </li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#FFB400]/10 p-6 text-sm text-slate-900 shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Need a hand?</h2>
            <p className="mt-2 text-sm text-slate-800">
              Our onboarding team can migrate your spreadsheets and messaging history into HouseHive in under a week.
            </p>
            <Link
              href="mailto:hello@househive.ai"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-slate-800"
            >
              Book a white-glove setup
            </Link>
          </section>
        </aside>
      </div>
    </section>
  );
}

function StatCard({ label, value, trend, accent }) {
  const accentStyles = {
    emerald: "from-emerald-400/30 to-emerald-400/0",
    sky: "from-sky-400/30 to-sky-400/0",
    amber: "from-amber-400/30 to-amber-400/0",
    violet: "from-violet-400/30 to-violet-400/0",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl">
      <div className={`absolute inset-0 h-full w-full bg-gradient-to-br ${accentStyles[accent] ?? "from-white/10 to-transparent"} opacity-60`} aria-hidden />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</p>
        <div className="mt-3 flex items-end justify-between">
          <h2 className="text-4xl font-semibold text-white">{value}</h2>
          {trend && <span className="text-xs text-slate-300">{trend}</span>}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, label, description }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:border-[#FFB400] hover:shadow-2xl"
    >
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {description && <p className="mt-2 text-xs text-slate-300">{description}</p>}
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
        Open workflow <span className="transition group-hover:translate-x-1">↗</span>
      </span>
    </Link>
  );
}
