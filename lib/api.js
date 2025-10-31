// lib/api.js
const API = process.env.NEXT_PUBLIC_API_URL; // e.g. https://househive-backend-v3.onrender.com

function token() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function j(method, path, body, form) {
  const url = `${API}${path}`;
  const headers = {};
  if (!form) headers['Content-Type'] = 'application/json';
  const t = token(); if (t) headers['Authorization'] = `Bearer ${t}`;
  const opts = { method, headers };
  if (body) opts.body = form ? body : JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    let msg = await res.text(); try { msg = JSON.parse(msg).detail || msg } catch {}
    throw new Error(msg || res.statusText);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Auth
export const apiRegister = (payload) => j('POST','/api/register', payload);
export async function apiLogin(email, password) {
  const data = await j('POST','/api/login', {email, password});
  localStorage.setItem('token', data.token || '');
  return data;
}
export const apiMe = () => j('GET','/auth/me');

// Properties
export const apiGetProperties = () => j('GET','/api/properties');
export const apiCreateProperty = (payload) => j('POST','/api/properties', payload);
export const apiUpdateProperty = (id, payload) => j('PUT',`/api/properties/${id}`, payload);
export const apiDeleteProperty = (id) => j('DELETE',`/api/properties/${id}`);

// Tasks (Maintenance)
export const apiGetTasks = (status) => j('GET', `/api/maintenance${status?`?status=${status}`:''}`);
export const apiCreateTask = (payload) => j('POST','/api/maintenance', payload);
export const apiUpdateTask = (id, payload) => j('PUT',`/api/maintenance/${id}`, payload);
export const apiDeleteTask = (id) => j('DELETE',`/api/maintenance/${id}`);

// Tenants
export const apiGetTenants = () => j('GET','/api/tenants');
export const apiCreateTenant = (payload) => j('POST','/api/tenants', payload);
export const apiUpdateTenant = (id, payload) => j('PUT',`/api/tenants/${id}`, payload);
export const apiDeleteTenant = (id) => j('DELETE',`/api/tenants/${id}`);

// Reminders
export const apiGetReminders = () => j('GET','/api/reminders');
export const apiCreateReminder = (payload) => j('POST','/api/reminders', payload);
export const apiUpdateReminder = (id, payload) => j('PUT',`/api/reminders/${id}`, payload);
export const apiDeleteReminder = (id) => j('DELETE',`/api/reminders/${id}`);

// Stripe
export const apiCreateCheckout = (plan) => j('POST','/api/create-checkout-session', { plan });
export const apiBillingPortal = () => j('POST','/api/billing-portal');

// Admin
export const apiAdminUsers = () => j('GET','/api/admin/users');
export const apiAdminSetPlan = (user_id, plan) => j('PUT','/api/admin/set-plan',{user_id, plan});
export const apiAdminDeleteUser = (user_id) => j('DELETE',`/api/admin/delete-user/${user_id}`);
export const apiAdminImpersonate = (user_id) => j('POST',`/api/admin/impersonate/${user_id}`);


