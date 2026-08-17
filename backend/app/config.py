from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "change-this-to-a-random-secret-key"
    access_token_expire_minutes: int = 1440
    database_url: str = "sqlite:///./rag_chatbot.db"
    chroma_persist_dir: str = "./storage/chroma_db"
    upload_dir: str = "./storage/uploads"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    chunk_size: int = 1000
    chunk_overlap: int = 150
    retrieval_k: int = 4
    admin_emails: str = ""
    max_upload_size_mb: int = 5

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def admin_email_set(self) -> set[str]:
        return {e.strip().lower() for e in self.admin_emails.split(",") if e.strip()}

    class Config:
        env_file = ".env"


settings = Settings()
