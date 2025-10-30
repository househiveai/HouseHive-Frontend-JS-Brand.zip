const API_URL = process.env.NEXT_PUBLIC_API_URL

// 🧩 Auth
export async function apiLogin(email, password) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function apiRegister(email, password) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// 🧩 Authenticated endpoints
export async function apiMe() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// 🧩 Stripe: Create checkout session
export async function apiCreateCheckout(plan) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plan }),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

// 🧩 Stripe: Manage subscription portal
export async function apiBillingPortal() {
  const token = localStorage.getItem('token')
  const res = await fetch(`${API_URL}/api/billing-portal`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}





