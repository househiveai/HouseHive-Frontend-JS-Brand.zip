import { useState } from 'react'
import { apiLogin } from '../lib/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const go = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await apiLogin(email, password)
      if (res?.token) window.location.href = '/dashboard'
      else setMsg('Login failed')
    } catch(e){ setMsg(e.message) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={go} className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-[#2a2a2a]">
        <h1 className="text-2xl font-bold text-[#FFB400] mb-6">Login</h1>
        <label className="block mb-2">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/>
        <label className="block mt-4 mb-2">Password</label>
        <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
        <button className="btn-primary w-full mt-6">Sign In</button>
        {!!msg && <p className="text-red-400 mt-3">{msg}</p>}
      </form>
    </div>
  )
}
