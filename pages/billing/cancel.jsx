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

