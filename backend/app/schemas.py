from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class DocumentOut(BaseModel):
    id: int
    filename: str
    chunk_count: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


class SourceSnippet(BaseModel):
    filename: str
    content: str


class SearchResult(BaseModel):
    document_id: int
    filename: str
    content: str
    score: float


class ChatRequest(BaseModel):
    question: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    conversation_id: int
    answer: str
    sources: List[SourceSnippet]


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    sources: Optional[List[SourceSnippet]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationDetail(ConversationOut):
    messages: List[MessageOut]


class AdminTotals(BaseModel):
    total_users: int
    total_documents: int
    total_chunks: int
    total_conversations: int
    total_messages: int
    storage_bytes: int


class AdminUserStat(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    created_at: datetime
    document_count: int
    conversation_count: int


class AdminDashboard(BaseModel):
    totals: AdminTotals
    users: List[AdminUserStat]


class AdminUserCreate(BaseModel):
    email: EmailStr
    password: str
    is_admin: bool = False


class AdminUserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_admin: Optional[bool] = None
    password: Optional[str] = None
