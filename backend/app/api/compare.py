from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse, ComparisonRequest

router = APIRouter(prefix="/compare", tags=["Comparison"])

@router.post("", response_model=ApiResponse)
async def compare_contracts(
    req: ComparisonRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    diffs = [
        {
            "clauseType": "Limitation of Liability",
            "status": "modified",
            "originalText": "Vendor's total liability shall not exceed the amount of fees paid in the 12 months preceding the event.",
            "modifiedText": "Vendor's total liability shall not exceed three (3) times the amount of fees paid in the 12 months preceding the event.",
            "explanation": "Liability cap has been increased from 1x to 3x fees, significantly increasing the client risk profile."
        },
        {
            "clauseType": "Indemnification",
            "status": "added",
            "modifiedText": "Client shall indemnify, defend, and hold harmless Vendor from and against any and all claims arising out of Client's breach of Section 4 (Intellectual Property).",
            "explanation": "A one-sided IP indemnification clause has been added to favor the vendor."
        }
    ]
    
    return {
        "success": True,
        "data": {
            "negotiation_score": 78,
            "diffs": diffs
        }
    }
