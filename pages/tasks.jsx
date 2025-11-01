import { useEffect, useState } from 'react'
import { apiGetProperties, apiCreateTask, apiGetTasks } from '../lib/api'

export default function Tasks() {
  const [props, setProps] = useState([])
  const [tasks, setTasks] = useState([])
  const [propertyId, setPropertyId] = useState(undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('normal')
  const [dueDate, setDueDate] = useState('')

  // Load properties and tasks
  const load = async () => {
    const p = await apiGetProperties()
    setProps(p)
    setPropertyId(p[0]?.id)
    setTasks(await apiGetTasks())
  }

  useEffect(() => {
    load()
  }, [])

  // Add new maintenance task
  const add = async () => {
    if (!propertyId || !title) return
    await apiCreateTask({
      property_id: propertyId,
      title,
      description,
      urgent,
      status: 'open',
      assignee,
      priority,
      due_date: dueDate,
    })
    setTitle('')
    setDescription('')
    setUrgent(false)
    setAssignee('')
    setPriority('normal')
    setDueDate('')
    setTasks(await apiGetTasks())
  }

  // Helper: check if overdue
  const isOverdue = (dateStr) => {
    if (!dateStr) return false
    const today = new Date()
    const due = new Date(dateStr)
    return due < today && due.toDateString() !== today.toDateString()
  }

  return (
    <div className="col px-4 py-6">
      <div className="card bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#FFB400] mb-4">
          Create Maintenance Task
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <div className="col-span-1">
            <label className="text-gray-300">Property</label>
            <select
              value={propertyId || ''}
              onChange={(e) => setPropertyId(Number(e.target.value))}
              className="w-full p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
            >
              {props.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
            />
          </div>

          <div className="flex flex-wrap gap-4 md:col-span-2">
            <label className="flex items-center text-gray-300 gap-2">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
                className="accent-[#FFB400]"
              />
              Urgent Task
            </label>

            <label className="text-gray-300">
              Priority:
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="ml-2 p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="text-gray-300">
              Due Date:
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="ml-2 bg-zinc-900 text-white rounded-lg p-2 border border-zinc-700 cursor-pointer hover:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400] transition-all duration-150"
                style={{ colorScheme: 'dark' }}
              />
            </label>

            <label className="text-gray-300">
              Assignee:
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Vendor / Tech name or email"
                className="ml-2 p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
              />
            </label>
          </div>
        </div>

        <button
          className="mt-6 bg-[#FFB400] text-black font-semibold py-2 px-6 rounded-xl hover:opacity-90 transition"
          onClick={add}
        >
          Add Task
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-[#FFB400] mb-4">
          Active Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((t) => {
              const overdue = isOverdue(t.due_date)
              const urgentColor = t.urgent ? 'text-red-400' : 'text-gray-300'
              const overdueColor = overdue ? 'text-red-500 font-semibold' : ''
              return (
                <div
                  key={t.id}
                  className={`card bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 ${
                    t.urgent ? 'border-red-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`text-xl font-semibold ${urgentColor}`}>
                      {t.title} {t.urgent && '🔥'}
                    </h3>
                    <span
                      className={`text-sm ${overdueColor}`}
                      title={
                        overdue
                          ? 'This task is overdue'
                          : t.due_date
                          ? 'Due on ' + t.due_date
                          : ''
                      }
                    >
                      {t.due_date
                        ? overdue
                          ? `⏰ Overdue (${t.due_date})`
                          : `📅 Due ${t.due_date}`
                        : 'No due date'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{t.description}</p>
                  <p className="text-gray-500 text-sm">
                    Property #{t.property_id} • {t.priority.toUpperCase()} •{' '}
                    {t.status}
                    {t.assignee && ` • Assigned to: ${t.assignee}`}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
