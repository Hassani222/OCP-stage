import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Conversation, User
from app.schemas import ConversationDetail, ConversationOut, MessageOut

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Conversation)
        .filter(Conversation.owner_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.owner_id == current_user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation introuvable")

    messages = [
        MessageOut(
            id=m.id,
            role=m.role,
            content=m.content,
            sources=json.loads(m.sources) if m.sources else None,
            created_at=m.created_at,
        )
        for m in conversation.messages
    ]

    return ConversationDetail(
        id=conversation.id, title=conversation.title, created_at=conversation.created_at, messages=messages
    )


@router.delete("/conversations/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.owner_id == current_user.id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation introuvable")

    db.delete(conversation)
    db.commit()
