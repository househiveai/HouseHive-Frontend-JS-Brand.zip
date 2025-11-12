// lib/api.js
import { getAccessToken, setAccessToken, clearSession } from "./auth";

const DEFAULT_API_BASE = "https://househive-backend-v3.onrender.com";
const envBase = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || null;
const normalizedBase = envBase ? envBase.replace(/\/$/, "") : null;
export const API_BASE = normalizedBase
  ? (normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`)
  : DEFAULT_API_BASE;

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  }).then(async (res) => {
    if (!res.ok) throw new Error("Unable to refresh session");
    const data = await res.json();
    if (!data?.access_token) throw new Error("Invalid refresh response");
    setAccessToken(data.access_token);
    return data.access_token;
  }).finally(() => { refreshPromise = null; });
  return refreshPromise;
}

async function parse(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  return text || null;
}

function withLeadingSlash(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export async function request(path, { method = "GET", body, headers, retry = true } = {}) {
  const token = getAccessToken();
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${withLeadingSlash(path)}`, {
    method,
    credentials: "include",
    headers: finalHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401 && retry) {
    try {
      const newTok = await refreshAccessToken();
      return request(path, { method, body, headers: { ...finalHeaders, Authorization: `Bearer ${newTok}` }, retry: false });
    } catch (e) {
      clearSession();
      throw e;
    }
  }

  if (res.status === 204) return null;
  const payload = await parse(res);
  if (!res.ok) throw new Error(payload?.detail || payload?.message || res.statusText);
  return payload;
}

export const Auth = {
  register: (body) => request(`/auth/register`, { method: "POST", body }),
  login: async (email, password) => {
    const data = await request(`/auth/login`, { method: "POST", body: { email, password } });
    if (data?.access_token) setAccessToken(data.access_token);
    return data;
  },
  me: () => request(`/auth/me`),
  logout: () => clearSession(),
};

export const Account = {
updateProfile: (body) => request(`/auth/profile`, { method: "PATCH", body }),
updateEmail: (body) => request(`/auth/email`, { method: "PATCH", body }),
updatePassword: (body) => request(`/auth/password`, { method: "PATCH", body }),
};

export const Properties = {
  list: () => request(`/properties`),
  add: (body) => request(`/properties`, { method: "POST", body }),
  update: (id, body) => request(`/properties/${id}`, { method: "PATCH", body }),
  remove: (id) => request(`/properties/${id}`, { method: "DELETE" }),
};

export const Tenants = {
  list: () => request(`/tenants`),
  add: (body) => request(`/tenants`, { method: "POST", body }),
  update: (id, body) => request(`/tenants/${id}`, { method: "PATCH", body }),
  remove: (id) => request(`/tenants/${id}`, { method: "DELETE" }),
};

export const Tasks = {
  list: () => request(`/tasks`),
  add: (body) => request(`/tasks`, { method: "POST", body }),
};

export const Reminders = {
  list: () => request(`/reminders`),
  add: (body) => request(`/reminders`, { method: "POST", body }),
};

export const Ai = {
  chat: (message, history = []) =>
    request(`/ai/chat`, { method: "POST", body: { message, history } }),
  draft: (recipient, context, tone = "friendly") =>
    request(`/ai/draft`, { method: "POST", body: { recipient, context, tone } }),
};

// Admin And Billing
export const Admin = {
  users: () => request(`/admin/users`),
  setPlan: (id, plan) => request(`/admin/set-plan`, { method: "POST", body: { id, plan } }),
  deleteUser: (id) => request(`/admin/delete-user`, { method: "DELETE", body: { id } }),
};

export const Billing = {
  createCheckout: (plan) => request(`/billing/create-checkout`, { method: "POST", body: { plan } }),
  portal: () => request(`/billing/portal`, { method: "POST" }),
};

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path, body) => request(path, { method: "DELETE", body }),
};

export const apiMe = () => Auth.me();
export const apiRegister = (body) => Auth.register(body);
export const apiLogin = ({ email, password }) => Auth.login(email, password);

export const apiForgotPassword = (email) =>
  request(`/auth/forgot-password`, { method: "POST", body: { email } });

export const apiResetPassword = (token, password) =>
  request(`/auth/reset-password`, { method: "POST", body: { token, password } });

export const apiGetProperties = () => Properties.list();
export const apiAddProperty = (body) => Properties.add(body);
export const apiUpdateProperty = (id, body) => Properties.update(id, body);
export const apiDeleteProperty = (id) => Properties.remove(id);

export const apiGetTenants = () => Tenants.list();
export const apiAddTenant = (body) => Tenants.add(body);
export const apiUpdateTenant = (id, body) => Tenants.update(id, body);
export const apiDeleteTenant = (id) => Tenants.remove(id);

export const apiGetTasks = () => Tasks.list();
export const apiAddTask = (body) => Tasks.add(body);

export const apiGetReminders = () => Reminders.list();
export const apiAddReminder = (body) => Reminders.add(body);

export const apiCreateCheckout = (plan) => Billing.createCheckout(plan);
export const apiBillingPortal = () => Billing.portal();

export const apiChat = (message, history) => Ai.chat(message, history);
export const apiDraftMessage = (recipient, context) => Ai.draft(recipient, context);

export const apiAdminUsers = () => Admin.users();
export const apiAdminSetPlan = (id, plan) => Admin.setPlan(id, plan);
export const apiAdminDeleteUser = (id) => Admin.deleteUser(id);
