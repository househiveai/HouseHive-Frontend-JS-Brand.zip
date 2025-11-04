// lib/api.js
import axios from "axios";

const API_BASE = "https://househive-backend-v3.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

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
    "Network error";
  console.error("API Error:", msg);
  throw new Error(msg);
}

// AUTH
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
  } catch (err) { handleError(err); }
}

export async function apiMe() {
  try {
    const { data } = await api.get("/api/auth/me");
    if (typeof window !== "undefined")
      localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err) { handleError(err); }
}

export function apiLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

// AI CHAT
export async function apiChat(message) {
  try {
    const { data } = await api.post("/api/ai/chat", { message });
    return data; // { reply: "..." }
  } catch (err) {
    handleError(err);
  }
}
