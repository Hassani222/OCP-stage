# Guide de déploiement — Clarté

## Prérequis

| Logiciel | Version | Rôle |
|---|---|---|
| Python | 3.10+ | Backend (FastAPI) |
| Node.js | 18+ | Frontend (React) |
| Ollama | dernière version | LLM local (génération des réponses) |
| Git | — | Récupération du code |

**Matériel** : 8 Go de RAM minimum, ~10 Go d'espace disque (dépendances + modèle LLM). GPU non requis (inférence CPU). Internet requis seulement à l'installation.

**Ports utilisés** : `8001` (backend), `5173` (frontend), `11434` (Ollama).

---

## Mode opératoire

### 1. Récupérer le code
```bash
git clone https://github.com/Hassani222/OCP-stage.git
cd rag-chatbot
```

### 2. Ollama (LLM)
```bash
ollama pull llama3          # télécharge le modèle (~4,7 Go)
ollama --version             # vérifier l'installation
```

### 3. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate         # Windows (source venv/bin/activate sur Linux/Mac)
pip install -r requirements.txt
copy .env.example .env        # cp sur Linux/Mac
uvicorn app.main:app --reload --port 8001
```
→ API disponible sur **http://localhost:8001** (doc interactive : `/docs`)

### 4. Frontend
```bash
cd frontend
npm install
copy .env.example .env        # cp sur Linux/Mac
npm run dev
```
→ Application disponible sur **http://localhost:5173**

### 5. Vérification
1. Ouvrir http://localhost:5173, créer un compte.
2. Importer un document (PDF/DOCX/TXT, 5 Mo max).
3. Poser une question dans le chat → une réponse doit s'afficher progressivement.
4. Pour un accès administrateur, ajouter son email dans `ADMIN_EMAILS` (`backend/.env`) avant de se connecter.

---

## Variables essentielles (`backend/.env`)

| Variable | Défaut | Rôle |
|---|---|---|
| `SECRET_KEY` | — | Clé de signature JWT — **à changer en production** |
| `OLLAMA_MODEL` | `llama3` | Modèle utilisé pour la génération |
| `ADMIN_EMAILS` | vide | Emails promus administrateur à la connexion |
| `MAX_UPLOAD_SIZE_MB` | 5 | Taille max par document |

## Problèmes fréquents

| Symptôme | Solution |
|---|---|
| Page ne charge pas | Vérifier que backend et frontend sont bien lancés (étapes 3 et 4) |
| « Une erreur s'est produite » dans le chat | Vérifier Ollama : `curl http://localhost:11434/api/tags` |
| Première réponse très lente (1-3 min) | Normal — chargement du modèle en mémoire ; les suivantes sont rapides |
