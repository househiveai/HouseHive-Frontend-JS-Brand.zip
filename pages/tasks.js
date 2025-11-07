import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiAddTask, apiGetTasks, apiGetProperties } from "../lib/api";

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

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const [tasksData, propertiesData] = await Promise.all([
        apiGetTasks(),
        apiGetProperties(),
      ]);
      setTasks(tasksData);
      setProperties(propertiesData);
    } catch (err) {
      setError(err?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title) {
      alert("Enter task title");
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
  }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Maintenance Tasks</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-yellow-400 mb-6 max-w-2xl">
        <h2 className="text-lg text-yellow-300 mb-2">Add New Task</h2>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
        />
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-2 mb-3"
        >
          <option value="">Assign to Property</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          onClick={addTask}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:opacity-90"
        >
          Add Task
        </button>
      </div>

      {error && (
        <div className="max-w-2xl mb-4 bg-red-900/60 border border-red-500/60 text-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="max-w-2xl">
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="p-4 mb-3 bg-zinc-900 border border-zinc-700 rounded-xl"
            >
              <div className="font-semibold text-yellow-300">{t.title}</div>
              <div className="text-gray-400 text-sm">{t.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
