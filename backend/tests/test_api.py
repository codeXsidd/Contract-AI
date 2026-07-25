import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.ai_service import AIService
from app.ai.rag_service import RAGService
from app.services.reports import ReportGenerator

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_contracts():
    response = client.get("/api/contracts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) or "data" in data or isinstance(data, dict)

def test_pii_detection():
    pii = AIService.detect_pii("Contact john@example.com or call +1 555-0199 for details.")
    assert "privacy_score" in pii
    assert "john@example.com" in pii["email"]

def test_rag_embedding_and_query():
    rag = RAGService()
    text = "The agreement shall terminate after 30 days written notice by either party."
    store = rag.build_vector_store(text)
    assert store["index"] is not None
    results = rag.search_similar(store["index"], store["chunks"], "How to terminate?")
    assert len(results) > 0

def test_pdf_report_generation():
    pdf_bytes = ReportGenerator.generate_pdf_report({
        "title": "Unit Test Contract",
        "type": "NDA",
        "risk_score": 15,
        "health_score": 95,
        "compliance_score": 98,
        "summary": "Sample test agreement."
    })
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 500
