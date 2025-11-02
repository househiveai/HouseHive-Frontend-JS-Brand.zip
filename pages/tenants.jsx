import { useState, useEffect } from "react";
import { apiGetTenants, apiGetProperties, apiCreateTenant } from "../lib/api";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [unit, setUnit] = useState("");
  const [rent, setRent] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = async () => {
    setTenants(await apiGetTenants());
    setProperties(await apiGetProperties());
  };
  useEffect(() => { load(); }, []);

  const addTenant = async () => {
    await apiCreateTenant({
      name, email, phone, property_id: propertyId,
      unit, rent, start_date: start, end_date: end
    });
    setName(""); setEmail(""); setPhone("");
    setPropertyId(""); setUnit(""); setRent(""); setStart(""); setEnd("");
    load();
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Tenants</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-2xl">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-800 rounded p-3 w-full mb-2" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-zinc-800 rounded p-3 w-full mb-2" />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="bg-zinc-800 rounded p-3 w-full mb-2" />
        <select value={propertyId} onChange={e => setPropertyId(Number(e.target.value))} className="bg-zinc-800 rounded p-3 w-full mb-2">
          <option value="">Select Property</option>
          {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)} className="bg-zinc-800 rounded p-3 w-full mb-2" />
        <input placeholder="Monthly Rent ($)" value={rent} onChange={e => setRent(e.target.value)} className="bg-zinc-800 rounded p-3 w-full mb-2" />
        <div className="flex space-x-3">
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="bg-zinc-800 rounded p-3 w-full" />
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="bg-zinc-800 rounded p-3 w-full" />
        </div>
        <button onClick={addTenant} className="bg-yellow-400 text-black font-semibold px-5 py-2 mt-4 rounded hover:opacity-90">Add Tenant</button>
      </div>

      <div className="mt-10">
        {tenants.map(t => (
          <div key={t.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 mb-3">
            <div className="text-xl font-semibold text-yellow-400">{t.name}</div>
            <div className="text-zinc-400 text-sm">{t.email} • {t.phone}</div>
            <div className="text-zinc-500 text-sm">Property ID: {t.property_id || 'N/A'}</div>
            <div className="text-zinc-400 text-sm">Unit {t.unit} — Rent ${t.rent}</div>
            <div className="text-zinc-500 text-sm">{t.start_date} → {t.end_date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
