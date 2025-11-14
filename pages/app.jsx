import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Command center in your pocket",
    description:
      "Track rent collection, urgent maintenance, and tenant communications at a glance with cards designed for quick scanning on mobile.",
  },
  {
    title: "Instant, intelligent alerts",
    description:
      "Receive adaptive push notifications that surface the tasks that need you most, while AI copilots draft quick replies you can send in seconds.",
  },
  {
    title: "Offline-friendly records",
    description:
      "Access lease files, inspection photos, and payment history even during walk-throughs in buildings with spotty reception.",
  },
];

const setupSteps = [
  {
    step: "01",
    title: "Send the invite",
    text: "From the HouseHive web dashboard, add team members and residents. We automatically email download links tailored to their roles.",
  },
  {
    step: "02",
    title: "Download the app",
    text: "Tap the App Store or Google Play badge below from any device. SSO keeps everyone synced with the desktop experience.",
  },
  {
    step: "03",
    title: "Stay in the loop",
    text: "Enable notifications to receive real-time updates, AI-generated summaries, and escalations when something requires attention.",
  },
];

function AppStoreBadge({ store, href, icon, description }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 rounded-3xl border border-white/15 bg-white/5 px-6 py-4 text-left text-sm font-medium text-white transition hover:border-[#FFB400]/80 hover:bg-white/10 hover:text-[#FFB400]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 text-white shadow-[0_15px_35px_-18px_rgba(0,0,0,0.75)] transition group-hover:bg-black/60">
        {icon}
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.35em] text-slate-300 group-hover:text-[#FFB400]">
          {description}
        </span>
        <span className="mt-1 block text-lg font-semibold">{store}</span>
      </span>
    </Link>
  );
}

export default function AppPage() {
  return (
    <>
      <Head>
        <title>HouseHive Mobile Apps</title>
        <meta
          name="description"
          content="Download the HouseHive mobile apps for iOS and Android to manage properties, maintenance, and tenants wherever you are."
        />
      </Head>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16 text-white sm:px-10 lg:pt-24">
        <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#050910]/80 p-10 shadow-2xl backdrop-blur-2xl sm:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#FFB400]/25 blur-3xl" />
            <div className="absolute bottom-[-15%] right-[-10%] h-80 w-80 rounded-full bg-sky-400/15 blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#FFB400]">
                <span className="h-2 w-2 rounded-full bg-[#FFB400]" /> On the go
              </span>
              <div>
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Take HouseHive with you</h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-200">
                  Manage unit turnovers, maintenance emergencies, and tenant conversations from anywhere. Our native apps keep
                  every data point synced with the web dashboard while HiveBot copilots smooth every interaction.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <AppStoreBadge
                  href="https://example.com/ios"
                  store="Download on the App Store"
                  description="iOS & iPadOS"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                      <path
                        d="M17.52 12.06c-.02-2.24 1.82-3.32 1.9-3.37-1.04-1.52-2.66-1.73-3.23-1.75-1.37-.14-2.68.8-3.37.8-.7 0-1.77-.78-2.9-.76-1.48.02-2.85.87-3.61 2.21-1.54 2.66-.39 6.6 1.1 8.76.73 1.04 1.6 2.2 2.75 2.16 1.1-.04 1.5-.7 2.81-.7 1.3 0 1.66.7 2.89.68 1.2-.02 1.95-1.05 2.67-2.1.84-1.23 1.18-2.44 1.2-2.5-.03-.01-2.28-.88-2.31-3.43ZM15.32 5.52c.61-.74 1.03-1.77.92-2.8-.89.04-1.95.6-2.58 1.34-.56.65-1.07 1.7-.94 2.7.99.08 2-.5 2.6-1.24Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
                <AppStoreBadge
                  href="https://example.com/android"
                  store="Get it on Google Play"
                  description="Android"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                      <path
                        d="M3.47 2.26c-.14.24-.22.52-.22.83v17.82c0 .31.08.59.22.83l9.62-9.74L3.47 2.26Zm12.65 7.05L5.78 1.24l8.25 8.34 2.09-.27ZM2.26 1.47A1.74 1.74 0 0 0 1 3.09v17.82c0 .65.34 1.22.85 1.55l10.35-10.5L2.26 1.47Zm14.48 3.32-2.47-2.5c-.37-.36-.86-.53-1.35-.53-.27 0-.54.05-.8.16l4.62 4.67L16.74 4.8Zm.78.78-2.28 2.31 2.26 2.28 3.2-1.65c.62-.32 1.02-.94 1.02-1.64 0-.69-.4-1.31-1.02-1.63l-3.18-1.67Zm-.75 6.09-3.12 3.16 2.54 2.56 3.67-1.92a1.91 1.91 0 0 0 1.02-1.67c0-.68-.38-1.31-.99-1.63l-3.12-1.5Zm-3.81 3.86-9.12 9.27c.25.1.51.15.78.15.49 0 .98-.17 1.35-.53l7.3-7.43-2.31-2.36Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />
              </div>

              <p className="text-xs text-slate-400">
                Mobile apps are included with every HouseHive workspace. Links above lead to upcoming store listings—ask support for
                beta access today.
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -right-10 -top-8 h-24 w-24 rounded-full bg-[#FFB400]/20 blur-2xl" />
              <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-4 shadow-2xl">
                <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                    <span>Portfolio snapshot</span>
                    <span>Live</span>
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#FFB400]">Collected today</p>
                      <p className="mt-2 text-2xl font-semibold text-white">$14,820</p>
                      <p className="mt-1 text-xs text-slate-400">13 payments across 4 buildings</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-[#FFB400]">Open issues</p>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2">
                          <span>Roof inspection</span>
                          <span className="text-xs text-emerald-300">Technician assigned</span>
                        </li>
                        <li className="flex items-center justify-between rounded-xl bg-black/40 px-3 py-2">
                          <span>Lease renewal</span>
                          <span className="text-xs text-sky-200">Awaiting signature</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
                  <Image
                    src="/og-image.png"
                    alt="HouseHive mobile preview"
                    width={640}
                    height={360}
                    className="h-auto w-full rounded-2xl border border-white/10 object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Designed for property pros in motion</h2>
            <p className="max-w-2xl text-base text-slate-200">
              Whether you manage a boutique portfolio or hundreds of units, HouseHive mobile keeps the same glassmorphic calm you
              love on desktop. Every workflow adapts to smaller screens so you can triage tasks without digging through menus.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_38px_-28px_rgba(12,19,36,0.95)]"
                >
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_24px_45px_-32px_rgba(12,19,36,0.9)]">
            <h2 className="text-2xl font-semibold text-white">Quick start checklist</h2>
            <p className="text-sm text-slate-300">
              Launch your mobile rollout in an afternoon. These steps keep teams aligned across devices and ensure HiveBot can assist
              without interruptions.
            </p>
            <ol className="space-y-5">
              {setupSteps.map((item) => (
                <li key={item.step} className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#FFB400]">{item.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#FFB400]/20 via-[#050910]/90 to-[#0C1324] p-12 text-center shadow-2xl">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[15%] top-[10%] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-[10%] bottom-[15%] h-52 w-52 rounded-full bg-sky-400/15 blur-[100px]" />
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#FFB400]">
              <span className="h-2 w-2 rounded-full bg-[#FFB400]" /> Need a hand?
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Roll out HouseHive mobile across your portfolio</h2>
            <p className="text-base text-slate-200">
              Our onboarding team will migrate your workflows, automate notifications, and train your staff on mobile best
              practices.
            </p>
            <Link
              href="mailto:hello@househive.app"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
            >
              Talk with onboarding
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
