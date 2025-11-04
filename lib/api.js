// lib/api.js

const API = process.env.NEXT_PUBLIC_API_URL || "https://househive-backend-v3.onrender.com";


function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function j(method, path, body, form) {
  const url = `${API}${path}`;
  const headers = {};

  if (!form) headers["Content-Type"] = "application/json";
  const t = token();
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = form ? body : JSON.stringify(body);
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(await res.text());
  }

  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}

// ------------------------------
// AUTH ENDPOINTS
// ------------------------------
export const apiRegister = (payload) => j("POST", "/auth/register", payload);
export const apiLogin = (email, password) =>
  j("POST", "/auth/login", { email, password });
export const apiMe = () => j("GET", "/auth/me");

// ------------------------------
// OTHER ENDPOINTS
// ------------------------------
// Add more routes below like:
// export const apiProperties = () => j("GET", "/properties");
