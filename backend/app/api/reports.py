from fastapi import APIRouter, Depends, Response
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.services.reports import ReportGenerator

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/{contract_id}/pdf")
async def generate_pdf(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    # Fetch summary info
    res = db.table("contracts").select("*").eq("id", contract_id).execute()
    contract_data = res.data[0] if res.data else {"title": "Service Contract", "type": "Service Agreement"}
    
    pdf_bytes = ReportGenerator.generate_pdf_report(contract_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Report_{contract_id}.pdf"}
    )

@router.post("/{contract_id}/risk")
async def generate_risk_pdf(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    # Retrieve contract
    res = db.table("contracts").select("*").eq("id", contract_id).execute()
    contract_data = res.data[0] if res.data else {"title": "Service Contract", "type": "Service Agreement"}
    contract_data["recommendations"] = [
        "Cap liability at 1x total annual service fee structure.",
        "Add comprehensive mutual NDA clause alignment.",
        "Shorten termination convenience notice from 90 days to 30 days."
    ]
    
    pdf_bytes = ReportGenerator.generate_pdf_report(contract_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Risk_Report_{contract_id}.pdf"}
    )
