
import { useEffect, useState } from 'react'
import { apiMe } from '../lib/api'

export default function Dashboard(){
  const [me, setMe] = useState(null)
  useEffect(()=>{ apiMe().then(setMe).catch(()=>{}) },[])
  return (
    <div className="card">
      <h2 className="h1">Welcome, {me?.name || 'friend'} 👋</h2>
      <p>Plan: <span className="badge">{me?.plan || 'free'}</span></p>
      <p>Use the nav to manage properties, maintenance, messages, and billing.</p>
    </div>
  )
}
