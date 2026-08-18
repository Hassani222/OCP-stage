import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🔐', title: 'Authentification', text: 'Un compte sécurisé par utilisateur, protégé par JWT.' },
  { icon: '📄', title: 'Import de documents', text: 'PDF, DOCX ou TXT — importés et indexés automatiquement.' },
  { icon: '🔍', title: 'Recherche sémantique', text: 'Retrouvez les passages pertinents en langage naturel.' },
  { icon: '💬', title: 'Réponses sourcées', text: "Un LLM répond en s'appuyant uniquement sur vos documents." },
  { icon: '🕓', title: 'Historique', text: 'Toutes vos conversations sont sauvegardées et consultables.' },
  { icon: '📊', title: 'Tableau de bord', text: "Vue d'ensemble de l'activité pour les administrateurs." },
]

const GUIDE_STEPS = [
  {
    n: 1,
    title: 'Créez votre compte',
    text: "Inscrivez-vous avec votre email professionnel en quelques secondes, sans installation.",
  },
  {
    n: 2,
    title: 'Importez vos documents',
    text: 'Ajoutez vos fichiers PDF, DOCX ou TXT (5 Mo max chacun) depuis la barre latérale du chat.',
  },
  {
    n: 3,
    title: 'Posez votre question',
    text: 'Écrivez votre question en langage naturel, comme vous le feriez à un collègue.',
  },
  {
    n: 4,
    title: 'Obtenez une réponse sourcée',
    text: "L'assistant répond en s'appuyant uniquement sur vos documents, sans jamais inventer.",
  },
  {
    n: 5,
    title: 'Retrouvez vos échanges',
    text: "Chaque conversation est sauvegardée : reprenez-la, ou téléchargez-en un rapport.",
  },
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

      <section className="landing-about">
        <h2>Le rôle de Clarté</h2>
        <p>
          Dans une entreprise, l'information existe presque toujours déjà — dans une politique
          RH, une procédure, une note de service — mais elle est difficile à retrouver
          rapidement. Une recherche classique ne fonctionne que si on tape exactement les mots
          du document, et lire un fichier entier pour trouver une seule réponse fait perdre du
          temps à tout le monde.
        </p>
        <p>
          Clarté résout ce problème en <strong>comprenant le sens de vos questions</strong>, pas
          seulement les mots que vous employez. Une intelligence artificielle lit ensuite les
          passages les plus pertinents et rédige une réponse claire, directement
          compréhensible. Chaque réponse indique toujours de quel document elle provient, pour
          que vous puissiez vérifier l'information vous-même.
        </p>
        <p>
          Cette intelligence artificielle fonctionne <strong>entièrement chez vous</strong>, sans
          passer par un service extérieur : vos documents et vos questions restent toujours en
          interne, à l'abri.
        </p>
      </section>

      <section className="landing-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="landing-feature-card">
            <span className="landing-feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section className="landing-guide">
        <h2>Guide d'utilisation</h2>
        <div className="landing-guide-steps">
          {GUIDE_STEPS.map((step) => (
            <div key={step.n} className="landing-guide-step">
              <span className="landing-guide-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>Clarté — RAG d'entreprise, propulsé par un LLM open source.</p>
      </footer>
    </div>
  )
}
