import { useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Search() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q || searching) return

    setSearching(true)
    setError('')
    try {
      const res = await client.get('/documents/search', { params: { q, k: 8 } })
      setResults(res.data)
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue lors de la recherche.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="brand">Clarté</span>
          <button className="link-btn" onClick={logout}>
            Déconnexion
          </button>
        </div>
        {user && <p className="muted small">{user.email}</p>}

        <Link className="new-conv-btn" to="/chat">
          ← Retour au chat
        </Link>
      </aside>

      <main className="chat-main">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher dans vos documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={searching}
          />
          <button type="submit" disabled={searching || !query.trim()}>
            Rechercher
          </button>
        </form>

        <div className="search-results">
          {error && <p className="error">{error}</p>}
          {!error && searching && <p className="muted center">Recherche en cours…</p>}
          {!error && !searching && searched && results.length === 0 && (
            <p className="muted center">Aucun passage pertinent trouvé.</p>
          )}
          {!error && !searching && !searched && (
            <p className="muted center">
              Recherchez un mot-clé ou une question pour retrouver les passages pertinents dans vos documents.
            </p>
          )}
          {results.map((r, idx) => (
            <div key={idx} className="search-result-item">
              <strong>{r.filename}</strong>
              <p>{r.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
