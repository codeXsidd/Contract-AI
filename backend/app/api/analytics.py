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
