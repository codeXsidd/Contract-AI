import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_time_machine_api():
    response = client.get("/api/analytics/1/time-machine")
    assert response.status_code == 200
    data = response.json()
    assert "projections" in data
    assert len(data["projections"]) == 4

def test_business_simulator_api():
    response = client.post("/api/analytics/1/simulate-impact", json={
        "payment_terms_days": 60,
        "liability_cap_percent": 200,
        "notice_period_days": 90,
        "sla_uptime_percent": 99.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "simulated_metrics" in data
    assert "cash_flow_risk_score" in data["simulated_metrics"]

def test_knowledge_graph_api():
    response = client.get("/api/analytics/1/knowledge-graph")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "links" in data

def test_health_timeline_api():
    response = client.get("/api/analytics/1/health-timeline")
    assert response.status_code == 200
    data = response.json()
    assert "timeline" in data

def test_regulatory_radar_api():
    response = client.get("/api/compliance/regulatory-radar")
    assert response.status_code == 200
    data = response.json()
    assert "regulatory_updates" in data
    assert data["radar_status"] == "Active"
