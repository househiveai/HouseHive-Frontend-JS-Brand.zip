// /lib/api.js
import { isBrowser, getAccessToken, setAccessToken, setUser, clearSession } from "./auth";

/**
 * Base URL resolution
 * Uses NEXT_PUBLIC_API_BASE or NEXT_PUBLIC_API_URL (with /api normalization)
 * Falls back to Render default if none provided.
 */
const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

function jsonHeaders(extra = {}) {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function parseResponse(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  return text || null;
}

function messageFrom(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;
  if (payload.message) return payload.message;
  return fallback;
}

let refreshPromise = null;
async function refreshAccessToken() {
  if (!isBrowser) throw new Error("No refresh token available");
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include", // refresh cookie
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
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function request(path, { method = "GET", headers = {}, body, retry = true } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include", // keep refresh cookie
    headers: jsonHeaders(headers),
    body,
  });

  if (res.status === 401 && retry && isBrowser) {
    try {
      await refreshAccessToken();
      return request(path, { method, headers, body, retry: false });
    } catch {
      clearSession();
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }
  }

  if (res.status === 204) return null;
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(messageFrom(payload, res.statusText));
  return payload;
}

/* ---------- High-level helpers ---------- */
export const api = {
  get: (p) => request(p),
  post: (p, data) => request(p, { method: "POST", body: JSON.stringify(data) }),
  put: (p, data) => request(p, { method: "PUT", body: JSON.stringify(data) }),
  patch: (p, data) => request(p, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (p) => request(p, { method: "DELETE" }),
};

/* ---------- Auth flows ---------- */
export async function apiLogin(email, password) {
  const data = await api.post("/auth/login", { email, password });
  if (data?.access_token) setAccessToken(data.access_token);
  if (data?.user) setUser(data.user);
  return data;
}
export async function apiRegister(body) {
  return api.post("/auth/register", body);
}
export async function apiMe() {
  const me = await api.get("/auth/me");
  setUser(me);
  return me;
}
export function apiLogout() {
  clearSession();
}

/* ---------- Domain helpers you can call anywhere ---------- */
export const Dashboard = {
  summary: () => api.get("/dashboard/summary"),
};

export const Properties = {
  list: () => api.get("/properties"),
  create: (data) => api.post("/properties", data),
};

export const Tenants = {
  list: () => api.get("/tenants"),
  create: (data) => api.post("/tenants", data),
  update: (id, data) => api.put(`/tenants/${id}`, data),
};

export const Leases = {
  list: () => api.get("/leases"),
  create: (data) => api.post("/leases", data),
  terminate: (id, data) => api.post(`/leases/${id}/terminate`, data),
};

export const Tasks = {
  list: () => api.get("/tasks?status=active"),
  create: (data) => api.post("/tasks", data),
  complete: (id) => api.post(`/tasks/${id}/complete`),
};

export const Finance = {
  summary: () => api.get("/finance/summary"),
  transactions: () => api.get("/finance/transactions"),
  add: (tx) => api.post("/finance/transactions", tx),
};

export const AI = {
  chat: (message) => api.post("/ai/chat", { message }),
  draft: ({ recipient, action, details }) => api.post("/ai/draft", { recipient, action, details }),
};
