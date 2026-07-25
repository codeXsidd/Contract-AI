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

def test_contract_sub_endpoints():
    # Search
    res = client.get("/api/contracts/search?q=TechCorp")
    assert res.status_code == 200
    assert "data" in res.json()

    # Versions
    res = client.get("/api/contracts/1/versions")
    assert res.status_code == 200
    assert "data" in res.json()

    # Status update
    res = client.patch("/api/contracts/1/status", json={"status": "active"})
    assert res.status_code == 200
    assert res.json()["data"]["status"] == "active"

def test_chat_and_negotiation_endpoints():
    # Chat message
    res = client.post("/api/chat/1", json={"message": "Summarize this contract", "target_language": "en"})
    assert res.status_code == 200
    assert "response" in res.json()

    # Chat history
    res = client.get("/api/chat/1/history")
    assert res.status_code == 200

    # Negotiation analyze
    res = client.post("/api/negotiation/1/analyze")
    assert res.status_code == 200
    assert "recommendations" in res.json()["data"]

    # Negotiation simulate
    res = client.post("/api/negotiation/1/simulate", json={"clause_id": "cl1", "new_text": "Updated liability text"})
    assert res.status_code == 200

def test_analytics_and_lifecycle_endpoints():
    # Dashboard stats
    res = client.get("/api/analytics/dashboard")
    assert res.status_code == 200
    assert "total_contracts" in res.json()["data"]

    # Upload trends
    res = client.get("/api/analytics/upload-trends")
    assert res.status_code == 200

    # Risk distribution
    res = client.get("/api/analytics/risk-distribution")
    assert res.status_code == 200

    # Compliance trends
    res = client.get("/api/analytics/compliance-trends")
    assert res.status_code == 200

    # Deadlines
    res = client.get("/api/lifecycle/deadlines")
    assert res.status_code == 200

    # Obligations
    res = client.get("/api/lifecycle/obligations")
    assert res.status_code == 200

    # Update obligation
    res = client.patch("/api/lifecycle/obligations/ob1", json={"status": "completed"})
    assert res.status_code == 200

