import { useEffect, useState } from 'react'
import { apiGetProperties, apiGetTasks, apiMe } from '../lib/api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [properties, setProperties] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user + data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await apiMe()
        const propRes = await apiGetProperties()
        const taskRes = await apiGetTasks()
        setUser(userRes)
        setProperties(propRes)
        setTasks(taskRes)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-[#FFB400] text-2xl">
        Loading your dashboard...
      </div>
    )

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#FFB400] mb-6">
        🏠 Welcome Back, {user?.name || 'User'}
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Plan: <span className="text-[#FFB400]">{user?.plan}</span> • Role: {user?.role}
      </p>

      {/* Properties Section */}
      <div className="w-full max-w-5xl bg-[#111111] rounded-2xl p-6 mb-8 shadow-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-semibold text-[#FFB400] mb-4">Your Properties</h2>
        {properties.length === 0 ? (
          <p className="text-gray-400">No properties yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#FFB400] transition"
              >
                <h3 className="text-xl font-semibold text-[#FFB400] mb-1">{p.name}</h3>
                <p className="text-gray-400 text-sm">{p.address}</p>
                {p.rent && (
                  <p className="text-gray-300 mt-2 text-sm">Rent: ${p.rent}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Section */}
      <div className="w-full max-w-5xl bg-[#111111] rounded-2xl p-6 shadow-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-semibold text-[#FFB400] mb-4">Maintenance Tracker</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No maintenance tasks.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-gray-400">
                  <th className="py-2 px-3">Task</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition"
                  >
                    <td className="py-2 px-3 text-white">{t.task}</td>
                    <td
                      className={`py-2 px-3 font-semibold ${
                        t.status === 'Completed'
                          ? 'text-green-400'
                          : t.status === 'In Progress'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {t.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} HouseHive.ai
      </footer>
    </div>
  )
}
