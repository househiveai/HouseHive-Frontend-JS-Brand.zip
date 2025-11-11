"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../components/AuthContext";
import { apiAdminUsers, apiAdminSetPlan, apiAdminDeleteUser } from "../lib/api";

const PLAN_METADATA = {
  cohost: {
    value: "cohost",
    name: "Cohost",
    description: "For part-time hosts",
    privileges: [
      "Automated guest messaging",
      "Shared calendar syncing",
      "Smart task assignments",
    ],
    limits: [
      "Up to 3 active properties",
      "1 team seat included",
      "Email support during business hours",
    ],
  },
  pro: {
    value: "pro",
    name: "Pro",
    description: "For growing portfolios",
    privileges: [
      "Advanced revenue analytics",
      "Dynamic pricing suggestions",
      "Workflow automations",
    ],
    limits: [
      "Unlimited properties",
      "3 team seats included",
      "Priority chat support",
    ],
  },
  agency: {
    value: "agency",
    name: "Agency",
    description: "For co-hosting teams",
    privileges: [
      "Client workspaces & permissions",
      "Team productivity insights",
      "White-labeled reporting",
    ],
    limits: [
      "Unlimited properties",
      "Unlimited team seats",
      "Dedicated success manager",
    ],
  },
};

const PLAN_OPTIONS = [
  {
    value: "none",
    name: "No plan",
    description: "Free tools only",
    privileges: ["Basic dashboard access", "Manual task tracking"],
    limits: ["Read-only analytics", "Community support"],
  },
  ...Object.values(PLAN_METADATA),
];

const PLAN_LIMITS = PLAN_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.limits;
  return acc;
}, {});

const PLAN_ORDER = PLAN_OPTIONS.map((option) => option.value);

function getPlanCode(plan) {
  if (!plan) return null;
  if (typeof plan === "string") return plan;
  if (typeof plan === "object") {
    if (typeof plan.code === "string") return plan.code;
    if (typeof plan.plan === "string") return plan.plan;
    if (typeof plan.value === "string") return plan.value;
  }
  return null;
}

function titleizePlan(code) {
  if (!code) return "Unknown";
  const metadata = PLAN_METADATA[code] || PLAN_OPTIONS.find((opt) => opt.value === code);
  if (metadata?.name) return metadata.name;
  return code
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractPurchasedPlans(user) {
  const raw = (() => {
    if (!user) return [];
    if (Array.isArray(user.purchased_plans)) return user.purchased_plans;
    if (Array.isArray(user.purchasedPlans)) return user.purchasedPlans;
    if (Array.isArray(user.plans)) return user.plans;
    if (user.plan) return [user.plan];
    return [];
  })();

  const codes = raw
    .map((item) => getPlanCode(item) || (typeof item === "string" ? item : null))
    .filter(Boolean)
    .map((plan) => plan.trim())
    .filter(Boolean);

  const uniqueCodes = Array.from(new Set(codes));

  uniqueCodes.sort((a, b) => {
    const indexA = PLAN_ORDER.indexOf(a);
    const indexB = PLAN_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return {
    codes: uniqueCodes,
    labels: uniqueCodes.map((code) => titleizePlan(code)),
  };
}

function PlanSelect({ value, onChange, purchasedPlanCodes = [], purchasedPlanNames = [] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleClick = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const selected =
    PLAN_OPTIONS.find((option) => option.value === value) ?? PLAN_OPTIONS[0];

  const purchasedSummary = purchasedPlanNames.length
    ? purchasedPlanNames.join(", ")
    : "No recorded purchases";

  const limitSummary = PLAN_LIMITS[selected.value] || PLAN_LIMITS.none || [];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="flex w-64 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left text-white transition hover:border-[#FFB400]"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
          if (event.key === " " || event.key === "Enter" || event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{selected.name}</span>
          <span className="text-xs text-slate-300">{selected.description}</span>
        </div>
        <svg
          className={`h-4 w-4 transition ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 7l5 6 5-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Customer access</p>
            <p className="mt-1 text-xs text-slate-200">
              Purchased: <span className="text-white">{purchasedSummary}</span>
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-slate-400">Plan limits</p>
            <ul className="mt-2 space-y-1">
              {limitSummary.map((limit) => (
                <li key={limit} className="flex items-start gap-2 text-[11px] text-slate-200">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FFB400]" aria-hidden />
                  <span>{limit}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul role="listbox" className="max-h-80 overflow-y-auto py-2">
            {PLAN_OPTIONS.map((option) => {
              const isActive = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onChange(option.value);
                        setOpen(false);
                      }
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setOpen(false);
                      }
                    }}
                    className={`w-full px-4 py-3 text-left transition hover:bg-white/10 ${
                      isActive ? "bg-white/10" : "bg-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {option.name}
                          </span>
                          {purchasedPlanCodes.includes(option.value) && (
                            <span className="rounded-full bg-[#FFB400]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFB400]">
                              Purchased
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-300">
                          {option.description}
                        </span>
                      </div>
                      {isActive && (
                        <svg
                          className="h-4 w-4 text-[#FFB400]"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 10l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <ul className="mt-3 space-y-2">
                      {option.privileges.map((privilege) => (
                        <li
                          key={privilege}
                          className="flex items-start gap-2 text-xs text-slate-200"
                        >
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FFB400]" aria-hidden />
                          <span>{privilege}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { user, loaded } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const load = useCallback(async () => {
    const data = await apiAdminUsers();
    setUsers(data);
  }, []);

  useEffect(() => {
    if (!user?.is_admin) return;
    load();
  }, [user, load]);

  const changePlan = useCallback(
    async (user_id, plan) => {
      await apiAdminSetPlan(user_id, plan === "none" ? null : plan);
      load();
    },
    [load]
  );

  const remove = useCallback(
    async (user_id) => {
      if (confirm("Delete this user?")) {
        await apiAdminDeleteUser(user_id);
        load();
      }
    },
    [load]
  );

  // AUTH GUARD
  if (!loaded) return null;
  if (!user) {
    if (typeof window !== "undefined") router.push("/login");
    return null;
  }
  if (!user.is_admin) {
    if (typeof window !== "undefined") router.push("/dashboard");
    return null;
  }

  return (
    <section className="space-y-10">
      {/* Header */}
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Admin controls</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">User & Billing Management</h1>
          <p className="max-w-2xl text-sm text-slate-200">
            Manage customer plans, access permissions, and lifecycle actions.
          </p>
        </div>
      </header>

      {/* Table Card */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <h2 className="text-lg font-semibold text-white mb-6">All Users</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-200">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.3em] text-slate-400 border-b border-white/10">
                <th className="py-3">Email</th>
                <th className="py-3">Plan</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {users.map((u) => {
                const { codes: purchasedPlanCodes, labels: purchasedPlanNames } = extractPurchasedPlans(u);
                const activePlanCode = getPlanCode(u?.plan) || (typeof u?.plan === "string" ? u.plan : null);
                const planLimits = PLAN_LIMITS[activePlanCode || "none"] || PLAN_LIMITS.none || [];

                return (
                  <tr key={u.id} className="hover:bg-white/5 transition">
                    <td className="py-4">
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-white">
                          {u.name || "N/A"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {u.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 align-top">
                      <div className="space-y-3">
                        <PlanSelect
                          value={activePlanCode || "none"}
                          onChange={(plan) => changePlan(u.id, plan)}
                          purchasedPlanCodes={purchasedPlanCodes}
                          purchasedPlanNames={purchasedPlanNames}
                        />
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                            Purchased tiers
                          </p>
                          <p className="mt-1 text-xs text-slate-200">
                            {purchasedPlanNames.length > 0
                              ? purchasedPlanNames.join(", ")
                              : "No recorded purchases"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                            Current limits
                          </p>
                          <ul className="mt-1 space-y-1">
                            {planLimits.map((limit) => (
                              <li key={limit} className="flex items-start gap-2 text-[11px] text-slate-200">
                                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FFB400]" aria-hidden />
                                <span>{limit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 align-top">
                      <button
                        onClick={() => remove(u.id)}
                        className="rounded-xl bg-red-500/20 border border-red-400/30 px-3 py-1 text-red-200 text-xs font-medium transition hover:bg-red-500/30 hover:border-red-400/60"
                      >
                        Delete user
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] hover:text-[#f39c00]"
      >
        ← Back to dashboard
      </Link>
    </section>
  );
}