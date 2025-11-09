"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function UserMenu() {
  const { user, logout, loaded } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!loaded) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" aria-hidden />
    );
  }

  if (!user) {
    return (
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 text-sm font-medium text-white shadow-lg">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB400]/60"
        >
          Log in
        </Link>
        <span className="my-1 h-6 w-px bg-white/15" aria-hidden />
        <Link
          href="/register"
          className="bg-[#FFB400] px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#f39c00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1324] focus-visible:ring-[#FFB400]"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    : user.email?.slice(0, 2).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 pr-3 text-left text-sm text-white shadow-lg transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB400]/60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB400] to-[#d49300] text-sm font-semibold uppercase text-slate-900 shadow-md">
          {initials || "HH"}
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">Signed in as</span>
          <span className="text-sm font-semibold text-white">{user.name || user.email}</span>
        </span>
        <svg
          className="ml-auto h-4 w-4 text-white/60 transition group-hover:text-white"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-[#04070f]/95 p-5 text-sm text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB400] to-[#d49300] text-base font-semibold uppercase text-slate-900 shadow-lg">
              {initials || "HH"}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">{user.name || "HouseHive Member"}</p>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:border-white/15 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Dashboard <span className="text-xs text-slate-400">↗</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:border-white/15 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Account settings <span className="text-xs text-slate-400">↗</span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="mt-5 w-full rounded-xl border border-transparent bg-red-500/10 px-3 py-2 text-left text-sm font-medium text-red-200 transition hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
