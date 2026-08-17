from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, run_lightweight_migrations
from app.routers import admin_router, auth_router, chat_router, documents_router, history_router

Base.metadata.create_all(bind=engine)
run_lightweight_migrations()

app = FastAPI(title="Clarté", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Conversation-Id", "X-Sources"],
)

app.include_router(auth_router.router)
app.include_router(documents_router.router)
app.include_router(chat_router.router)
app.include_router(history_router.router)
app.include_router(admin_router.router)


@app.get("/health")
def health():
    return {"status": "ok"}
