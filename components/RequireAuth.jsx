"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAccessToken } from "../lib/auth";

export default function RequireAuth({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    // If NO token → send to login
    if (!token) {
      if (router.pathname !== "/login" && router.pathname !== "/register") {
        router.push("/login");
      }
    }
  }, [router]);

  return children;
}
