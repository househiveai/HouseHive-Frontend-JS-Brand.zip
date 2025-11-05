import { useEffect, useState } from "react";
import { apiAddProperty, apiGetProperties } from "../lib/api";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const load = async () => {
    try {
      const data = await apiGetProperties();
      setProperties(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addProperty = async () => {
    if (!name) return alert("Enter a property name");
    await apiAddProperty({ name, address });
    setName(""); setAddress("");
    await load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Properties</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-400 mb-6 max-w-2xl">
        <h2 className="text-lg text-yellow-300 mb-2">Add New Property</h2>
        <input
          placeholder="Property Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-3"
        />
        <button
          onClick={addProperty}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Add Property
        </button>
      </div>

      <div className="max-w-2xl">
        {properties.length === 0 ? (
          <p className="text-gray-500">No properties yet.</p>
        ) : (
          properties.map((p) => (
            <div
              key={p.id}
              className="p-4 mb-3 bg-zinc-900 border border-zinc-700 rounded-xl"
            >
              <div className="font-semibold text-yellow-300">{p.name}</div>
              <div className="text-gray-400 text-sm">{p.address}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
