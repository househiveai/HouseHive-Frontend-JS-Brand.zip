// lib/api.js
import { getAccessToken, setAccessToken, clearSession } from "./auth";

const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  }).then(async (res) => {
    if (!res.ok) throw new Error("Unable to refresh session");
    const data = await res.json();
    if (!data?.access_token) throw new Error("Invalid refresh response");
    setAccessToken(data.access_token);
    return data.access_token;
  }).finally(() => { refreshPromise = null; });
  return refreshPromise;
}

async function parse(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  return text || null;
}

export async function request(path, { method = "GET", body, headers, retry = true } = {}) {
  const token = getAccessToken();
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: finalHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && retry) {
    try {
      const newTok = await refreshAccessToken();
      return request(path, { method, body, headers: { ...finalHeaders, Authorization: `Bearer ${newTok}` }, retry: false });
    } catch (e) {
      clearSession();
      throw e;
    }
  }

  if (res.status === 204) return null;
  const payload = await parse(res);
  if (!res.ok) throw new Error(payload?.detail || payload?.message || res.statusText);
  return payload;
}

export const Auth = {
  register: (body) => request(`/auth/register`, { method: "POST", body }),
  login: async (email, password) => {
    const data = await request(`/auth/login`, { method: "POST", body: { email, password } });
    if (data?.access_token) setAccessToken(data.access_token);
    return data;
  },
  me: () => request(`/auth/me`),
  logout: () => clearSession(),
};

export const Properties = {
  list: () => request(`/properties`),
  add: (body) => request(`/properties`, { method: "POST", body }),
};

export const Tenants = {
  list: () => request(`/tenants`),
  add: (body) => request(`/tenants`, { method: "POST", body }),
};

export const Tasks = {
  list: () => request(`/tasks`),
  add: (body) => request(`/tasks`, { method: "POST", body }),
};

export const Reminders = {
  list: () => request(`/reminders`),
  add: (body) => request(`/reminders`, { method: "POST", body }),
};

export const Ai = {
  chat: (message, history = []) => request(`/ai/chat`, { method: "POST", body: { message, history } }),
  draft: (recipient, context, tone = "friendly") =>
    request(`/ai/draft`, { method: "POST", body: { recipient, context, tone } }),
};

// Admin And Billing
export const Admin = {
  users: () => request(`/admin/users`),
  setPlan: (id, plan) => request(`/admin/set-plan`, { method: "POST", body: { id, plan } }),
  deleteUser: (id) => request(`/admin/delete-user`, { method: "DELETE", body: { id } }),
};

export const Billing = {
  createCheckout: (plan) => request(`/billing/create-checkout`, { method: "POST", body: { plan } }),
  portal: () => request(`/billing/portal`, { method: "POST" }),
};
