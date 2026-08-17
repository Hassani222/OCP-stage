# Clarté

Chatbot intelligent RAG pour documents d'entreprise. Application web complète : import
de documents (PDF/DOCX/TXT), recherche sémantique, génération de réponses par un LLM
open source, affichage des sources, authentification, historique des conversations et
tableau de bord administrateur.

## Stack

| Composant          | Technologie                                  |
|--------------------|-----------------------------------------------|
| Langage backend    | Python (FastAPI)                              |
| Framework RAG      | LangChain                                     |
| Base vectorielle   | ChromaDB                                      |
| Embeddings         | Sentence Transformers (all-MiniLM-L6-v2)      |
| LLM                | Ollama (open source, local — ex : Llama3)     |
| Base relationnelle | SQLite (utilisateurs, conversations, docs)    |
| Frontend           | React.js (Vite)                               |

## Prérequis

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installé localement

## 1. Installer et démarrer Ollama

```bash
ollama pull llama3
ollama serve
```

## 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
copy .env.example .env       # Windows (cp sur Linux/Mac)

uvicorn app.main:app --reload --port 8000
```

L'API est disponible sur http://localhost:8000 (documentation interactive sur `/docs`).

## 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env       # Windows (cp sur Linux/Mac)
npm run dev
```

L'application est disponible sur http://localhost:5173.

## Utilisation

1. Créez un compte, connectez-vous.
2. Importez un ou plusieurs documents (PDF, DOCX, TXT) depuis la barre latérale.
3. Posez une question dans le chat : le système récupère les passages pertinents
   (recherche sémantique via ChromaDB) et génère une réponse via le LLM, avec les
   sources affichées sous la réponse.
4. Vos conversations sont sauvegardées et accessibles depuis l'historique.

## Architecture du pipeline RAG

```
Import document → extraction texte → découpage en chunks →
embeddings (Sentence Transformers) → stockage ChromaDB
                                            ↓
Question utilisateur → recherche sémantique (top-k, filtrée par utilisateur) →
contexte + question → LLM (Ollama) → réponse + sources affichées
```

## Structure du projet

```
rag-chatbot/
├── backend/
│   └── app/
│       ├── main.py            # point d'entrée FastAPI
│       ├── config.py          # configuration (.env)
│       ├── models.py          # modèles SQLAlchemy
│       ├── auth.py            # JWT, hachage des mots de passe
│       ├── rag/                # pipeline RAG (loaders, splitter, embeddings, vectorstore, chain)
│       └── routers/            # endpoints auth, documents, chat, history
└── frontend/
    └── src/
        ├── pages/              # Login, Register, Chat
        ├── components/         # Sidebar, DocumentUpload, MessageBubble
        └── context/            # AuthContext (JWT)
```

## Notes

- Chaque utilisateur ne voit que ses propres documents (filtrage par `owner_id` dans ChromaDB).
- Pour changer de modèle LLM, modifiez `OLLAMA_MODEL` dans `backend/.env` (ex : `mistral`, `phi3`).
- Les données (SQLite + ChromaDB) sont stockées localement dans `backend/storage/` et `backend/rag_chatbot.db`.
