import os
import re
import math
from typing import List, Dict, Any
import numpy as np

class RAGService:
    def __init__(self):
        self.dimension = 384

    def chunk_text(self, text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
        """
        Splits a text document into sliding window overlapping paragraphs.
        """
        words = text.split()
        if not words:
            return []
        chunks = []
        step = max(1, chunk_size - overlap)
        for i in range(0, len(words), step):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    def _text_to_vector(self, text: str, vocabulary: Dict[str, int]) -> np.ndarray:
        words = re.findall(r'\w+', text.lower())
        vec = np.zeros(len(vocabulary), dtype=np.float32)
        for w in words:
            if w in vocabulary:
                vec[vocabulary[w]] += 1.0
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec /= norm
        return vec

    def build_vector_store(self, text: str) -> Dict[str, Any]:
        """
        Creates a lightweight memory index from text document chunks using term frequency vectors.
        Uses zero heavy dependencies to run efficiently in low-memory (<512MB) cloud containers.
        """
        chunks = self.chunk_text(text)
        if not chunks:
            return {"index": None, "chunks": []}

        try:
            # Build vocabulary across all chunks
            words = set(re.findall(r'\w+', text.lower()))
            vocabulary = {word: idx for idx, word in enumerate(words)}

            if not vocabulary:
                return {"index": None, "chunks": chunks}

            matrix = np.array([self._text_to_vector(c, vocabulary) for c in chunks], dtype=np.float32)

            return {
                "index": {
                    "matrix": matrix,
                    "vocabulary": vocabulary
                },
                "chunks": chunks
            }
        except Exception as e:
            print(f"Warning: Vector store creation fallback: {e}")
            return {"index": None, "chunks": chunks}

    def search_similar(self, index: Any, chunks: List[str], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Performs semantic/text similarity search using cosine distance over TF vectors.
        """
        if not index or not chunks or not isinstance(index, dict) or "matrix" not in index:
            # Fallback simple keyword match
            query_words = set(query.lower().split())
            scores = []
            for chunk in chunks:
                chunk_words = set(chunk.lower().split())
                overlap = len(query_words.intersection(chunk_words))
                scores.append(overlap)
            top_indices = np.argsort(scores)[::-1][:top_k]
            return [{"chunk": chunks[i], "score": float(scores[i])} for i in top_indices if scores[i] > 0]

        try:
            matrix = index["matrix"]
            vocabulary = index["vocabulary"]

            query_vec = self._text_to_vector(query, vocabulary)
            if np.linalg.norm(query_vec) == 0:
                return []

            similarities = np.dot(matrix, query_vec)
            top_indices = np.argsort(similarities)[::-1][:top_k]

            results = []
            for idx in top_indices:
                score = float(similarities[idx])
                if score > 0:
                    results.append({
                        "chunk": chunks[idx],
                        "score": round(score, 4)
                    })
            return results
        except Exception as e:
            print(f"Warning: RAG search fallback: {e}")
            return []

rag_service = RAGService()
