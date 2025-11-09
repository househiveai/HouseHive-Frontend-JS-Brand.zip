import Link from "next/link";
import { getUser } from "../lib/auth";

export default function TopNav() {
  // purely client-less; if you want live email here, lift getUser() into pages
  const user = getUser?.();
  const link = (href, text) => (
    <Link href={href} className="px-3 py-2 rounded-lg hover:bg-[#1a1a1a]">
      {text}
    </Link>
  );

  return (
    <nav className="w-full bg-black/60 border-b border-[#2a2a2a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
        <span className="font-semibold text-[#FFB400]">HouseHive.ai</span>
        <div className="flex-1" />
        {link("/dashboard", "Dashboard")}
        {link("/properties", "Properties")}
        {link("/tenants", "Tenants")}
        {link("/tasks", "Tasks")}
        {link("/landlord", "Landlord")}
        {link("/messages", "Messages")}
        {link("/reminders", "Reminders")}
        {link("/settings", "Settings")}
      </div>
    </nav>
  );
}
