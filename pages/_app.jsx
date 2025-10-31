import '../styles/globals.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <title>HouseHive.ai — AI-Powered Property Assistant</title>
        <meta name="theme-color" content="#FFB400" />
      </Head>

      {/* Header */}
      <header className="header bg-black text-white border-b border-[#222]">
        <div className="header-inner flex justify-between items-center px-6 py-4">
          {/* Brand Logo */}
          <div className="brand flex items-center space-x-2">
            <Link href="/">
              <img
                src="/og-image.png"
                alt="HouseHive.ai"
                className="logo w-10 h-10 rounded-full"
              />
            </Link>
            <Link href="/" className="text-[#FFB400] text-xl font-bold">
              HouseHive.ai
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-6 items-center">
            <Link href="/dashboard" className="hover:text-[#FFB400]">
              Dashboard
            </Link>
            <Link href="/properties" className="hover:text-[#FFB400]">
              Properties
            </Link>
            <Link href="/tasks" className="hover:text-[#FFB400]">
              Maintenance
            </Link>
            <Link href="/messages" className="hover:text-[#FFB400]">
              Messages
            </Link>
            <Link href="/billing" className="hover:text-[#FFB400]">
              Billing
            </Link>

            {/* Login/Logout Button */}
            {!loggedIn ? (
              <Link
                href="/login"
                className="bg-[#FFB400] text-black px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-[#FFB400] text-[#FFB400] px-4 py-2 rounded-xl font-semibold hover:bg-[#FFB400] hover:text-black transition"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main>
        <Component {...pageProps} />
      </main>

      {/* Footer */}
      <footer className="footer bg-black text-gray-500 text-center py-6 border-t border-[#222]">
        © {new Date().getFullYear()} HouseHive.ai — AI-Powered Property Assistant
      </footer>
    </>
  );
}
