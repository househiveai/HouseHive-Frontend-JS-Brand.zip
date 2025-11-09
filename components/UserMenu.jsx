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
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-[#FFB400] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#f39c00]"
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
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/30 via-white/20 to-white/10 text-sm font-semibold uppercase text-slate-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials || "HH"}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-4 text-sm text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFB400] text-base font-semibold uppercase text-slate-900">
              {initials || "HH"}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.name || "HouseHive Member"}</p>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 transition hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Dashboard <span className="text-xs text-slate-400">↗</span>
            </Link>
            <Link
              href="/account"
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 transition hover:bg-white/10"
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
            className="mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/20 hover:text-red-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
