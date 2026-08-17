import os

from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_core.documents import Document as LCDocument

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def load_document(file_path: str, filename: str) -> list[LCDocument]:
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext == ".docx":
        loader = Docx2txtLoader(file_path)
    elif ext == ".txt":
        loader = TextLoader(file_path, encoding="utf-8")
    else:
        raise ValueError(f"Format de fichier non supporté : {ext}")

    docs = loader.load()
    for doc in docs:
        doc.metadata["filename"] = filename
    return docs
