
import '../styles/globals.css'
import Link from 'next/link'

export default function App({ Component, pageProps }){
  return (
    <><head>    <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
</head>
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
