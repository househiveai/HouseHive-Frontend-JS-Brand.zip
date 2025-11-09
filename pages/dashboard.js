"use client";

import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiGetProperties, apiGetInsights } from "../lib/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetInsights();
        setInsights(data);

        const props = await apiGetProperties();
        setProperties(props || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center min-h-screen text-yellow-400 text-xl">
          Loading Dashboard…
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="p-8 min-h-screen bg-black text-white">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">Dashboard</h1>

        {insights && (
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl mb-6 max-w-3xl">
            <p>{insights.summary}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3 text-yellow-300">Your Properties</h2>
        <div className="space-y-3 max-w-3xl">
          {properties.map((p) => (
            <div key={p.id} className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
              <div className="font-bold text-yellow-400">{p.name}</div>
              <div className="text-zinc-400">{p.address || "No address provided"}</div>
            </div>
          ))}

          {properties.length === 0 && (
            <div className="text-zinc-400 italic">No properties yet.</div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
