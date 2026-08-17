PROJET DE FIN D'ANNÉE
4ème Année en Ingénierie Informatique et Réseaux

Réalisé par : [Prénom NOM]

Tuteur(s) :
Encadrant Professionnel : [Prénom NOM]
Encadrant Pédagogique : [Prénom NOM]

Au sein de : OCP Group (Office Chérifien des Phosphates)

Année universitaire : [20xx/20xx]

# Clarté — Conception et développement d'un chatbot intelligent basé sur les techniques Retrieval-Augmented Generation (RAG) pour l'exploitation de documents d'entreprise

---

## Dédicaces

*[Section personnelle — à rédiger par l'étudiant. Généralement dédiée aux membres de la famille et aux proches ayant apporté un soutien moral durant l'année.]*

---

## Remerciements

*[Section personnelle — à rédiger par l'étudiant en une dizaine de lignes maximum, citant nommément l'encadrant professionnel, l'encadrant pédagogique, et toute personne ayant contribué au bon déroulement du projet. Ne pas y inclure les membres du jury.]*

---

## Table des matières

- Introduction générale ..................................................................... 1
- Chapitre 1 : Présentation du cadre de projet ................................. 2
  1. Introduction
  2. Présentation de l'OCP
  3. Étude de l'existant
     3.1. Description de l'existant
     3.2. Critique de l'existant
     3.3. Solution proposée
  4. Choix du modèle de développement
  5. Planning prévisionnel
  6. Conclusion
- Chapitre 2 : Spécification des besoins .......................................... 5
  1. Introduction
  2. Spécification des besoins fonctionnels
  3. Spécification des besoins non fonctionnels
  4. Présentation des cas d'utilisation
     4.1. Présentation des acteurs
     4.2. Description des cas d'utilisation
     4.3. Diagramme des cas d'utilisation global
- Chapitre 3 : Conception du système ............................................. 9
  1. Introduction
  2. Modélisation dynamique
  3. Modélisation statique
  4. Conclusion
- Chapitre 4 : Réalisation du système ............................................ 14
  1. Introduction
  2. Environnement de développement
  3. Principales interfaces graphiques
  4. Conclusion
- Conclusion générale ...................................................................... 18
- Bibliographie et Nétographie ......................................................... 19
- Annexes ......................................................................................... 20

*(Numérotation indicative — à régénérer automatiquement dans Word via Références > Table des matières une fois le document mis en forme selon les styles de titres.)*

---

## Liste des figures

*[À compléter automatiquement dans Word une fois les captures d'écran insérées. Figures suggérées, dans l'ordre d'apparition :]*
- Figure 1 : Architecture globale de l'application Clarté
- Figure 2 : Pipeline RAG — de l'import du document à la réponse générée
- Figure 3 : Diagramme de cas d'utilisation global
- Figure 4 : Diagramme de séquence — Authentification
- Figure 5 : Diagramme de séquence — Question/réponse RAG (avec streaming)
- Figure 6 : Diagramme de classes
- Figure 7 : Page d'accueil (Landing)
- Figure 8 : Page de connexion
- Figure 9 : Interface de chat avec réponse en streaming
- Figure 10 : Page de recherche sémantique
- Figure 11 : Tableau de bord administrateur

## Liste des tableaux

- Tableau 1 : Planning prévisionnel
- Tableau 2 : Description du cas d'utilisation « Poser une question »
- Tableau 3 : Description du cas d'utilisation « Gérer les utilisateurs »
- Tableau 4 : Dictionnaire de données — table `users`
- Tableau 5 : Dictionnaire de données — table `documents`
- Tableau 6 : Dictionnaire de données — table `conversations`
- Tableau 7 : Dictionnaire de données — table `messages`
- Tableau 8 : Résultats de l'évaluation quantitative du RAG

---

## Introduction générale

Dans un contexte où les entreprises accumulent chaque année un volume croissant de documents internes — politiques RH, procédures, comptes rendus, notes de service — l'accès rapide et fiable à l'information qu'ils contiennent devient un enjeu opérationnel majeur. La recherche par mots-clés classique montre ses limites dès que la question posée ne correspond pas exactement au vocabulaire du document, et la lecture manuelle de longs fichiers pour retrouver une information ponctuelle représente une perte de temps considérable pour les collaborateurs.

C'est dans cette optique que s'inscrit notre projet de fin d'année, réalisé au sein de l'OCP Group, dont l'objectif est de concevoir et développer **Clarté**, un chatbot intelligent d'entreprise fondé sur les techniques de **Retrieval-Augmented Generation (RAG)**. Cette approche combine la recherche sémantique — pour retrouver, parmi des documents internes, les passages les plus pertinents par rapport à une question posée en langage naturel — et la génération de texte par un grand modèle de langage (LLM), afin de produire une réponse claire, contextualisée et systématiquement appuyée sur des sources vérifiables.

La problématique à laquelle ce projet répond peut se formuler ainsi : *comment permettre à un collaborateur d'obtenir, en langage naturel et en quelques secondes, une réponse fiable et sourcée à partir des documents internes de l'entreprise, sans dépendre d'un service externe qui exposerait des données sensibles hors de l'organisation ?*

Le présent rapport est structuré en quatre chapitres. Le premier chapitre présente le cadre général du projet : l'organisme d'accueil, l'étude de l'existant et la solution envisagée. Le deuxième chapitre détaille la spécification des besoins fonctionnels et non fonctionnels ainsi que les cas d'utilisation. Le troisième chapitre expose la conception du système, tant du point de vue dynamique que statique. Enfin, le quatrième chapitre décrit la réalisation concrète de l'application, l'environnement de développement utilisé et les principales interfaces graphiques obtenues.

---

## Chapitre 1 : Présentation du cadre de projet

### 1. Introduction

Ce chapitre a pour objectif de situer le projet dans son contexte. Il présente successivement l'organisme d'accueil, une étude de l'existant en matière de gestion et de consultation des documents internes, la critique de cet existant, la solution proposée, le modèle de développement retenu ainsi que le planning prévisionnel suivi durant la période du stage.

### 2. Présentation de l'OCP

*[Section à personnaliser avec les informations exactes du site/département d'accueil. Éléments de cadrage général fournis à titre de base :]*

L'**OCP Group** (Office Chérifien des Phosphates) est une entreprise marocaine fondée en 1920, leader mondial sur le marché des phosphates et de leurs dérivés (engrais notamment). Le groupe est présent sur l'ensemble de la chaîne de valeur, de l'extraction du phosphate brut dans ses sites miniers (Khouribga, Benguerir, Youssoufia) jusqu'à la transformation industrielle dans ses complexes chimiques (Jorf Lasfar, Safi), et exporte ses produits vers de nombreux marchés internationaux. Le groupe emploie plusieurs dizaines de milliers de collaborateurs et occupe une place stratégique dans l'économie marocaine.

*[À compléter : direction/département d'accueil précis, effectif de l'équipe, outils informatiques déjà en place dans ce service, organigramme simplifié.]*

**Attention** : cette section ne doit pas prendre la forme d'une communication institutionnelle ; elle doit rester factuelle et se concentrer, en particulier, sur le département d'accueil et les outils numériques qui y sont utilisés.

### 3. Étude de l'existant

#### 3.1. Description de l'existant

Au sein de l'organisme d'accueil, la consultation des documents internes (politiques, procédures, notes de service) repose aujourd'hui sur des méthodes classiques : partages réseau, arborescences de dossiers, ou moteurs de recherche interne limités à la recherche par mots-clés exacts. Un collaborateur souhaitant connaître, par exemple, le nombre de jours de congé maladie ou les modalités de télétravail doit localiser manuellement le document concerné puis le parcourir intégralement pour trouver l'information recherchée.

#### 3.2. Critique de l'existant

Cette approche présente plusieurs limites :
- **Recherche par mots-clés stricts** : une question formulée différemment du vocabulaire exact du document ne renvoie aucun résultat pertinent.
- **Absence de synthèse** : l'utilisateur doit lire et interpréter lui-même le document, sans réponse directe à sa question.
- **Perte de temps** : la recherche manuelle d'une information ponctuelle dans un document long est chronophage.
- **Aucune traçabilité de la source** : lorsqu'une réponse est obtenue par un collègue ou par une recherche informelle, l'origine exacte de l'information n'est pas toujours vérifiable.
- **Silos documentaires** : chaque utilisateur ne dispose pas nécessairement d'une vue consolidée de l'ensemble des documents pertinents à son besoin.

#### 3.3. Solution proposée

Pour répondre à ces limites, nous proposons **Clarté**, une application web permettant :
- l'import de documents d'entreprise (PDF, DOCX, TXT) ;
- leur découpage automatique en segments (chunks) et leur indexation sémantique dans une base vectorielle ;
- l'interrogation en langage naturel, via un chatbot, avec génération de réponses **exclusivement fondées sur le contenu des documents importés** ;
- l'affichage systématique des sources ayant permis de générer chaque réponse ;
- une recherche sémantique autonome, indépendante du chat, pour consulter directement les passages pertinents ;
- un tableau de bord administrateur pour le suivi de l'usage et la gestion des comptes utilisateurs.

Un point de conception essentiel distingue ce projet des solutions RAG s'appuyant sur des API LLM externes (OpenAI, Anthropic, etc.) : Clarté utilise un **modèle de langage exécuté localement** (via Ollama), garantissant qu'aucun document d'entreprise n'est transmis à un service tiers — un critère déterminant dans un contexte industriel où la confidentialité des données est stratégique.

### 4. Choix du modèle de développement

Le projet a été mené selon une démarche **itérative et incrémentale**, proche des principes agiles : chaque fonctionnalité (authentification, import de documents, recherche sémantique, génération de réponses, historique, tableau de bord administrateur, streaming des réponses, etc.) a été spécifiée, développée, testée puis validée indépendamment avant l'intégration de la fonctionnalité suivante. Cette approche a permis d'obtenir, dès les premières itérations, une application fonctionnelle de bout en bout, puis de l'enrichir progressivement — ce qui est particulièrement adapté à un projet dont le périmètre s'est précisé au fil de l'avancement, plutôt qu'entièrement figé en amont.

### 5. Planning prévisionnel

**Tableau 1 : Planning prévisionnel**

| Étape | Semaines 1-2 | Semaines 3-4 | Semaines 5-6 | Semaines 7-8 |
|---|---|---|---|---|
| Étude préalable et spécification des besoins | ✕ | | | |
| Conception (architecture, modélisation) | ✕ | ✕ | | |
| Réalisation — socle (auth, import, RAG de base) | | ✕ | ✕ | |
| Réalisation — fonctionnalités avancées (recherche, admin, streaming) | | | ✕ | ✕ |
| Tests, évaluation quantitative et rédaction du rapport | | | | ✕ |

*[À ajuster avec les dates réelles du stage.]*

### 6. Conclusion

Ce chapitre a permis de situer le projet dans son contexte organisationnel, d'identifier les limites de la gestion documentaire actuelle et de poser les bases de la solution retenue. Le chapitre suivant détaille la spécification des besoins fonctionnels et non fonctionnels de l'application Clarté.

---

## Chapitre 2 : Spécification des besoins

### 1. Introduction

Ce chapitre présente les besoins fonctionnels et non fonctionnels auxquels doit répondre l'application, ainsi que les principaux cas d'utilisation identifiés.

### 2. Spécification des besoins fonctionnels

**2.1. Authentification et gestion des comptes**
- 2.1.1. Un utilisateur peut créer un compte (email + mot de passe).
- 2.1.2. Un utilisateur peut se connecter et obtient un jeton d'authentification (JWT) valable pour une durée configurable.
- 2.1.3. Chaque requête protégée vérifie ce jeton sans jamais retransmettre le mot de passe.

**2.2. Import et gestion des documents**
- 2.2.1. Un utilisateur peut importer un document au format PDF, DOCX ou TXT.
- 2.2.2. La taille de chaque document est limitée (5 Mo) afin de préserver les performances d'indexation.
- 2.2.3. Un utilisateur peut consulter la liste de ses documents et en supprimer un, ce qui supprime également ses données vectorielles associées.

**2.3. Extraction et indexation des documents**
- 2.3.1. Le texte de chaque document est extrait puis découpé en segments (chunks) de taille configurable.
- 2.3.2. Chaque segment est converti en vecteur numérique (embedding) et stocké dans une base vectorielle.
- 2.3.3. Chaque segment conserve une référence à son document d'origine (nom de fichier, identifiant).

**2.4. Recherche sémantique**
- 2.4.1. Un utilisateur peut interroger directement la base documentaire (page « Recherche »), indépendamment du chat, et obtenir les passages les plus pertinents.
- 2.4.2. La recherche est strictement limitée aux documents appartenant à l'utilisateur connecté.

**2.5. Génération de réponses (chat RAG)**
- 2.5.1. Un utilisateur peut poser une question en langage naturel.
- 2.5.2. Le système récupère les passages les plus pertinents et les transmet, avec la question, à un modèle de langage local.
- 2.5.3. La réponse générée s'appuie exclusivement sur le contenu récupéré ; si aucune information pertinente n'est trouvée, le système l'indique explicitement plutôt que d'inventer une réponse.
- 2.5.4. La réponse est affichée progressivement (streaming) au fur et à mesure de sa génération, afin de réduire le temps d'attente perçu.
- 2.5.5. Un utilisateur peut télécharger un rapport (question, réponse, source) pour chaque échange.

**2.6. Historique des conversations**
- 2.6.1. Chaque échange (question, réponse, sources) est sauvegardé et rattaché à une conversation et à un utilisateur.
- 2.6.2. Un utilisateur peut consulter, reprendre ou supprimer une conversation existante.

**2.7. Administration**
- 2.7.1. Un compte administrateur dispose d'un tableau de bord dédié, distinct de l'espace utilisateur standard, présentant des statistiques globales (nombre d'utilisateurs, de documents, de segments indexés, de conversations, de messages, volume de stockage).
- 2.7.2. L'administrateur peut créer, modifier (email, rôle, mot de passe) et supprimer un compte utilisateur.
- 2.7.3. Un utilisateur non-administrateur n'a accès à aucune fonctionnalité d'administration.

### 3. Spécification des besoins non fonctionnels

- **Confidentialité** : aucun document ni aucune question posée par un utilisateur n'est transmis à un service tiers ; le modèle de langage est exécuté localement.
- **Isolation des données** : un utilisateur ne peut consulter, rechercher ou interroger que ses propres documents (filtrage systématique par identifiant de propriétaire au niveau de la base vectorielle).
- **Performance** : la génération de réponse est plafonnée en nombre de tokens et le retrieval est limité à un nombre configurable de passages, afin de contenir le temps de réponse ; l'affichage en streaming améliore la réactivité perçue.
- **Sécurité** : mots de passe hachés (bcrypt), authentification par jeton signé (JWT), séparation stricte des privilèges administrateur/utilisateur avec garde-fous (un administrateur ne peut ni supprimer ni se retirer ses propres droits).
- **Ergonomie** : interface claire, cohérente visuellement, accessible (contrastes, focus clavier).
- **Portabilité** : application web utilisable depuis n'importe quel navigateur moderne, sans installation cliente.

### 4. Présentation des cas d'utilisation

#### 4.1. Présentation des acteurs

- **Utilisateur** : collaborateur de l'entreprise. Peut s'inscrire, se connecter, importer des documents, poser des questions, consulter son historique, effectuer des recherches sémantiques et télécharger des rapports.
- **Administrateur** : rôle attribué à certains comptes (via une liste d'emails autorisés). Accède exclusivement au tableau de bord d'administration (statistiques et gestion des comptes utilisateurs) ; n'utilise pas l'espace de chat.

#### 4.2. Description des cas d'utilisation

**Tableau 2 : Description du cas d'utilisation « Poser une question » pour l'acteur Utilisateur**

| | |
|---|---|
| **Cas n°** | 1 |
| **Acteur(s)** | Utilisateur |
| **Objectif** | Obtenir une réponse fiable et sourcée à une question portant sur ses documents importés. |
| **Pré-condition(s)** | L'utilisateur est authentifié et a importé au moins un document. |
| **Post-condition(s)** | Une réponse est affichée, accompagnée des sources documentaires utilisées ; l'échange est sauvegardé dans l'historique. |
| **Scénario nominal** | 1. L'utilisateur saisit sa question. 2. Le système recherche les passages pertinents (recherche sémantique). 3. Le système transmet la question et le contexte au modèle de langage. 4. La réponse est générée et affichée progressivement. 5. L'échange est enregistré. |
| **Scénario alternatif** | Si aucun passage pertinent n'est trouvé, le système informe l'utilisateur qu'aucune information n'est disponible plutôt que de générer une réponse. |

**Tableau 3 : Description du cas d'utilisation « Gérer les utilisateurs » pour l'acteur Administrateur**

| | |
|---|---|
| **Cas n°** | 2 |
| **Acteur(s)** | Administrateur |
| **Objectif** | Créer, modifier ou supprimer un compte utilisateur depuis le tableau de bord. |
| **Pré-condition(s)** | L'administrateur est authentifié et reconnu comme tel par le système. |
| **Post-condition(s)** | Le compte est créé, mis à jour ou supprimé ; en cas de suppression, les documents et données vectorielles associés sont également supprimés. |
| **Scénario nominal** | 1. L'administrateur accède au tableau de bord. 2. Il consulte la liste des utilisateurs. 3. Il crée/modifie/supprime un compte. 4. Le tableau de bord est actualisé. |
| **Scénario alternatif** | Le système refuse toute tentative de l'administrateur de supprimer ou de retirer ses propres droits d'administration. |

#### 4.3. Diagramme des cas d'utilisation global

*[À insérer : diagramme UML représentant les deux acteurs (Utilisateur, Administrateur) et leurs cas d'utilisation respectifs — S'inscrire, Se connecter, Importer un document, Supprimer un document, Rechercher, Poser une question, Consulter l'historique, Télécharger un rapport pour l'acteur Utilisateur ; Consulter le tableau de bord, Créer/Modifier/Supprimer un utilisateur pour l'acteur Administrateur — réalisé avec un outil tel que StarUML, Visual Paradigm ou draw.io.]*

**Figure 3 : Diagramme de cas d'utilisation global**

---

## Chapitre 3 : Conception du système

### 1. Introduction

Ce chapitre présente la conception de l'application selon les deux points de vue complémentaires du langage UML : la modélisation dynamique, qui décrit le comportement du système au fil du temps, et la modélisation statique, qui décrit sa structure de données et son architecture.

### 2. Modélisation dynamique

#### 2.1. Diagramme de séquence — Authentification

Le scénario d'authentification se déroule comme suit : l'utilisateur saisit son email et son mot de passe ; le frontend transmet ces informations au backend (`POST /auth/login`) ; le backend vérifie le mot de passe (comparaison avec le hash bcrypt stocké) puis, si la vérification réussit, génère un jeton JWT signé et le retourne. Ce jeton est ensuite joint à chaque requête ultérieure via l'en-tête `Authorization`, permettant au backend d'identifier l'utilisateur sans revalidation du mot de passe.

**Figure 4 : Diagramme de séquence — Authentification** *[à réaliser sous UML2]*

#### 2.2. Diagramme de séquence — Question/réponse RAG

Ce scénario illustre le cœur fonctionnel de l'application :
1. L'utilisateur envoie une question depuis l'interface de chat.
2. Le backend crée (ou réutilise) une conversation et enregistre le message utilisateur.
3. Le backend effectue une recherche sémantique (`similarity_search`) dans ChromaDB, filtrée par l'identifiant du propriétaire, et récupère les *k* passages les plus proches.
4. Les sources sont immédiatement connues à ce stade et transmises au frontend via les en-têtes de la réponse HTTP, avant même le début de la génération.
5. Le contexte (passages récupérés) et la question sont transmis au modèle de langage (Ollama / llama3), qui génère la réponse **token par token**.
6. Chaque fragment de texte généré est transmis immédiatement au frontend (streaming HTTP), qui l'affiche au fur et à mesure.
7. Une fois la génération terminée, la réponse complète est enregistrée dans l'historique avec ses sources.

**Figure 5 : Diagramme de séquence — Question/réponse RAG (avec streaming)** *[à réaliser sous UML2]*

#### 2.3. Diagramme d'activité — Import et indexation d'un document

Le processus d'import se déroule selon l'enchaînement suivant : dépôt du fichier → vérification du format (PDF/DOCX/TXT) et de la taille (≤ 5 Mo) → extraction du texte → découpage en segments → génération des embeddings → indexation dans ChromaDB avec métadonnées (propriétaire, document d'origine) → mise à jour du nombre de segments en base relationnelle. En cas d'échec à une étape quelconque, le document et son fichier physique sont supprimés pour éviter tout état incohérent.

*[À réaliser sous forme de diagramme d'activité UML.]*

### 3. Modélisation statique

#### 3.1. Diagramme de classes

Le modèle de données relationnel s'articule autour de quatre entités principales :

- **User** : représente un compte (utilisateur ou administrateur).
- **Document** : représente un fichier importé par un utilisateur.
- **Conversation** : regroupe une suite d'échanges entre un utilisateur et l'assistant.
- **Message** : représente un échange individuel (question ou réponse) au sein d'une conversation.

Relations : un `User` possède plusieurs `Document` et plusieurs `Conversation` (relations 1,n) ; une `Conversation` contient plusieurs `Message` (relation 1,n). La suppression d'un utilisateur ou d'une conversation entraîne la suppression en cascade des entités qui lui sont rattachées.

**Figure 6 : Diagramme de classes** *[à réaliser — attributs et méthodes détaillés ci-dessous dans le dictionnaire de données]*

#### 3.2. Modèle relationnel

```
User (id, email, hashed_password, is_admin, created_at)
Document (id, owner_id#, filename, stored_path, chunk_count, uploaded_at)
Conversation (id, owner_id#, title, created_at)
Message (id, conversation_id#, role, content, sources, created_at)
```//
(# = clé étrangère)

#### 3.3. Dictionnaire de données

**Tableau 4 : Dictionnaire de données — table `users`**

| Nom de la colonne | Type | Obligatoire | Valeur par défaut | Clé |
|---|---|---|---|---|
| id | Entier | Oui | auto-incrément | Primaire |
| email | Texte | Oui | — | Unique |
| hashed_password | Texte | Oui | — | — |
| is_admin | Booléen | Oui | Faux | — |
| created_at | Date/heure | Non | horodatage courant | — |

**Tableau 5 : Dictionnaire de données — table `documents`**

| Nom de la colonne | Type | Obligatoire | Clé |
|---|---|---|---|
| id | Entier | Oui | Primaire |
| owner_id | Entier | Oui | Étrangère → users.id |
| filename | Texte | Oui | — |
| stored_path | Texte | Oui | — |
| chunk_count | Entier | Non (déf. 0) | — |
| uploaded_at | Date/heure | Non | — |

**Tableau 6 : Dictionnaire de données — table `conversations`**

| Nom de la colonne | Type | Obligatoire | Clé |
|---|---|---|---|
| id | Entier | Oui | Primaire |
| owner_id | Entier | Oui | Étrangère → users.id |
| title | Texte | Non | — |
| created_at | Date/heure | Non | — |

**Tableau 7 : Dictionnaire de données — table `messages`**

| Nom de la colonne | Type | Obligatoire | Clé |
|---|---|---|---|
| id | Entier | Oui | Primaire |
| conversation_id | Entier | Oui | Étrangère → conversations.id |
| role | Texte (« user »/« assistant ») | Oui | — |
| content | Texte long | Oui | — |
| sources | Texte (JSON) | Non | — |
| created_at | Date/heure | Non | — |

*(Les segments de documents et leurs vecteurs ne sont pas stockés dans la base relationnelle mais dans la base vectorielle ChromaDB, sous forme de collection indexée par métadonnées `owner_id`, `document_id` et `filename`.)*

#### 3.4. Architecture de l'application

##### 3.4.1. Architecture logicielle

L'application suit une architecture **client-serveur découplée** :

- **Frontend** : application monopage (SPA) développée en **React** (build via **Vite**), communiquant avec le backend par API REST et par flux HTTP (streaming) pour les réponses du chatbot.
- **Backend** : API développée en **Python** avec le framework **FastAPI**, orchestrant :
  - l'authentification (JWT, hachage bcrypt) ;
  - le pipeline RAG via **LangChain** (chargement de documents, découpage, embeddings, orchestration du LLM) ;
  - la persistance relationnelle via **SQLAlchemy** (SQLite) ;
  - la base vectorielle **ChromaDB** pour la recherche sémantique ;
  - la génération de texte via **Ollama**, exécutant localement un modèle **Llama 3**.
- **Séparation stricte des espaces** : l'interface utilisateur (chat, recherche, historique) et l'interface d'administration constituent deux espaces visuellement et fonctionnellement distincts, un compte administrateur n'accédant jamais à l'espace utilisateur standard.

**Figure 1 : Architecture globale de l'application Clarté**

```
┌─────────────┐        REST / streaming HTTP        ┌──────────────────┐
│   Frontend   │ ───────────────────────────────────▶ │      Backend       │
│  React + Vite│ ◀─────────────────────────────────── │     FastAPI        │
└─────────────┘                                        └─────────┬─────────┘
                                                                    │
                                    ┌───────────────────────────────┼───────────────────────────────┐
                                    ▼                                ▼                                ▼
                          ┌──────────────────┐          ┌──────────────────────┐          ┌──────────────────┐
                          │   SQLite (SQLAlchemy) │      │  ChromaDB (vecteurs)   │          │  Ollama (Llama 3)  │
                          │ users, documents,      │      │  embeddings des        │          │  génération locale  │
                          │ conversations, messages│      │  segments de documents │          │  de réponses        │
                          └──────────────────┘          └──────────────────────┘          └──────────────────┘
```

##### 3.4.2. Architecture matérielle

L'application est déployée, dans le cadre du projet, sur un poste de travail unique exécutant l'ensemble des composants (frontend, backend, base de données, base vectorielle et serveur Ollama). Dans une perspective de déploiement en production au sein de l'entreprise, ces composants seraient répartis sur des nœuds distincts (serveur d'application, serveur de base de données, serveur d'inférence LLM disposant idéalement d'une accélération GPU), communiquant via le réseau interne de l'entreprise, sans aucune exposition à internet, afin de préserver la confidentialité des documents traités.

### 4. Conclusion

Ce chapitre a présenté la conception du système, tant du point de vue de son comportement dynamique (scénarios d'authentification et de génération de réponse) que de sa structure statique (modèle de données et architecture logicielle). Le chapitre suivant détaille la réalisation concrète de cette conception.

---

## Chapitre 4 : Réalisation du système

### 1. Introduction

Ce chapitre présente l'environnement de développement utilisé pour la réalisation de Clarté ainsi que les principales interfaces graphiques obtenues.

### 2. Environnement de développement

#### 2.1. Environnement matériel

*[À compléter avec les caractéristiques réelles du poste de développement : processeur, mémoire, système d'exploitation.]* Le développement a été réalisé sur un poste sous Windows, sans accélération GPU dédiée, le modèle de langage étant exécuté en inférence CPU via Ollama.

#### 2.2. Environnement logiciel

| Composant | Technologie |
|---|---|
| Langage backend | Python 3.13 |
| Framework API | FastAPI |
| Framework RAG | LangChain |
| Base vectorielle | ChromaDB |
| Modèle d'embeddings | Sentence Transformers (`all-MiniLM-L6-v2`) |
| Modèle de langage (LLM) | Llama 3 (via Ollama, exécution locale) |
| Base relationnelle | SQLite (via SQLAlchemy) |
| Frontend | React 18 (Vite) |
| Authentification | JWT (python-jose), bcrypt (passlib) |
| Éditeur / outils | Visual Studio Code, Git |

### 3. Principales interfaces graphiques

*[Les captures d'écran réelles de l'application doivent être insérées ici, chacune accompagnée d'un court paragraphe explicatif, conformément à la consigne du guide.]*

- **Page d'accueil** : page publique présentant l'application et ses fonctionnalités, avec accès à la connexion et à l'inscription.
- **Connexion / Inscription** : formulaires d'authentification classiques, avec gestion des erreurs (email déjà utilisé, identifiants incorrects).
- **Interface de chat** : zone de conversation avec l'assistant, réponses affichées progressivement (effet de frappe), bouton de téléchargement du rapport de réponse (question, réponse, source), historique des conversations dans la barre latérale, import de documents.
- **Page de recherche sémantique** : champ de recherche indépendant renvoyant directement les passages documentaires les plus pertinents, sans passer par la génération LLM.
- **Tableau de bord administrateur** : espace visuellement distinct (bandeau supérieur dédié), présentant des indicateurs agrégés (nombre d'utilisateurs, de documents, de segments indexés, de conversations, de messages, volume de stockage) ainsi qu'un tableau de gestion des comptes utilisateurs (création, modification du rôle et du mot de passe, suppression).

### 4. Conclusion

La réalisation du projet a permis d'aboutir à une application fonctionnelle de bout en bout, couvrant l'ensemble du pipeline RAG — de l'import du document à la génération de réponses sourcées — ainsi que les fonctionnalités transverses attendues d'une application d'entreprise (authentification, historique, administration). Une évaluation quantitative a par ailleurs été menée pour objectiver la qualité du système (voir Tableau 8), mesurant à la fois la pertinence du retrieval et la fidélité des réponses générées par rapport aux documents sources.

**Tableau 8 : Résultats de l'évaluation quantitative du RAG**

| Métrique | Résultat |
|---|---|
| Hit Rate@k (retrieval) | 100 % |
| MRR (Mean Reciprocal Rank) | 1,000 |
| Exactitude des réponses générées | 100 % |
| Sources citées correctes | 100 % |
| Latence moyenne de génération (CPU) | ≈ 40 s |

*Note méthodologique à faire figurer dans le rapport : ces résultats ont été obtenus sur un jeu de test volontairement restreint (10 questions, 2 documents), représentatif de la faisabilité du système plutôt que d'une garantie de performance à grande échelle ; un élargissement du jeu de test constitue une piste d'amélioration identifiée.*

---

## Conclusion générale

Ce projet de fin d'année a porté sur la conception et le développement de Clarté, un chatbot intelligent d'entreprise fondé sur les techniques de Retrieval-Augmented Generation. L'objectif initial — permettre à un collaborateur d'obtenir, en langage naturel, une réponse fiable et systématiquement sourcée à partir des documents internes de l'entreprise — a été atteint : l'application couvre l'ensemble de la chaîne fonctionnelle, de l'import et l'indexation des documents jusqu'à la génération de réponses en temps réel, en passant par la recherche sémantique autonome, l'historique des échanges et un espace d'administration dédié au suivi de l'usage.

Sur le plan technique, ce projet a permis de mettre en œuvre concrètement une architecture RAG complète (extraction, découpage, embeddings, indexation vectorielle, retrieval, génération), tout en intégrant des exigences propres à un contexte d'entreprise : isolation stricte des données par utilisateur, exécution locale du modèle de langage pour préserver la confidentialité, séparation des privilèges administrateur/utilisateur, et amélioration continue de l'expérience utilisateur (réponses en streaming, téléchargement de rapports, limitation du temps de génération).

Plusieurs axes d'amélioration ont été identifiés et pourraient faire l'objet de travaux futurs : l'élargissement du jeu d'évaluation quantitative à un corpus plus large et plus varié, la mise en place de tests automatisés (unitaires et d'intégration), la conteneurisation de l'application pour faciliter son déploiement, ou encore l'ajout d'une fonctionnalité de récupération de mot de passe en libre-service.

---

## Bibliographie et Nétographie

**Nétographie**

[1] FastAPI — Documentation officielle. https://fastapi.tiangolo.com/

[2] LangChain — Documentation officielle. https://python.langchain.com/

[3] ChromaDB — Documentation officielle. https://docs.trychroma.com/

[4] Ollama — Documentation officielle. https://ollama.com/

[5] Sentence-Transformers — Documentation du modèle `all-MiniLM-L6-v2`. https://www.sbert.net/

[6] React — Documentation officielle. https://react.dev/

[7] SQLAlchemy — Documentation officielle. https://docs.sqlalchemy.org/

*[Compléter avec les éventuels articles, cours ou ouvrages consultés — ex. cours de Génie Logiciel, notions RAG issues d'articles académiques, etc.]*

---

## Annexes

*[Facultatif. Peuvent y figurer : extraits de code jugés significatifs (ex. pipeline de streaming des réponses), diagrammes UML complémentaires, interfaces graphiques additionnelles.]*
