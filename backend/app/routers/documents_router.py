import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models import Document, User
from app.rag.loaders import SUPPORTED_EXTENSIONS, load_document
from app.rag.splitter import split_documents
from app.rag.vectorstore import add_document_chunks, delete_document_chunks, similarity_search_with_scores
from app.schemas import DocumentOut, SearchResult

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Format non supporté : {ext}. Utilisez PDF, DOCX ou TXT.")

    max_size = settings.max_upload_size_bytes
    content = await file.read(max_size + 1)
    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"Document trop volumineux. Taille maximale autorisée : {settings.max_upload_size_mb} Mo.",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{ext}"
    stored_path = os.path.join(settings.upload_dir, stored_name)

    with open(stored_path, "wb") as f:
        f.write(content)

    document = Document(owner_id=current_user.id, filename=file.filename, stored_path=stored_path, chunk_count=0)
    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        raw_docs = load_document(stored_path, file.filename)
        chunks = split_documents(raw_docs)
        chunk_count = add_document_chunks(chunks, owner_id=current_user.id, document_id=document.id)
    except Exception as exc:
        db.delete(document)
        db.commit()
        os.remove(stored_path)
        raise HTTPException(status_code=422, detail=f"Échec du traitement du document : {exc}")

    document.chunk_count = chunk_count
    db.commit()
    db.refresh(document)
    return document


@router.get("/", response_model=list[DocumentOut])
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )


@router.get("/search", response_model=list[SearchResult])
def search_documents(q: str, k: int = 5, current_user: User = Depends(get_current_user)):
    if not q.strip():
        raise HTTPException(status_code=400, detail="La requête de recherche ne peut pas être vide.")

    results = similarity_search_with_scores(q, owner_id=current_user.id, k=k)
    return [
        SearchResult(
            document_id=doc.metadata.get("document_id"),
            filename=doc.metadata.get("filename", "inconnu"),
            content=doc.page_content,
            score=score,
        )
        for doc, score in results
    ]


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    document = (
        db.query(Document)
        .filter(Document.id == document_id, Document.owner_id == current_user.id)
        .first()
    )
    if not document:
        raise HTTPException(status_code=404, detail="Document introuvable")

    delete_document_chunks(document.id)
    if os.path.exists(document.stored_path):
        os.remove(document.stored_path)
    db.delete(document)
    db.commit()
