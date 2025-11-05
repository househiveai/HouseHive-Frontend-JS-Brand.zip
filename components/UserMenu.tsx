"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on page load + after login changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);            // ✅ keeps the menu component visible
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* If NOT logged in → show Login + Sign Up buttons */}
      {!user && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-[#F0F0F0] text-black flex items-center justify-center font-bold"
          >
            
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-xl p-4 text-sm border border-gray-200 z-50">
              
              <Link href="/login">Login</Link>
            </div>
          )}
        </>
      )}

      {/* If logged in → show avatar */}
      {user && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-[#FFB400] text-black flex items-center justify-center font-bold"
          >
            {user.name?.charAt(0).toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-xl rounded-xl p-4 text-sm border border-gray-200 z-50">
              <p className="font-semibold">{user.name || "User"}</p>
              <p className="text-gray-500 text-xs mb-3">{user.email}</p>

              <button
                onClick={logout}
                className="w-full text-left text-red-600 hover:underline"
              >
                Log out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
