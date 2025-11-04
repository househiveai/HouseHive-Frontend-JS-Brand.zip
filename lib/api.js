// lib/api.js
import axios from "axios";

// ================================
// 🔗 API BASE URL
// ================================
const API_BASE = "https://househive-backend-v3.onrender.com";

// ================================
// 🧠 Axios Instance
// ================================
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // 15 seconds timeout
});

// ================================
// 🔐 Token Interceptor
// ================================
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================================
// ⚠️ Error Handler
// ================================
function handleError(error) {
  const msg =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    "Network error";
  console.error("API Error:", msg);
  throw new Error(msg);
}

// ================================
// 🧾 AUTH ENDPOINTS
// ================================

// Register new user
export async function apiRegister({ name, email, password }) {
  try {
    const { data } = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return data; // user info only (no token)
  } catch (err) {
    handleError(err);
  }
}

// Login existing user
export async function apiLogin(email, password) {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });
    // data = { access_token, token_type, user }
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data.user;
  } catch (err) {
    handleError(err);
  }
}

// Get current logged-in user
export async function apiMe() {
  try {
    const { data } = await api.get("/api/auth/me");
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data));
    }
    return data;
  } catch (err) {
    handleError(err);
  }
}

// Logout (clears localStorage)
export function apiLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

// ================================
// 🏠 PROPERTY / TENANT / TASK EXAMPLES
// ================================

// Example: Get all properties
export async function apiGetProperties() {
  try {
    const { data } = await api.get("/api/properties");
    return data;
  } catch (err) {
    handleError(err);
  }
}

// Example: Add a property
export async function apiAddProperty(payload) {
  try {
    const { data } = await api.post("/api/properties", payload);
    return data;
  } catch (err) {
    handleError(err);
  }
}

// Example: Get all tenants
export async function apiGetTenants() {
  try {
    const { data } = await api.get("/api/tenants");
    return data;
  } catch (err) {
    handleError(err);
  }
}
