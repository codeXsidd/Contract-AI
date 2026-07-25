from fastapi import APIRouter, Depends
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse, ComplianceRequest

router = APIRouter(prefix="/compliance", tags=["Compliance"])

@router.post("/{contract_id}", response_model=ApiResponse)
async def check_compliance(
    contract_id: str,
    req: ComplianceRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    results = []
    
    # Generate mock check responses for selected frameworks
    if "gdpr" in req.frameworks:
        results.append({
            "id": "gdpr",
            "name": "GDPR",
            "score": 87,
            "color": "#3b82f6",
            "icon": "🇪🇺",
            "violations": [
                {"rule": "Art. 13 - Transparency", "description": "Privacy notice does not include lawful basis for processing", "severity": "high", "fix": "Add explicit statement of legal basis (e.g., legitimate interest, consent) in Section 3"},
                {"rule": "Art. 17 - Right to Erasure", "description": "Contract lacks right to erasure provisions", "severity": "medium", "fix": "Add clause granting data subjects the right to request deletion of their personal data"}
            ],
            "recommendations": ["Add a comprehensive Data Processing Agreement (DPA)"]
        })
        
    if "hipaa" in req.frameworks:
        results.append({
            "id": "hipaa",
            "name": "HIPAA",
            "score": 82,
            "color": "#8b5cf6",
            "icon": "🏥",
            "violations": [
                {"rule": "45 CFR 164.308 - Safeguards", "description": "Administrative safeguards not specified for ePHI handling", "severity": "high", "fix": "Add specific technical and administrative safeguard requirements for electronic Protected Health Information"}
            ],
            "recommendations": ["Include Business Associate Agreement (BAA)"]
        })
        
    return {
        "success": True,
        "data": {
            "results": results
        }
    }
