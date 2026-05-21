'use client'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [convId, setConvId] = useState<string | undefined>()

  const send = async () => {
    if (!input.trim() || loading) return
    const q = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, conversation_id: convId, user: 'visitor' }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      if (!convId) setConvId(data.conversation_id)
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">🤖 虚拟软件公司 AI 助手</h1>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-sm">💭 思考中...</div>}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="输入问题..." className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={send} disabled={loading || !input.trim()} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">发送</button>
        </div>
      </div>
    </main>
  )
}
