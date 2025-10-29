
import { useState } from 'react'
import { apiCreateCheckout, apiBillingPortal } from '../lib/api'

export default function Billing(){
  const [status, setStatus] = useState('')
  const go = async (plan) => {
    try{ const { url } = await apiCreateCheckout(plan); window.location.href = url }
    catch(e){ setStatus(e.message) }
  }
  const portal = async () => {
    try{ const res = await apiBillingPortal(); window.location.href = res.url }
    catch(e){ setStatus(e.message) }
  }
  return (
    <div className="col">
      <div className="card">
        <h2 className="h1">Choose a Plan</h2>
        <div className="row">
          <button className="btn primary" onClick={()=>go('cohost')}>Co-Host</button>
          <button className="btn primary" onClick={()=>go('pro')}>Pro</button>
          <button className="btn primary" onClick={()=>go('agency')}>Agency</button>
          <button className="btn" onClick={portal}>Manage Subscription</button>
        </div>
        {!!status && <p style={{color:'#ffd46b'}}>{status}</p>}
      </div>
    </div>
  )
}
import Link from 'next/link'

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-4xl font-bold text-[#FFB400] mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Thank you for subscribing to <span className="text-[#FFB400] font-semibold">HouseHive Premium</span>.
        <br /> Your account is now upgraded and ready to go!
      </p>
      <Link href="/dashboard">
        <button className="bg-[#FFB400] text-black px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition">
          Go to Dashboard
        </button>
      </Link>
    </div>
  )
}
import Link from 'next/link'

export default function Cancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        ⚠️ Payment Canceled
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Your checkout was canceled. Don’t worry — you can try again anytime.
      </p>
      <Link href="/billing">
        <button className="bg-[#FFB400] text-black px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition">
          Back to Billing
        </button>
      </Link>
    </div>
  )
}
