// pages/dashboard.js
import { useEffect, useState } from 'react'
import { apiGetProperties, apiGetTasks, apiGetTenants, apiGetReminders } from '../lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    tasks: 0,
    tenants: 0,
    reminders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [props, tasks, tenants, reminders] = await Promise.all([
          apiGetProperties(),
          apiGetTasks(),
          apiGetTenants(),
          apiGetReminders()
        ])
        setStats({
          properties: props.length,
          tasks: tasks.length,
          tenants: tenants.length,
          reminders: reminders.length
        })
      } catch (e) {
        console.error('Error loading dashboard:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="col" style={{ maxWidth: 1000 }}>
      <div className="h1">Dashboard</div>

      {/* Stat cards grid */}
      <div
        className="grid gap-5 mt-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <StatCard title="Properties" value={stats.properties} icon="🏠" color="#FFB400" />
        <StatCard title="Active Tasks" value={stats.tasks} icon="🧰" color="#00C2FF" />
        <StatCard title="Tenants" value={stats.tenants} icon="👥" color="#52FFB4" />
        <StatCard title="Reminders" value={stats.reminders} icon="⏰" color="#FF6B6B" />
      </div>

      {/* Quick action panel */}
      <div className="card" style={{ marginTop: 32 }}>
        <div className="h1">Quick Actions</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <ActionButton link="/properties" label="Add Property" emoji="🏡" />
          <ActionButton link="/tasks" label="Create Task" emoji="🧾" />
          <ActionButton link="/tenants" label="Add Tenant" emoji="👤" />
          <ActionButton link="/reminders" label="New Reminder" emoji="⏳" />
        </div>
      </div>

      {/* AI activity log preview */}
      <div className="card" style={{ marginTop: 32 }}>
        <div className="h1">AI Assistant Insights</div>
        <p style={{ opacity: 0.9 }}>
          HiveBot is analyzing your portfolio and automating reminders and maintenance tasks.
        </p>
        <p style={{ fontStyle: 'italic', color: '#aaa', marginTop: 8 }}>
          Example: “2 properties have open maintenance requests. 1 tenant rent reminder scheduled.”
        </p>
      </div>

      {!loading && stats.properties === 0 && (
        <div className="card" style={{ marginTop: 20, textAlign: 'center' }}>
          <p>No data yet. Add your first property to get started!</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className="card flex flex-col items-center justify-center text-center"
      style={{
        borderColor: color,
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        padding: '30px 20px',
      }}
    >
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: 8 }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: '700', color }}>{value}</div>
    </div>
  )
}

function ActionButton({ link, label, emoji }) {
  return (
    <a
      href={link}
      className="card flex flex-col items-center justify-center hover:opacity-90"
      style={{
        background: '#111',
        textAlign: 'center',
        padding: '20px 10px',
        border: '1px solid #2a2a2a',
      }}
    >
      <div style={{ fontSize: '1.8rem' }}>{emoji}</div>
      <div style={{ fontWeight: '600', marginTop: 8, color: '#FFB400' }}>{label}</div>
    </a>
  )
}
