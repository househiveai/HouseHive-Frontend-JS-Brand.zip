"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-zinc-800 shadow-lg px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="HouseHive Logo" width={45} height={45} />
          <div className="ml-2">
            <h1 className="text-[#FFB400] text-xl font-bold leading-none">HOUSEHIVE.AI</h1>
            <p className="text-xs text-zinc-400 -mt-1">Property management using AI</p>
          </div>
        </Link>

{/* Desktop Navigation */}
<div className="hidden sm:flex items-center space-x-5 text-[#FFB400] text-sm font-medium">
  <Link href="/dashboard">Dashboard</Link> 
  <Link href="/landlord">Landlord</Link>
  <Link href="/properties">Properties</Link>
  <Link href="/maintenance">Maintenance</Link>
  <Link href="/tenants">Tenants</Link>
  <Link href="/reminders">Reminders</Link>
  <Link href="/messages">Messages</Link>
  <Link href="/billing">Billing</Link>
</div>




        {/* Mobile Icons (Hamburger + User Menu) */}
        <div className="sm:hidden flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
          <Image src="/logo.png" alt="HouseHive Logo" />
          {/* User Menu stays exactly the same */}
          <UserMenu />
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col space-y-3 text-[#FFB400] text-sm font-medium">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/properties" onClick={() => setMenuOpen(false)}>Properties</Link>
          <Link href="/maintenance" onClick={() => setMenuOpen(false)}>Maintenance</Link>
          <Link href="/tenants" onClick={() => setMenuOpen(false)}>Tenants</Link>
          <Link href="/reminders" onClick={() => setMenuOpen(false)}>Reminders</Link>
          <Link href="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
          <Link href="/billing" onClick={() => setMenuOpen(false)}>Billing</Link>
        </div>
      )}
    </nav>
  );
}
