# Rapport d'évaluation quantitative du RAG — Clarté

Généré le 2026-07-29 00:15 UTC

## Configuration évaluée

- Modèle d'embeddings : `sentence-transformers/all-MiniLM-L6-v2`
- Modèle LLM : `llama3` (Ollama)
- Chunking : chunk_size=1000, chunk_overlap=150 (caractères)
- k (nombre de passages récupérés) : 4
- Jeu de test : 10 questions (eval_dataset.json)

## Qualité du retrieval

| Métrique | Valeur |
|---|---|
| Hit Rate@4 (precision) | 100% (10/10) |
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

## Fidélité des réponses générées

| Métrique | Valeur |
|---|---|
| Exactitude des réponses (fait attendu présent) | 100% (10/10) |
| Sources citées correctes | 100% (10/10) |
| Latence moyenne de génération | 39.8 s |

| # | Question | Réponse générée | Correcte ? | Sources correctes ? | Latence |
|---|---|---|---|---|---|
| 1 | Combien de jours de congés payés par an ? | Les employés à temps plein bénéficient de 25 jours de congés payés par an. | ✅ | ✅ | 101.8s |
| 2 | Combien de jours de congé maladie payés par an ? | 10 jours. | ✅ | ✅ | 5.9s |
| 3 | À partir de quel jour d'absence un justificatif médical est-il requis ? | Un justificatif médical est requis à partir du 3e jour d'absence consécutif. | ✅ | ✅ | 13.1s |
| 4 | Combien de semaines dure le congé maternité ? | Le congé maternité dure 16 semaines. | ✅ | ✅ | 9.9s |
| 5 | Combien de jours dure le congé paternité ? | Le congé paternité dure 25 jours calendaires, à prendre dans les 6 mois suivant la naissance de l'en… | ✅ | ✅ | 41.7s |
| 6 | Combien de jours de télétravail par semaine sont autorisés ? | Selon la politique de télétravail, les employés éligibles peuvent télétravailler jusqu'à 2 jours par… | ✅ | ✅ | 69.8s |
| 7 | Quel est le montant de l'indemnité de télétravail ? | L'indemnité mensuelle de télétravail est de 40 euros. | ✅ | ✅ | 10.9s |
| 8 | Entre quelles heures un télétravailleur doit-il être joignable ? | Un télétravailleur doit rester joignable pendant les heures habituelles de bureau, soit de 9h à 18h. | ✅ | ✅ | 14.1s |
| 9 | Combien de temps à l'avance faut-il prévenir les RH avant un déménagement à l'étranger ? | Selon le contexte, il est nécessaire de prévenir le service RH au moins 2 mois à l'avance en cas de … | ✅ | ✅ | 69.8s |
| 10 | Le télétravail est-il autorisé depuis l'étranger ? | Non, le télétravail depuis l'étranger n'est pas autorisé pour des raisons fiscales et légales. | ✅ | ✅ | 60.8s |
