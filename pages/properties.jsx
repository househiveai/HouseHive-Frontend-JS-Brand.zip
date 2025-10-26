
import { useEffect, useState } from 'react'
import { apiGetProperties, apiCreateProperty } from '../lib/api'

export default function Properties(){
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const load = async () => setRows(await apiGetProperties())
  useEffect(()=>{ load() },[])
  const add = async () => {
    if(!name) return
    await apiCreateProperty({name, address, notes})
    setName(''); setAddress(''); setNotes(''); load()
  }
  return (
    <div className="col">
      <div className="card">
        <h2 className="h1">Add Property</h2>
        <div className="col" style={{maxWidth:520}}>
          <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} />
          <label>Address</label><input value={address} onChange={e=>setAddress(e.target.value)} />
          <label>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} />
          <button className="btn primary" onClick={add}>Add</button>
        </div>
      </div>
      <div className="list" style={{marginTop:12}}>
        {rows.map(r=> (
          <div className="card" key={r.id}>
            <div className="h1">{r.name}</div>
            <div style={{opacity:.8}}>{r.address}</div>
            <p style={{opacity:.8}}>{r.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
