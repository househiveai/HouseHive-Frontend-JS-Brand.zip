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
    error?.response?.data?.error ||
    error?.message ||
    "Network error";
  console.error("API Error:", msg);
  throw new Error(msg);
}

// ================================
// 🧾 AUTH ENDPOINTS
// ================================

// ✅ Register new user
export async function apiRegister({ name, email, password }) {
  try {
    // ensure all 3 fields exist before sending
    if (!email || !password)
      throw new Error("Email and password are required");
    const payload = {
      name: name || "",
      email: email.trim().toLowerCase(),
      password: password.trim(),
    };
    const { data } = await api.post("/api/auth/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Registered:", data);
    return data; // returns user info
  } catch (err) {
    handleError(err);
  }
}

// ✅ Login existing user
export async function apiLogin(email, password) {
  try {
    if (!email || !password)
      throw new Error("Email and password are required");
    const { data } = await api.post(
      "/api/auth/login",
      { email: email.trim().toLowerCase(), password: password.trim() },
      { headers: { "Content-Type": "application/json" } }
    );
    // Save token and user to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    console.log("✅ Logged in:", data.user.email);
    return data.user;
  } catch (err) {
    handleError(err);
  }
}

// ✅ Get current logged-in user
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

// ✅ Logout (clears localStorage)
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

// ================================
// 🧪 Utility Helpers
// ================================

// Quickly check if logged in
export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

// Get saved user
export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}
