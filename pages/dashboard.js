"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    tasks: 0,
    reminders: 0,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchStats() {
      try {
        const data = await api("/dashboard/summary", token);
        setStats(data);
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-8 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="text-gray-400 mt-1">
        Your smart co-host overview.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        {/* Properties */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <p className="text-gray-400 text-sm">Properties</p>
          <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">
            {stats.properties}
          </h2>
        </div>

        {/* Tenants */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <p className="text-gray-400 text-sm">Tenants / Guests</p>
          <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">
            {stats.tenants}
          </h2>
        </div>

        {/* Tasks */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <p className="text-gray-400 text-sm">Active Tasks</p>
          <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">
            {stats.tasks}
          </h2>
        </div>

        {/* Reminders */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <p className="text-gray-400 text-sm">Reminders</p>
          <h2 className="text-4xl font-bold mt-1 text-[#FFB400]">
            {stats.reminders}
          </h2>
        </div>

      </div>
    </div>
  );
}
