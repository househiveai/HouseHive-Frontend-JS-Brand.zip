import { getAccessToken, setAccessToken, setUser, clearSession } from "@/lib/auth";

// ---- Base URL resolution ----
const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  null;

const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

// ---- Helpers ----
const isBrowser = typeof window !== "undefined";
let refreshPromise = null;

async function refreshAccessToken() {
  // Uses httpOnly refresh cookie on the backend
  if (!isBrowser) throw new Error("No browser context");
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include"
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Unable to refresh session");
      const data = await res.json();
      if (!data?.access_token) throw new Error("Invalid refresh response");
      setAccessToken(data.access_token);
      return data.access_token;
    })
    .catch((e) => {
      clearSession();
      throw e;
    })
    .finally(() => (refreshPromise = null));

  return refreshPromise;
}

async function parseResponse(res) {
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) return res.json();
  const text = await res.text();
  return text || null;
}

function errorMessage(payload, fallback) {
  if (!payload) return fallback || "Request failed";
  if (typeof payload === "string") return payload;
  return payload.detail || payload.message || fallback || "Request failed";
}

// ---- Core request (fetch) with auto attach Bearer + auto refresh ----
export async function request(path, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers
  });

  // If not authorized, try one silent refresh
  if (res.status === 401 && retry && isBrowser) {
    try {
      await refreshAccessToken();
      return request(path, options, false);
    } catch {
      clearSession();
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  if (res.status === 204) return null;

  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(errorMessage(payload, res.statusText));
  return payload;
}

// ---- Convenience wrappers used by pages ----
export async function apiRegister(body) {
  return request("/auth/register", { method: "POST", body: JSON.stringify(body) });
}
export async function apiLogin(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (data?.access_token) setAccessToken(data.access_token);
  if (data?.user) setUser(data.user);
  return data;
}
export async function apiMe() {
  const me = await request("/auth/me");
  if (me) setUser(me);
  return me;
}
export function apiLogout() {
  clearSession();
}

export function apiDashboardSummary() {
  return request("/dashboard/summary");
}

export function apiGetProperties() {
  return request("/properties");
}

export function apiChat(message) {
  return request("/ai/chat", { method: "POST", body: JSON.stringify({ message }) });
}

export function apiDraftMessage(recipient, action, details) {
  return request("/ai/draft", {
    method: "POST",
    body: JSON.stringify({ recipient, action, details })
  });
}
