'use client'
import { useState } from 'react'
import './globals.css'

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
    <main className="container">
      <div className="header">
        <h1>🤖 虚拟软件公司 AI 助手</h1>
        <p style={{color: 'var(--muted)'}}>智能辅助开发、架构设计、代码审查</p>
      </div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'bot'}`}>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
          {loading && <div className="loading"> 思考中...</div>}
        </div>
        <div className="input-area">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && send()} 
            placeholder="输入问题，例如：如何设计用户登录模块？"
          />
          <button onClick={send} disabled={loading || !input.trim()}>发送</button>
        </div>
      </div>
    </main>
  )
}
