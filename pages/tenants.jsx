import { useEffect, useState } from 'react'
import { apiGetTenants, apiCreateTenant, apiDeleteTenant, apiGetProperties } from '../lib/api'

export default function Tenants(){
  const [tenants, setTenants] = useState([])
  const [props, setProps] = useState([])
  const [form, setForm] = useState({name:'', email:'', phone:'', property_id:'', unit:'', notes:''})
  const [msg, setMsg] = useState('')

  const load = async ()=>{
    try{
      const [t,p] = await Promise.all([apiGetTenants(), apiGetProperties()])
      setTenants(t); setProps(p)
    }catch(e){ setMsg(e.message) }
  }

  useEffect(()=>{ load() },[])

  const add = async ()=>{
    setMsg('')
    try{
      const payload = {...form, property_id: form.property_id? Number(form.property_id): null}
      await apiCreateTenant(payload)
      setForm({name:'',email:'',phone:'',property_id:'',unit:'',notes:''})
      load()
    }catch(e){ setMsg(e.message) }
  }

  const del = async(id)=>{
    if(!confirm('Delete this tenant?')) return
    await apiDeleteTenant(id)
    load()
  }

  return (
    <div className="page">
      <h1>Tenants</h1>
      <div className="card">
        <div className="row gap">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
          <select className="input" value={form.property_id} onChange={e=>setForm({...form, property_id:e.target.value})}>
            <option value="">Select Property</option>
            {props.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input className="input" placeholder="Unit" value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})}/>
          <input className="input" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          <button className="btn-primary" onClick={add}>Add Tenant</button>
        </div>
        {!!msg && <p className="text-red-400 mt-2">{msg}</p>}
      </div>

      <div className="list">
        {tenants.map(t=>(
          <div key={t.id} className="item">
            <div>
              <div className="title">{t.name} {t.unit? `• Unit ${t.unit}`:''}</div>
              <div className="muted">{t.email || '—'} • {t.phone || '—'}</div>
            </div>
            <div className="muted">Property ID: {t.property_id || '—'}</div>
            <button className="btn" onClick={()=>del(t.id)}>Delete</button>
          </div>
        ))}
        {tenants.length===0 && <p className="muted">No tenants yet.</p>}
      </div>
    </div>
  )
}
