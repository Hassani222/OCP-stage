import { Link } from 'react-router-dom'
import DocumentUpload from './DocumentUpload'

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  documents,
  onDocumentUploaded,
  onDocumentDeleted,
  user,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="brand">Clarté</span>
        <button className="link-btn" onClick={onLogout}>
          Déconnexion
        </button>
      </div>
      {user && <p className="muted small">{user.email}</p>}

      <button className="new-conv-btn" onClick={onNewConversation}>
        + Nouvelle conversation
      </button>

      <Link className="new-conv-btn" to="/search">
        🔍 Rechercher dans les documents
      </Link>

      <div className="conversation-list">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span>{conv.title}</span>
            <button
              className="link-btn"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteConversation(conv.id)
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <DocumentUpload documents={documents} onUploaded={onDocumentUploaded} onDeleted={onDocumentDeleted} />
    </aside>
  )
}
