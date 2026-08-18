import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

function formatNumber(n) {
  return n.toLocaleString('fr-FR')
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} o`
  const units = ['Ko', 'Mo', 'Go']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

const EMPTY_NEW_USER = { email: '', password: '', is_admin: false }

export default function Admin() {
  const { user, logout } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUser, setNewUser] = useState(EMPTY_NEW_USER)
  const [createError, setCreateError] = useState('')
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({ email: '', is_admin: false, password: '' })
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)

  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const [documents, setDocuments] = useState(null)
  const [docError, setDocError] = useState('')
  const [deletingDocId, setDeletingDocId] = useState(null)

  useEffect(() => {
    loadDashboard()
    loadDocuments()
  }, [])

  function loadDashboard() {
    client
      .get('/admin/dashboard')
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Impossible de charger le tableau de bord.'))
  }

  function loadDocuments() {
    client
      .get('/admin/documents')
      .then((res) => setDocuments(res.data))
      .catch((err) => setDocError(err.response?.data?.detail || 'Impossible de charger les documents.'))
  }

  async function handleDeleteDocument(doc) {
    if (!window.confirm(`Supprimer le document « ${doc.filename} » (propriétaire : ${doc.owner_email}) ?`)) return
    setDeletingDocId(doc.id)
    setDocError('')
    try {
      await client.delete(`/admin/documents/${doc.id}`)
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id))
      loadDashboard()
    } catch (err) {
      setDocError(err.response?.data?.detail || 'Échec de la suppression.')
    } finally {
      setDeletingDocId(null)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      await client.post('/admin/users', newUser)
      setNewUser(EMPTY_NEW_USER)
      setShowCreateForm(false)
      loadDashboard()
    } catch (err) {
      setCreateError(err.response?.data?.detail || "Échec de la création de l'utilisateur.")
    } finally {
      setCreating(false)
    }
  }

  function startEdit(u) {
    setEditingId(u.id)
    setEditDraft({ email: u.email, is_admin: u.is_admin, password: '' })
    setEditError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditError('')
  }

  async function saveEdit(id) {
    setSaving(true)
    setEditError('')
    const payload = { email: editDraft.email, is_admin: editDraft.is_admin }
    if (editDraft.password) payload.password = editDraft.password
    try {
      await client.patch(`/admin/users/${id}`, payload)
      setEditingId(null)
      loadDashboard()
    } catch (err) {
      setEditError(err.response?.data?.detail || 'Échec de la mise à jour.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Supprimer le compte ${u.email} ? Cette action est irréversible.`)) return
    setDeletingId(u.id)
    setDeleteError('')
    try {
      await client.delete(`/admin/users/${u.id}`)
      loadDashboard()
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Échec de la suppression.')
    } finally {
      setDeletingId(null)
    }
  }

  const tiles = dashboard
    ? [
        { label: 'Utilisateurs', value: formatNumber(dashboard.totals.total_users) },
        { label: 'Documents', value: formatNumber(dashboard.totals.total_documents) },
        { label: 'Segments indexés', value: formatNumber(dashboard.totals.total_chunks) },
        { label: 'Conversations', value: formatNumber(dashboard.totals.total_conversations) },
        { label: 'Messages', value: formatNumber(dashboard.totals.total_messages) },
        { label: 'Stockage utilisé', value: formatBytes(dashboard.totals.storage_bytes) },
      ]
    : []

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          Clarté <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-topbar-nav">
          {user && <span className="admin-topbar-email">{user.email}</span>}
          <button className="admin-topbar-logout" onClick={logout}>
            Déconnexion
          </button>
        </nav>
      </header>

      <main className="admin-page">
        <h1>Tableau de bord administrateur</h1>

        {error && <p className="error">{error}</p>}

        {!error && !dashboard && <p className="muted">Chargement…</p>}

        {dashboard && (
          <>
            <div className="stat-tile-grid">
              {tiles.map((tile) => (
                <div key={tile.label} className="stat-tile">
                  <span className="stat-tile-label">{tile.label}</span>
                  <span className="stat-tile-value">{tile.value}</span>
                </div>
              ))}
            </div>

            <div className="admin-section-header">
              <h2>Utilisateurs</h2>
              <button
                className="admin-add-btn"
                onClick={() => {
                  setShowCreateForm((v) => !v)
                  setCreateError('')
                }}
              >
                {showCreateForm ? 'Annuler' : '+ Ajouter un utilisateur'}
              </button>
            </div>

            {showCreateForm && (
              <form className="admin-create-form" onSubmit={handleCreate}>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={newUser.is_admin}
                    onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                  />
                  Administrateur
                </label>
                <button type="submit" disabled={creating}>
                  {creating ? 'Création…' : 'Créer'}
                </button>
                {createError && <p className="error">{createError}</p>}
              </form>
            )}

            {deleteError && <p className="error">{deleteError}</p>}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Documents</th>
                    <th>Conversations</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.users.map((u) => {
                    const isSelf = u.id === user.id
                    const isEditing = editingId === u.id
                    return (
                      <tr key={u.id}>
                        {isEditing ? (
                          <td>
                            <input
                              className="admin-inline-input"
                              type="email"
                              value={editDraft.email}
                              onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                            />
                          </td>
                        ) : (
                          <td>{u.email}</td>
                        )}

                        {isEditing ? (
                          <td>
                            <label className="admin-checkbox-label" title={isSelf ? 'Vous ne pouvez pas retirer vos propres droits admin' : undefined}>
                              <input
                                type="checkbox"
                                checked={editDraft.is_admin}
                                disabled={isSelf}
                                onChange={(e) => setEditDraft({ ...editDraft, is_admin: e.target.checked })}
                              />
                              Admin
                            </label>
                          </td>
                        ) : (
                          <td>{u.is_admin ? 'Administrateur' : 'Utilisateur'}</td>
                        )}

                        <td className="num">{formatNumber(u.document_count)}</td>
                        <td className="num">{formatNumber(u.conversation_count)}</td>
                        <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>

                        <td className="admin-actions">
                          {isEditing ? (
                            <>
                              <input
                                className="admin-inline-input"
                                type="password"
                                placeholder="Nouveau mot de passe (optionnel)"
                                value={editDraft.password}
                                onChange={(e) => setEditDraft({ ...editDraft, password: e.target.value })}
                              />
                              <button className="link-btn" onClick={() => saveEdit(u.id)} disabled={saving}>
                                {saving ? 'Enregistrement…' : 'Enregistrer'}
                              </button>
                              <button className="link-btn" onClick={cancelEdit}>
                                Annuler
                              </button>
                              {editError && <p className="error">{editError}</p>}
                            </>
                          ) : (
                            <>
                              <button className="link-btn" onClick={() => startEdit(u)}>
                                Modifier
                              </button>
                              <button
                                className="link-btn"
                                onClick={() => handleDelete(u)}
                                disabled={isSelf || deletingId === u.id}
                                title={isSelf ? 'Vous ne pouvez pas supprimer votre propre compte' : undefined}
                              >
                                {deletingId === u.id ? 'Suppression…' : 'Supprimer'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="admin-section-header">
              <h2>Documents</h2>
            </div>

            {docError && <p className="error">{docError}</p>}

            {!docError && !documents && <p className="muted">Chargement…</p>}

            {documents && (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Fichier</th>
                      <th>Propriétaire</th>
                      <th>Segments</th>
                      <th>Importé le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.filename}</td>
                        <td>{doc.owner_email}</td>
                        <td className="num">{formatNumber(doc.chunk_count)}</td>
                        <td>{new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}</td>
                        <td className="admin-actions">
                          <button
                            className="link-btn"
                            onClick={() => handleDeleteDocument(doc)}
                            disabled={deletingDocId === doc.id}
                          >
                            {deletingDocId === doc.id ? 'Suppression…' : 'Supprimer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="muted">
                          Aucun document importé.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
