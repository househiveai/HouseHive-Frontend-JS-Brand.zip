// /pages/landlord.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import {
  Properties, Tenants, Leases, Tasks, Finance, AI,
} from "@/lib/api";

const tabs = [
  "Overview",
  "Properties",
  "Tenants",
  "Leases",
  "Finance",
  "Tasks",
  "Messages",
  "AI Assistant",
  "Documents",
  "Settings",
];

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition
      ${active ? "bg-[#FFB400] text-black border-[#FFB400]" : "bg-[#1a1a1a] text-gray-200 border-[#2a2a2a] hover:border-[#3a3a3a]"}`}
    >
      {label}
    </button>
  );
}

function SectionCard({ title, children, actions }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function LandlordPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  // datasets
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [txs, setTxs] = useState([]);
  const [financeSummary, setFinanceSummary] = useState({ income: 0, expenses: 0, net: 0 });

  // forms (quick add)
  const [newProperty, setNewProperty] = useState({ name: "", address: "" });
  const [newTenant, setNewTenant] = useState({ name: "", email: "" });
  const [newTask, setNewTask] = useState({ title: "", property_id: "", priority: "normal" });
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const [props, tens, leas, tks, fsum, ftx] = await Promise.all([
          Properties.list(),
          Tenants.list(),
          Leases.list(),
          Tasks.list(),
          Finance.summary().catch(() => ({ income: 0, expenses: 0, net: 0 })),
          Finance.transactions().catch(() => []),
        ]);
        setProperties(props || []);
        setTenants(tens || []);
        setLeases(leas || []);
        setTasks(tks || []);
        setFinanceSummary(fsum || { income: 0, expenses: 0, net: 0 });
        setTxs(ftx || []);
      } catch (e) {
        console.error("Landlord load failed", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleCreateProperty(e) {
    e.preventDefault();
    const created = await Properties.create(newProperty);
    setProperties((arr) => [created, ...arr]);
    setNewProperty({ name: "", address: "" });
  }

  async function handleCreateTenant(e) {
    e.preventDefault();
    const created = await Tenants.create(newTenant);
    setTenants((arr) => [created, ...arr]);
    setNewTenant({ name: "", email: "" });
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    const created = await Tasks.create(newTask);
    setTasks((arr) => [created, ...arr]);
    setNewTask({ title: "", property_id: "", priority: "normal" });
  }

  async function handleAI() {
    if (!aiPrompt.trim()) return;
    try {
      const reply = await AI.chat(aiPrompt.trim());
      alert(reply?.answer || "AI responded (see console)"); // swap for a nicer UI later
      setAiPrompt("");
    } catch (e) {
      alert("AI error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111111] text-white">
        Loading landlord hub...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-white px-6 md:px-8 py-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <TabButton key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard title="Portfolio At-a-Glance">
              <ul className="text-sm text-gray-300 space-y-1">
                <li>Properties: {properties.length}</li>
                <li>Tenants/Guests: {tenants.length}</li>
                <li>Active Tasks: {tasks.length}</li>
                <li>Leases: {leases.length}</li>
                <li>
                  Monthly Net:{" "}
                  <span className={financeSummary.net >= 0 ? "text-green-400" : "text-red-400"}>
                    ${Number(financeSummary.net || 0).toLocaleString()}
                  </span>
                </li>
              </ul>
            </SectionCard>

            <SectionCard title="Upcoming / Active Tasks" actions={
              <button onClick={() => setActiveTab("Tasks")} className="text-sm underline">
                View all
              </button>
            }>
              <div className="space-y-2">
                {tasks.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between bg-[#141414] rounded-lg px-3 py-2">
                    <div>
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-gray-400">Priority: {t.priority || "normal"}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await Tasks.complete(t.id);
                        setTasks((arr) => arr.filter((x) => x.id !== t.id));
                      }}
                      className="text-sm bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#3a3a3a]"
                    >
                      Complete
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-gray-500 text-sm">No active tasks.</p>}
              </div>
            </SectionCard>

            <SectionCard title="Finance Snapshot" actions={
              <button onClick={() => setActiveTab("Finance")} className="text-sm underline">
                Open Finance
              </button>
            }>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-gray-400 text-xs">Income</p>
                  <p className="text-xl font-semibold">${Number(financeSummary.income || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Expenses</p>
                  <p className="text-xl font-semibold">${Number(financeSummary.expenses || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Net</p>
                  <p className={`text-xl font-semibold ${financeSummary.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                    ${Number(financeSummary.net || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "Properties" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard title="Add Property">
              <form onSubmit={handleCreateProperty} className="space-y-3">
                <input
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  placeholder="Name"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  required
                />
                <input
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  placeholder="Address"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  required
                />
                <button className="bg-[#FFB400] text-black px-4 py-2 rounded font-medium">Create</button>
              </form>
            </SectionCard>

            <SectionCard title="All Properties" actions={null}>
              <div className="space-y-2">
                {properties.map((p) => (
                  <div key={p.id} className="bg-[#141414] rounded-lg px-3 py-2">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.address}</p>
                  </div>
                ))}
                {properties.length === 0 && <p className="text-gray-500 text-sm">No properties yet.</p>}
              </div>
            </SectionCard>

            <SectionCard title="Quick Task">
              <form onSubmit={handleCreateTask} className="space-y-3">
                <input
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
                <select
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  value={newTask.property_id}
                  onChange={(e) => setNewTask({ ...newTask, property_id: e.target.value })}
                  required
                >
                  <option value="">Select property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">low</option>
                  <option value="normal">normal</option>
                  <option value="high">high</option>
                </select>
                <button className="bg-[#FFB400] text-black px-4 py-2 rounded font-medium">Add Task</button>
              </form>
            </SectionCard>
          </div>
        )}

        {activeTab === "Tenants" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Add Tenant">
              <form onSubmit={handleCreateTenant} className="space-y-3">
                <input
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  placeholder="Full name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  className="w-full bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                  placeholder="Email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  required
                />
                <button className="bg-[#FFB400] text-black px-4 py-2 rounded font-medium">Add Tenant</button>
              </form>
            </SectionCard>

            <SectionCard title="All Tenants">
              <div className="space-y-2">
                {tenants.map((t) => (
                  <div key={t.id} className="bg-[#141414] rounded-lg px-3 py-2 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.email}</p>
                    </div>
                    <button className="text-sm bg-[#2a2a2a] px-2 py-1 rounded">Message</button>
                  </div>
                ))}
                {tenants.length === 0 && <p className="text-gray-500 text-sm">No tenants yet.</p>}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "Leases" && (
          <div className="space-y-6">
            <SectionCard title="Leases">
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="text-left py-2">Property</th>
                      <th className="text-left py-2">Tenant</th>
                      <th className="text-left py-2">Start</th>
                      <th className="text-left py-2">End</th>
                      <th className="text-left py-2">Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leases.map((l) => (
                      <tr key={l.id} className="border-t border-[#2a2a2a]">
                        <td className="py-2">{l.property_name || l.property_id}</td>
                        <td className="py-2">{l.tenant_name || l.tenant_id}</td>
                        <td className="py-2">{l.start_date}</td>
                        <td className="py-2">{l.end_date}</td>
                        <td className="py-2">${Number(l.rent || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leases.length === 0 && <p className="text-gray-500 text-sm mt-3">No leases yet.</p>}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "Finance" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SectionCard title="Summary">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-gray-400 text-xs">Income</p>
                  <p className="text-xl font-semibold">${Number(financeSummary.income || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Expenses</p>
                  <p className="text-xl font-semibold">${Number(financeSummary.expenses || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Net</p>
                  <p className={`text-xl font-semibold ${financeSummary.net >= 0 ? "text-green-400" : "text-red-400"}`}>
                    ${Number(financeSummary.net || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Transactions" actions={null}>
              <div className="max-h-80 overflow-auto space-y-2">
                {txs.map((tx) => (
                  <div key={tx.id} className="bg-[#141414] rounded-lg px-3 py-2 flex justify-between">
                    <div>
                      <p className="font-medium">{tx.label}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                    <p className={`font-semibold ${tx.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                      {tx.type === "expense" ? "-" : "+"}${Number(tx.amount || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
                {txs.length === 0 && <p className="text-gray-500 text-sm">No transactions yet.</p>}
              </div>
            </SectionCard>

            <SectionCard title="Add Transaction">
              {/* You can wire this to Finance.add(tx) */}
              <p className="text-gray-400 text-sm">Coming next: form for income/expense.</p>
            </SectionCard>
          </div>
        )}

        {activeTab === "Tasks" && (
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="bg-[#141414] rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-400">Property: {t.property_name || t.property_id}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 border border-[#2a2a2a] rounded">{t.priority || "normal"}</span>
                  <button
                    onClick={async () => {
                      await Tasks.complete(t.id);
                      setTasks((arr) => arr.filter((x) => x.id !== t.id));
                    }}
                    className="text-sm bg-[#2a2a2a] px-2 py-1 rounded hover:bg-[#3a3a3a]"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-gray-500 text-sm">No active tasks.</p>}
          </div>
        )}

        {activeTab === "Messages" && (
          <SectionCard title="Messages / Notices">
            <p className="text-gray-400 text-sm">Hook this to your /messages endpoints when ready.</p>
          </SectionCard>
        )}

        {activeTab === "AI Assistant" && (
          <SectionCard title="Ask HouseHive AI">
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#111111] border border-[#2a2a2a] rounded px-3 py-2"
                placeholder="e.g., Draft a rent increase notice for Unit 3B effective Jan 1"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button onClick={handleAI} className="bg-[#FFB400] text-black px-4 py-2 rounded font-medium">
                Send
              </button>
            </div>
          </SectionCard>
        )}

        {activeTab === "Documents" && (
          <SectionCard title="Leases & Docs">
            <p className="text-gray-400 text-sm">Connect storage (S3 / GDrive) and list documents here.</p>
          </SectionCard>
        )}

        {activeTab === "Settings" && (
          <SectionCard title="Landlord Settings">
            <p className="text-gray-400 text-sm">Owner profile, payment prefs, notifications, branding, etc.</p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
