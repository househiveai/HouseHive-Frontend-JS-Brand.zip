// pages/landlord.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { apiGetProperties } from "@/lib/api";

export default function LandlordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const list = await apiGetProperties();
        setProperties(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Landlord load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading landlord tools...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Landlord</h1>
        <p className="text-gray-400 mt-1">
          Manage rentals, tenants, finances, leases, messaging, and AI tools.
        </p>
      </div>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { t: "Add Property", href: "/properties/new" },
          { t: "Add Tenant/Guest", href: "/tenants/new" },
          { t: "Create Lease", href: "/leases/new" },
          { t: "Record Payment", href: "/billing/new" },
          { t: "New Task", href: "/tasks/new" },
          { t: "Message Tenant", href: "/messages/new" }
        ].map((a) => (
          <a
            key={a.t}
            href={a.href}
            className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] hover:border-[#FFB400] transition"
          >
            <div className="text-[#FFB400] font-semibold">{a.t}</div>
            <div className="text-gray-400 text-sm">Open form</div>
          </a>
        ))}
      </section>

      {/* Properties table (example) */}
      <section className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2a2a2a] text-lg font-semibold">
          Properties
        </div>
        <div className="divide-y divide-[#2a2a2a]">
          {properties.length === 0 && (
            <div className="px-6 py-6 text-gray-400">No properties yet.</div>
          )}
          {properties.map((p) => (
            <div key={p.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name || p.address || `Property #${p.id}`}</div>
                <div className="text-gray-400 text-sm">
                  {p.city ? `${p.city}, ` : ""}{p.state || ""} {p.zip || ""}
                </div>
              </div>
              <div className="flex gap-3">
                <a href={`/properties/${p.id}`} className="text-[#FFB400] hover:underline">View</a>
                <a href={`/tenants?property=${p.id}`} className="text-gray-300 hover:underline">Tenants</a>
                <a href={`/tasks?property=${p.id}`} className="text-gray-300 hover:underline">Tasks</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Finance & Leases & Messaging placeholders you can wire next */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <div className="font-semibold mb-2">Finance</div>
          <p className="text-gray-400 text-sm">
            Track rent, deposits, payouts, and expenses (hook to /billing endpoints).
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <div className="font-semibold mb-2">Leases</div>
          <p className="text-gray-400 text-sm">
            Store PDFs, set start/end dates, renewal reminders (hook to /leases).
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
          <div className="font-semibold mb-2">Messaging & AI</div>
          <p className="text-gray-400 text-sm">
            Chat with tenants and draft replies via AI (hook to /messages and /ai/draft).
          </p>
        </div>
      </section>
    </div>
  );
}
