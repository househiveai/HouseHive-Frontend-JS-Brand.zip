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
  const [dueDate, setDueDate] = useState('') // ✅ renamed from "due" to match your input

  // Load properties & tasks
  const load = async () => {
    const p = await apiGetProperties()
    setProps(p)
    setPropertyId(p[0]?.id)
    setTasks(await apiGetTasks())
  }

  useEffect(() => {
    load()
  }, [])

  // Add a new maintenance task
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
      due_date: dueDate, // ✅ matches backend key
    })
    setTitle('')
    setDescription('')
    setUrgent(false)
    setAssignee('')
    setPriority('normal')
    setDueDate('')
    setTasks(await apiGetTasks())
  }

  return (
    <div className="col">
      <div className="card">
        <h2 className="h1">Create Maintenance Task</h2>
        <div className="col" style={{ maxWidth: 720 }}>
          <label>Property</label>
          <select
            value={propertyId || ''}
            onChange={(e) => setPropertyId(Number(e.target.value))}
          >
            {props.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <label className="row">
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
              />{' '}
              Urgent
            </label>

            <label>
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>

            <label>
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-zinc-900 text-white rounded-xl p-3 w-full border border-zinc-700 mt-3 cursor-pointer hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-150"
                style={{
                  colorScheme: 'dark',
                }}
              />
            </label>

            <label>
              Assignee
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Vendor/Tech name or email"
              />
            </label>
          </div>

          <button className="btn primary mt-4" onClick={add}>
            Add Task
          </button>
        </div>
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {tasks.map((t) => (
          <div className="card" key={t.id}>
            <div className="h1">{t.title}</div>
            <div style={{ opacity: 0.85 }}>
              #{t.property_id} • {t.status}{' '}
              {t.urgent ? '• 🔥 Urgent' : ''} • {t.priority}{' '}
              {t.due_date ? '• Due ' + t.due_date : ''}
            </div>
            {t.assignee && (
              <div style={{ opacity: 0.85 }}>Assigned to: {t.assignee}</div>
            )}
            <p style={{ opacity: 0.8 }}>{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
