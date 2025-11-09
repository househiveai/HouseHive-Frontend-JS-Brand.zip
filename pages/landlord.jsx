"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessToken } from "@/lib/auth";
import { request } from "@/lib/api";

export default function LandlordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState({
    units: 0,
    occupied: 0,
    vacant: 0,
    delinquent: 0,
    mrr: 0,
  });

  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const [ov, t, l, tk, tx] = await Promise.all([
          request("/landlord/overview"),
          request("/tenants"),
          request("/leases"),
          request("/tasks?status=open"),
          request("/finance/transactions?limit=10")
        ]);
        if (ov) setOverview(ov);
        if (Array.isArray(t)) setTenants(t);
        if (Array.isArray(l)) setLeases(l);
        if (Array.isArray(tk)) setTasks(tk);
        if (Array.isArray(tx)) setTransactions(tx);
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
        Loading landlord hub...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Landlord</h1>
          <p className="text-gray-400">Everything to run your rentals in one place.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/properties" className="px-4 py-2 rounded-xl bg-[#FFB400] text-black font-medium">
            Add Property
          </Link>
          <Link href="/tenants" className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
            Add Tenant
          </Link>
        </div>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <KPI label="Units" value={overview.units} />
        <KPI label="Occupied" value={overview.occupied} />
        <KPI label="Vacant" value={overview.vacant} />
        <KPI label="Delinquent" value={overview.delinquent} />
        <KPI label="Monthly Recurring Rent" value={`$${Number(overview.mrr || 0).toLocaleString()}`} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Active Leases" href="/leases">
            <Table
              headers={["Property", "Tenant", "Start", "End", "Rent"]}
              rows={leases.slice(0, 6).map(l => [
                l.property_name || l.property_id,
                l.tenant_name || l.tenant_id,
                formatDate(l.start_date),
                formatDate(l.end_date),
                currency(l.rent)
              ])}
              empty="No leases yet."
            />
          </Card>

          <Card title="Open Tasks" href="/tasks">
            <Table
              headers={["Task", "Property", "Assignee", "Due"]}
              rows={tasks.slice(0, 6).map(t => [
                t.title,
                t.property_name || t.property_id,
                t.assignee_name || "—",
                formatDate(t.due_date)
              ])}
              empty="No open tasks 🎉"
            />
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Recent Transactions" href="/billing">
            <Table
              headers={["Date", "Type", "Amount"]}
              rows={transactions.slice(0, 8).map(tx => [
                formatDate(tx.date),
                tx.type,
                currency(tx.amount)
              ])}
              empty="No transactions yet."
            />
          </Card>

          <Card title="Tenants" href="/tenants">
            <ul className="divide-y divide-[#2a2a2a]">
              {tenants.slice(0, 6).map(t => (
                <li key={t.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.name || t.email}</p>
                    <p className="text-xs text-gray-400">{t.phone || t.email}</p>
                  </div>
                  <Link href={`/tenants/${t.id}`} className="text-[#FFB400] text-sm">View</Link>
                </li>
              ))}
              {tenants.length === 0 && (
                <li className="py-3 text-gray-400">No tenants yet.</li>
              )}
            </ul>
          </Card>

          <Card title="AI Assistant" href="/messages">
            <p className="text-gray-300 text-sm">
              Draft notices, create lease riders, craft tenant messages, or summarize issues.
            </p>
            <Link
              href="/messages"
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-[#FFB400] text-black font-medium"
            >
              Open Messages
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold text-[#FFB400]">{value}</p>
    </div>
  );
}

function Card({ title, href, children }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {href && (
          <Link href={href} className="text-sm text-[#FFB400]">
            View all
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Table({ headers, rows, empty }) {
  if (!rows || rows.length === 0) {
    return <p className="text-gray-400 text-sm">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-400">
          <tr>
            {headers.map((h) => (
              <th key={h} className="py-2 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[#2a2a2a]">
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-4">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

function currency(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
