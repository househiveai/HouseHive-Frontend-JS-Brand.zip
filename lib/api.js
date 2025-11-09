import axios from "axios";

const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase =
  process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
const API_BASE = normalizedBase
  ? normalizedBase.endsWith("/api")
    ? normalizedBase
    : `${normalizedBase}/api`
  : DEFAULT_API_BASE;

const isBrowser = typeof window !== "undefined";
const SESSION_EXPIRED_MESSAGE = "Your session has expired. Please sign in again.";

function getStoredToken() {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
}

function storeToken(token) {
  if (!isBrowser) return;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
}

function storeUser(user) {
  if (!isBrowser) return;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

function clearSession() {
  storeToken(null);
  storeUser(null);
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (!isBrowser) throw new Error("No refresh token available");

  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Unable to refresh session");

      const data = await res.json();
      if (!data?.access_token) throw new Error("Invalid refresh response");

      storeToken(data.access_token);
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

export async function request(path, options = {}, retry = true) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  if (res.status === 401 && retry && isBrowser) {
    try {
      await refreshAccessToken();
      return request(path, options, false);
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

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const originalRequest = err?.config;

    if (status === 401 && isBrowser && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        clearSession();
      }
    }

    return Promise.reject(err);
  },
);

function handleError(error) {
  const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Network Error";
  throw new Error(msg);
}

/* AUTH */
export async function apiRegister(body) {
  try {
    const { data } = await api.post("/auth/register", body);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiLogin(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    storeToken(data.access_token);
    storeUser(data.user);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiMe() {
  try {
    const { data } = await api.get("/auth/me");
    storeUser(data);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export function apiLogout() {
  clearSession();
}

/* PROPERTIES */
export async function apiGetProperties() {
  try {
    const { data } = await api.get("/properties");
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiAddProperty(data) {
  return request("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* AI CHAT */
export async function apiChat(message) {
  try {
    const { data } = await api.post("/ai/chat", { message });
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ✅ FIXED + CORRECT `apiDraftMessage` */
export async function apiDraftMessage(recipient, action, details) {
  try {
    const res = await fetch(`${API_BASE}/ai/draft`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, action, details }),
    });

    if (!res.ok) throw new Error("Draft Failed");
    return await res.json();
  } catch (err) {
    throw new Error("Draft Message Failed");
  }
}
