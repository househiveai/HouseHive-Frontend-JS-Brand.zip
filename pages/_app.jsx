
import '../styles/globals.css'
import Link from 'next/link'

export default function App({ Component, pageProps }){
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <img className="logo" src="/logo.svg" alt="HouseHive.ai"/>
            <div>
              <div className="title">HouseHive.ai</div>
              <div className="tag">AI-Powered Property Assistant</div>
            </div>
          </div>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/tasks">Maintenance</Link>
            <Link href="/messages">Messages</Link>
           <a href="/billing">Billing</a>

            <a href="/register">Logout</a>
          </nav>
        </div>
      </header>
      <main><Component {...pageProps}/></main>
      <div className="footer">© {new Date().getFullYear()} HouseHive.ai</div>
    </>
  )
}
