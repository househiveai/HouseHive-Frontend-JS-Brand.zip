import { useCallback, useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiAddReminder } from "../lib/api";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function RemindersPage() {
  return (
    <RequireAuth>
      <RemindersContent />
    </RequireAuth>
  );
}

function RemindersContent() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const snapshot = await fetchPortfolioSnapshot();
      setReminders(snapshot.reminders);
      setMetrics(snapshot.metrics);
      if (snapshot.errorSummary) {
        setError(snapshot.errorSummary);
      } else if (snapshot.errors?.length) {
        setError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
      }
    } catch (err) {
      setError(err?.message || "Unable to load reminders.");
      setMetrics(createEmptyMetrics());
    } finally {
      setLoading(false);
    }
  }, []);

  const addReminder = async () => {
    if (!title) {
      setError("Enter a reminder title");
      return;
    }

    setError("");

    try {
      await apiAddReminder({ title, due_date: dueDate || null });
      setTitle("");
      setDueDate("");
      await load();
    } catch (err) {
      setError(err?.message || "Unable to add reminder.");
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Operational nudges</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">HouseHive reminders</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Schedule renewals, inspections, and follow-ups with the same glassmorphic polish as your authentication experience.
        </p>
      </header>

      <DashboardBridge metrics={metrics} focus="Reminders" />

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Add new reminder</h2>
          <p className="mt-1 text-sm text-slate-200">Keep your team on track with perfectly timed nudges.</p>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Reminder title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            />
            <button
              onClick={addReminder}
              className="rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
            >
              Add reminder
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold">Upcoming reminders</h2>
          <p className="mt-1 text-sm text-slate-200">HiveBot syncs these into dashboards and sends gentle nudges.</p>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-300">Loading reminders...</p>
            ) : reminders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                No reminders yet. Create one to keep everyone aligned.
              </div>
            ) : (
              reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  <p className="text-white">{reminder.title}</p>
                  <p className="text-xs text-slate-400">
                    {reminder.due_date
                      ? new Date(reminder.due_date).toLocaleDateString()
                      : "No due date set"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
