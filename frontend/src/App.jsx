import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Search from './pages/Search'
import Admin from './pages/Admin'

function HomeRoute() {
  const { token, user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Chargement…</div>
  if (!token) return <Landing />
  return <Navigate to={user?.is_admin ? '/admin' : '/chat'} replace />
}

function PrivateRoute({ children }) {
  const { token, user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Chargement…</div>
  if (!token) return <Navigate to="/login" replace />
  if (user?.is_admin) return <Navigate to="/admin" replace />
  return children
}

function PublicRoute({ children }) {
  const { token, user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Chargement…</div>
  return token ? <Navigate to={user?.is_admin ? '/admin' : '/chat'} replace /> : children
}

function AdminRoute({ children }) {
  const { token, user, loading } = useAuth()
  if (loading) return <div className="loading-screen">Chargement…</div>
  if (!token) return <Navigate to="/login" replace />
  if (!user?.is_admin) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <span className="access-denied-icon">🔒</span>
          <h1>Accès refusé</h1>
          <p>Cette section est réservée aux administrateurs.</p>
          <Link className="landing-cta-primary" to="/chat">
            ← Retour à l'application
          </Link>
        </div>
      </div>
    )
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/" element={<HomeRoute />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/search"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  )
}
