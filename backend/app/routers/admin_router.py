import os

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import get_db
from app.dependencies import require_admin
from app.models import Conversation, Document, Message, User
from app.rag.vectorstore import delete_document_chunks
from app.schemas import AdminDashboard, AdminTotals, AdminUserCreate, AdminUserStat, AdminUserUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


def _user_stat(db: Session, user: User) -> AdminUserStat:
    document_count = db.query(func.count(Document.id)).filter(Document.owner_id == user.id).scalar()
    conversation_count = db.query(func.count(Conversation.id)).filter(Conversation.owner_id == user.id).scalar()
    return AdminUserStat(
        id=user.id,
        email=user.email,
        is_admin=user.is_admin,
        created_at=user.created_at,
        document_count=document_count,
        conversation_count=conversation_count,
    )


@router.get("/dashboard", response_model=AdminDashboard, dependencies=[Depends(require_admin)])
def get_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(func.count(User.id)).scalar()
    total_documents = db.query(func.count(Document.id)).scalar()
    total_chunks = db.query(func.coalesce(func.sum(Document.chunk_count), 0)).scalar()
    total_conversations = db.query(func.count(Conversation.id)).scalar()
    total_messages = db.query(func.count(Message.id)).scalar()

    storage_bytes = 0
    for (stored_path,) in db.query(Document.stored_path).all():
        if os.path.exists(stored_path):
            storage_bytes += os.path.getsize(stored_path)

    doc_counts = dict(
        db.query(Document.owner_id, func.count(Document.id)).group_by(Document.owner_id).all()
    )
    conv_counts = dict(
        db.query(Conversation.owner_id, func.count(Conversation.id)).group_by(Conversation.owner_id).all()
    )

    users = [
        AdminUserStat(
            id=user.id,
            email=user.email,
            is_admin=user.is_admin,
            created_at=user.created_at,
            document_count=doc_counts.get(user.id, 0),
            conversation_count=conv_counts.get(user.id, 0),
        )
        for user in db.query(User).order_by(User.created_at.desc()).all()
    ]

    return AdminDashboard(
        totals=AdminTotals(
            total_users=total_users,
            total_documents=total_documents,
            total_chunks=total_chunks,
            total_conversations=total_conversations,
            total_messages=total_messages,
            storage_bytes=storage_bytes,
        ),
        users=users,
    )


@router.post("/users", response_model=AdminUserStat, status_code=201)
def create_user(
    payload: AdminUserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        is_admin=payload.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_stat(db, user)


@router.patch("/users/{user_id}", response_model=AdminUserStat)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    if payload.email is not None and payload.email != user.email:
        existing = db.query(User).filter(User.email == payload.email, User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Un compte existe déjà avec cet email")
        user.email = payload.email

    if payload.is_admin is not None:
        if user.id == current_user.id and not payload.is_admin:
            raise HTTPException(
                status_code=400, detail="Vous ne pouvez pas retirer vos propres droits administrateur."
            )
        user.is_admin = payload.is_admin

    if payload.password:
        user.hashed_password = hash_password(payload.password)

    db.commit()
    db.refresh(user)
    return _user_stat(db, user)


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    for doc in user.documents:
        delete_document_chunks(doc.id)
        if os.path.exists(doc.stored_path):
            os.remove(doc.stored_path)

    db.delete(user)
    db.commit()
