// lib/api.js
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Single axios instance that automatically attaches Bearer token
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("househive_token");
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
    "Network error";
  throw new Error(msg);
}

export async function registerUser({ name, email, password }) {
  try {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    // No token on register; you can auto-login next or redirect to login page
    return data; // { id, email, name, created_at }
  } catch (err) {
    handleError(err);
  }
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });
    // data: { access_token, token_type, user }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("househive_token", data.access_token);
      window.localStorage.setItem("househive_user", JSON.stringify(data.user));
    }
    return data.user;
  } catch (err) {
    handleError(err);
  }
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("househive_token");
    window.localStorage.removeItem("househive_user");
  }
}

export async function getMe() {
  try {
    const { data } = await api.get("/api/auth/me");
    // Optionally keep user fresh in localStorage
    if (typeof window !== "undefined") {
      window.localStorage.setItem("househive_user", JSON.stringify(data));
    }
    return data; // {id,email,name,created_at}
  } catch (err) {
    handleError(err);
  }
}
