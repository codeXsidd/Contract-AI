from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ApiResponse

router = APIRouter(prefix="/lifecycle", tags=["Lifecycle"])

@router.get("/obligations", response_model=ApiResponse)
async def get_obligations(
    contract_id: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    obligations = [
        {"id": "ob1", "contract_id": contract_id or "1", "description": "Deliver quarterly consulting report", "due_date": "2024-09-01", "status": "pending", "priority": "medium"},
        {"id": "ob2", "contract_id": contract_id or "1", "description": "Pay invoice #3010", "due_date": "2024-08-15", "status": "pending", "priority": "high"}
    ]
    return {
        "success": True,
        "data": obligations
    }

@router.get("/deadlines", response_model=ApiResponse)
async def get_deadlines(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    deadlines = [
        {"id": "1", "contract_id": "c1", "contract_title": "Microsoft Azure SLA", "type": "renewal", "date": "2024-08-01", "status": "upcoming", "days_remaining": 7},
        {"id": "2", "contract_id": "c2", "contract_title": "AWS Enterprise Agreement", "type": "renewal", "date": "2024-08-08", "status": "upcoming", "days_remaining": 14},
        {"id": "3", "contract_id": "c3", "contract_title": "Vendor Agreement Q2", "type": "expiry", "date": "2024-07-25", "status": "today", "days_remaining": 0},
        {"id": "4", "contract_id": "c4", "contract_title": "NDA - Beta Corp", "type": "review", "date": "2024-07-20", "status": "overdue", "days_remaining": -4}
    ]
    return {
        "success": True,
        "data": deadlines
    }

@router.get("/expiring", response_model=ApiResponse)
async def get_expiring_contracts(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    expiring = [
        {"id": "3", "contract_id": "c3", "contract_title": "Vendor Agreement Q2", "type": "expiry", "date": "2024-07-25", "status": "today", "days_remaining": 0},
        {"id": "1", "contract_id": "c1", "contract_title": "Microsoft Azure SLA", "type": "renewal", "date": "2024-08-01", "status": "upcoming", "days_remaining": 7}
    ]
    return {
        "success": True,
        "data": expiring
    }

@router.patch("/obligations/{obligation_id}", response_model=ApiResponse)
async def update_obligation_status(
    obligation_id: str,
    body: dict,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    new_status = body.get("status", "completed")
    return {
        "success": True,
        "message": f"Obligation {obligation_id} updated to {new_status}",
        "data": {"id": obligation_id, "status": new_status}
    }

