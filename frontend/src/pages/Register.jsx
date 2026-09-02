import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  phone: '',
  company_name: '',
  job_title: '',
  address: '',
}

export default function Register() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || "Échec de l'inscription")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card auth-card-wide" onSubmit={handleSubmit}>
        <h1>Créer un compte</h1>
        {error && <p className="error">{error}</p>}

        <div className="auth-card-row">
          <input placeholder="Prénom" value={form.first_name} onChange={update('first_name')} required />
          <input placeholder="Nom" value={form.last_name} onChange={update('last_name')} required />
        </div>

        <input type="email" placeholder="Email" value={form.email} onChange={update('email')} required />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={update('password')}
          required
          minLength={6}
        />
        <input type="tel" placeholder="Numéro de téléphone" value={form.phone} onChange={update('phone')} required />

        <div className="auth-card-row">
          <input placeholder="Nom de société" value={form.company_name} onChange={update('company_name')} required />
          <input placeholder="Votre rôle dans l'entreprise" value={form.job_title} onChange={update('job_title')} required />
        </div>

        <input placeholder="Adresse" value={form.address} onChange={update('address')} required />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Création…' : "S'inscrire"}
        </button>
        <p>
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
