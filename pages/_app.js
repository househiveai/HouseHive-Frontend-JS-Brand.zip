import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'))
    const onStorage = () => setLoggedIn(!!localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    setLoggedIn(false)
    window.location.href = '/login'
  }

  return (
    <>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>HouseHive.ai</title>
        <meta name="description" content="AI-powered property assistant" />
      </head>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Link href="/">
              <img src="/og-image.png" alt="HouseHive.ai" className="logo" />
            </Link>
          </div>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/tasks">Maintenance</Link>
            <Link href="/tenants">Tenants</Link>
            <Link href="/reminders">Rent Reminders</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/billing">Billing</Link>
            {loggedIn ? (
              <>
                <Link href="/admin">Admin</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link href="/login" className="login-btn">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main><Component {...pageProps} /></main>
      <footer className="footer">© {new Date().getFullYear()} HouseHive.ai</footer>
    </>
  )
}
