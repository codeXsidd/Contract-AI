import os
import numpy as np
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
import faiss

class RAGService:
    def __init__(self):
        # Initialize a lightweight sentence-transformer model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384  # Embedding dimension of all-MiniLM-L6-v2
        
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
        if not chunks:
            return {"index": None, "chunks": []}
            
        embeddings = self.model.encode(chunks)
        embeddings = np.array(embeddings).astype('float32')
        
        # Create a standard flat index
        index = faiss.IndexFlatL2(self.dimension)
        index.add(embeddings)
        
        return {
            "index": index,
            "chunks": chunks
        }

    def search_similar(self, index: faiss.Index, chunks: List[str], query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Performs semantic search using cosine distances.
        """
        if not index or not chunks:
            return []
            
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
        
rag_service = RAGService()
