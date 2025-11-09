// lib/api.js
import { getAccessToken, setAccessToken, clearSession } from "@/lib/auth";

const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase =
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  null;

const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

const isBrowser = typeof window !== "undefined";
const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

let refreshPromise = null;

async function refreshAccessToken() {
  if (!isBrowser) throw new Error("No refresh token available (SSR).");
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
    .catch((err) => {
      clearSession();
      throw err;
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

async function parseResponse(res) {
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) return res.json();
  const text = await res.text();
  return text || null;
}

function responseErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;
  if (payload.message) return payload.message;
  return fallback;
}

/** Core request with auto-Bearer and refresh */
export async function request(path, options = {}, retry = true) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers
  });

  // Try one refresh on 401
  if (res.status === 401 && retry && isBrowser) {
    try {
      const newToken = await refreshAccessToken();
      const retryHeaders = {
        ...headers,
        Authorization: newToken ? `Bearer ${newToken}` : undefined
      };
      const res2 = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        ...options,
        headers: retryHeaders
      });
      if (res2.status === 204) return null;
      const payload2 = await parseResponse(res2);
      if (!res2.ok) throw new Error(responseErrorMessage(payload2, res2.statusText));
      return payload2;
    } catch {
      clearSession();
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }
  }

  if (res.status === 204) return null;
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(responseErrorMessage(payload, res.statusText));
  return payload;
}

/* ===== Convenience API wrappers ===== */

export async function apiLogin(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  if (data?.access_token) setAccessToken(data.access_token);
  return data;
}

export async function apiRegister(body) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function apiMe() {
  return request("/auth/me");
}

export async function apiLogout() {
  clearSession();
}

export async function apiDashboardSummary() {
  return request("/dashboard/summary");
}

/* PROPERTIES (examples) */
export async function apiGetProperties() {
  return request("/properties");
}

export async function apiAddProperty(payload) {
  return request("/properties", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/* AI Chat (examples) */
export async function apiChat(message) {
  return request("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message })
  });
}

export async function apiDraftMessage(recipient, action, details) {
  return request("/ai/draft", {
    method: "POST",
    body: JSON.stringify({ recipient, action, details })
  });
}
