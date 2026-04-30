"""
RAG (Retrieval-Augmented Generation) Module
Author: Ajay Kumar
Description: Handles text chunking, embedding generation, FAISS indexing,
             similarity search, and LLM response generation.
"""

import os
import re
import numpy as np
import faiss
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class RAGChatbot:
    """
    A RAG-based chatbot that answers questions using portfolio data.
    
    Pipeline:
        1. Load text data from file
        2. Split text into chunks
        3. Generate embeddings using OpenAI
        4. Store embeddings in FAISS index
        5. At query time: embed query → search FAISS → inject context → LLM
    """

    def __init__(self, data_path: str, chunk_size: int = 300, chunk_overlap: int = 50):
        self.data_path = data_path
        self.chunk_size = chunk_size       # words per chunk
        self.chunk_overlap = chunk_overlap  # overlapping words between chunks
        self.chunks = []
        self.index = None
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.embedding_model = "text-embedding-3-small"
        self.chat_model = "gpt-3.5-turbo"
        self.embedding_dim = 1536  # dimension for text-embedding-3-small

        # Build the FAISS index on initialization
        self.build_index()

    # ─────────────────────────────────────────────────────────────
    # STEP 1: Load data
    # ─────────────────────────────────────────────────────────────
    def load_data(self) -> str:
        """Load raw text from the portfolio data file."""
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file not found: {self.data_path}")
        with open(self.data_path, "r", encoding="utf-8") as f:
            return f.read()

    # ─────────────────────────────────────────────────────────────
    # STEP 2: Chunk text
    # ─────────────────────────────────────────────────────────────
    def chunk_text(self, text: str) -> list[str]:
        """
        Split text into overlapping chunks for better context retrieval.
        Uses word-level chunking with overlap to avoid cutting mid-sentence context.
        """
        # Split by double newlines first (sections), then words
        sections = [s.strip() for s in text.split("\n\n") if s.strip()]
        chunks = []

        for section in sections:
            words = section.split()
            if len(words) <= self.chunk_size:
                # Small section — keep as one chunk
                chunks.append(section)
            else:
                # Large section — split into overlapping chunks
                start = 0
                while start < len(words):
                    end = min(start + self.chunk_size, len(words))
                    chunk = " ".join(words[start:end])
                    chunks.append(chunk)
                    start += self.chunk_size - self.chunk_overlap

        return [c for c in chunks if len(c.strip()) > 20]  # remove tiny chunks

    # ─────────────────────────────────────────────────────────────
    # STEP 3: Generate embeddings
    # ─────────────────────────────────────────────────────────────
    def get_embedding(self, text: str) -> np.ndarray:
        """Generate a single embedding vector using OpenAI."""
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=text.replace("\n", " ")
        )
        return np.array(response.data[0].embedding, dtype=np.float32)

    def get_embeddings_batch(self, texts: list[str]) -> np.ndarray:
        """Generate embeddings for a list of texts in a single API call (more efficient)."""
        cleaned = [t.replace("\n", " ") for t in texts]
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=cleaned
        )
        vectors = [item.embedding for item in response.data]
        return np.array(vectors, dtype=np.float32)

    # ─────────────────────────────────────────────────────────────
    # STEP 4: Build FAISS index
    # ─────────────────────────────────────────────────────────────
    def build_index(self):
        """
        Full pipeline: Load → Chunk → Embed → Index with FAISS.
        Called once on startup.
        """
        print("📄 Loading portfolio data...")
        raw_text = self.load_data()

        print("✂️  Chunking text...")
        self.chunks = self.chunk_text(raw_text)
        print(f"   → {len(self.chunks)} chunks created")

        print("🔢 Generating embeddings (this may take a moment)...")
        embeddings = self.get_embeddings_batch(self.chunks)

        print("🗄️  Building FAISS index...")
        # IndexFlatIP = Flat index with Inner Product (cosine sim after normalization)
        self.index = faiss.IndexFlatIP(self.embedding_dim)

        # Normalize vectors so inner product = cosine similarity
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)

        print(f"✅ FAISS index built with {self.index.ntotal} vectors")

    # ─────────────────────────────────────────────────────────────
    # STEP 5: Query the RAG system
    # ─────────────────────────────────────────────────────────────
    def retrieve_context(self, query: str, top_k: int = 4) -> list[str]:
        """
        Embed the query and retrieve the top-k most similar chunks from FAISS.
        """
        query_vec = self.get_embedding(query).reshape(1, -1)
        faiss.normalize_L2(query_vec)

        distances, indices = self.index.search(query_vec, top_k)

        # Filter out very low similarity results (threshold = 0.3)
        relevant = []
        for dist, idx in zip(distances[0], indices[0]):
            if dist > 0.3 and idx < len(self.chunks):
                relevant.append(self.chunks[idx])

        return relevant

    def query(self, user_message: str, top_k: int = 4) -> tuple[str, list[str]]:
        """
        Full RAG pipeline for a user query.
        
        Returns:
            (reply_text, source_chunks)
        """
        # 1. Retrieve relevant context chunks
        context_chunks = self.retrieve_context(user_message, top_k=top_k)

        if not context_chunks:
            return (
                "I don't have specific information about that in Ajay's portfolio. "
                "Try asking about his projects, skills, experience, or education!",
                []
            )

        # 2. Build the prompt with injected context
        context_text = "\n\n---\n\n".join(context_chunks)

        system_prompt = """You are an AI assistant embedded in Ajay Kumar's developer portfolio website.
Your job is to answer visitor questions about Ajay — his skills, projects, experience, and background.

RULES:
- Answer ONLY based on the provided context below
- Be friendly, professional, and enthusiastic about Ajay's work
- Keep answers concise but informative (2-4 sentences unless more detail is needed)
- If information is not in the context, say so honestly
- Refer to Ajay in third person (e.g., "Ajay has built...")
- Highlight impressive achievements (300+ users, scholarships, etc.) when relevant

CONTEXT ABOUT AJAY:
{context}""".format(context=context_text)

        # 3. Call the LLM with context-injected prompt
        response = self.client.chat.completions.create(
            model=self.chat_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.4,   # Lower = more factual, less creative
            max_tokens=500
        )

        reply = response.choices[0].message.content.strip()
        return reply, context_chunks
