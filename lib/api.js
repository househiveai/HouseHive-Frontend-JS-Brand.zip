// Single, clean fetch client with auto-refresh
const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

import { getAccessToken, setAccessToken, clearSession } from "./auth";

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Unable to refresh session");
      const data = await res.json();
      if (!data?.access_token) throw new Error("Invalid refresh response");
      setAccessToken(data.access_token);
      return data.access_token;
    })
    .finally(() => { refreshPromise = null; });
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
    ...(body ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && retry) {
    try {
      const newTok = await refreshAccessToken();
      const rerunHeaders = {
        ...finalHeaders,
        Authorization: `Bearer ${newTok}`,
      };
      const res2 = await fetch(`${API_BASE}${path}`, {
        method,
        credentials: "include",
        headers: rerunHeaders,
        ...(body ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
      });
      if (res2.status === 204) return null;
      const payload2 = await parse(res2);
      if (!res2.ok) throw new Error(payload2?.detail || payload2?.message || res2.statusText);
      return payload2;
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

/** Convenience wrappers */
export const api = {
  get: (p) => request(p),
  post: (p, b) => request(p, { method: "POST", body: b }),
  put: (p, b) => request(p, { method: "PUT", body: b }),
  del: (p) => request(p, { method: "DELETE" }),
};

/** Specific calls you already use elsewhere */
export const Auth = {
  login: async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    if (data?.access_token) setAccessToken(data.access_token);
    return data;
  },
  me: () => api.get("/auth/me"),
  logout: () => clearSession(),
};
