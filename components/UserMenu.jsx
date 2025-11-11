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

  const initials = user?.name
    ? user.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
    : user?.email?.slice(0, 2).toUpperCase();

  const isAuthenticated = Boolean(user);

  const avatarClassName = "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold uppercase shadow-md";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-2.5 py-1.5 pr-3 text-left text-sm text-white shadow-lg transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB400]/60"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className={`${isAuthenticated
              ? "bg-gradient-to-br from-[#FFB400] to-[#d49300] text-slate-900"
              : "border border-white/15 bg-white/5 text-white/70"
            } ${avatarClassName}`}
        >
          {isAuthenticated ? (
            initials || "HH"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
              aria-hidden
            >
              <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.33 0-6 1.82-6 4v1h12v-1c0-2.18-2.67-4-6-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {isAuthenticated ? (
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/50">Signed in as</span>
            <span className="text-sm font-semibold text-white">{user.name || user.email}</span>
          </span>
        ) : (
          <span className="hidden flex-col leading-tight text-left sm:flex">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-white/40">Welcome</span>
            <span className="text-sm font-semibold text-white">Guest</span>
          </span>
        )}
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
        <div className="absolute right-0 z-30 mt-3 w-72 origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-[#04070f]/95 p-5 text-sm text-white shadow-[0_24px_55px_-32px_rgba(5,8,15,0.9)] backdrop-blur-xl">
          {isAuthenticated ? (
            <>
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB400] to-[#d49300] text-base font-semibold uppercase text-slate-900 shadow-lg">
                  {initials || "HH"}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{user.name || "HouseHive Member"}{user?.is_admin ? " (Admin)" : ""}</p>
                  <p className="text-xs text-slate-300">{user.email}</p>
                  <p className="text-xs text-slate-300">{user.plan || "None"}</p>
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

                {user?.is_admin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-[#FFB400]/30 bg-[#FFB400]/10 px-3 py-2 text-xs font-semibold  text-[#FFB400] transition hover:bg-[#FFB400]/20 hover:border-[#FFB400]/60"
                  >
                    Admin Dashboard <span className="text-xs text-slate-400">↗</span>
                  </Link>
                )}


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


            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.33 0-6 1.82-6 4v1h12v-1c0-2.18-2.67-4-6-4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Welcome</p>
                  <p className="text-xs text-slate-300">Sign in to access your workspace</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-center text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/20"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-transparent bg-[#FFB400] px-4 py-2 text-center text-sm font-semibold text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Create account
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
