import { useCallback, useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiAddTask } from "../lib/api";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function TasksPage() {
  return (
    <RequireAuth>
      <TasksContent />
    </RequireAuth>
  );
}

function TasksContent() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const snapshot = await fetchPortfolioSnapshot();
      setTasks(snapshot.tasks);
      setProperties(snapshot.properties);
      setMetrics(snapshot.metrics);
      if (snapshot.errorSummary) {
        setError(snapshot.errorSummary);
      } else if (snapshot.errors?.length) {
        setError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
      }
    } catch (err) {
      setError(err?.message || "Unable to load tasks.");
      setMetrics(createEmptyMetrics());
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = async () => {
    if (!title) {
      setError("Enter task title");
      return;
    }

    setError("");

    try {
      await apiAddTask({
        title,
        description,
        property_id: propertyId ? Number(propertyId) : null,
      });
      setTitle("");
      setDescription("");
      setPropertyId("");
      await load();
    } catch (err) {
      setError(err?.message || "Unable to add task.");
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Workflow board</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Maintenance & operations tasks</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Assign work orders, capture notes, and keep your team aligned in a sleek glassmorphic command center.
        </p>
      </header>

      <DashboardBridge metrics={metrics} focus="Tasks" />

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold text-white">Add new task</h2>
          <p className="mt-1 text-sm text-slate-200">Log upcoming work and assign it to the right property.</p>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            />
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
            >
              <option value="">Assign to property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id} className="text-slate-900">
                  {property.name}
                </option>
              ))}
            </select>
            <button
              onClick={addTask}
              className="rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
            >
              Add task
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-semibold">Open tasks</h2>
          <p className="mt-1 text-sm text-slate-200">HiveBot keeps team members updated and follows up automatically.</p>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-300">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
                No tasks yet. Log your first item to track it here.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  <p className="text-white">{task.title}</p>
                  {task.description && <p className="mt-1 text-xs text-slate-400">{task.description}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
