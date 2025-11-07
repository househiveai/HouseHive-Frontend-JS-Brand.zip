import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiAddReminder, apiGetReminders } from "../lib/api";

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

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const reminderList = await apiGetReminders();
      setReminders(reminderList);
    } catch (err) {
      setError(err?.message || "Unable to load reminders.");
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async () => {
    if (!title) {
      alert("Enter a reminder title");
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
  }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Reminders</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-400 mb-6 max-w-2xl">
        <h2 className="text-lg text-yellow-300 mb-2">Add New Reminder</h2>
        <input
          placeholder="Reminder Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-3"
        />
        <button
          onClick={addReminder}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Add Reminder
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mb-4 bg-red-900/60 border border-red-500/60 text-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <p className="text-gray-500">No reminders yet.</p>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              className="p-4 mb-3 bg-zinc-900 border border-zinc-700 rounded-xl"
            >
              <div className="font-semibold text-yellow-300">{r.title}</div>
              <div className="text-gray-400 text-sm">
                {r.due_date ? new Date(r.due_date).toLocaleDateString() : "No date set"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
