import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 pb-16 text-white shadow-2xl backdrop-blur-xl sm:p-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-5%] top-[10%] h-72 w-72 rounded-full bg-[#FFB400]/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[35%] h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_55%)]" />
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#FFB400]">
            <span className="h-2 w-2 rounded-full bg-[#FFB400]" /> powered by HiveBot
          </div>
          <div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              A glassmorphic control center for everything property.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-200">
              HouseHive orchestrates leasing, maintenance, messaging, and finances with calm clarity. Automate the busywork and
              keep every resident in the loop without breaking a sweat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-[#f39c00]"
            >
              Launch your workspace
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
            >
              Mobile apps
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-5 text-left sm:grid-cols-4">
            {["Properties", "Tenants", "Tasks", "Reminders"].map((label, idx) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-[#FFB400]">{idx === 0 ? "∞" : "0"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-[-40px] -translate-x-1/2 rounded-3xl bg-[#FFB400]/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-900">
            Live snapshot
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-6 shadow-2xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-[#FFB400]">Today&apos;s flow</p>
              <ul className="mt-4 space-y-4 text-sm text-slate-200">
                <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">Rental payment</p>
                    <p className="text-xs text-slate-400">Unit 4B • due today</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-300">Collected</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">HVAC maintenance</p>
                    <p className="text-xs text-slate-400">Townhouse 3 • in progress</p>
                  </div>
                  <span className="rounded-full bg-[#FFB400]/10 px-3 py-1 text-xs font-medium text-[#FFB400]">Technician en route</span>
                </li>
                <li className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">Guest welcome</p>
                    <p className="text-xs text-slate-400">Short-stay • arriving tomorrow</p>
                  </div>
                  <span className="rounded-full bg-sky-400/20 px-3 py-1 text-xs font-medium text-sky-200">Auto-messaged</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Workflows on autopilot</p>
              <p className="mt-2 text-sm">
                AI copilots coordinate reminders, draft replies, and surface anomalies before they become emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
