import { useEffect, useState } from "react";
import { apiGetProperties, apiGetTasks } from "../lib/api";

export default function Dashboard() {
  const [props, setProps] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    apiGetProperties().then(setProps);
    apiGetTasks().then(setTasks);
  }, []);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">Properties</h2>
          {props.length === 0 && (
            <p className="text-zinc-500">No properties yet.</p>
          )}
          {props.map((p) => (
            <div key={p.id} className="border-b border-zinc-700 py-2">
              <div className="font-semibold">{p.name}</div>
              <div className="text-zinc-400 text-sm">{p.address}</div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">Tasks</h2>
          {tasks.length === 0 && <p className="text-zinc-500">No tasks yet.</p>}
          {tasks.map((t) => (
            <div key={t.id} className="border-b border-zinc-700 py-2">
              <div className="font-semibold">{t.title}</div>
              <div className="text-zinc-400 text-sm">
                {t.priority} • {t.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
