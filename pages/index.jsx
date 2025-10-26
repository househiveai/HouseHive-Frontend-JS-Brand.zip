
import { useState } from 'react'
import { apiLogin, apiRegister } from '../lib/api'

export default function Home(){
  const [email, setEmail] = useState('demo@househive.ai')
  const [password, setPassword] = useState('demo1234')
  const [name, setName] = useState('Demo User')
  const [mode, setMode] = useState('login')
  const [msg, setMsg] = useState('')
  const submit = async () => {
    try {
      if (mode === 'register') {
        await apiRegister({email, password, name}); setMsg('Registered! Now log in.'); setMode('login'); return
      }
      await apiLogin(email, password); window.location.href='/dashboard'
    } catch(e){ setMsg(e.message || 'Error') }
  }
  return (
    <>
      <div className="hero">
        <h1 style={{fontSize:'2rem',fontWeight:900,margin:'0 0 6px'}}>Work faster with HiveBot</h1>
        <p style={{opacity:.85,margin:'0 0 12px'}}>Tasks, vendors, and guest messages—handled by AI with one click.</p>
        <div className="row">
          <button className="btn primary" onClick={()=>document.getElementById('auth')?.scrollIntoView({behavior:'smooth'})}>Get Started</button>
          <a className="btn" href="/dashboard">Demo Dashboard</a>
        </div>
      </div>

      <div id="auth" style={{height:16}}></div>
      <div className="container" style={{marginTop:16}}>
        <h2 className="h1">{mode==='login'?'Login to HouseHive':'Create your account'}</h2>
        <div className="col" style={{maxWidth:520}}>
          {mode==='register' && (<><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} /></>)}
          <label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} />
          <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="row">
            <button className="btn primary" onClick={submit}>{mode==='login'?'Login':'Create Account'}</button>
            <button className="btn" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Need an account?':'Already have an account?'}</button>
          </div>
          {!!msg && <p style={{color:'#ffd46b'}}>{msg}</p>}
        </div>
      </div>
    </>
  )
}
