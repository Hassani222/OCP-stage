import { useRef, useState } from 'react'
import client from '../api/client'

const MAX_UPLOAD_SIZE_MB = 5
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

export default function DocumentUpload({ documents, onUploaded, onDeleted }) {
  const fileInput = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setError('')

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError(`Document trop volumineux. Taille maximale autorisée : ${MAX_UPLOAD_SIZE_MB} Mo.`)
      fileInput.current.value = ''
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await client.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUploaded(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || "Échec de l'import du document")
    } finally {
      setUploading(false)
      fileInput.current.value = ''
    }
  }

  async function handleDelete(id) {
    await client.delete(`/documents/${id}`)
    onDeleted(id)
  }

  const totalChunks = documents.reduce((sum, doc) => sum + (doc.chunk_count || 0), 0)

  return (
    <div className="document-panel">
      <div className="document-panel-header">
        <h3>Documents</h3>
        {documents.length > 0 && (
          <span className="document-panel-summary">
            {documents.length} document{documents.length > 1 ? 's' : ''} · {totalChunks} segment
            {totalChunks > 1 ? 's' : ''} indexé{totalChunks > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <label className="upload-btn">
        {uploading ? 'Import en cours…' : 'Importer un document'}
        <input
          type="file"
          ref={fileInput}
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          disabled={uploading}
          hidden
        />
      </label>
      {error && <p className="error">{error}</p>}
      <ul className="document-list">
        {documents.map((doc) => (
          <li key={doc.id}>
            <div className="document-list-info">
              <span className="document-list-name" title={doc.filename}>
                {doc.filename}
              </span>
              <span className="document-list-meta">
                {doc.chunk_count} segment{doc.chunk_count > 1 ? 's' : ''} ·{' '}
                {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <button className="link-btn" onClick={() => handleDelete(doc.id)}>
              Supprimer
            </button>
          </li>
        ))}
        {documents.length === 0 && <li className="muted">Aucun document importé</li>}
      </ul>
    </div>
  )
}
