const API = process.env.NEXT_PUBLIC_API_URL;

function token() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
}

async function j(method, path, body, form) {
  const url = `${API}${path}`;
  const headers = {};
  if (!form) headers['Content-Type'] = 'application/json';
  const t = token();
  if (t) headers['Authorization'] = `Bearer ${t}`;
  const opts = { method, headers };
  if (body) opts.body = form ? body : JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Auth
// Auth
export const apiRegister = (payload) => j('POST','/auth/register', payload);
export const apiLogin = (email, password) => j('POST','/auth/login', { email, password });
export const apiMe = () => j('GET','/auth/me');



// Properties
export const apiGetProperties = () => j('GET','/api/properties');
export const apiCreateProperty = (payload) => j('POST','/api/properties', payload);

// Tasks
export const apiGetTasks = (status) => j('GET', `/api/maintenance${status?`?status=${status}`:''}`);
export const apiCreateTask = (payload) => j('POST','/api/maintenance', payload);

// Tenants
export const apiGetTenants = () => j('GET','/api/tenants');
export const apiCreateTenant = (payload) => j('POST','/api/tenants', payload);

// Reminders
export const apiGetReminders = () => j('GET','/api/reminders');
export const apiCreateReminder = (payload) => j('POST','/api/reminders', payload);

// Stripe
export const apiCreateCheckout = (plan) => j('POST','/api/create-checkout-session', {plan});
export const apiBillingPortal = () => j('POST','/api/billing-portal');

// Admin
export const apiAdminUsers = () => j('GET','/api/admin/users');
export const apiAdminSetPlan = (user_id, plan) => j('PUT','/api/admin/set-plan',{user_id, plan});
export const apiAdminImpersonate = (user_id) => j('POST',`/api/admin/impersonate/${user_id}`);

// Chat
export async function apiChatStream(message) {
  const res = await fetch(`${API}/chat/stream`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({message}),
  });
  if (!res.ok || !res.body) throw new Error('Chat stream failed');
  return res.body.getReader();
}
