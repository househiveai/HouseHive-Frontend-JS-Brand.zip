
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
     <div className="flex space-x-4 mt-6">
  <a
    href="/register"
    className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-300 transition"
  >
    Get Started
  </a>

  <button
    onClick={async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "demo@househive.ai",
            password: "demo123",
          }),
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } else {
          alert("Demo account unavailable right now.");
        }
      } catch (err) {
        alert("Error connecting to demo account.");
      }
    }}
    className="bg-black text-yellow-400 font-bold py-2 px-6 rounded border border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
  >
    Demo Dashboard
  </button>
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
