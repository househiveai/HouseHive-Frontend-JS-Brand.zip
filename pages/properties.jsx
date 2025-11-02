import { useEffect, useState } from "react";
import { apiGetProperties, apiCreateProperty } from "../lib/api";

export default function Properties() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [rent, setRent] = useState("");
  const [lease, setLease] = useState("");

  const load = async () => setRows(await apiGetProperties());
  useEffect(() => { load(); }, []);

  const add = async () => {
    await apiCreateProperty({ name, address, notes, rent, lease_months: lease });
    setName(""); setAddress(""); setNotes(""); setRent(""); setLease("");
    load();
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Properties</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-xl">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-800 rounded p-3 mb-2"/>
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-zinc-800 rounded p-3 mb-2"/>
        <input placeholder="Monthly Rent ($)" value={rent} onChange={e => setRent(e.target.value)} className="w-full bg-zinc-800 rounded p-3 mb-2"/>
        <input placeholder="Lease Length (months)" value={lease} onChange={e => setLease(e.target.value)} className="w-full bg-zinc-800 rounded p-3 mb-2"/>
        <textarea placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-zinc-800 rounded p-3 mb-3"/>
        <button onClick={add} className="bg-yellow-400 text-black py-2 px-6 rounded font-bold hover:opacity-90">Add Property</button>
      </div>

      <div className="mt-10">
        {rows.map(r => (
          <div key={r.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 mb-3">
            <div className="text-xl font-semibold text-yellow-400">{r.name}</div>
            <div className="text-zinc-400">{r.address}</div>
            <div className="text-zinc-500 text-sm">{r.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
