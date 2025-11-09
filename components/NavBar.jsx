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
    <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-white/10 px-5 py-4 text-white shadow-2xl backdrop-blur-2xl">
      <Link href="/" className="flex items-center gap-3">
        <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/80 p-2 shadow-lg">
          <Image src="/logo.png" alt="HouseHive" width={40} height={40} priority className="h-full w-full object-contain" />
        </span>
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-[#FFB400]">HouseHive</span>
          <span className="text-base font-semibold text-white">Intelligent Property Hub</span>
        </span>
      </Link>

      <div className="hidden flex-1 items-center justify-end gap-8 text-sm font-medium text-slate-100 lg:flex">
        {links.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 transition ${
                active ? "bg-white/20 text-[#FFB400] shadow" : "text-slate-200 hover:text-[#FFB400]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:block">
          <UserMenu />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white shadow-lg transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 top-full mt-4 w-full rounded-3xl border border-white/10 bg-black/80 p-6 text-sm shadow-2xl backdrop-blur-xl lg:hidden">
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
