from functools import lru_cache

from langchain_chroma import Chroma
from langchain_core.documents import Document as LCDocument

from app.config import settings
from app.rag.embeddings import get_embeddings

COLLECTION_NAME = "enterprise_documents"


@lru_cache
def get_vectorstore() -> Chroma:
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
        persist_directory=settings.chroma_persist_dir,
    )


def add_document_chunks(chunks: list[LCDocument], owner_id: int, document_id: int) -> int:
    if not chunks:
        return 0

    for chunk in chunks:
        chunk.metadata["owner_id"] = owner_id
        chunk.metadata["document_id"] = document_id

    ids = [f"doc{document_id}-chunk{i}" for i in range(len(chunks))]
    get_vectorstore().add_documents(chunks, ids=ids)
    return len(chunks)


def delete_document_chunks(document_id: int) -> None:
    store = get_vectorstore()
    store._collection.delete(where={"document_id": document_id})


def similarity_search(query: str, owner_id: int, k: int) -> list[LCDocument]:
    store = get_vectorstore()
    return store.similarity_search(query, k=k, filter={"owner_id": owner_id})


def similarity_search_with_scores(query: str, owner_id: int, k: int) -> list[tuple[LCDocument, float]]:
    store = get_vectorstore()
    return store.similarity_search_with_score(query, k=k, filter={"owner_id": owner_id})
