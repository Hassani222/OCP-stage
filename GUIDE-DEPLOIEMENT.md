# Guide de déploiement — Clarté

Ce document décrit les prérequis et le mode opératoire détaillé pour déployer l'application Clarté sur un poste (environnement de développement/démonstration, un seul poste hébergeant tous les composants).

---

## 1. Prérequis

### 1.1. Logiciels requis

| Logiciel | Version minimale | Rôle |
|---|---|---|
| Python | 3.10+ | Exécution du backend FastAPI |
| Node.js | 18+ | Build et exécution du frontend React |
| Ollama | dernière version | Exécution locale du modèle de langage (LLM) |
| Git | toute version récente | Récupération du code source |

### 1.2. Prérequis matériels

- CPU multi-cœurs récent (l'inférence du LLM s'exécute en CPU par défaut ; une carte GPU compatible accélérerait significativement la génération, mais n'est pas indispensable).
- Au moins 8 Go de RAM disponibles (le modèle Llama 3 8B occupe environ 4,7 Go une fois chargé en mémoire).
- Environ 10 Go d'espace disque libre (dépendances Python incluant PyTorch, modèle Llama 3, modèle d'embeddings).
- Connexion internet requise **uniquement lors de l'installation** (téléchargement des dépendances et du modèle LLM) ; l'application fonctionne ensuite entièrement hors ligne.

### 1.3. Ports réseau utilisés

| Port | Composant |
|---|---|
| 8001 | API backend (FastAPI) |
| 5173 | Frontend (serveur de développement Vite) |
| 11434 | Serveur Ollama |

*Remarque : le port 8000 est volontairement évité pour le backend — sur certains postes Windows avec Docker Desktop actif, le proxy réseau WSL2 intercepte silencieusement ce port. Le port 8001 est utilisé par défaut pour cette raison.*

---

## 2. Mode opératoire de déploiement

### Étape 1 — Récupérer le code source

```bash
git clone <URL_DU_DEPOT_GIT>
cd rag-chatbot
```

### Étape 2 — Installer et démarrer Ollama

1. Télécharger et installer Ollama depuis [ollama.com/download](https://ollama.com/download) (installation standard, sans droits administrateur particuliers).
2. Vérifier l'installation :
   ```bash
   ollama --version
   ```
3. Télécharger le modèle de langage utilisé par l'application (téléchargement d'environ 4,7 Go) :
   ```bash
   ollama pull llama3
   ```
4. Vérifier que le serveur Ollama répond :
   ```bash
   curl http://localhost:11434/api/tags
   ```
   La réponse doit contenir `llama3` dans la liste des modèles disponibles.

### Étape 3 — Configurer et démarrer le backend

```bash
cd backend
python -m venv venv

# Activation de l'environnement virtuel
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt
copy .env.example .env       # Windows (cp sur Linux/Mac)
```

Ouvrir le fichier `.env` généré et vérifier/ajuster les paramètres si nécessaire (voir §3 « Variables de configuration » ci-dessous). En particulier, pour disposer d'un compte administrateur, renseigner son adresse email dans `ADMIN_EMAILS`.

Démarrer le serveur :
```bash
uvicorn app.main:app --reload --port 8001
```

Vérification : l'API est accessible sur **http://localhost:8001**, documentation interactive sur **http://localhost:8001/docs**.

### Étape 4 — Configurer et démarrer le frontend

Dans un second terminal :
```bash
cd frontend
npm install
copy .env.example .env       # Windows (cp sur Linux/Mac)
```

Vérifier que `VITE_API_URL` dans `frontend/.env` correspond bien à l'adresse du backend (`http://localhost:8001`).

Démarrer le serveur de développement :
```bash
npm run dev
```

Vérification : l'application est accessible sur **http://localhost:5173**.

### Étape 5 — Vérification de bout en bout

1. Ouvrir http://localhost:5173 dans un navigateur.
2. Créer un compte utilisateur (page « Créer un compte »).
3. Importer un document (PDF, DOCX ou TXT, 5 Mo maximum).
4. Poser une question relative au contenu du document dans le chat et vérifier qu'une réponse cohérente s'affiche progressivement.
5. Si l'email utilisé figure dans `ADMIN_EMAILS` (backend/.env), se reconnecter avec ce compte : il doit être automatiquement redirigé vers le tableau de bord administrateur (`/admin`).

---

## 3. Variables de configuration

### Backend (`backend/.env`)

| Variable | Valeur par défaut | Description |
|---|---|---|
| `SECRET_KEY` | *(à changer)* | Clé secrète de signature des jetons JWT — **à générer aléatoirement avant tout déploiement réel** |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 1440 | Durée de validité d'un jeton de connexion (en minutes) |
| `DATABASE_URL` | `sqlite:///./rag_chatbot.db` | Base de données relationnelle |
| `CHROMA_PERSIST_DIR` | `./storage/chroma_db` | Dossier de persistance de la base vectorielle |
| `UPLOAD_DIR` | `./storage/uploads` | Dossier de stockage des fichiers importés |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | Modèle d'embeddings |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Adresse du serveur Ollama |
| `OLLAMA_MODEL` | `llama3` | Modèle de langage utilisé pour la génération |
| `CHUNK_SIZE` | 1000 | Taille des segments de découpage (en caractères) |
| `CHUNK_OVERLAP` | 150 | Chevauchement entre segments (en caractères) |
| `RETRIEVAL_K` | 4 | Nombre de segments récupérés par question |
| `ADMIN_EMAILS` | *(vide)* | Liste d'emails (séparés par des virgules) promus administrateur à la connexion |
| `MAX_UPLOAD_SIZE_MB` | 5 | Taille maximale par document importé |

### Frontend (`frontend/.env`)

| Variable | Valeur par défaut | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8001` | Adresse de l'API backend |

---

## 4. Arrêt et redémarrage

- Arrêter chaque service avec `Ctrl+C` dans son terminal respectif.
- Ollama fonctionne comme un service en arrière-plan une fois installé ; il n'a généralement pas besoin d'être relancé manuellement après un redémarrage du poste.
- Après un redémarrage du poste, relancer uniquement les étapes 3 et 4 (le backend et le frontend) — l'installation des dépendances (étapes 2 et 3, `pip install`/`npm install`) n'est requise qu'une seule fois.

## 5. Problèmes fréquents

| Symptôme | Cause probable | Solution |
|---|---|---|
| La page ne charge pas | Backend et/ou frontend non démarrés | Relancer les étapes 3 et 4 |
| Réponse « Une erreur s'est produite » dans le chat | Ollama non démarré ou modèle non téléchargé | Vérifier `curl http://localhost:11434/api/tags` |
| Erreur de connexion au backend depuis le frontend | Port 8001 déjà utilisé par un autre processus, ou `VITE_API_URL` incorrect | Vérifier qu'aucun autre processus n'écoute sur le port, vérifier `frontend/.env` |
| Import de document rejeté | Format non supporté ou fichier > 5 Mo | Utiliser un PDF/DOCX/TXT de moins de 5 Mo, ou ajuster `MAX_UPLOAD_SIZE_MB` |
| Première réponse du chat très lente (~1 à 3 min) | Chargement initial du modèle LLM en mémoire par Ollama (modèle déchargé après une période d'inactivité) | Comportement normal ; les réponses suivantes sont nettement plus rapides tant que le modèle reste chargé |
