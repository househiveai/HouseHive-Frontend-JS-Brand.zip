import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="bg-zinc-900 border-b border-zinc-800 flex justify-between items-center px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <img src="/favicon.ico" alt="HouseHive.ai" className="w-8 h-8" />
          <Link href="/" className="text-yellow-400 font-bold text-xl">HouseHive.ai</Link>
        </div>
        <nav className="flex space-x-6 text-sm font-medium">
          {loggedIn ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/tenants">Tenants</Link>
              <Link href="/tasks">Maintenance</Link>
              <Link href="/reminders">Reminders</Link>
              <Link href="/messages">HiveBot</Link>
              <Link href="/billing">Billing</Link>
              <Link href="/admin">Admin</Link>
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="pt-6 pb-20 px-6">
        <Component {...pageProps} />
      </main>

      <footer className="text-center text-zinc-600 py-6 border-t border-zinc-800">
        © {new Date().getFullYear()} HouseHive.ai — Powered by AI
      </footer>
    </div>
  )
}
