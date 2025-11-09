import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/landlord", label: "Landlord" },
  { href: "/properties", label: "Properties" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/tenants", label: "Tenants" },
  { href: "/reminders", label: "Reminders" },
  { href: "/messages", label: "Messages" },
  { href: "/billing", label: "Billing" },
];

export default function NavBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-6 overflow-hidden rounded-full border border-white/10 bg-[#0C1324]/80 px-6 py-4 text-white shadow-[0_22px_45px_-28px_rgba(14,23,42,0.9)] backdrop-blur-2xl">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),rgba(12,19,36,0.4))] opacity-60"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#FFB400]/25 blur-3xl"
      />

      <Link href="/" className="relative z-10 flex items-center gap-3">
        <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-transparent p-1 shadow-inner">
          <Image
            src="/logo.png"
            alt="HouseHive"
            width={42}
            height={42}
            priority
            className="h-full w-full object-contain"
          />
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-xs font-semibold uppercase tracking-[0.45em] text-[#FFB400]">HouseHive</span>
          <span className="text-base font-semibold text-white/90">Intelligent Property Hub</span>
        </span>
      </Link>

      <div className="relative z-10 hidden flex-1 items-center justify-end gap-1 lg:flex">
        {links.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-white/15 text-[#FFB400] shadow-[0_8px_18px_-12px_rgba(255,180,0,0.7)]"
                  : "text-slate-200/90 hover:bg-white/10 hover:text-[#FFB400]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <div className="hidden lg:block">
          <UserMenu />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white shadow-lg transition hover:bg-white/20 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-4 w-full rounded-3xl border border-white/10 bg-[#050910]/95 p-6 text-sm shadow-2xl backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 transition ${
                    active ? "bg-white/10 text-[#FFB400]" : "text-slate-100 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6">
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
}
