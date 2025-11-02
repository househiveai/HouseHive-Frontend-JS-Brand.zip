// /pages/_app.js
import '@/styles/globals.css'
import Head from 'next/head'
import NavBar from '@/components/NavBar' // NOTE: See step 2 if this alias fails

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HouseHive.ai — Smart Property Management</title>
        <meta name="description" content="AI-powered property management for landlords, co-hosts, and agencies." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Component {...pageProps} />
        </main>
        <footer className="text-center text-sm mt-12 pb-6 text-zinc-400 border-t border-zinc-800">
          © {new Date().getFullYear()} <span className="text-[#FFB400] font-semibold">HouseHive.ai</span>
        </footer>
      </div>
    </>
  )
}
