import { useCallback, useEffect, useMemo, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import {
  apiAddTenant,
  apiMe,
} from "../lib/api";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function TenantsPage() {
  return (
    <RequireAuth>
      <TenantsContent />
    </RequireAuth>
  );
}

function TenantsContent() {
  const [user, setUser] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [me, snapshot] = await Promise.all([apiMe(), fetchPortfolioSnapshot()]);
      setUser(me);
      setProperties(snapshot.properties);
      setTenants(snapshot.tenants);
      setMetrics(snapshot.metrics);
      if (snapshot.errors?.length) {
        setError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
      }
    } catch (err) {
      setError(err?.message || "Failed to load tenants.");
      setMetrics(createEmptyMetrics());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const propertyLookup = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property.id] = property.name;
      return acc;
    }, {});
  }, [properties]);

  async function handleAddTenant(event) {
    event.preventDefault();
    setError("");

    try {
      const payload = {
        name,
        email: email || null,
        phone: phone || null,
        property_id: Number(propertyId),
      };

      await apiAddTenant(payload);
      await load();

      setShowForm(false);
      setName("");
      setEmail("");
      setPhone("");
      setPropertyId("");
    } catch (err) {
      setError(err?.message || "Unable to add tenant. Please try again.");
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Loading tenant roster...
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Resident management</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Tenants & guests</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Track contact details, assigned properties, and onboarding progress with the same modern polish as your auth flows.
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
          + Add tenant
        </button>
      </header>

      <DashboardBridge metrics={metrics} focus="Tenants" />

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {tenants.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 text-center text-sm text-slate-300">
            No tenants yet. Add a resident to kick off automated messaging and reminders.
          </div>
        ) : (
          tenants.map((tenant) => (
            <article
              key={tenant.id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" aria-hidden />
              <div className="relative">
                <h2 className="text-xl font-semibold text-white">{tenant.name}</h2>
                {tenant.email && <p className="mt-1 text-sm text-slate-200">{tenant.email}</p>}
                {tenant.phone && <p className="text-sm text-slate-200">{tenant.phone}</p>}
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-300">
                  {propertyLookup[tenant.property_id]
                    ? `Property: ${propertyLookup[tenant.property_id]}`
                    : `Property #${tenant.property_id}`}
                </p>
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
                <h2 className="text-2xl font-semibold">Add tenant</h2>
                <p className="mt-1 text-sm text-slate-200">Capture contact details and assign their home base.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:text-[#FFB400]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTenant} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-200">
                Full name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Email (optional)
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="tenant@example.com"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Phone (optional)
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="+1 (555) 123-4567"
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Assign to property
                <select
                  value={propertyId}
                  onChange={(event) => setPropertyId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  required
                >
                  <option value="">Select a property...</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id} className="text-slate-900">
                      {property.name}
                    </option>
                  ))}
                </select>
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
                  Save tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
