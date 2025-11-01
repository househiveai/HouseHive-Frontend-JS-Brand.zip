import { useState } from 'react'
import { apiChat } from '../lib/api'

export default function Messages() {
  const [input, setInput] = useState('HiveBot, create a 3-step plan to resolve my urgent tasks.')
  const [log, setLog] = useState([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const msgs = [...log, { role: 'user', content: input }]
    setLog(msgs)
    setInput('')
    setLoading(true)
    try {
      // ✅ Send user message as a string (or combine full chat history if your backend expects it)
      const res = await apiChat(input)
      setLog([...msgs, { role: 'assistant', content: res.reply || res.message || 'No response received.' }])
    } catch (err) {
      console.error(err)
      setLog([...msgs, { role: 'assistant', content: '⚠️ Error connecting to HiveBot.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="col">
      <div className="card">
        <div className="h1">HiveBot</div>
        <div className="col">
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to HiveBot..."
          />
          <button
            className="btn primary"
            onClick={send}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <div className="col" style={{ marginTop: 12 }}>
        {log.map((m, i) => (
          <div
            key={i}
            className="card"
            style={{
              background: m.role === 'assistant' ? '#201a09' : '#121318',
              opacity: loading && i === log.length - 1 ? 0.6 : 1
            }}
          >
            <div style={{ fontWeight: 800, color: m.role === 'assistant' ? '#FFB400' : '#9aa0a6' }}>
              {m.role === 'assistant' ? 'HiveBot' : 'You'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
