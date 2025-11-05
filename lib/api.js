// /lib/api.js
import axios from "axios";

const API_BASE = "https://househive-backend-v3.onrender.com/";


const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach bearer token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    const { data } = await api.post("/api/auth/register", { name, email, password });
    return data;
  } catch (err) { handleError(err); }
}

export async function apiLogin(email, password) {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });

    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data.user;
  } catch (err) {
    handleError(err);
  }
}


export async function apiMe() {
  try {
    const { data } = await api.get("/api/auth/me");
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

/* ======== PROPERTIES ======== */

export async function apiGetProperties() {
  try { const { data } = await api.get("/api/properties"); return data; }
  catch (err) { handleError(err); }
}

export async function apiAddProperty(payload) {
  try { const { data } = await api.post("/api/properties", payload); return data; }
  catch (err) { handleError(err); }
}

/* ========= TENANTS ========= */

export async function apiAddTenant(payload) {
  try { const { data } = await api.post("/api/tenants", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetTenants() {
  try { const { data } = await api.get("/api/tenants"); return data; }
  catch (err) { handleError(err); }
}

/* ========= TASKS ========= */

export async function apiAddTask(payload) {
  try { const { data } = await api.post("/api/tasks", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetTasks() {
  try { const { data } = await api.get("/api/tasks"); return data; }
  catch (err) { handleError(err); }
}

export async function apiMarkTaskDone(id) {
  try { const { data } = await api.post(`/api/tasks/${id}/done`); return data; }
  catch (err) { handleError(err); }
}

/* ======== REMINDERS ======== */

export async function apiAddReminder(payload) {
  try { const { data } = await api.post("/api/reminders", payload); return data; }
  catch (err) { handleError(err); }
}

export async function apiGetReminders() {
  try { const { data } = await api.get("/api/reminders"); return data; }
  catch (err) { handleError(err); }
}

/* ======== INSIGHTS ======== */

export async function apiGetInsights() {
  try { const { data } = await api.get("/api/insights"); return data; }
  catch (err) { handleError(err); }

  
}



/* ======== BASIC AI CHAT ======== */

export async function apiChat(message) {
  try {
    const { data } = await api.post("/api/ai/chat", { message });
    return data; // { reply }
  } catch (err) { handleError(err); }
}

/* ======== ADVANCED AI CHAT (with memory) ======== */

export async function askAI(question, history = []) {
  try {
    const normalizedHistory = Array.isArray(history) ? history : [];

    const updatedHistory =
      normalizedHistory[normalizedHistory.length - 1]?.content === question
        ? normalizedHistory
        : [...normalizedHistory, { role: "user", content: question }];

    const payload = {
      message: question,
      history: updatedHistory,
    };

    const { data } = await api.post("/api/ai/chat", payload);

    return {
      reply: data.reply,
      history: [...updatedHistory, { role: "assistant", content: data.reply }],
    };

  } catch (err) {
    console.error("AI Error:", err);
    return {
      reply: "HiveBot could not reply right now.",
      history,
    };
  }
}
