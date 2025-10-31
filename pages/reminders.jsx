import { useEffect, useState } from 'react'
import { apiGetReminders, apiCreateReminder, apiDeleteReminder, apiGetTenants, apiGetProperties } from '../lib/api'

export default function Reminders(){
  const [reminders, setReminders] = useState([])
  const [tenants, setTenants] = useState([])
  const [props, setProps] = useState([])
  const [form, setForm] = useState({tenant_id:'', property_id:'', title:'Rent Due', message:'Your rent is due.', due_date:''})
  const [msg, setMsg] = useState('')

  const load = async ()=>{
    try{
      const [r,t,p] = await Promise.all([apiGetReminders(), apiGetTenants(), apiGetProperties()])
      setReminders(r); setTenants(t); setProps(p)
    }catch(e){ setMsg(e.message) }
  }
  useEffect(()=>{ load() },[])

  const add = async ()=>{
    setMsg('')
    try{
      const payload = {
        ...form,
        tenant_id: form.tenant_id? Number(form.tenant_id): null,
        property_id: form.property_id? Number(form.property_id): null
      }
      await apiCreateReminder(payload)
      setForm({tenant_id:'', property_id:'', title:'Rent Due', message:'Your rent is due.', due_date:''})
      load()
    }catch(e){ setMsg(e.message) }
  }

  const del = async(id)=>{
    if(!confirm('Delete this reminder?')) return
    await apiDeleteReminder(id)
    load()
  }

  return (
    <div className="page">
      <h1>Rent Reminders</h1>
      <div className="card">
        <div className="row gap">
          <select className="input" value={form.tenant_id} onChange={e=>setForm({...form, tenant_id:e.target.value})}>
            <option value="">Select Tenant (optional)</option>
            {tenants.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="input" value={form.property_id} onChange={e=>setForm({...form, property_id:e.target.value})}>
            <option value="">Select Property (optional)</option>
            {props.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <input className="input" placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})}/>
          <input className="input" type="date" value={form.due_date} onChange={e=>setForm({...form, due_date:e.target.value})}/>
          <button className="btn-primary" onClick={add}>Add Reminder</button>
        </div>
        {!!msg && <p className="text-red-400 mt-2">{msg}</p>}
      </div>

      <div className="list">
        {reminders.map(r=>(
          <div key={r.id} className="item">
            <div>
              <div className="title">{r.title} • Due {r.due_date}</div>
              <div className="muted">{r.message}</div>
            </div>
            <div className="muted">TenantID: {r.tenant_id || '—'} • PropertyID: {r.property_id || '—'}</div>
            <button className="btn" onClick={()=>del(r.id)}>Delete</button>
          </div>
        ))}
        {reminders.length===0 && <p className="muted">No reminders yet.</p>}
      </div>
    </div>
  )
}
