import axios from "axios";

const API_BASE = "https://househive-backend.onrender.com/api";

/* Base fetch wrapper (used for POST with JSON body) */
export async function request(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",   // ✅ Needed to send refresh cookie
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/* Axios instance for GET-based requests */
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: true,       // ✅ send/receive refresh cookie
});


/* Attach stored token automatically */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function handleError(error) {
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
  } catch (err) { handleError(err); }
}

export async function apiLogin(email, password) {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data.user;
  } catch (err) { handleError(err); }
}

export async function apiMe() {
  try {
    const { data } = await api.get("/auth/me");
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  } catch (err) { handleError(err); }
}

export function apiLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

/* ========= PROPERTIES ========= */

export async function apiGetProperties() {
  try { const { data } = await api.get("/properties"); return data; }
  catch (err) { handleError(err); }
}

export async function apiAddProperty(data) {
  return request("/properties", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* ========= TENANTS ========= */

export async function apiAddTenant(payload) {
  try { const { data } = await api.post("/tenants", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetTenants() {
  try { const { data } = await api.get("/tenants"); return data; }
  catch (err) { handleError(err); }
}

/* ========= TASKS ========= */

export async function apiAddTask(payload) {
  try { const { data } = await api.post("/tasks", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetTasks() {
  try { const { data } = await api.get("/tasks"); return data; }
  catch (err) { handleError(err); }
}

export async function apiMarkTaskDone(id) {
  try { const { data } = await api.post(`/tasks/${id}/done`); return data; }
  catch (err) { handleError(err); }
}

/* ========= REMINDERS ========= */

export async function apiAddReminder(payload) {
  try { const { data } = await api.post("/reminders", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetReminders() {
  try { const { data } = await api.get("/reminders"); return data; }
  catch (err) { handleError(err); }
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
  } catch (err) { handleError(err); }
}
