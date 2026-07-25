from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse, SimilaritySearchTextRequest

router = APIRouter(prefix="/similarity", tags=["Similarity Search"])

@router.post("/text", response_model=ApiResponse)
async def search_similarity_by_text(
    req: SimilaritySearchTextRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    items = [
        {
            "id": "1",
            "title": "Master Service Agreement - TechCorp (v1)",
            "score": 96,
            "matchedClauses": ["Section 8 (Limitation of Liability)", "Section 12.1 (Termination for Cause)"]
        },
        {
            "id": "2",
            "title": "Vendor Agreement - Supply Chain Ltd",
            "score": 78,
            "matchedClauses": ["Section 4 (Payment Terms)", "Section 14 (Governing Law)"]
        }
    ]
    return {
        "success": True,
        "data": {
            "items": items
        }
    }
