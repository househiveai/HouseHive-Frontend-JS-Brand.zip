import { useState, useEffect } from "react";
import { apiGetReminders, apiCreateReminder } from "../lib/api";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const load = async () => setReminders(await apiGetReminders());
  useEffect(() => { load(); }, []);

  const addReminder = async () => {
    if (!title || !date) return alert("Please fill in title and date");
    await apiCreateReminder({ title, due_date: date, notes });
    setTitle(""); setDate(""); setNotes("");
    load();
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Rent Reminders</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-xl">
        <input
          placeholder="Reminder Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-2"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-3"
        />
        <button
          onClick={addReminder}
          className="bg-yellow-400 text-black py-2 px-6 rounded font-bold hover:opacity-90"
        >
          Add Reminder
        </button>
      </div>

      <div className="mt-10">
        {reminders.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 mb-3"
          >
            <div className="text-xl font-semibold text-yellow-400">
              {r.title}
            </div>
            <div className="text-zinc-400">Due: {r.due_date}</div>
            <div className="text-zinc-500 text-sm">{r.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
