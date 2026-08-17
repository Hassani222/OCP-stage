import base64
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import SessionLocal, get_db
from app.dependencies import get_current_user
from app.models import Conversation, Message, User
from app.rag.chain import answer_question, retrieve_context, stream_answer_tokens
from app.schemas import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


def _get_or_create_conversation(payload: ChatRequest, current_user: User, db: Session) -> Conversation:
    if payload.conversation_id is not None:
        conversation = (
            db.query(Conversation)
            .filter(Conversation.id == payload.conversation_id, Conversation.owner_id == current_user.id)
            .first()
        )
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation introuvable")
        return conversation

    title = payload.question[:60] + ("..." if len(payload.question) > 60 else "")
    conversation = Conversation(owner_id=current_user.id, title=title)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.post("/ask", response_model=ChatResponse)
def ask(payload: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = _get_or_create_conversation(payload, current_user, db)

    user_message = Message(conversation_id=conversation.id, role="user", content=payload.question)
    db.add(user_message)
    db.commit()

    result = answer_question(payload.question, owner_id=current_user.id)

    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=result["answer"],
        sources=json.dumps(result["sources"]),
    )
    db.add(assistant_message)
    db.commit()

    return ChatResponse(conversation_id=conversation.id, answer=result["answer"], sources=result["sources"])


@router.post("/ask/stream")
def ask_stream(payload: ChatRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conversation = _get_or_create_conversation(payload, current_user, db)

    user_message = Message(conversation_id=conversation.id, role="user", content=payload.question)
    db.add(user_message)
    db.commit()

    docs, sources = retrieve_context(payload.question, owner_id=current_user.id)
    conversation_id = conversation.id
    question = payload.question

    def event_stream():
        parts = []
        for token in stream_answer_tokens(question, docs):
            parts.append(token)
            yield token

        write_db = SessionLocal()
        try:
            assistant_message = Message(
                conversation_id=conversation_id,
                role="assistant",
                content="".join(parts),
                sources=json.dumps(sources),
            )
            write_db.add(assistant_message)
            write_db.commit()
        finally:
            write_db.close()

    headers = {
        "X-Conversation-Id": str(conversation_id),
        "X-Sources": base64.b64encode(json.dumps(sources).encode("utf-8")).decode("ascii"),
    }
    return StreamingResponse(event_stream(), media_type="text/plain; charset=utf-8", headers=headers)
