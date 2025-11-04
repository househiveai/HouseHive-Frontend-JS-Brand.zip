// lib/api.js

const API = "https://househive-backend-v3.onrender.com";  // ✅ Correct backend URL

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function j(method, path, body, form) {
  const url = `${API}/api${path}`;  // ✅ add '/api' prefix here
  const headers = {};
  if (!form) headers["Content-Type"] = "application/json";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = form ? body : JSON.stringify(body);

  const res = await fetch(url, options);
  if (!res.ok) throw Error(await res.text());
  return (res.headers.get("content-type") || "").includes("application/json") ? res.json() : res.text();
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
