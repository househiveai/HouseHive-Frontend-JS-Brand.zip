import { useEffect, useState } from 'react'
import Select from 'react-select'
import {
  apiGetProperties,
  apiCreateProperty,
  apiGetTenants,
  apiCreateTenant,
} from '../lib/api'

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [props, setProps] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
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
      setError('⚠️ Failed to connect to server.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  // Add tenant
  const addTenant = async () => {
    if (!name || !email || !selectedProperty) {
      setError('Please fill in name, email, and select a property.')
      return
    }
    try {
      await apiCreateTenant({
        name,
        email,
        phone,
        property_id: selectedProperty.value,
        unit,
        notes,
      })
      setName('')
      setEmail('')
      setPhone('')
      setUnit('')
      setNotes('')
      setSelectedProperty(null)
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
      const newOption = { value: newProp.id, label: newProp.name }
      setProps([...props, newProp])
      setSelectedProperty(newOption)
      setNewPropertyName('')
    } catch (err) {
      console.error(err)
      setError('Error adding new property.')
    }
  }

  // Property dropdown options
  const propertyOptions = props.map((p) => ({
    value: p.id,
    label: p.name,
  }))

  // Add "+ Add new property" as the final option
  const customOptions = [
    ...propertyOptions,
    { value: 'new', label: '➕ Add new property' },
  ]

  return (
    <div className="col px-4 py-6">
      <h1 className="text-3xl font-bold text-[#FFB400] mb-4">Tenants</h1>

      <div className="card bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex flex-wrap gap-3 items-center">
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

          {/* 🟡 React Select dropdown */}
          <div style={{ minWidth: '250px' }}>
            <Select
              value={selectedProperty}
              onChange={(selected) => {
                if (selected.value === 'new') {
                  const name = prompt('Enter new property name:')
                  if (name) {
                    setNewPropertyName(name)
                    addPropertyInline()
                  }
                } else {
                  setSelectedProperty(selected)
                }
              }}
              options={customOptions}
              placeholder="Search or select property..."
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#181818',
                  borderColor: '#333',
                  color: 'white',
                  borderRadius: '10px',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#222',
                  color: 'white',
                }),
                singleValue: (base) => ({ ...base, color: 'white' }),
                input: (base) => ({ ...base, color: 'white' }),
                placeholder: (base) => ({ ...base, color: '#aaa' }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? '#FFB400' : '#222',
                  color: isFocused ? 'black' : 'white',
                  cursor: 'pointer',
                }),
              }}
            />
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
