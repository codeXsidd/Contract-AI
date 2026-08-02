import os
import numpy as np
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import faiss

class RAGService:
    def __init__(self):
        self._model = None
        self.dimension = 384  # Embedding dimension of all-MiniLM-L6-v2

    @property
    def model(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                print(f"Warning: Failed to load SentenceTransformer: {e}")
                self._model = None
        return self._model
        
    def chunk_text(self, text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
        """
        Splits a text document into sliding window overlapping paragraphs.
        """
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        return chunks

    def build_vector_store(self, text: str) -> Dict[str, Any]:
        """
        Creates a FAISS memory index from text document chunks.
        """
        chunks = self.chunk_text(text)
        if not chunks or not self.model:
            return {"index": None, "chunks": chunks}
            
        try:
            embeddings = self.model.encode(chunks)
            embeddings = np.array(embeddings).astype('float32')
            
            # Create a standard flat index
            index = faiss.IndexFlatL2(self.dimension)
            index.add(embeddings)
            
            return {
                "index": index,
                "chunks": chunks
            }
        except Exception:
            return {"index": None, "chunks": chunks}

    def search_similar(self, index: Any, chunks: List[str], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Performs semantic search using cosine distances.
        """
        if not index or not chunks or not self.model:
            return []
            
        try:
            query_vector = self.model.encode([query]).astype('float32')
            distances, indices = index.search(query_vector, top_k)
            
            results = []
            for i, idx in enumerate(indices[0]):
                if idx != -1 and idx < len(chunks):
                    results.append({
                        "chunk": chunks[idx],
                        "score": float(1.0 / (1.0 + distances[0][i])) # Convert distance to score
                    })
            return results
        except Exception:
            return []
        
rag_service = RAGService()
