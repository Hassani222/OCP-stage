import { Fragment, useEffect, useRef, useState } from 'react'
import client, { API_URL } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import MessageBubble from '../components/MessageBubble'

export default function Chat() {
  const { user, logout } = useAuth()
  const [conversations, setConversations] = useState([])
  const [documents, setDocuments] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    loadConversations()
    loadDocuments()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    const res = await client.get('/history/conversations')
    setConversations(res.data)
  }

  async function loadDocuments() {
    const res = await client.get('/documents/')
    setDocuments(res.data)
  }

  async function selectConversation(id) {
    setActiveConversationId(id)
    const res = await client.get(`/history/conversations/${id}`)
    setMessages(res.data.messages)
  }

  function startNewConversation() {
    setActiveConversationId(null)
    setMessages([])
  }

  async function deleteConversation(id) {
    await client.delete(`/history/conversations/${id}`)
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (id === activeConversationId) startNewConversation()
  }

  function updateLastMessage(patch) {
    setMessages((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      next[next.length - 1] = typeof patch === 'function' ? patch(last) : { ...last, ...patch }
      return next
    })
  }

  async function handleSend(e) {
    e.preventDefault()
    const question = input.trim()
    if (!question || sending) return

    setInput('')
    setSending(true)
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setMessages((prev) => [...prev, { role: 'assistant', content: '', sources: [], streaming: true }])

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/chat/ask/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, conversation_id: activeConversationId }),
      })

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => null)
        throw new Error(errBody?.detail || "Une erreur s'est produite.")
      }

      const newConversationId = res.headers.get('X-Conversation-Id')
      const sourcesHeader = res.headers.get('X-Sources')
      const sources = sourcesHeader ? JSON.parse(atob(sourcesHeader)) : []

      if (!activeConversationId && newConversationId) {
        setActiveConversationId(Number(newConversationId))
        loadConversations()
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        updateLastMessage((last) => ({ ...last, content: last.content + chunk }))
      }

      updateLastMessage({ sources, streaming: false })
    } catch (err) {
      updateLastMessage({ content: err.message || "Une erreur s'est produite.", streaming: false })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={startNewConversation}
        onDeleteConversation={deleteConversation}
        documents={documents}
        onDocumentUploaded={(doc) => setDocuments((prev) => [doc, ...prev])}
        onDocumentDeleted={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
        user={user}
        onLogout={logout}
      />

      <main className="chat-main">
        <div className="messages">
          {messages.length === 0 && (
            <p className="muted center">
              Importez des documents puis posez une question pour commencer.
            </p>
          )}
          {messages.map((m, idx) => (
            <Fragment key={idx}>
              <MessageBubble
                message={m}
                question={m.role === 'assistant' ? messages[idx - 1]?.content : undefined}
                userEmail={user?.email}
              />
              {m.role === 'assistant' && idx < messages.length - 1 && <hr className="qa-divider" />}
            </Fragment>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Posez une question sur vos documents…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending}
          />
          <button type="submit" disabled={sending || !input.trim()}>
            Envoyer
          </button>
        </form>
      </main>
    </div>
  )
}
