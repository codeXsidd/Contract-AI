from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=ApiResponse)
async def get_dashboard_metrics(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    # Retrieve stats
    return {
        "success": True,
        "data": {
            "total_contracts": 147,
            "active_contracts": 89,
            "high_risk_contracts": 23,
            "expiring_soon": 7,
            "avg_compliance_score": 87,
            "avg_health_score": 84
        }
    }

@router.get("/upload-trends", response_model=ApiResponse)
async def get_upload_trends(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": [
            {"month": "Feb", "count": 12},
            {"month": "Mar", "count": 19},
            {"month": "Apr", "count": 15},
            {"month": "May", "count": 28},
            {"month": "Jun", "count": 34},
            {"month": "Jul", "count": 41}
        ]
    }

@router.get("/risk-distribution", response_model=ApiResponse)
async def get_risk_distribution(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": [
            {"name": "Safe", "value": 45, "color": "#10b981"},
            {"name": "Moderate", "value": 32, "color": "#f59e0b"},
            {"name": "High Risk", "value": 23, "color": "#ef4444"}
        ]
    }

@router.get("/compliance-trends", response_model=ApiResponse)
async def get_compliance_trends(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": [
            {"month": "Apr", "gdpr": 72, "hipaa": 68, "iso": 75},
            {"month": "May", "gdpr": 78, "hipaa": 72, "iso": 80},
            {"month": "Jun", "gdpr": 82, "hipaa": 76, "iso": 83},
            {"month": "Jul", "gdpr": 87, "hipaa": 82, "iso": 88}
        ]
    }

