"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RequireAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If NO token → send to login
    if (!token) {
      if (router.pathname !== "/login" && router.pathname !== "/register") {
        router.push("/login");
      }
    }
  }, [router]);

  return children;
}
