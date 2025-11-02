// pages/_app.js
import '@/styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    document.body.classList.add('dark')
  }, [])

  return (
    <>
      <Head>
        <title>HouseHive.ai — Property management using AI</title>
        <meta name="description" content="AI-powered property management assistant that automates tasks, reminders, and communications for landlords and co-hosts." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Global layout wrapper */}
      <div className="min-h-screen flex flex-col bg-black text-white">
        <header className="bg-zinc-900 border-b border-zinc-800 flex flex-col sm:flex-row sm:justify-between items-center px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="HouseHive.ai" width="42" height="42" />
            <div>
              <h1 className="text-xl font-bold text-[#FFB400]">HOUSEHIVE.AI</h1>
              <p className="text-xs text-gray-400">Property management using AI</p>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center mt-2 sm:mt-0">
            <a href="/dashboard" className="mx-2 hover:text-[#FFB400]">Dashboard</a>
            <a href="/properties" className="mx-2 hover:text-[#FFB400]">Properties</a>
            <a href="/maintenance" className="mx-2 hover:text-[#FFB400]">Maintenance</a>
            <a href="/tenants" className="mx-2 hover:text-[#FFB400]">Tenants</a>
            <a href="/reminders" className="mx-2 hover:text-[#FFB400]">Rent Reminders</a>
            <a href="/messages" className="mx-2 hover:text-[#FFB400]">Messages</a>
            <a href="/billing" className="mx-2 hover:text-[#FFB400]">Billing</a>
            <a href="/admin" className="mx-2 hover:text-[#FFB400]">Admin</a>
            <a href="/login" className="ml-4 bg-[#FFB400] text-black px-4 py-1 rounded hover:bg-yellow-400">Logout</a>
          </nav>
        </header>

        <main className="flex justify-center px-4 py-10">
          <div className="col w-full" style={{ maxWidth: '860px' }}>
            <Component {...pageProps} />
          </div>
        </main>

        <footer className="text-center py-6 text-gray-400 border-t border-zinc-800">
          © {new Date().getFullYear()} HouseHive.ai
        </footer>
      </div>
    </>
  )
}
