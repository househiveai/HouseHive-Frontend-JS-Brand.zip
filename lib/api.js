// ✅ Base API URL — no /api here since all endpoints already start with /api/ in backend
const API = 'https://househive-backend-v3-zip.onrender.com'

function token() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('token') || ''
}

async function j(method, path, body, form) {
  const url = API + path
  const headers = {}
  if (!form) headers['Content-Type'] = 'application/json'
  const t = token()
  if (t) headers['Authorization'] = `Bearer ${t}`
  const opts = { method, headers }
  if (body) opts.body = form ? body : JSON.stringify(body)

  const res = await fetch(url, opts)
  if (!res.ok) {
    let msg = await res.text()
    try { msg = JSON.parse(msg).detail || msg } catch {}
    throw new Error(msg || res.statusText)
  }

  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

// ✅ AUTH
export async function apiRegister(payload) {
  return j('POST', '/api/auth/register', payload)
}

export async function apiLogin(email, password) {
  const form = new FormData()
  form.append('email', email)
  form.append('password', password)
  const data = await j('POST', '/api/auth/login', form, true)
  localStorage.setItem('token', data.token || data.access_token || '')
  return data
}

export async function apiMe() {
  return j('GET', '/api/auth/me')
}

// ✅ PROPERTIES
export async function apiGetProperties() {
  return j('GET', '/api/properties')
}

export async function apiCreateProperty(payload) {
  return j('POST', '/api/properties', payload)
}

// ✅ MAINTENANCE
export async function apiGetTasks() {
  return j('GET', '/api/maintenance')
}

export async function apiCreateTask(payload) {
  return j('POST', '/api/maintenance', payload)
}

// ✅ AI CHAT
export async function apiChat(messages, system_prompt) {
  return j('POST', '/api/ai/chat', { messages, system_prompt })
}

// ✅ STRIPE BILLING
export async function apiCreateCheckout(plan) {
  return j('POST', '/api/create-checkout-session', { plan })
}

export async function apiBillingPortal() {
  return j('POST', '/api/billing-portal')
}



