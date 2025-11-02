import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HouseHive.ai — Smart Property Management</title>
        <meta name="description" content="AI-powered property management for landlords and co-hosts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-black text-white font-sans">
        <Component {...pageProps} />
        <footer className="text-center text-sm mt-12 pb-6 text-zinc-400">
          © 2025 <span className="text-[#FFB400] font-semibold">HouseHive.ai</span>
        </footer>
      </div>
    </>
  )
}
