import axios from "axios";

/* ============================
   BASE URL RESOLUTION
============================ */
const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com/api";
const envBase =
  process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? normalizedBase.endsWith("/api")
    ? normalizedBase
    : `${normalizedBase}/api`
  : DEFAULT_API_BASE;

/* ============================
   TOKEN STORAGE
============================ */
const isBrowser = typeof window !== "undefined";

function getStoredToken() {
  return isBrowser ? localStorage.getItem("accessToken") : null;
}

function storeToken(token) {
  if (!isBrowser) return;
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

function storeUser(user) {
  if (!isBrowser) return;
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

function clearSession() {
  storeToken(null);
  storeUser(null);
}

/* ============================
   REFRESH TOKEN HANDLING
============================ */
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
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/* ============================
   AXIOS INSTANCE
============================ */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,
});

/* Add token before requests */
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

/* Attempt refresh on 401 */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config;

    if (status === 401 && isBrowser && original && !original._retry) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearSession();
      }
    }

    return Promise.reject(err);
  }
);

/* ============================
   ERROR HANDLING
============================ */
function handleError(error) {
  const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Network Error";
  throw new Error(msg);
}

/* ============================
   EXPORTED API CALLS
============================ */
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

/* AI CHAT */
export async function apiChat(message) {
  try {
    const { data } = await api.post("/ai/chat", { message });
    return data;
  } catch (err) {
    handleError(err);
  }
}

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
} catch {
  throw new Error("Draft Message Failed");
}
}
