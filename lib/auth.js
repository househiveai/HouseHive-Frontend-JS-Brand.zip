// Lightweight auth helpers (localStorage + refresh cookie)
const isBrowser = typeof window !== "undefined";

export function getAccessToken() {
  if (!isBrowser) return null;
  return localStorage.getItem("token");
}
export function setAccessToken(tok) {
  if (!isBrowser) return;
  if (tok) localStorage.setItem("token", tok);
  else localStorage.removeItem("token");
}
export function getUser() {
  if (!isBrowser) return null;
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
}
export function setUser(u) {
  if (!isBrowser) return;
  if (u) localStorage.setItem("user", JSON.stringify(u));
  else localStorage.removeItem("user");
}
export function clearSession() {
  setAccessToken(null);
  setUser(null);
}
