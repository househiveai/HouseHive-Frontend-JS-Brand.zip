
const API = process.env.NEXT_PUBLIC_API_BASE || 'https://househive-backend-server-1.onrender.com/api'
function token(){ if (typeof window==='undefined') return ''; return localStorage.getItem('token') || '' }

async function j(method, path, body, form){
  const url = API + path
  const headers = {}
  if(!form) headers['Content-Type'] = 'application/json'
  const t = token(); if (t) headers['Authorization'] = `Bearer ${t}`
  const opts = { method, headers }
  if (body) opts.body = form ? body : JSON.stringify(body)
  const res = await fetch(url, opts)
  if(!res.ok){ let msg = await res.text(); try{ msg = JSON.parse(msg).detail || msg }catch{}; throw new Error(msg || res.statusText) }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export async function apiRegister(payload){ return j('POST','/auth/register', payload) }
export async function apiLogin(email, password){
  const form = new FormData(); form.append('username', email); form.append('password', password)
  const data = await j('POST','/auth/login', form, true)
  localStorage.setItem('token', data.access_token); return data
}
export async function apiMe(){ return j('GET','/auth/me') }

export async function apiGetProperties(){ return j('GET','/properties') }
export async function apiCreateProperty(payload){ return j('POST','/properties', payload) }

export async function apiGetTasks(){ return j('GET','/tasks') }
export async function apiCreateTask(payload){ return j('POST','/tasks', payload) }

export async function apiChat(messages, system_prompt){ return j('POST','/ai/chat', { messages, system_prompt }) }

export async function apiCreateCheckout(plan){ return j('POST','/stripe/checkout?plan='+plan) }
export async function apiBillingPortal(){ return j('POST','/stripe/portal') }
