"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../lib/auth";
import { api } from "../lib/api";

export default function LandlordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    properties: [],
    leases: [],
    openTasks: [],
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const properties = await api.get("/properties/").catch(() => []);
        // The following endpoints 404 for now → default to empty arrays
        const leases = await api.get("/leases").catch(() => []);
        const openTasks = await api.get("/tasks?status=open").catch(() => []);

        setOverview({ properties, leases, openTasks });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading landlord hub...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-6 py-8">
      <h1 className="text-3xl font-semibold">Landlord</h1>
      <p className="text-gray-400 mt-1">All tools to manage rentals, tenants, leases & finances.</p>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card title="Properties" count={overview.properties?.length || 0} href="/properties" />
        <Card title="Leases" count={overview.leases?.length || 0} href="/leases" />
        <Card title="Open Tasks" count={overview.openTasks?.length || 0} href="/tasks" />
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Action title="Add Tenant" href="/tenants/new" />
        <Action title="Upload Lease" href="/leases/new" />
        <Action title="Record Payment" href="/finance/new" />
        <Action title="Message a Tenant" href="/messages/new" />
      </section>
    </div>
  );
}

function Card({ title, count, href }) {
  return (
    <a href={href} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6 hover:border-[#3a3a3a] transition">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-4xl font-bold text-[#FFB400] mt-1">{count}</div>
      <div className="text-xs text-gray-500 mt-2">Open</div>
    </a>
  );
}
function Action({ title, href }) {
  return (
    <a href={href} className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-5 hover:border-[#3a3a3a] transition">
      <div className="text-white">{title} →</div>
      <div className="text-xs text-gray-400 mt-1">Open</div>
    </a>
  );
}
