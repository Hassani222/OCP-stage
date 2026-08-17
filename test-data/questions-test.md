# Jeu de test — Clarté

Deux documents courts avec des faits précis, pour vérifier manuellement que la
récupération (retrieval) et la génération de réponses fonctionnent correctement.

## Documents

- `politique_conges.txt`
- `politique_teletravail.txt`

Importez les deux fichiers via l'interface (barre latérale → import de documents)
avant de poser les questions ci-dessous.

## Questions simples et réponses attendues

| # | Question | Réponse attendue |
|---|----------|-------------------|
| 1 | Combien de jours de congés payés par an ? | 25 jours |
| 2 | Combien de jours de congé maladie payés par an ? | 10 jours |
| 3 | À partir de quel jour d'absence un justificatif médical est-il requis ? | Le 3e jour |
| 4 | Combien de semaines dure le congé maternité ? | 16 semaines |
| 5 | Combien de jours dure le congé paternité ? | 25 jours calendaires |
| 6 | Combien de jours de télétravail par semaine sont autorisés ? | 2 jours |
| 7 | Quel est le montant de l'indemnité de télétravail ? | 40 euros par mois |
| 8 | Entre quelles heures un télétravailleur doit-il être joignable ? | De 9h à 18h |
| 9 | Combien de temps à l'avance faut-il prévenir les RH avant un déménagement à l'étranger ? | 2 mois |
| 10 | Le télétravail est-il autorisé depuis l'étranger ? | Non |

Pour chaque réponse, vérifiez aussi que la section "Sources" affichée sous la
réponse cite bien le bon fichier (`politique_conges.txt` ou
`politique_teletravail.txt`) — c'est la référence au document d'origine que
chaque chunk garde via ses métadonnées (`filename`, `document_id`) dans
ChromaDB.

## Comparer deux découpages (chunking) différents

Vous avez mentionné deux configurations à comparer :
- chunk_size = 300, overlap = 20
- chunk_size = 500, overlap = 20

**Note importante** : dans `backend/app/rag/splitter.py`, `chunk_size` et
`chunk_overlap` sont mesurés en **caractères**, pas en tokens (le
`RecursiveCharacterTextSplitter` de LangChain compte des caractères par
défaut). Donc "300" et "500" ici correspondent à des caractères, pas des
tokens — à garder en tête si vous comparez avec un tokenizer.

Pour tester les deux configurations :

1. Ouvrez `backend/.env` et modifiez :
   ```
   CHUNK_SIZE=300
   CHUNK_OVERLAP=20
   ```
2. Redémarrez le backend (`uvicorn` doit relire `.env` au démarrage).
3. Supprimez les documents déjà importés (s'il y en a) puis réimportez
   `politique_conges.txt` et `politique_teletravail.txt`.
4. Posez les 10 questions ci-dessus, notez les réponses et le nombre de
   chunks affiché après import (`chunk_count` dans la liste de documents).
5. Répétez les étapes 1 à 4 avec :
   ```
   CHUNK_SIZE=500
   CHUNK_OVERLAP=20
   ```
6. Comparez : nombre de chunks générés, pertinence des sources citées, et
   qualité des réponses entre les deux configurations.
