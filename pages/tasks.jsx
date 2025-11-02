import { useEffect, useState } from "react";
import { apiGetProperties, apiGetTasks, apiCreateTask } from "../lib/api";

export default function Tasks() {
  const [properties, setProperties] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");

  const load = async () => {
    const props = await apiGetProperties();
    setProperties(props);
    setTasks(await apiGetTasks());
  };

  useEffect(() => {
    load();
  }, []);

  const addTask = async () => {
    if (!propertyId || !title) return alert("Please select a property and title.");
    await apiCreateTask({
      property_id: propertyId,
      title,
      description,
      urgent,
      status: "open",
      assignee,
      priority,
      due_date: dueDate,
    });
    setTitle(""); setDescription(""); setUrgent(false);
    setAssignee(""); setPriority("normal"); setDueDate("");
    setTasks(await apiGetTasks());
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        Maintenance Tasks
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-2xl">
        <label className="block text-zinc-400 mb-1">Property</label>
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(Number(e.target.value))}
          className="bg-zinc-800 text-white rounded p-3 w-full mb-3"
        >
          <option value="">Select Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-3"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-3"
        />
        <div className="flex items-center space-x-3 mb-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
            />
            <span>Urgent</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-zinc-800 rounded p-2"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-zinc-800 rounded p-2"
          />
        </div>
        <input
          placeholder="Assignee (vendor/tech)"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="bg-zinc-800 rounded p-3 w-full mb-3"
        />

        <button
          onClick={addTask}
          className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded hover:opacity-90"
        >
          Add Task
        </button>
      </div>

      <div className="mt-10">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 mb-3"
          >
            <div className="text-xl font-semibold text-yellow-400">{t.title}</div>
            <div className="text-zinc-400 text-sm">
              {t.priority} • {t.status} {t.urgent ? "• 🔥" : ""}{" "}
              {t.due_date ? `• Due ${t.due_date}` : ""}
            </div>
            {t.assignee && (
              <div className="text-zinc-500 text-sm">Assigned to: {t.assignee}</div>
            )}
            <p className="text-zinc-400 mt-1">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
