import { useEffect, useState } from "react";
import { apiAddTenant, apiGetTenants, apiGetProperties } from "../lib/api";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);

  const load = async () => {
    setTenants(await apiGetTenants());
    setProperties(await apiGetProperties());
  };

  const addTenant = async () => {
    if (!name) return alert("Enter tenant name");
    await apiAddTenant({ name, email, property_id: propertyId ? Number(propertyId) : null });
    setName(""); setEmail(""); setPropertyId("");
    await load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Tenants</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-400 mb-6 max-w-2xl">
        <h2 className="text-lg text-yellow-300 mb-2">Add New Tenant</h2>
        <input
          placeholder="Tenant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <input
          placeholder="Tenant Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-3"
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={addTenant}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Add Tenant
        </button>
      </div>

      <div className="max-w-2xl">
        {tenants.length === 0 ? (
          <p className="text-gray-500">No tenants yet.</p>
        ) : (
          tenants.map((t) => (
            <div
              key={t.id}
              className="p-4 mb-3 bg-zinc-900 border border-zinc-700 rounded-xl"
            >
              <div className="font-semibold text-yellow-300">{t.name}</div>
              <div className="text-gray-400 text-sm">{t.email}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
