# Rapport d'avancement — Clarté

**Chatbot intelligent RAG pour l'exploitation de documents d'entreprise**

Date : [à compléter]
Auteur : [Prénom NOM]

---

## Sommaire

1. Cahier des charges
2. Étude de besoin
3. Choix techniques
4. Conception (architecture RAG + interface utilisateur)
5. Réalisation

---

## 1. Cahier des charges

### 1.1. Contexte

Les collaborateurs de l'entreprise doivent aujourd'hui consulter manuellement des documents internes (politiques RH, procédures, notes de service) pour trouver une information précise. Cette recherche, effectuée par mots-clés ou par lecture intégrale des documents, est lente et ne garantit pas la pertinence du résultat.

### 1.2. Objectif du projet

Concevoir et développer **Clarté**, une application web de type chatbot permettant à un utilisateur d'interroger en langage naturel un ensemble de documents d'entreprise qu'il a lui-même importés, et d'obtenir une réponse synthétique, fiable et systématiquement accompagnée de sa source documentaire.

### 1.3. Périmètre fonctionnel

| # | Fonctionnalité |
|---|---|
| 1 | Authentification des utilisateurs (inscription, connexion, session sécurisée) |
| 2 | Import et gestion de documents (PDF, DOCX, TXT) |
| 3 | Extraction, découpage et indexation sémantique des documents |
| 4 | Recherche sémantique en langage naturel |
| 5 | Génération de réponses par un modèle de langage (LLM), avec sources |
| 6 | Historique des conversations |
| 7 | Tableau de bord administrateur (statistiques + gestion des comptes) |

### 1.4. Contraintes

- **Confidentialité** : les documents et questions des utilisateurs ne doivent jamais quitter l'infrastructure de l'entreprise (pas d'appel à une API LLM externe).
- **Isolation des données** : un utilisateur ne doit avoir accès qu'à ses propres documents.
- **Séparation des rôles** : l'espace administrateur doit être strictement séparé de l'espace utilisateur standard.
- **Performance** : le temps de réponse doit rester acceptable malgré l'exécution locale du modèle de langage (pas de GPU dédié dans l'environnement actuel).

### 1.5. Acteurs

- **Utilisateur** : importe des documents, pose des questions, consulte son historique.
- **Administrateur** : supervise l'usage de la plateforme et gère les comptes utilisateurs, sans accéder à l'espace de chat.

---

## 2. Étude de besoin

### 2.1. Besoins fonctionnels

**Authentification**
- Inscription par email/mot de passe, mot de passe haché (jamais stocké en clair).
- Connexion avec émission d'un jeton d'authentification (JWT) à durée de vie configurable.

**Documents**
- Import de fichiers PDF, DOCX, TXT, avec une taille maximale de 5 Mo par document.
- Liste et suppression des documents importés par l'utilisateur.

**Indexation**
- Découpage automatique du texte extrait en segments (chunks) de taille configurable, avec chevauchement.
- Génération d'un vecteur d'embedding par segment et stockage dans une base vectorielle.
- Conservation, pour chaque segment, d'une référence à son document source.

**Recherche et génération**
- Recherche sémantique des passages les plus pertinents par rapport à une question.
- Génération d'une réponse par un LLM, strictement fondée sur les passages récupérés (pas d'invention en l'absence d'information pertinente).
- Affichage progressif de la réponse au fur et à mesure de sa génération (streaming).
- Génération d'un rapport téléchargeable (question, réponse, source) par échange.

**Historique**
- Sauvegarde de chaque échange (question, réponse, sources), regroupé par conversation.
- Consultation, reprise et suppression d'une conversation.

**Administration**
- Tableau de bord présentant des statistiques globales d'usage (utilisateurs, documents, segments indexés, conversations, messages, volume de stockage).
- Gestion complète des comptes utilisateurs (création, modification du rôle et du mot de passe, suppression), avec garde-fous empêchant un administrateur de se retirer ses propres droits ou de supprimer son propre compte.

### 2.2. Besoins non fonctionnels

| Besoin | Détail |
|---|---|
| Confidentialité | Modèle de langage exécuté localement (Ollama) ; aucune donnée transmise à un service tiers |
| Isolation | Filtrage systématique des documents et résultats de recherche par identifiant de propriétaire |
| Sécurité | Mots de passe hachés (bcrypt), jetons signés (JWT), séparation stricte des privilèges |
| Performance perçue | Réponses affichées en streaming ; génération plafonnée en nombre de tokens |
| Ergonomie | Interface claire, cohérente, accessible au clavier |
| Portabilité | Application web, aucune installation cliente requise |

### 2.3. Principaux cas d'usage

1. Un utilisateur importe une politique RH puis demande *« Combien de jours de congés payés par an ? »* et obtient une réponse exacte avec la source citée.
2. Un utilisateur consulte directement les passages pertinents d'un document via la page de recherche, sans passer par le chat.
3. Un administrateur consulte le tableau de bord pour suivre l'adoption de l'outil et gérer les comptes.

---

## 3. Choix techniques

| Composant | Technologie retenue | Justification |
|---|---|---|
| Backend / API | **FastAPI** (Python) | Framework asynchrone performant, typage fort, documentation interactive générée automatiquement (Swagger), écosystème Python adapté à l'IA/ML |
| Orchestration RAG | **LangChain** | Abstractions standardisées pour le chargement de documents, le découpage et l'appel au LLM ; large intégration avec Ollama et ChromaDB |
| Base vectorielle | **ChromaDB** | Base vectorielle légère, embarquée, sans infrastructure serveur dédiée à gérer — adaptée à un déploiement simple |
| Embeddings | **Sentence-Transformers** (`all-MiniLM-L6-v2`) | Modèle open source léger, rapide en inférence CPU, bonnes performances sur la similarité sémantique multilingue/français |
| Modèle de langage (LLM) | **Ollama + Llama 3** | Exécution 100 % locale : critère décisif de confidentialité vis-à-vis des documents d'entreprise, contrairement à un appel à une API LLM externe (OpenAI, etc.) |
| Base relationnelle | **SQLite** (via SQLAlchemy) | Suffisante pour le volume actuel, sans serveur de base de données à administrer ; migration vers PostgreSQL possible sans changement de code applicatif (SQLAlchemy) |
| Authentification | **JWT** + **bcrypt** | Standard de l'industrie pour l'authentification API sans état (stateless) et le hachage de mots de passe |
| Frontend | **React** (Vite) | Écosystème mature, développement rapide, rendu réactif adapté à l'affichage en streaming des réponses |

**Alternative écartée** : l'utilisation d'une API LLM externe (OpenAI, Anthropic, etc.) a été écartée malgré une qualité de réponse potentiellement supérieure, car elle impliquerait la transmission de documents internes de l'entreprise à un service tiers — incompatible avec la contrainte de confidentialité du cahier des charges.

---

## 4. Conception

### 4.1. Architecture RAG

Le pipeline RAG se déroule en deux phases distinctes :

**Phase d'indexation (à l'import d'un document)**
```
Document (PDF/DOCX/TXT)
   → extraction du texte
   → découpage en segments (chunks)
   → génération des embeddings (Sentence-Transformers)
   → stockage dans ChromaDB (avec métadonnées : propriétaire, document d'origine)
```

**Phase de question/réponse (à chaque question posée)**
```
Question utilisateur
   → embedding de la question
   → recherche des k segments les plus proches dans ChromaDB (filtrés par propriétaire)
   → construction du contexte (segments + question)
   → génération de la réponse par le LLM (Ollama / Llama 3), en flux (streaming)
   → réponse affichée progressivement, sources déjà connues et affichées immédiatement
   → sauvegarde de l'échange dans l'historique
```

**Schéma d'architecture logicielle**

```
┌──────────────┐   REST + streaming HTTP   ┌───────────────────┐
│   Frontend    │ ────────────────────────▶ │      Backend       │
│  React + Vite │ ◀──────────────────────── │      FastAPI       │
└──────────────┘                            └─────────┬──────────┘
                                                        │
                     ┌──────────────────────────────────┼──────────────────────────────────┐
                     ▼                                   ▼                                   ▼
           ┌──────────────────┐             ┌──────────────────────┐             ┌────────────────────┐
           │  SQLite (SQLAlchemy)│           │   ChromaDB (vecteurs)  │           │  Ollama (Llama 3)    │
           │  utilisateurs,       │           │   embeddings des       │           │  génération de        │
           │  documents,          │           │   segments de          │           │  réponses en local    │
           │  conversations       │           │   documents            │           │                       │
           └──────────────────┘             └──────────────────────┘             └────────────────────┘
```

**Isolation multi-utilisateur** : chaque segment indexé dans ChromaDB porte l'identifiant du propriétaire du document en métadonnée. Toute recherche (recherche autonome ou retrieval pour le chat) applique systématiquement un filtre sur cet identifiant, garantissant qu'un utilisateur ne peut jamais recevoir de résultat provenant des documents d'un autre utilisateur.

### 4.2. Interface utilisateur

L'application est structurée en deux espaces visuellement et fonctionnellement distincts :

**Espace utilisateur**
- *Page d'accueil* : présentation publique de l'application, accès à la connexion/inscription.
- *Chat* : conversation avec l'assistant, réponses affichées en flux (effet de frappe), historique des conversations en barre latérale, import de documents, téléchargement d'un rapport par réponse.
- *Recherche* : interrogation directe de la base documentaire, indépendamment du chat, avec affichage des passages pertinents et de leur source.

**Espace administrateur**
- *Tableau de bord* : bandeau supérieur dédié (visuellement distinct de l'espace utilisateur), indicateurs agrégés (utilisateurs, documents, segments indexés, conversations, messages, volume de stockage) et table de gestion des comptes (création, modification, suppression). Un compte administrateur est automatiquement redirigé vers cet espace et n'a pas accès à l'interface de chat.

---

## 5. Réalisation

### 5.1. État d'avancement

L'ensemble du périmètre fonctionnel décrit dans le cahier des charges est **implémenté et fonctionnel de bout en bout** :

- ✅ Authentification (inscription, connexion, JWT)
- ✅ Import, extraction, découpage et indexation des documents
- ✅ Recherche sémantique autonome
- ✅ Génération de réponses RAG avec streaming et sources
- ✅ Historique des conversations
- ✅ Tableau de bord administrateur avec gestion complète des utilisateurs (CRUD)
- ✅ Séparation stricte des espaces utilisateur/administrateur
- ✅ Téléchargement de rapport par réponse
- ✅ Évaluation quantitative du pipeline RAG (harnais de test reproductible)

### 5.2. Résultats de l'évaluation quantitative

Un harnais d'évaluation automatisé (`backend/eval/run_evaluation.py`) mesure la qualité du système sur un jeu de test de 10 questions portant sur 2 documents :

| Métrique | Résultat |
|---|---|
| Hit Rate@k (pertinence du retrieval) | 100 % |
| MRR (Mean Reciprocal Rank) | 1,000 |
| Exactitude des réponses générées | 100 % |
| Sources citées correctes | 100 % |
| Latence moyenne de génération (CPU) | ≈ 40 s |

*Ces résultats, obtenus sur un jeu de test volontairement restreint, attestent de la faisabilité de l'approche ; un élargissement du corpus de test est prévu pour consolider ces mesures.*

### 5.3. Prochaines étapes envisagées

- Élargissement du jeu d'évaluation à un corpus documentaire plus large.
- Mise en place de tests automatisés (unitaires/intégration).
- Conteneurisation (Docker) pour faciliter le déploiement.
- Fonctionnalité de récupération de mot de passe en libre-service.

---

*Les prérequis techniques et le mode opératoire détaillé de déploiement font l'objet d'un document séparé : `GUIDE-DEPLOIEMENT.md`.*
