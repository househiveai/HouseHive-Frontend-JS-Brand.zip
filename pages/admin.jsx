import { useState, useEffect } from "react";
import { apiAdminUsers, apiAdminSetPlan, apiAdminDeleteUser } from "../lib/api";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const load = async () => setUsers(await apiAdminUsers());
  useEffect(() => { load(); }, []);

  const changePlan = async (user_id, plan) => {
    await apiAdminSetPlan(user_id, plan);
    load();
  };

  const remove = async (user_id) => {
    if (confirm("Delete this user?")) {
      await apiAdminDeleteUser(user_id);
      load();
    }
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        Admin Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-3 border-b border-zinc-700">Email</th>
              <th className="p-3 border-b border-zinc-700">Plan</th>
              <th className="p-3 border-b border-zinc-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800">
                <td className="p-3 border-b border-zinc-700">{u.email}</td>
                <td className="p-3 border-b border-zinc-700 text-yellow-400">
                  {u.plan}
                </td>
                <td className="p-3 border-b border-zinc-700">
                  <select
                    value={u.plan}
                    onChange={(e) => changePlan(u.id, e.target.value)}
                    className="bg-zinc-800 text-white rounded p-2 mr-3"
                  >
                    <option value="Free">Free</option>
                    <option value="Cohost">Cohost</option>
                    <option value="Pro">Pro</option>
                    <option value="Agency">Agency</option>
                  </select>
                  <button
                    onClick={() => remove(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
