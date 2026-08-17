"""
Évaluation quantitative du pipeline RAG de Clarté.

Mesure :
- Qualité du retrieval : Hit Rate@k (le bon document est-il dans les k passages
  récupérés ?) et MRR (Mean Reciprocal Rank).
- Fidélité des réponses : la réponse générée par le LLM contient-elle bien le
  fait attendu, et les sources citées sont-elles correctes ?

Le script utilise le pipeline réel de l'application (embeddings, ChromaDB,
Ollama) sur un compte d'évaluation dédié, pas une simulation.

Usage :
    python eval/run_evaluation.py                  # évaluation complète
    python eval/run_evaluation.py --retrieval-only  # rapide, sans appel LLM
"""

import argparse
import json
import sys
import time
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from app.auth import hash_password
from app.config import settings
from app.database import SessionLocal
from app.models import Document, User
from app.rag.chain import answer_question
from app.rag.loaders import load_document
from app.rag.splitter import split_documents
from app.rag.vectorstore import add_document_chunks, similarity_search

EVAL_USER_EMAIL = "evaluation-rag@clarte.local"
TEST_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "test-data"
DATASET_PATH = Path(__file__).resolve().parent / "eval_dataset.json"
REPORT_PATH = TEST_DATA_DIR / "rag-evaluation-report.md"
TEST_DOCUMENTS = ["politique_conges.txt", "politique_teletravail.txt"]


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return text.lower()


def get_or_create_eval_user(db) -> User:
    user = db.query(User).filter(User.email == EVAL_USER_EMAIL).first()
    if user:
        return user
    user = User(email=EVAL_USER_EMAIL, hashed_password=hash_password("eval-only-not-a-real-login"))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def ensure_documents_indexed(db, user: User) -> None:
    for filename in TEST_DOCUMENTS:
        existing = db.query(Document).filter(Document.owner_id == user.id, Document.filename == filename).first()
        if existing:
            continue
        path = TEST_DATA_DIR / filename
        if not path.exists():
            raise FileNotFoundError(f"Document de test introuvable : {path}")

        document = Document(owner_id=user.id, filename=filename, stored_path=str(path), chunk_count=0)
        db.add(document)
        db.commit()
        db.refresh(document)

        raw_docs = load_document(str(path), filename)
        chunks = split_documents(raw_docs)
        chunk_count = add_document_chunks(chunks, owner_id=user.id, document_id=document.id)
        document.chunk_count = chunk_count
        db.commit()
        print(f"  Indexé : {filename} ({chunk_count} chunks)")


def evaluate_retrieval(db, user: User, dataset: list[dict]) -> list[dict]:
    results = []
    for item in dataset:
        docs = similarity_search(item["question"], owner_id=user.id, k=settings.retrieval_k)
        filenames = [d.metadata.get("filename") for d in docs]
        hit = item["expected_source"] in filenames
        rank = filenames.index(item["expected_source"]) + 1 if hit else None
        results.append({**item, "retrieved_filenames": filenames, "retrieval_hit": hit, "retrieval_rank": rank})
    return results


def evaluate_generation(user: User, retrieval_results: list[dict]) -> list[dict]:
    results = []
    for item in retrieval_results:
        start = time.time()
        result = answer_question(item["question"], owner_id=user.id)
        elapsed = time.time() - start

        answer_norm = normalize(result["answer"])
        answer_correct = any(normalize(kw) in answer_norm for kw in item["expected_answer_contains"])

        cited_sources = [s["filename"] for s in result["sources"]]
        source_correct = item["expected_source"] in cited_sources

        results.append(
            {
                **item,
                "answer": result["answer"],
                "answer_correct": answer_correct,
                "cited_sources": cited_sources,
                "source_correct": source_correct,
                "latency_seconds": round(elapsed, 1),
            }
        )
        status = "OK" if answer_correct else "ECHEC"
        print(f"  [{item['id']:>2}] {status:5s} ({elapsed:5.1f}s)  {item['question']}")
    return results


def build_report(retrieval_results, generation_results, retrieval_only: bool) -> str:
    n = len(retrieval_results)
    hits = sum(1 for r in retrieval_results if r["retrieval_hit"])
    hit_rate = hits / n
    mrr = sum((1 / r["retrieval_rank"]) if r["retrieval_hit"] else 0 for r in retrieval_results) / n

    lines = [
        "# Rapport d'évaluation quantitative du RAG — Clarté",
        "",
        f"Généré le {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "## Configuration évaluée",
        "",
        f"- Modèle d'embeddings : `{settings.embedding_model}`",
        f"- Modèle LLM : `{settings.ollama_model}` (Ollama)",
        f"- Chunking : chunk_size={settings.chunk_size}, chunk_overlap={settings.chunk_overlap} (caractères)",
        f"- k (nombre de passages récupérés) : {settings.retrieval_k}",
        f"- Jeu de test : {n} questions ({DATASET_PATH.name})",
        "",
        "## Qualité du retrieval",
        "",
        f"| Métrique | Valeur |",
        f"|---|---|",
        f"| Hit Rate@{settings.retrieval_k} (precision) | {hit_rate:.0%} ({hits}/{n}) |",
        f"| MRR (Mean Reciprocal Rank) | {mrr:.3f} |",
        "",
        "| # | Question | Document attendu | Trouvé ? | Rang |",
        "|---|---|---|---|---|",
    ]
    for r in retrieval_results:
        lines.append(
            f"| {r['id']} | {r['question']} | `{r['expected_source']}` | "
            f"{'✅' if r['retrieval_hit'] else '❌'} | {r['retrieval_rank'] or '—'} |"
        )

    if not retrieval_only:
        n_gen = len(generation_results)
        answer_correct_count = sum(1 for r in generation_results if r["answer_correct"])
        source_correct_count = sum(1 for r in generation_results if r["source_correct"])
        avg_latency = sum(r["latency_seconds"] for r in generation_results) / n_gen

        lines += [
            "",
            "## Fidélité des réponses générées",
            "",
            "| Métrique | Valeur |",
            "|---|---|",
            f"| Exactitude des réponses (fait attendu présent) | {answer_correct_count / n_gen:.0%} ({answer_correct_count}/{n_gen}) |",
            f"| Sources citées correctes | {source_correct_count / n_gen:.0%} ({source_correct_count}/{n_gen}) |",
            f"| Latence moyenne de génération | {avg_latency:.1f} s |",
            "",
            "| # | Question | Réponse générée | Correcte ? | Sources correctes ? | Latence |",
            "|---|---|---|---|---|---|",
        ]
        for r in generation_results:
            answer_short = r["answer"].replace("\n", " ")
            if len(answer_short) > 100:
                answer_short = answer_short[:100] + "…"
            lines.append(
                f"| {r['id']} | {r['question']} | {answer_short} | "
                f"{'✅' if r['answer_correct'] else '❌'} | {'✅' if r['source_correct'] else '❌'} | "
                f"{r['latency_seconds']}s |"
            )

    lines.append("")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Évaluation quantitative du pipeline RAG de Clarté")
    parser.add_argument("--retrieval-only", action="store_true", help="Ne pas évaluer la génération LLM (rapide)")
    args = parser.parse_args()

    dataset = json.loads(DATASET_PATH.read_text(encoding="utf-8"))

    db = SessionLocal()
    try:
        print("Préparation du compte d'évaluation et indexation des documents…")
        user = get_or_create_eval_user(db)
        ensure_documents_indexed(db, user)

        print(f"\nÉvaluation du retrieval ({len(dataset)} questions, k={settings.retrieval_k})…")
        retrieval_results = evaluate_retrieval(db, user, dataset)

        generation_results = []
        if not args.retrieval_only:
            print(f"\nÉvaluation de la génération de réponses (appels LLM réels, peut prendre plusieurs minutes)…")
            generation_results = evaluate_generation(user, retrieval_results)

        report = build_report(retrieval_results, generation_results, args.retrieval_only)
        REPORT_PATH.write_text(report, encoding="utf-8")
        print(f"\nRapport écrit dans : {REPORT_PATH}")
        print("\n" + "=" * 70)
        print(report)
    finally:
        db.close()


if __name__ == "__main__":
    main()
