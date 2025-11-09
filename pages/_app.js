import '../styles/globals.css'
import Head from 'next/head'
import NavBar from '../components/NavBar'
import { AuthProvider } from '../components/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HouseHive</title>
        <meta
          name="description"
          content="AI-powered property management with smart co-hosting, maintenance tracking, and guest messaging — powered by HiveBot."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative min-h-screen bg-slate-950 text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[-120px] h-72 w-72 rounded-full bg-[#FFB400]/10 blur-3xl" />
          <div className="absolute right-[5%] top-[220px] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        </div>

        <AuthProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <header className="sticky top-6 z-50 mx-auto w-full max-w-6xl px-4 sm:px-6">
              <NavBar />
            </header>

            <main className="flex-1 px-4 pb-16 pt-12 sm:px-6">
              <div className="mx-auto w-full max-w-6xl">
                <Component {...pageProps} />
              </div>
            </main>

            <footer className="mx-auto w-full max-w-6xl px-4 pb-12 text-center text-sm text-slate-400 sm:px-6">
              &copy; {new Date().getFullYear()} <span className="text-[#FFB400] font-semibold">HouseHive.ai</span> — smart
              co-hosting for modern landlords
            </footer>
          </div>
        </AuthProvider>
      </div>
    </>
  )
}
