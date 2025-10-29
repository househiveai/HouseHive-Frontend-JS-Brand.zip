// ✅ Base API URL (with /api — matches your backend routes)
const API = 'https://househive-backend-v3-zip.onrender.com/api'

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
  return j('POST', '/auth/register', payload)
}

export async function apiLogin(email, password) {
  const form = new FormData()
  form.append('email', email)
  form.append('password', password)
  const data = await j('POST', '/auth/login', form, true)
  // 🔹 Standardize token key name
  localStorage.setItem('token', data.token || data.access_token || '')
  return data
}

export async function apiMe() {
  return j('GET', '/auth/me')
}

// ✅ PROPERTIES
export async function apiGetProperties() {
  return j('GET', '/properties')
}

export async function apiCreateProperty(payload) {
  return j('POST', '/properties', payload)
}

// ✅ MAINTENANCE
export async function apiGetTasks() {
  return j('GET', '/maintenance')
}

export async function apiCreateTask(payload) {
  return j('POST', '/maintenance', payload)
}

// ✅ AI CHAT
export async function apiChat(messages, system_prompt) {
  const res = await fetch(`${API}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system_prompt }),
  })
  if (!res.ok) throw new Error('AI chat failed')
  return await res.json()
}

// ✅ STRIPE BILLING
export async function apiCreateCheckout(plan) {
  const res = await fetch(`${API}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  if (!res.ok) throw new Error(`Checkout failed: ${res.status}`)
  return await res.json()
}

export async function apiBillingPortal() {
  const res = await fetch(`${API}/billing-portal`, { method: 'POST' })
  if (!res.ok) throw new Error(`Billing portal failed: ${res.status}`)
  return await res.json()
}


