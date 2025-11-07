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
  if (!isBrowser) {
    throw new Error("No refresh token available");
  }

  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Unable to refresh session");
      }

      const data = await res.json();
      if (!data?.access_token) {
        throw new Error("Invalid refresh response");
      }

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
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

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

/* Base fetch wrapper (used for POST with JSON body) */
export async function request(path, options = {}, retry = true) {
  const token = getStoredToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // ✅ send/receive refresh cookies
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (retry && isBrowser) {
      try {
        await refreshAccessToken();
        return request(path, options, false);
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : SESSION_EXPIRED_MESSAGE;
        throw new Error(message);
      }
    }

    clearSession();
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  if (res.status === 204) {
    return null;
  }

  const payload = await parseResponse(res);

  if (!res.ok) {
    const message = responseErrorMessage(payload, res.statusText);
    throw new Error(message || "Request failed");
  }

  return payload;
}

/* Axios instance for GET-based requests */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true, // ✅ allow cookie authentication
});

/* Auto-add access token to requests */
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    if (typeof config.headers?.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status === 401 && isBrowser && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          if (typeof originalRequest.headers?.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          } else {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${newToken}`,
            };
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        clearSession();
        return Promise.reject(
          refreshError instanceof Error ? refreshError : new Error(SESSION_EXPIRED_MESSAGE),
        );
      }
    }

    return Promise.reject(error);
  },
);

function handleError(error) {
  if (error?.response?.status === 401) {
    clearSession();
  }
  const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Network Error";
  console.error("API Error:", msg);
  throw new Error(msg);
}

/* ========= AUTH ========= */

export async function apiRegister({ name, email, password }) {
  try {
    const { data } = await api.post("/auth/register", { name, email, password });
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

export async function apiForgotPassword(email) {
  try {
    await api.post("/auth/forgot", { email });
  } catch (err) {
    handleError(err);
  }
}

export async function apiResetPassword(token, newPassword) {
  try {
    await api.post("/auth/reset", {
      token,
      new_password: newPassword,
    });
  } catch (err) {
    handleError(err);
  }
}

/* Automatically refresh user state */
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

/* ========= PROPERTIES ========= */

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
    credentials: "include",   // ✅ ensure cookie session works
    body: JSON.stringify(data),
  });
}

/* ========= TENANTS ========= */

export async function apiAddTenant(payload) {
  try {
    const { data } = await api.post("/tenants", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetTenants() {
  try {
    const { data } = await api.get("/tenants");
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ========= TASKS ========= */

export async function apiAddTask(payload) {
  try {
    const { data } = await api.post("/tasks", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetTasks() {
  try {
    const { data } = await api.get("/tasks");
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiMarkTaskDone(id) {
  try {
    const { data } = await api.post(`/tasks/${id}/done`);
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ========= REMINDERS ========= */

export async function apiAddReminder(payload) {
  try {
    const { data } = await api.post("/reminders", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiGetReminders() {
  try {
    const { data } = await api.get("/reminders");
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ========= INSIGHTS ========= */

export async function apiGetInsights() {
  return request("/insights");
}

/* ========= AI CHAT ========= */

export async function apiChat(message) {
  try {
    const { data } = await api.post("/ai/chat", { message });
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ========= BILLING ========= */

export async function apiCreateCheckout(plan) {
  try {
    const { data } = await api.post("/billing/create-checkout", { plan });
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiBillingPortal() {
  try {
    const { data } = await api.post("/billing/portal");
    return data;
  } catch (err) {
    handleError(err);
  }
}

/* ========= ADMIN ========= */

export async function apiAdminUsers() {
  try {
    const { data } = await api.get("/admin/users");
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiAdminSetPlan(userId, plan) {
  try {
    const { data } = await api.post(`/admin/users/${userId}/plan`, { plan });
    return data;
  } catch (err) {
    handleError(err);
  }
}

export async function apiAdminDeleteUser(userId) {
  try {
    const { data } = await api.delete(`/admin/users/${userId}`);
    return data;
  } catch (err) {
    handleError(err);
  }
}
