from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
import os
import shutil
from datetime import date
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.services.parser import DocumentParser
from app.ai.ai_service import AIService
from app.schemas.schemas import ContractResponse, ApiResponse

router = APIRouter(prefix="/contracts", tags=["Contracts"])

# Temporary workspace for local parsing
TEMP_DIR = "contracts_temp"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/upload", response_model=ApiResponse)
async def upload_contract(
    file: UploadFile = File(...),
    title: str = Form(...),
    type: str = Form(...),
    effective_date: Optional[date] = Form(None),
    expiry_date: Optional[date] = Form(None),
    value: Optional[float] = Form(None),
    currency: str = Form("USD"),
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    # Validate extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Only PDF and DOCX are allowed."
        )
        
    # Write temp file locally
    temp_path = os.path.join(TEMP_DIR, f"{current_user['id']}_{file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Parse document content
        parsed = DocumentParser.parse_file(temp_path)
        content_text = parsed["text"]
        
        # PII Detection and Summary
        pii = AIService.detect_pii(content_text)
        summary = content_text[:300] + "..." # basic initial summary
        
        # Save payload to Supabase Database
        contract_data = {
            "user_id": current_user["id"],
            "title": title,
            "type": type,
            "status": "draft",
            "effective_date": str(effective_date) if effective_date else None,
            "expiry_date": str(expiry_date) if expiry_date else None,
            "value": value,
            "currency": currency,
            "file_url": f"storage://contracts/{file.filename}",
            "risk_score": 40, # default placeholder score before LLM analysis
            "health_score": 80,
            "compliance_score": 85,
            "summary": summary,
            "is_pii_masked": False,
            "language": "English",
            "version": 1
        }
        
        res = db.table("contracts").insert(contract_data).execute()
        
        if not res.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save contract to database"
            )
            
        return {
            "success": True,
            "message": "Contract uploaded and parsed successfully",
            "data": res.data[0]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Parsing error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("", response_model=ApiResponse)
async def get_all_contracts(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    res = db.table("contracts").select("*").eq("user_id", current_user["id"]).execute()
    return {
        "success": True,
        "data": res.data
    }

@router.get("/{contract_id}", response_model=ApiResponse)
async def get_contract_by_id(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    res = db.table("contracts").select("*").eq("id", contract_id).eq("user_id", current_user["id"]).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found"
        )
    return {
        "success": True,
        "data": res.data[0]
    }
