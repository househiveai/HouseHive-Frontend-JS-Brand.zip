// pages/_app.jsx
import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }){
  const [loggedIn, setLoggedIn] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) { setLoggedIn(false); return }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${t}` }
    }).then(r=>r.json()).then(d=>{
      if (d?.email) { setLoggedIn(true); setMe(d) } else { setLoggedIn(false) }
    }).catch(()=>setLoggedIn(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <>
      <Head>
        <title>HouseHive.ai — Smart Co-Host</title>
        <meta name="description" content="AI-powered co-host for properties, tenants, maintenance, messages, and billing."/>
        <link rel="icon" href="/favicon.ico" />
        {/* Simple GA (optional): */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
            <script dangerouslySetInnerHTML={{__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}}/>
          </>
        )}
      </Head>

      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Link href="/"><img src="/og-image.png" alt="HouseHive.ai" className="logo" /></Link>
          </div>
          <nav className="nav">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/tasks">Maintenance</Link>
            <Link href="/tenants">Tenants</Link>
            <Link href="/reminders">Rent Reminders</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/billing">Billing</Link>
            {me?.email?.toLowerCase() === 'dntullo@yahoo.com' && <Link href="/admin">Admin</Link>}
            {!loggedIn ? (
              <Link className="btn-primary" href="/login">Login</Link>
            ) : (
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            )}
          </nav>
        </div>
      </header>

      <main><Component {...pageProps}/></main>
      <div className="footer">© {new Date().getFullYear()} HouseHive.ai</div>
    </>
  )
}
