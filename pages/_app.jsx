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
    <><Head>    <link rel="icon" type="image/x-icon" href="/logo.png"></link>
</Head>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <Link href="/"><img className="logo" src="/og-image.png" alt="HouseHive.ai" class="logo"/></Link>
            
            
          </div>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/tasks">Maintenance</Link>
            <Link href="/messages">Messages</Link>
           <Link href="/billing">Billing</Link>

            {!loggedIn ? (
          <Link
            href="/login"
            className="bg-[#FFB400] text-black px-4 py-2 rounded-xl font-semibold hover:opacity-90"
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
      <main><Component {...pageProps}/></main>
      <div className="footer">© {new Date().getFullYear()} HouseHive.ai</div>
      
    </>
  )
}
