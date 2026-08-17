const RULE = '─'.repeat(48)

function section(title, body) {
  return [RULE, title, RULE, body, '']
}

function downloadReport(question, message, userEmail) {
  const lines = [
    '='.repeat(48),
    '  RAPPORT DE RÉPONSE — CLARTÉ',
    '='.repeat(48),
    '',
    `Généré le : ${new Date().toLocaleString('fr-FR')}`,
    `Utilisateur : ${userEmail || 'inconnu'}`,
    '',
    ...section('1. QUESTION', question || '(question introuvable)'),
    ...section('2. RÉPONSE', message.content),
  ]

  lines.push(RULE, '3. SOURCE', RULE)
  const filenames = [...new Set((message.sources || []).map((s) => s.filename))]
  lines.push(filenames.length > 0 ? filenames.join(', ') : '(aucune source citée)', '')

  lines.push('='.repeat(48), 'Généré automatiquement par Clarté (chatbot RAG d\'entreprise)', '='.repeat(48))

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rapport-clarte-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function MessageBubble({ message, question, userEmail }) {
  const isUser = message.role === 'user'
  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-bubble">
        <p>
          {message.content}
          {message.streaming && <span className="typing-cursor" />}
        </p>
        {!isUser && !message.streaming && (
          <button className="report-btn" onClick={() => downloadReport(question, message, userEmail)}>
            📄 Télécharger le rapport
          </button>
        )}
      </div>
    </div>
  )
}
