"""
RAG Module — Groq (chat) + local sentence-transformers (embeddings)
No embedding API quota issues. Numpy cosine similarity for vector search.
"""

import os
import numpy as np
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
embedder = SentenceTransformer("all-MiniLM-L6-v2")  # fast, local, no API needed


class RAGChatbot:
    def __init__(self, data_path: str, chunk_size: int = 300, chunk_overlap: int = 50):
        self.data_path = data_path
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.chunks = []
        self.embeddings = None
        self.build_index()

    def load_data(self) -> str:
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found: {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            return f.read()

    def chunk_text(self, text: str) -> list:
        sections = [s.strip() for s in text.split("\n\n") if s.strip()]
        chunks = []
        for section in sections:
            words = section.split()
            if len(words) <= self.chunk_size:
                chunks.append(section)
            else:
                start = 0
                while start < len(words):
                    end = min(start + self.chunk_size, len(words))
                    chunks.append(" ".join(words[start:end]))
                    start += self.chunk_size - self.chunk_overlap
        return [c for c in chunks if len(c.strip()) > 20]

    def build_index(self):
        print("[*] Loading portfolio data...")
        raw_text = self.load_data()
        print("[*] Chunking text...")
        self.chunks = self.chunk_text(raw_text)
        print(f"   -> {len(self.chunks)} chunks created")
        print("[*] Generating embeddings (local)...")
        vecs = embedder.encode(self.chunks, convert_to_numpy=True).astype(np.float32)
        norms = np.linalg.norm(vecs, axis=1, keepdims=True)
        self.embeddings = vecs / np.maximum(norms, 1e-10)
        print(f"[OK] Index built with {len(self.chunks)} vectors")

    def retrieve_context(self, query: str, top_k: int = 4) -> list:
        q = embedder.encode([query], convert_to_numpy=True).astype(np.float32)[0]
        q = q / max(np.linalg.norm(q), 1e-10)
        scores = self.embeddings @ q
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [self.chunks[i] for i in top_indices if scores[i] > 0.3]

    def query(self, user_message: str, top_k: int = 4) -> tuple:
        context_chunks = self.retrieve_context(user_message, top_k=top_k)

        if not context_chunks:
            return (
                "I don't have specific information about that in Ajay's portfolio. "
                "Try asking about his projects, skills, experience, or education!",
                []
            )

        context_text = "\n\n---\n\n".join(context_chunks)
        system_prompt = f"""You are an AI assistant embedded in Ajay Kumar's developer portfolio website.
Answer visitor questions about Ajay based ONLY on the context below.
Be friendly, professional, and concise (2-4 sentences). Refer to Ajay in third person.
If information is not in the context, say so honestly. Highlight achievements like 300+ users and scholarships when relevant.

CONTEXT ABOUT AJAY:
{context_text}"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4,
            max_tokens=500
        )
        return response.choices[0].message.content.strip(), context_chunks
