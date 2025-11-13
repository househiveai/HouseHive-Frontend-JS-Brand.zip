"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";


const STATUS_OPTIONS = [
  { value: "new", label: "New", badgeClass: "bg-white/10 text-slate-200" },
  {
    value: "in-progress",
    label: "In progress",
    badgeClass: "bg-[#FFB400]/10 text-[#FFB400]",
  },
  {
    value: "scheduled",
    label: "Scheduled",
    badgeClass: "bg-sky-400/20 text-sky-200",
  },
  {
    value: "resolved",
    label: "Resolved",
    badgeClass: "bg-emerald-400/20 text-emerald-200",
  },
];

const vendorDirectory = [
  { id: "v1", name: "Brightline Plumbing" },
  { id: "v2", name: "ClimateCraft HVAC" },
  { id: "v3", name: "Evergreen Electrical" },
  { id: "v4", name: "Summit Roofing" },
];

const propertyRoster = [
  "Maple Grove Apartments",
  "Townhome 104",
  "Lakeside Villas",
  "Unit 203",
];

const getStatusMeta = (status) =>
  STATUS_OPTIONS.find((option) => option.value === status) ?? STATUS_OPTIONS[0];

export default function Maintenance() {
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      title: "Leaking faucet in Unit 203",
      description: "Resident reported a persistent leak under the kitchen sink.",
      status: "in-progress",
      reportedAt: "Reported 2 days ago",
      property: "Unit 203",
    },
    {
      id: "req-2",
      title: "HVAC not cooling — Townhome 104",
      description: "Initial triage completed, tech en route.",
      status: "resolved",
      reportedAt: "Technician scheduled today",
      property: "Townhome 104",
    },
    {
      id: "req-3",
      title: "Lobby lighting retrofit",
      description: "Awaiting confirmation for LED upgrade timeline.",
      status: "scheduled",
      reportedAt: "Awaiting vendor confirmation",
      property: "Maple Grove Apartments",
    },
  ]);
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    property: propertyRoster[0],
  });
  const [vendorMessage, setVendorMessage] = useState({
    property: propertyRoster[0],
    vendors: new Set([vendorDirectory[0].id]),
    subject: "",
    body: "",
  });
  const [activityLog, setActivityLog] = useState([]);
  const [confirmation, setConfirmation] = useState("");
  const [vendorConfirmation, setVendorConfirmation] = useState("");

  const activeRequests = useMemo(
    () =>
      [...requests]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((request) => ({
          ...request,
          statusMeta: getStatusMeta(request.status),
        })),
    [requests],
  );

  const handleRequestChange = (field, value) => {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
    setConfirmation("");
  };

  const handleSubmitRequest = (event) => {
    event.preventDefault();
    if (!requestForm.title.trim() || !requestForm.description.trim()) {
      setConfirmation("Add a title and description to submit a request.");
      return;
    }

    const timestamp = new Date();
    const newRequest = {
      id: `req-${timestamp.getTime()}`,
      title: requestForm.title.trim(),
      description: requestForm.description.trim(),
      status: "new",
      reportedAt: `Added ${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      property: requestForm.property,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setActivityLog((prev) => [
      {
        id: `log-${timestamp.getTime()}`,
        message: `Request “${newRequest.title}” created for ${newRequest.property}.`,
        createdAt: timestamp.toISOString(),
      },
      ...prev,
    ]);
    setConfirmation("Request submitted and added to the active queue.");
    setRequestForm({ title: "", description: "", property: propertyRoster[0] });
  };

  const handleStatusChange = (requestId, status) => {
    const requestToUpdate = requests.find((request) => request.id === requestId);

    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
            }
          : request,
      ),
    );

    if (requestToUpdate) {
      setActivityLog((prev) => [
        {
          id: `log-${requestId}-${status}-${Date.now()}`,
          message: `Status for “${requestToUpdate.title}” updated to ${getStatusMeta(status).label}.`,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const handleVendorSelection = (vendorId) => {
    setVendorMessage((prev) => {
      const nextVendors = new Set(prev.vendors);
      if (nextVendors.has(vendorId)) {
        nextVendors.delete(vendorId);
      } else {
        nextVendors.add(vendorId);
      }
      return { ...prev, vendors: nextVendors };
    });
    setVendorConfirmation("");
  };

  const handleVendorMessageChange = (field, value) => {
    setVendorMessage((prev) => ({ ...prev, [field]: value }));
    setVendorConfirmation("");
  };

  const handleSendVendorLog = (event) => {
    event.preventDefault();
    if (vendorMessage.vendors.size === 0) {
      setVendorConfirmation("Select at least one vendor to notify.");
      return;
    }
    if (!vendorMessage.body.trim()) {
      setVendorConfirmation("Include a brief update before sending.");
      return;
    }

    const timestamp = new Date();
    const recipients = vendorDirectory
      .filter((vendor) => vendorMessage.vendors.has(vendor.id))
      .map((vendor) => vendor.name)
      .join(", ");

    setActivityLog((prev) => [
      {
        id: `log-vendor-${timestamp.getTime()}`,
        message: `Vendor log sent to ${recipients} for ${vendorMessage.property}.`,
        createdAt: timestamp.toISOString(),
      },
      ...prev,
    ]);

    setVendorConfirmation("Vendor log recorded and message queued for delivery.");
    setVendorMessage({
      property: vendorMessage.property,
      vendors: new Set(vendorMessage.vendors),
      subject: "",
      body: "",
    });
  };

  const recentActivity = activityLog.slice(0, 6);

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Maintenance HQ</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Coordinated upkeep made elegant</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Triage requests, assign vendors, and keep residents informed — all within a modern interface that mirrors your new
          auth experience.
        </p>
      </header>

      <DashboardBridge metrics={metrics} dashboardMetrics={metrics} focus="Maintenance" />

      {metricsError && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{metricsError}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Active requests</h2>
          <p className="mt-1 text-sm text-slate-200">High-priority items surfaced automatically by HiveBot.</p>
          <ul className="mt-6 space-y-4 text-sm text-slate-200">
            {activeRequests.map((request) => (
              <li key={request.id} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{request.title}</p>
                    <p className="text-xs text-slate-400">{request.reportedAt}</p>
                    <p className="mt-2 text-xs text-slate-300">
                      <span className="font-semibold text-white">Property:</span> {request.property}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">{request.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${request.statusMeta.badgeClass}`}
                  >
                    {request.statusMeta.label}
                  </span>
                </div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Update progress
                  <select
                    value={request.status}
                    onChange={(event) => handleStatusChange(request.id, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Log a request</h2>
            <p className="mt-1 text-sm text-slate-200">Collect all the context your vendors need to respond quickly.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmitRequest}>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Property
                <select
                  value={requestForm.property}
                  onChange={(event) => handleRequestChange("property", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                >
                  {propertyRoster.map((property) => (
                    <option key={property} value={property} className="bg-slate-900 text-slate-100">
                      {property}
                    </option>
                  ))}
                </select>
              </label>
              <input
                type="text"
                value={requestForm.title}
                onChange={(event) => handleRequestChange("title", event.target.value)}
                placeholder="Task title"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />
              <textarea
                value={requestForm.description}
                onChange={(event) => handleRequestChange("description", event.target.value)}
                placeholder="Describe the issue…"
                rows={4}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Submit request
                </button>
                <span>or</span>
                <Link href="/messages" className="font-semibold text-[#FFB400] hover:text-[#f39c00]">
                  Ask HiveBot to notify the tenant
                </Link>
              </div>
              {confirmation && <p className="text-xs text-emerald-300">{confirmation}</p>}
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Maintenance messages</h2>
            <p className="mt-1 text-sm text-slate-200">Coordinate outreach without leaving the upkeep workspace.</p>

            {messageStatus && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] ${
                  messageStatus.startsWith("Add")
                    ? "border-red-500/40 bg-red-500/10 text-red-200"
                    : "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                }`}
              >
                {messageStatus}
              </div>
            )}

            <form onSubmit={handleSendMaintenanceMessage} className="mt-6 space-y-4 text-sm">
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Recipient
                <select
                  value={messageRecipient}
                  onChange={(event) => setMessageRecipient(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                >
                  <option value="Vendor">Vendor</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Internal team">Internal team</option>
                </select>
              </label>

              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Message
                <textarea
                  rows={3}
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder="Share scheduling updates, access notes, or next steps."
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
              >
                Send maintenance update
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <h3 className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent outreach</h3>
              <ul className="space-y-3 text-sm text-slate-200">
                {messageLog.map((entry, index) => (
                  <li
                    key={`${entry.recipient}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{entry.recipient}</p>
                        <p className="mt-1 text-sm text-white">{entry.body}</p>
                      </div>
                      <span className="text-xs text-slate-400">{entry.timestamp}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#FFB400]/10 p-6 text-sm text-slate-900 shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">Automation spotlight</h2>
            <p className="mt-2 text-sm text-slate-800">
              Auto-create maintenance reminders after every resolved ticket to ensure follow-up surveys and inspection photos are captured.
            </p>
            <Link
              href="/reminders"
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-slate-800"
            >
              Manage reminders
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Create vendor log</h2>
            <p className="mt-1 text-sm text-slate-200">
              Broadcast updates and coordinate the right vendors for a property-level issue.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSendVendorLog}>
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Property
                <select
                  value={vendorMessage.property}
                  onChange={(event) => handleVendorMessageChange("property", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
                >
                  {propertyRoster.map((property) => (
                    <option key={property} value={property} className="bg-slate-900 text-slate-100">
                      {property}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="space-y-2 text-xs text-slate-200">
                <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Vendors</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {vendorDirectory.map((vendor) => (
                    <label
                      key={vendor.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm hover:border-[#FFB400]/60"
                    >
                      <input
                        type="checkbox"
                        checked={vendorMessage.vendors.has(vendor.id)}
                        onChange={() => handleVendorSelection(vendor.id)}
                        className="h-4 w-4 rounded border-white/20 bg-slate-900 text-[#FFB400] focus:ring-[#FFB400]"
                      />
                      {vendor.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <input
                type="text"
                value={vendorMessage.subject}
                onChange={(event) => handleVendorMessageChange("subject", event.target.value)}
                placeholder="Subject (optional)"
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />

              <textarea
                value={vendorMessage.body}
                onChange={(event) => handleVendorMessageChange("body", event.target.value)}
                placeholder="Share progress, attachments, or scheduling details…"
                rows={4}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FFB400] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Send update
                </button>
                <span>or</span>
                <Link href="/vendors" className="font-semibold text-[#FFB400] hover:text-[#f39c00]">
                  Manage vendor profiles
                </Link>
              </div>
              {vendorConfirmation && <p className="text-xs text-emerald-300">{vendorConfirmation}</p>}
            </form>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-semibold text-white">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-200">Track automatic updates from requests and vendor outreach.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-200">
              {recentActivity.length === 0 ? (
                <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400">
                  Nothing logged yet — actions you take will show here.
                </li>
              ) : (
                recentActivity.map((entry) => (
                  <li key={entry.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="font-semibold text-white">{entry.message}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
}
