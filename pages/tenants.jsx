import { useEffect, useState } from 'react'
import {
  apiGetProperties,
  apiCreateProperty,
  apiGetTenants,
  apiCreateTenant,
} from '../lib/api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [props, setProps] = useState([])
  const [propertyId, setPropertyId] = useState('')
  const [newPropertyName, setNewPropertyName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [unit, setUnit] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // Load tenants and properties
  const load = async () => {
    try {
      const p = await apiGetProperties()
      setProps(p)
      setTenants(await apiGetTenants())
      setError('')
    } catch (err) {
      console.error(err)
      setError('Failed to connect to server. Please try again.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Add tenant
  const addTenant = async () => {
    if (!name || !email || !propertyId) {
      setError('Please fill in name, email, and select a property.')
      return
    }
    try {
      await apiCreateTenant({
        name,
        email,
        phone,
        property_id: propertyId,
        unit,
        notes,
      })
      setName('')
      setEmail('')
      setPhone('')
      setUnit('')
      setNotes('')
      await load()
    } catch (err) {
      console.error(err)
      setError('Error adding tenant.')
    }
  }

  // Add property inline
  const addPropertyInline = async () => {
    if (!newPropertyName.trim()) return
    try {
      const newProp = await apiCreateProperty({
        name: newPropertyName,
        address: '',
        notes: '',
      })
      setProps([...props, newProp])
      setPropertyId(newProp.id)
      setNewPropertyName('')
    } catch (err) {
      console.error(err)
      setError('Error adding new property.')
    }
  }

  return (
    <div className="col px-4 py-6">
      <h1 className="text-3xl font-bold text-[#FFB400] mb-4">Tenants</h1>

      <div className="card bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Tenant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700"
          />

          <div className="flex flex-col">
            <select
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700 w-52"
            >
              <option value="">Select Property</option>
              {props.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Inline add property */}
            <div className="flex items-center mt-2">
              <input
                placeholder="Add property..."
                value={newPropertyName}
                onChange={(e) => setNewPropertyName(e.target.value)}
                className="p-1 rounded-lg bg-zinc-900 text-white border border-zinc-700 w-full"
              />
              <button
                onClick={addPropertyInline}
                className="ml-2 px-3 py-1 bg-[#FFB400] text-black rounded-lg font-semibold hover:opacity-90 transition"
              >
                +
              </button>
            </div>
          </div>

          <input
            placeholder="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700 w-32"
          />
          <input
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-2 rounded-lg bg-zinc-900 text-white border border-zinc-700 flex-grow"
          />

          <button
            onClick={addTenant}
            className="bg-[#FFB400] text-black font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition"
          >
            Add Tenant
          </button>
        </div>

        {error && <p className="text-red-400 mt-3">{error}</p>}
      </div>

      <h2 className="text-xl font-semibold text-[#FFB400] mb-3">Tenant List</h2>

      {tenants.length === 0 ? (
        <p className="text-gray-400">No tenants yet.</p>
      ) : (
        <div className="space-y-3">
          {tenants.map((t) => (
            <div
              key={t.id}
              className="card bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{t.email}</p>
                  <p className="text-gray-500 text-sm">
                    Property #{t.property_id} • Unit {t.unit}
                  </p>
                </div>
                <div className="text-gray-400">{t.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
