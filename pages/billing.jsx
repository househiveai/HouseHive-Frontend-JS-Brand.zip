import { useState, useEffect } from 'react'
import { apiCreateCheckout, apiBillingPortal, apiMe } from '../lib/api'

export default function Billing() {
  const [status, setStatus] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔹 Load user info (current plan)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiMe()
        setUser(res)
      } catch (e) {
        console.error(e)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // 🔹 Checkout
  const go = async (plan) => {
    try {
      setStatus('Redirecting to Stripe...')
      const data = await apiCreateCheckout(plan)
      window.location.href = data.url
    } catch (e) {
      setStatus('Failed to fetch: ' + e.message)
    }
  }

  // 🔹 Billing Portal
  const portal = async () => {
    try {
      setStatus('Opening billing portal...')
      const res = await apiBillingPortal()
      window.location.href = res.url
    } catch (e) {
      setStatus('Failed to open portal: ' + e.message)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#FFB400] mb-6">Billing & Subscription</h1>

      {/* Summary Card */}
      <div className="w-full max-w-lg bg-[#111111] rounded-2xl p-6 mb-8 shadow-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-semibold text-[#FFB400] mb-2">Subscription Summary</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : user ? (
          <>
            <p className="text-lg">
              <span className="font-semibold text-white">{user.name}</span> <br />
              Plan: <span className="text-[#FFB400] font-medium">{user.plan}</span>
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              Role: {user.role} • Email: {user.email}
            </p>
          </>
        ) : (
          <p className="text-red-400">Unable to load user info.</p>
        )}
      </div>

      {/* Plan Buttons */}
      <div className="w-full max-w-lg bg-[#111111] rounded-2xl p-6 shadow-lg border border-[#2a2a2a]">
        <h2 className="text-2xl font-semibold mb-4 text-[#FFB400]">Choose a Plan</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            className="bg-[#FFB400] text-black px-5 py-3 rounded-xl font-semibold hover:opacity-80 transition"
            onClick={() => go('cohost')}
          >
            Co-Host
          </button>
          <button
            className="bg-[#FFB400] text-black px-5 py-3 rounded-xl font-semibold hover:opacity-80 transition"
            onClick={() => go('pro')}
          >
            Pro
          </button>
          <button
            className="bg-[#FFB400] text-black px-5 py-3 rounded-xl font-semibold hover:opacity-80 transition"
            onClick={() => go('agency')}
          >
            Agency
          </button>
        </div>

        <button
          className="bg-transparent border border-[#FFB400] text-[#FFB400] px-5 py-3 rounded-xl font-semibold hover:bg-[#FFB400] hover:text-black transition"
          onClick={portal}
        >
          Manage Subscription
        </button>

        {status && (
          <p className="mt-4 text-gray-300 text-center text-sm">{status}</p>
        )}
      </div>

      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} HouseHive.ai
      </footer>
    </div>
  )
}

