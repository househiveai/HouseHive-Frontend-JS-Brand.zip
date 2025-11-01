import { useEffect, useState } from 'react'
import { apiGetProperties, apiCreateProperty } from '../lib/api'

export default function Properties() {
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [rent, setRent] = useState('')
  const [rentalLength, setRentalLength] = useState('')

  const load = async () => setRows(await apiGetProperties())

  useEffect(() => { load() }, [])

  // 🟨 Add property (POST body)
  const add = async () => {
    if (!name) return

    await apiCreateProperty({
      name,
      address,
      rent: parseFloat(rent) || 0,
      rental_length: parseInt(rentalLength) || null,
      notes
    })

    setName('')
    setAddress('')
    setNotes('')
    setRent('')
    setRentalLength('')
    load()
  }

  return (
    <div className="col">
      <div className="card">
        <h2 className="h1">Add Property</h2>
        <div className="col" style={{ maxWidth: 520 }}>
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />

          <label>Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)} />

          <label>Monthly Rent ($)</label>
          <input
            type="number"
            placeholder="Enter rent amount"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
          />

          <label>Rental Length (months)</label>
          <input
            type="number"
            placeholder="Length of rental"
            value={rentalLength}
            onChange={(e) => setRentalLength(e.target.value)}
          />

          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} />

          <button className="btn primary" onClick={add}>Add Property</button>
        </div>
      </div>

      <div className="list" style={{ marginTop: 12 }}>
        {rows.map(r => (
          <div className="card" key={r.id}>
            <div className="h1">{r.name}</div>
            <div style={{ opacity: .8 }}>{r.address}</div>
            <p style={{ opacity: .8 }}>
              <strong>Rent:</strong> ${r.rent || 0} /month <br />
              <strong>Length:</strong> {r.rental_length || 'N/A'} months
            </p>
            <p style={{ opacity: .7 }}>{r.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
