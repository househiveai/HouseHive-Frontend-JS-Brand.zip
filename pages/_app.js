import '../styles/globals.css'
import Head from 'next/head'
import NavBar from '../components/NavBar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>HouseHive.ai</title>
        <meta
          name="description"
          content="AI-powered property management with smart co-hosting, maintenance tracking, and guest messaging — powered by HiveBot."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* --- Navbar --- */}
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
          <NavBar />
        </header>

        {/* --- Main Content --- */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Component {...pageProps} />
        </main>

        {/* --- Footer --- */}
       <footer className="text-center text-zinc-500 py-4 border-t border-zinc-800 text-sm">
  &copy; {new Date().getFullYear()} <span className="text-[#FFB400] font-semibold">HouseHive.ai</span>
</footer>

      </div>
    </>
  )
}
