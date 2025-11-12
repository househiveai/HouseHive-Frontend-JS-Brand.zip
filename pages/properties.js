import { useCallback, useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiMe, apiAddProperty } from "../lib/api";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function PropertiesPage() {
  return (
    <RequireAuth>
      <PropertiesContent />
    </RequireAuth>
  );
}

function PropertiesContent() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [me, snapshot] = await Promise.all([apiMe(), fetchPortfolioSnapshot()]);
      setUser(me);
      setProperties(snapshot.properties);
      setMetrics(snapshot.metrics);
      if (snapshot.errors?.length) {
        setError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
      }
    } catch (err) {
      setError(err?.message || "Unable to load properties.");
      setMetrics(createEmptyMetrics());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAddProperty(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = { name, address: address || null };
      await apiAddProperty(payload);
      await load();
      setShowForm(false);
      setName("");
      setAddress("");
    } catch (err) {
      setError(err?.message || "Unable to add property. Please try again.");
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Loading your portfolio...
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Property library</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Your managed spaces</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Keep every building, unit, and short-stay suite organized with notes, photos, and automation-ready metadata.
        </p>
        {user && (
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-300">
            Managing for {user.name || user.email}
          </p>
        )}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
        >
          + Add property
        </button>
      </header>

      <DashboardBridge metrics={metrics} focus="Properties" />

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {properties.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 text-center text-sm text-slate-300">
            No properties yet. Add your first listing to unlock smart automations.
          </div>
        ) : (
          properties.map((property) => (
            <article
              key={property.id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" aria-hidden />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{property.type || "Property"}</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{property.name}</h2>
                {property.address && <p className="mt-2 text-sm text-slate-200">{property.address}</p>}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-300">
                  <span>ID: {property.id}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#FFB400]">
                    Active
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Add new property</h2>
                <p className="mt-1 text-sm text-slate-200">Document a new unit to start automating tasks and billing.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:text-[#FFB400]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-200">
                Property name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="e.g. Oakwood Residence"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Address (optional)
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="123 Market Street"
                />
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Save property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
