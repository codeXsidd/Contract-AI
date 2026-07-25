from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.ai.ai_service import AIService
from app.ai.rag_service import rag_service
from app.schemas.schemas import ApiResponse, ChatMessageRequest, ChatMessageResponse, ComplianceRequest

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])

@router.get("/{contract_id}/summary", response_model=ApiResponse)
async def get_summary(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    res = db.table("contracts").select("summary, title, type, value, currency, risk_score, health_score, compliance_score, upload_date, effective_date, expiry_date").eq("id", contract_id).eq("user_id", current_user["id"]).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    contract = res.data[0]
    return {
        "success": True,
        "data": {
            "id": contract_id,
            "user_id": current_user["id"],
            "title": contract.get("title"),
            "status": "active",
            "type": contract.get("type"),
            "upload_date": contract.get("upload_date"),
            "effective_date": contract.get("effective_date"),
            "expiry_date": contract.get("expiry_date"),
            "value": contract.get("value"),
            "currency": contract.get("currency"),
            "risk_score": contract.get("risk_score"),
            "health_score": contract.get("health_score"),
            "compliance_score": contract.get("compliance_score"),
            "summary": contract.get("summary", "No summary has been generated yet for this contract."),
            "parties": [{"name": "TechCorp Consulting Inc.", "role": "Provider"}, {"name": "Acme Solutions Ltd", "role": "Client"}]
        }
    }

@router.get("/{contract_id}/clauses", response_model=ApiResponse)
async def get_clauses(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    # Retrieve clauses from public.clauses table
    res = db.table("clauses").select("*").eq("contract_id", contract_id).execute()
    if not res.data:
        # Fallback to standard mock list
        return {
            "success": True,
            "data": [
                {"id": "cl1", "contract_id": contract_id, "type": "liability", "content": "Neither party shall be liable for indirect, incidental, or consequential damages. TechCorp's maximum liability shall not exceed the total fees paid under this Agreement.", "risk_level": "safe", "risk_reason": "Standard mutual liability exclusion with standard cap.", "severity": 1},
                {"id": "cl2", "contract_id": contract_id, "type": "payment", "content": "Client shall pay all invoices within thirty (30) days of receipt. Late payments shall accumulate interest at a rate of 1.5% per month.", "risk_level": "moderate", "risk_reason": "Late payment fee is slightly higher than usual bank rates.", "severity": 3},
                {"id": "cl3", "contract_id": contract_id, "type": "termination", "content": "Either party may terminate this Agreement with ninety (90) days written notice. Immediate termination is permitted for uncured material breach.", "risk_level": "moderate", "risk_reason": "90-day period is long for consulting arrangements; typically 30-60 days.", "severity": 3}
            ]
        }
    return {
        "success": True,
        "data": res.data
    }

@router.get("/{contract_id}/red-flags", response_model=ApiResponse)
async def get_red_flags(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    return {
        "success": True,
        "data": [
            {"type": "Liability Cap", "description": "Liability is capped strictly at historical fees paid, rather than a fixed multiplier of standard value.", "severity": "medium"},
            {"type": "NDA", "description": "Mutual NDA clause does not cover data processing transfers specifically.", "severity": "low"}
        ]
    }
