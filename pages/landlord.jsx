"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "../lib/auth";
import {
  api,
  apiDeleteProperty,
  apiDeleteTenant,
  apiGetProperties,
  apiGetTenants,
  apiUpdateProperty,
  apiUpdateTenant,
} from "../lib/api";

export default function LandlordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [notice, setNotice] = useState(null);
  const [propertyForm, setPropertyForm] = useState(null);
  const [tenantForm, setTenantForm] = useState(null);
  const [propertyFormError, setPropertyFormError] = useState("");
  const [tenantFormError, setTenantFormError] = useState("");
  const [propertySaving, setPropertySaving] = useState(false);
  const [tenantSaving, setTenantSaving] = useState(false);
  const [propertyDeletingId, setPropertyDeletingId] = useState(null);
  const [tenantDeletingId, setTenantDeletingId] = useState(null);
  const noticeTimeoutRef = useRef(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const [propertyList, leaseList, openTaskList, tenantList] = await Promise.all([
          apiGetProperties().catch(() => []),
          // The following endpoints 404 for now → default to empty arrays
          api.get("/leases").catch(() => []),
          api.get("/tasks?status=open").catch(() => []),
          apiGetTenants().catch(() => []),
        ]);

        const normalizedProperties = ensureArray(propertyList);
        const normalizedLeases = ensureArray(leaseList);
        const normalizedTasks = ensureArray(openTaskList);
        const normalizedTenants = ensureArray(tenantList);

        setProperties(normalizedProperties);
        setLeases(normalizedLeases);
        setOpenTasks(normalizedTasks);
        setTenants(normalizedTenants);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const tenantPropertyLookup = useMemo(() => {
    return properties.reduce((acc, property) => {
      acc[property.id] = property.name || `Property #${property.id}`;
      return acc;
    }, {});
  }, [properties]);

  function showNotice(type, message) {
    setNotice({ type, message });
    if (noticeTimeoutRef.current) {
      clearTimeout(noticeTimeoutRef.current);
    }
    noticeTimeoutRef.current = setTimeout(() => {
      setNotice((current) => (current?.message === message ? null : current));
      noticeTimeoutRef.current = null;
    }, 4000);
  }

  function openPropertyEditor(property) {
    setPropertyForm({
      id: property.id,
      name: property.name || "",
      address: property.address || "",
    });
    setPropertyFormError("");
  }

  async function handlePropertySave(event) {
    event.preventDefault();
    if (!propertyForm) return;
    setPropertyFormError("");
    setPropertySaving(true);
    try {
      const payload = {
        name: propertyForm.name,
        address: propertyForm.address || null,
      };
      const updated = await apiUpdateProperty(propertyForm.id, payload);
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyForm.id ? { ...property, ...updated, ...payload } : property,
        ),
      );
      showNotice("success", "Property details updated.");
      setPropertyForm(null);
    } catch (error) {
      setPropertyFormError(error?.message || "Unable to update property. Please try again.");
    } finally {
      setPropertySaving(false);
    }
  }

  async function handlePropertyDelete(property) {
    if (propertyDeletingId) return;
    const confirmed = window.confirm(`Remove ${property.name || "this property"}?`);
    if (!confirmed) return;
    setPropertyDeletingId(property.id);
    try {
      await apiDeleteProperty(property.id);
      setProperties((prev) => prev.filter((item) => item.id !== property.id));
      showNotice("success", "Property removed.");
    } catch (error) {
      showNotice("error", error?.message || "Unable to delete property. Please try again.");
    } finally {
      setPropertyDeletingId(null);
    }
  }

  function openTenantEditor(tenant) {
    setTenantForm({
      id: tenant.id,
      name: tenant.name || "",
      email: tenant.email || "",
      phone: tenant.phone || "",
      propertyId: tenant.property_id ? String(tenant.property_id) : "",
    });
    setTenantFormError("");
  }

  async function handleTenantSave(event) {
    event.preventDefault();
    if (!tenantForm) return;
    setTenantFormError("");
    setTenantSaving(true);
    try {
      const payload = {
        name: tenantForm.name,
        email: tenantForm.email || null,
        phone: tenantForm.phone || null,
        property_id: tenantForm.propertyId ? Number(tenantForm.propertyId) : null,
      };
      const updated = await apiUpdateTenant(tenantForm.id, payload);
      setTenants((prev) =>
        prev.map((tenant) =>
          tenant.id === tenantForm.id ? { ...tenant, ...updated, ...payload } : tenant,
        ),
      );
      showNotice("success", "Renter profile updated.");
      setTenantForm(null);
    } catch (error) {
      setTenantFormError(error?.message || "Unable to update renter. Please try again.");
    } finally {
      setTenantSaving(false);
    }
  }

  async function handleTenantDelete(tenant) {
    if (tenantDeletingId) return;
    const confirmed = window.confirm(`Remove ${tenant.name || "this renter"}?`);
    if (!confirmed) return;
    setTenantDeletingId(tenant.id);
    try {
      await apiDeleteTenant(tenant.id);
      setTenants((prev) => prev.filter((item) => item.id !== tenant.id));
      showNotice("success", "Renter removed.");
    } catch (error) {
      showNotice("error", error?.message || "Unable to delete renter. Please try again.");
    } finally {
      setTenantDeletingId(null);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Preparing your landlord workspace...
      </section>
    );
  }

  return (
    <section className="space-y-10">
      {notice && (
        <div
          className={`rounded-3xl border p-4 text-sm shadow-lg backdrop-blur-xl ${
            notice.type === "success"
              ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-50"
              : "border-red-500/40 bg-red-500/20 text-red-50"
          }`}
        >
          {notice.message}
        </div>
      )}
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Landlord command hub</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Operational clarity in every lease</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Surface property metrics, manage leasing workflows, and dispatch maintenance — all with the same polished experience as
          your authentication screens.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <HighlightCard
          title="Properties"
          count={properties.length}
          href="/properties"
          accent="from-[#FFB400]/40 to-transparent"
        />
        <HighlightCard
          title="Leases"
          count={leases.length}
          href="/leases"
          accent="from-sky-400/30 to-transparent"
        />
        <HighlightCard
          title="Open tasks"
          count={openTasks.length}
          href="/tasks"
          accent="from-emerald-400/30 to-transparent"
        />
        <HighlightCard
          title="Renters"
          count={tenants.length}
          href="/tenants"
          accent="from-purple-400/30 to-transparent"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ManagementCard
          title="Managed properties"
          description="Keep inventory clean with quick edits or retirements."
          emptyMessage="No properties yet. Add one from the properties workspace to get started."
          items={properties}
          renderItem={(property) => (
            <ManagementRow
              key={property.id}
              title={property.name || "Unnamed property"}
              subtitle={property.address || `ID: ${property.id}`}
              meta={property.type || "Property"}
              onEdit={() => openPropertyEditor(property)}
              onDelete={() => handlePropertyDelete(property)}
              deleting={propertyDeletingId === property.id}
            />
          )}
          footerLink={{ href: "/properties", label: "View all properties" }}
        />

        <ManagementCard
          title="Resident roster"
          description="Fine-tune renter details and assignments without leaving your dashboard."
          emptyMessage="No renters recorded yet. Head to the tenant workspace to invite your first resident."
          items={tenants}
          renderItem={(tenant) => (
            <ManagementRow
              key={tenant.id}
              title={tenant.name || "Unnamed renter"}
              subtitle={tenant.email || tenant.phone || `Property #${tenant.property_id ?? "–"}`}
              meta={tenantPropertyLookup[tenant.property_id] || (tenant.property_id ? `Property #${tenant.property_id}` : "Unassigned")}
              onEdit={() => openTenantEditor(tenant)}
              onDelete={() => handleTenantDelete(tenant)}
              deleting={tenantDeletingId === tenant.id}
            />
          )}
          footerLink={{ href: "/tenants", label: "View all renters" }}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Quick launch workflows</h2>
          <p className="mt-2 text-sm text-slate-200">Everything you need to keep landlords and tenants aligned.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ActionCard title="Add tenant" href="/tenants" description="Capture leases and welcome packets in one step." />
            <ActionCard title="Upload lease" href="/leases" description="Store and version agreements with reminders." />
            <ActionCard title="Record payment" href="/billing" description="Track invoices, settlements, and payouts." />
            <ActionCard title="Message tenant" href="/messages" description="Send AI-crafted updates across email & SMS." />
            <ActionCard
              title="AI plan manager"
              href="/account"
              description="Let the assistant update billing plans and profile preferences."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Portfolio pulse</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-200">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Two renewals require review this week. Generate offers with AI-assisted comparables.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                Maintenance backlog trimmed by 35% after automations were enabled.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                New co-host invite awaiting approval — keep collaborators aligned in one workspace.
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#FFB400]/10 p-6 text-sm text-slate-900 shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Pro tip</h2>
            <p className="mt-2 text-sm text-slate-800">
              Connect your Stripe account to automate rent collection, reconciliation, and payout forecasting.
            </p>
            <Link
              href="/billing"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-slate-800"
            >
              Set up billing
            </Link>
          </div>
        </div>
      </section>

      {propertyForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Edit property</h2>
                <p className="mt-1 text-sm text-slate-200">Update key details to keep your records aligned.</p>
              </div>
              <button
                type="button"
                onClick={() => (!propertySaving ? setPropertyForm(null) : null)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:text-[#FFB400] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={propertySaving}
              >
                ✕
              </button>
            </div>

            {propertyFormError && (
              <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {propertyFormError}
              </div>
            )}

            <form onSubmit={handlePropertySave} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-200">
                Property name
                <input
                  value={propertyForm.name}
                  onChange={(event) =>
                    setPropertyForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="e.g. Oakwood Residence"
                  required
                  disabled={propertySaving}
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Address (optional)
                <input
                  value={propertyForm.address}
                  onChange={(event) =>
                    setPropertyForm((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="123 Market Street"
                  disabled={propertySaving}
                />
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => (!propertySaving ? setPropertyForm(null) : null)}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={propertySaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={propertySaving}
                >
                  {propertySaving ? "Saving" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tenantForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Edit renter</h2>
                <p className="mt-1 text-sm text-slate-200">Keep contact info current and assignments accurate.</p>
              </div>
              <button
                type="button"
                onClick={() => (!tenantSaving ? setTenantForm(null) : null)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:text-[#FFB400] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={tenantSaving}
              >
                ✕
              </button>
            </div>

            {tenantFormError && (
              <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {tenantFormError}
              </div>
            )}

            <form onSubmit={handleTenantSave} className="mt-6 space-y-5">
              <label className="block text-sm font-medium text-slate-200">
                Full name
                <input
                  value={tenantForm.name}
                  onChange={(event) =>
                    setTenantForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  required
                  disabled={tenantSaving}
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Email (optional)
                <input
                  type="email"
                  value={tenantForm.email}
                  onChange={(event) =>
                    setTenantForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="tenant@example.com"
                  disabled={tenantSaving}
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Phone (optional)
                <input
                  value={tenantForm.phone}
                  onChange={(event) =>
                    setTenantForm((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  placeholder="+1 (555) 123-4567"
                  disabled={tenantSaving}
                />
              </label>

              <label className="block text-sm font-medium text-slate-200">
                Assign to property
                <select
                  value={tenantForm.propertyId}
                  onChange={(event) =>
                    setTenantForm((prev) => ({
                      ...prev,
                      propertyId: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  disabled={tenantSaving}
                >
                  <option value="" className="text-slate-900">
                    Unassigned
                  </option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id} className="text-slate-900">
                      {property.name || `Property #${property.id}`}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => (!tenantSaving ? setTenantForm(null) : null)}
                  className="rounded-2xl border border-white/20 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={tenantSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={tenantSaving}
                >
                  {tenantSaving ? "Saving" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function HighlightCard({ title, count, href, accent }) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#FFB400]"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} aria-hidden />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200">{title}</p>
        <h3 className="mt-3 text-4xl font-semibold text-white">{count}</h3>
        <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
          View details <span>↗</span>
        </p>
      </div>
    </Link>
  );
}

function ManagementCard({ title, description, emptyMessage, items, renderItem, footerLink }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-200">{description}</p>
        </div>
        {footerLink && (
          <Link
            href={footerLink.href}
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-[#FFB400] hover:text-[#FFB400]"
          >
            Open
          </Link>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">{emptyMessage}</div>
        ) : (
          items.slice(0, 4).map((item) => renderItem(item))
        )}
      </div>

      {items.length > 4 && footerLink && (
        <Link
          href={footerLink.href}
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]"
        >
          {footerLink.label}
          <span>↗</span>
        </Link>
      )}
    </div>
  );
}

function ManagementRow({ title, subtitle, meta, onEdit, onDelete, deleting }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <div>
        <p className="font-semibold text-white">{title}</p>
        {subtitle && <p className="text-xs text-slate-300">{subtitle}</p>}
        {meta && <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-slate-400">{meta}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-[#FFB400] hover:text-[#FFB400]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-200 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Removing" : "Delete"}
        </button>
      </div>
    </div>
  );
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.results)) return value.results;
  return [];
}

function ActionCard({ title, href, description }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-lg transition hover:-translate-y-1 hover:border-[#FFB400] hover:shadow-2xl"
    >
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-xs text-slate-300">{description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400]">
        Open <span className="transition group-hover:translate-x-1">↗</span>
      </span>
    </Link>
  );
}
