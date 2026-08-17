import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🔐', title: 'Authentification', text: 'Un compte sécurisé par utilisateur, protégé par JWT.' },
  { icon: '📄', title: 'Import de documents', text: 'PDF, DOCX ou TXT — importés et indexés automatiquement.' },
  { icon: '🔍', title: 'Recherche sémantique', text: 'Retrouvez les passages pertinents en langage naturel.' },
  { icon: '💬', title: 'Réponses sourcées', text: "Un LLM répond en s'appuyant uniquement sur vos documents." },
  { icon: '🕓', title: 'Historique', text: 'Toutes vos conversations sont sauvegardées et consultables.' },
  { icon: '📊', title: 'Tableau de bord', text: "Vue d'ensemble de l'activité pour les administrateurs." },
]

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <span className="brand">Clarté</span>
        <nav className="landing-nav">
          <Link to="/login" className="landing-nav-link">
            Se connecter
          </Link>
          <Link to="/register" className="landing-nav-btn">
            Créer un compte
          </Link>
        </nav>
      </header>

      <main className="landing-hero">
        <h1>Vos documents d'entreprise, enfin faciles à interroger.</h1>
        <p className="landing-subtitle">
          Clarté importe vos documents internes, les indexe, et répond à vos questions en
          langage naturel — avec les sources à l'appui, à chaque réponse.
        </p>
        <div className="landing-cta">
          <Link to="/register" className="landing-cta-primary">
            Commencer gratuitement
          </Link>
          <Link to="/login" className="landing-cta-secondary">
            J'ai déjà un compte
          </Link>
        </div>
      </main>

      <section className="landing-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="landing-feature-card">
            <span className="landing-feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <p>Clarté — RAG d'entreprise, propulsé par un LLM open source.</p>
      </footer>
    </div>
  )
}
