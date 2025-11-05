"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load on mount + whenever route changes
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [router.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); // ✅ Don't full refresh unless you want to
  };

  // ✅ If no user, show Login + Signup
  if (!user) {
    return (
      <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#F0F0F0] text-black flex items-center justify-center font-bold hover:scale-105 transition"
      >
        ?
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-4 text-sm border border-gray-200 z-50">
          <p className="font-semibold">Not Logged in</p>
          

          <button
            onClick={router.push("/login")}
            className="mt-3 w-full text-left text-red-600 hover:underline"
          >
            Log out
          </button>
        </div>
      )}
    </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#FFB400] text-black flex items-center justify-center font-bold hover:scale-105 transition"
      >
        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl p-4 text-sm border border-gray-200 z-50">
            <section>
                <nav>
                    <p className="w-10 h-10 rounded-full bg-[#FFB400] text-black flex items-center justify-center font-bold hover:scale-105 transition"> {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</p>
                   

                </nav>
                <article className="mt-2">
                    <p className="font-semibold">{user.name || "User"}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                </article>
            </section>
          

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
