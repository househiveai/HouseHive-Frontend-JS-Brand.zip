import Link from 'next/link'

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
      <h1 className="text-4xl font-bold text-[#FFB400] mb-4">
        🎉 Payment Successful!
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Thank you for subscribing to{' '}
        <span className="text-[#FFB400] font-semibold">HouseHive Premium</span>.
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

