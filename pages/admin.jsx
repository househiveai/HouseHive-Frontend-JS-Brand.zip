import { useEffect, useState } from "react";
import { apiMe, apiAdminUsers, apiAdminSetPlan, apiAdminDeleteUser, apiAdminImpersonate } from "../lib/api";

export default function Admin() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    try{
      const m = await apiMe();
      if (m?.email?.toLowerCase() !== 'dntullo@yahoo.com') { setMsg('Access denied'); return }
      setMe(m);
      const u = await apiAdminUsers();
      setUsers(u);
    }catch(e){ setMsg(e.message) }
  }
  useEffect(()=>{ load() },[])

  if (msg==='Access denied') return <div className="page"><h1>403 — Admin only</h1></div>

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      {!me ? <p>Loading...</p> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>ID</th><th>Email</th><th>Plan</th><th>Stripe</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.plan}</td>
                  <td className="muted">{u.stripe_customer_id || '—'}</td>
                  <td className="row gap">
                    <button className="btn" onClick={()=>apiAdminSetPlan(u.id,'Free').then(load)}>Free</button>
                    <button className="btn" onClick={()=>apiAdminSetPlan(u.id,'Pro').then(load)}>Pro</button>
                    <button className="btn" onClick={()=>apiAdminSetPlan(u.id,'Agency').then(load)}>Agency</button>
                    <button className="btn" onClick={()=>apiAdminImpersonate(u.id).then(d=>{localStorage.setItem('token', d.token); location.href='/dashboard'})}>Impersonate</button>
                    <button className="btn" onClick={()=>{ if(confirm('Delete?')) apiAdminDeleteUser(u.id).then(load) }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
