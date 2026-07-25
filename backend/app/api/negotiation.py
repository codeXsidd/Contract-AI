from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse, NegotiationResponse, NegotiationSimulationRequest

router = APIRouter(prefix="/negotiation", tags=["AI Negotiation"])

@router.post("/{contract_id}/analyze", response_model=ApiResponse)
async def analyze_negotiation(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    recommendations = [
        {
            "clause_id": "1",
            "clause_type": "Liability",
            "issue": "Liability cap exceeds industry standard",
            "original_text": "Vendor's total aggregate liability shall not exceed three (3) times the total fees paid in the twelve months preceding the claim.",
            "suggested_text": "Vendor's total aggregate liability shall not exceed one (1) times the total fees paid in the twelve months preceding the claim.",
            "explanation": "The current 3x liability cap is significantly above the industry standard of 1x. This exposes the client to elevated financial risk in case of disputes.",
            "impact": "high",
            "risk_reduction_pct": 35
        },
        {
            "clause_id": "2",
            "clause_type": "Termination",
            "issue": "Unilateral termination rights favor vendor",
            "original_text": "Either party may terminate this Agreement for any reason with 90 days written notice.",
            "suggested_text": "Either party may terminate this Agreement for convenience with 30 days written notice, or immediately upon a material breach uncured within 15 days of notice.",
            "explanation": "The 90-day notice for termination is too long. Industry standard is 30 days for convenience, with immediate termination rights for material breach.",
            "impact": "medium",
            "risk_reduction_pct": 20
        }
    ]
    
    return {
        "success": True,
        "data": {
            "negotiation_score": 62,
            "risk_reduction_pct": 35,
            "recommendations": recommendations
        }
    }

@router.get("/{contract_id}", response_model=ApiResponse)
async def get_negotiation_session(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": {
            "contract_id": contract_id,
            "negotiation_score": 62,
            "risk_reduction_pct": 35,
            "status": "in_progress"
        }
    }

@router.post("/{contract_id}/simulate", response_model=ApiResponse)
async def simulate_clause_negotiation(
    contract_id: str,
    req: NegotiationSimulationRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": {
            "contract_id": contract_id,
            "clause_id": req.clause_id,
            "new_text": req.new_text,
            "simulated_risk_score": 25,
            "improvement_pct": 18,
            "verdict": "Acceptable win-win clause modification"
        }
    }

