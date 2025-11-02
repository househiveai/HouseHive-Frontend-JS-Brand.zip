import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DefaultSeo } from 'next-seo'
import Script from 'next/script'

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
    <>
      {/* ✅ Google Analytics (replace with your GA ID) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <Script id="ga-script" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>

      {/* ✅ Default SEO + Open Graph */}
      <DefaultSeo
        title="HouseHive.ai — Smart Co-Host & AI-Powered Property Assistant"
        description="Automate your rental and Airbnb management with HouseHive.ai — track tenants, tasks, rent, and guest messages using built-in AI tools."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.househive.ai',
          site_name: 'HouseHive.ai',
          images: [
            {
              url: '/og-image.png',
              width: 1200,
              height: 630,
              alt: 'HouseHive.ai Dashboard Preview',
            },
          ],
        }}
        twitter={{
          handle: '@HouseHiveAI',
          site: '@HouseHiveAI',
          cardType: 'summary_large_image',
        }}
        additionalMetaTags={[
          { name: 'keywords', content: 'AI property management, Airbnb co-host, rental automation, landlord assistant, real estate SaaS' },
          { name: 'author', content: 'HouseHive.ai Team' },
        ]}
      />

      {/* ✅ Structured Data (schema.org) */}
      <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "HouseHive.ai",
          "url": "https://www.househive.ai",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "AI-powered property management and co-hosting assistant for landlords and Airbnb owners.",
          "offers": {
            "@type": "Offer",
            "price": "19.99",
            "priceCurrency": "USD"
          }
        })}
      </Script>

      {/* ✅ Header + Navigation */}
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

        <main className="flex justify-center px-4 py-10">
  <div className="col w-full" style={{ maxWidth: '860px' }}>
    <Component {...pageProps} />
  </div>
</main>


        <footer className="text-center text-zinc-600 py-6 border-t border-zinc-800">
          © {new Date().getFullYear()} HouseHive.ai — Smart Co-Hosting Powered by AI
        </footer>
      </div>
    </>
  )
}
