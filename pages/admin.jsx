"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../components/AuthContext";
import { apiAdminUsers, apiAdminSetPlan, apiAdminDeleteUser } from "../lib/api";

export default function Admin() {
  const { user, loaded } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

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

  const load = async () => setUsers(await apiAdminUsers());
  useEffect(() => { load(); }, []);

  const changePlan = async (user_id, plan) => {
    await apiAdminSetPlan(user_id, plan === "none" ? null : plan);
    load();
  };

  const remove = async (user_id) => {
    if (confirm("Delete this user?")) {
      await apiAdminDeleteUser(user_id);
      load();
    }
  };

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
              {users.map((u) => (
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

                  <td className="py-3">
                    <select
                      value={u.plan || "none"}
                      onChange={(e) => changePlan(u.id, e.target.value)}
                      className="rounded-xl bg-white/10 border border-white/10 px-3 py-1 text-white outline-none focus:border-[#FFB400] transition cursor-pointer"                    >
                      <option value="none">None</option>
                      <option value="cohost">Cohost</option>
                      <option value="pro">Pro</option>
                      <option value="agency">Agency</option>
                    </select>

                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => remove(u.id)}
                      className="rounded-xl bg-red-500/20 border border-red-400/30 px-3 py-1 text-red-200 text-xs font-medium transition hover:bg-red-500/30 hover:border-red-400/60"
                    >
                      Delete user
                    </button>
                  </td>
                </tr>
              ))}
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