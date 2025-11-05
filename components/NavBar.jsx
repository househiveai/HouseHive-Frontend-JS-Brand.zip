"use client";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function NavBar() {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black border-b border-zinc-800 px-4 sm:px-8 py-4 shadow-lg">

      {/* Logo + wordmark */}
      <div className="flex items-center justify-center sm:justify-start mb-3 sm:mb-0">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="HouseHive Logo" width={45} height={45} />
          <div className="ml-2">
            <h1 className="text-[#FFB400] text-xl font-bold leading-none">HOUSEHIVE.AI</h1>
            <p className="text-xs text-zinc-400 -mt-1">Property management using AI</p>
          </div>
        </Link>
      </div>

      {/* Links + User Menu */}
      <div className="flex items-center space-x-5 text-[#FFB400] text-sm font-medium">

        <Link href="/dashboard">Dashboard</Link>
        <Link href="/properties">Properties</Link>
        <Link href="/maintenance">Maintenance</Link>
        <Link href="/tenants">Tenants</Link>
        <Link href="/reminders">Reminders</Link>
        <Link href="/messages">Messages</Link>
        <Link href="/billing">Billing</Link>

        {/* ✅ Replaces old login link */}
        <UserMenu />
      </div>
    </nav>
  );
}
