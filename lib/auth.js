// Lightweight client-side auth helpers
const isBrowser = typeof window !== "undefined";
const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getAccessToken() {
  if (!isBrowser) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (!isBrowser) return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (!isBrowser) return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  setAccessToken(null);
  setUser(null);
}
