"use client";
import { useState, useEffect } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-white text-white flex items-center justify-center font-bold"
      >
        {user.name?.charAt(0).toUpperCase() || "U"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-4 text-sm border border-gray-200">
          <p className="font-semibold">{user.name || "User"}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>

          <button
            onClick={logout}
            className="mt-3 w-full text-left text-red-600 hover:underline"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
