# Rapport d'évaluation quantitative du RAG — Clarté

Généré le 2026-09-07 13:57 UTC

## Configuration évaluée

- Modèle d'embeddings : `sentence-transformers/all-MiniLM-L6-v2`
- Modèle LLM : `llama3.2:3b` (Ollama)
- Chunking : chunk_size=700, chunk_overlap=100 (caractères)
- k (nombre de passages récupérés) : 2
- Jeu de test : 12 questions (eval_dataset.json)

## Qualité du retrieval

| Métrique | Valeur |
|---|---|
| Hit Rate@2 (precision) | 100% (12/12) |
| MRR (Mean Reciprocal Rank) | 1.000 |

| # | Question | Document attendu | Trouvé ? | Rang |
|---|---|---|---|---|
| 1 | Combien de jours de congés payés par an ? | `politique_conges.txt` | ✅ | 1 |
| 2 | Combien de jours de congé maladie payés par an ? | `politique_conges.txt` | ✅ | 1 |
| 3 | À partir de quel jour d'absence un justificatif médical est-il requis ? | `politique_conges.txt` | ✅ | 1 |
| 4 | Combien de semaines dure le congé maternité ? | `politique_conges.txt` | ✅ | 1 |
| 5 | Combien de jours dure le congé paternité ? | `politique_conges.txt` | ✅ | 1 |
| 6 | Combien de jours de télétravail par semaine sont autorisés ? | `politique_teletravail.txt` | ✅ | 1 |
| 7 | Quel est le montant de l'indemnité de télétravail ? | `politique_teletravail.txt` | ✅ | 1 |
| 8 | Entre quelles heures un télétravailleur doit-il être joignable ? | `politique_teletravail.txt` | ✅ | 1 |
| 9 | Combien de temps à l'avance faut-il prévenir les RH avant un déménagement à l'étranger ? | `politique_teletravail.txt` | ✅ | 1 |
| 10 | Le télétravail est-il autorisé depuis l'étranger ? | `politique_teletravail.txt` | ✅ | 1 |
| 11 | Quel est le nombre de jours de congés payés pour les salariés à temps partiel ? | `politique_conges.txt` | ✅ | 1 |
| 12 | Quelle assurance santé est fournie aux employés en télétravail ? | `politique_teletravail.txt` | ✅ | 1 |

## Fidélité des réponses générées

| Métrique | Valeur |
|---|---|
| Fidélité (fait étayé ou refus hors corpus) | 100% (12/12) |
| Réponses non fidèles détectées | 0 |
| Précision des citations | 58% |
| Rappel des citations | 100% |
| Citations exactes (aucune source en trop ou manquante) | 33% (4/12) |
| Latence moyenne de génération | 9.1 s |

| # | Question | Réponse générée | Fidèle ? | Contrôle | Citations (P/R/exact) | Latence |
|---|---|---|---|---|---|---|
| 1 | Combien de jours de congés payés par an ? | Les employés à temps plein bénéficient de 25 jours de congés payés par an. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 8.5s |
| 2 | Combien de jours de congé maladie payés par an ? | 10 jours de congé maladie payés par an. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 7.2s |
| 3 | À partir de quel jour d'absence un justificatif médical est-il requis ? | Un justificatif médical est requis à partir du 3e jour d'absence consécutive. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 9.4s |
| 4 | Combien de semaines dure le congé maternité ? | Le congé maternité dure 16 semaines. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 7.3s |
| 5 | Combien de jours dure le congé paternité ? | Le congé paternité dure 25 jours calendaires. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 18.1s |
| 6 | Combien de jours de télétravail par semaine sont autorisés ? | 2 jours par semaine, sous réserve de l'accord de leur manager direct. | ✅ | fait étayé par le jeu de test | 100%/100%/✅ | 7.0s |
| 7 | Quel est le montant de l'indemnité de télétravail ? | L'indemnité de télétravail est de 40 euros par mois. | ✅ | fait étayé par le jeu de test | 100%/100%/✅ | 7.0s |
| 8 | Entre quelles heures un télétravailleur doit-il être joignable ? | Les télétravailleurs doivent être joignables pendant les heures habituelles de bureau, soit de 9h à … | ✅ | fait étayé par le jeu de test | 100%/100%/✅ | 8.9s |
| 9 | Combien de temps à l'avance faut-il prévenir les RH avant un déménagement à l'étranger ? | Il faut prévenir les RH au moins 2 mois à l'avance. | ✅ | fait étayé par le jeu de test | 50%/100%/❌ | 6.3s |
| 10 | Le télétravail est-il autorisé depuis l'étranger ? | Non, le télétravail depuis l'étranger n'est pas autorisé pour des raisons fiscales et légales. | ✅ | fait étayé par le jeu de test | 100%/100%/✅ | 7.7s |
| 11 | Quel est le nombre de jours de congés payés pour les salariés à temps partiel ? | Je n'ai pas trouvé d'information spécifique sur le nombre de jours de congés payés pour les salariés… | ✅ | refus attendu | 0%/100%/❌ | 12.6s |
| 12 | Quelle assurance santé est fournie aux employés en télétravail ? | Je n'ai pas trouvé d'information dans les documents fournis sur la politique de télétravail concerna… | ✅ | refus attendu | 0%/100%/❌ | 9.2s |

### Écarts de citation à corriger

- Question 1 — attendu : politique_conges.txt ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 2 — attendu : politique_conges.txt ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 3 — attendu : politique_conges.txt ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 4 — attendu : politique_conges.txt ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 5 — attendu : politique_conges.txt ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 9 — attendu : politique_teletravail.txt ; cité : politique_teletravail.txt, politique_conges.txt.
- Question 11 — attendu : aucune source ; cité : politique_conges.txt, politique_teletravail.txt.
- Question 12 — attendu : aucune source ; cité : politique_teletravail.txt.
