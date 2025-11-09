// /lib/auth.js
export const isBrowser = typeof window !== "undefined";

export function getAccessToken() {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
}

export function setAccessToken(token) {
  if (!isBrowser) return;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function setUser(user) {
  if (!isBrowser) return;
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
}

export function clearSession() {
  setAccessToken(null);
  setUser(null);
}
