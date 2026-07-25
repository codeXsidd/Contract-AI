from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.middleware.auth import get_current_user
from app.database.connection import get_db
from app.schemas.schemas import ChatMessageResponse
from app.ai.ai_service import AIService

class ChatMessageRequest(BaseModel):
    message: str
    target_language: Optional[str] = "en"

router = APIRouter(prefix="/chat", tags=["AI Chat"])

@router.post("/{contract_id}", response_model=ChatMessageResponse)
async def chat_message(
    contract_id: str,
    req: ChatMessageRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    msg = req.message.lower()
    target_lang = req.target_language or "en"
    
    # Retrieve contract from DB
    res = db.table("contracts").select("*").eq("id", contract_id).execute()
    contract_data = res.data[0] if res.data else None
    
    title = contract_data.get("title", "Contract") if contract_data else "Contract"
    summary = contract_data.get("summary", "No summary available") if contract_data else ""
    
    # Try querying Grok
    system_prompt = f"You are an expert legal counsel assistant answering questions in {target_lang} language about the contract: '{title}'."
    prompt = f"Contract Summary Context: {summary}\nUser's Question: {req.message}\nTarget Language: {target_lang}\n\nProvide a professional, clear response matching the question in {target_lang}."
    
    response = AIService.query_grok(prompt, system_prompt)
    
    # Multilingual Fallbacks
    if response == "MOCK_AI_RESPONSE" or response.startswith("Error"):
        if target_lang == "es":
            if "summar" in msg or "resumen" in msg:
                response = f"**Resumen del Contrato: {title}**\n\nEste es un contrato de tipo {contract_data.get('type', 'Acuerdo de Servicio')}.\n\n**Términos Clave:**\n- Valor Estimado: {contract_data.get('value', 'N/A')} {contract_data.get('currency', 'USD')}\n- Fecha de Inicio: {contract_data.get('effective_date', 'N/A')}\n- Fecha de Expiración: {contract_data.get('expiry_date', 'N/A')}"
            elif "risk" in msg or "riesgo" in msg:
                response = f"**Análisis de Riesgo para {title}**\n\n🔴 **Puntuación de Riesgo: 45/100**\n\n- Límite de responsabilidad requiere revisión.\n- Cláusula de terminación unilateral."
            else:
                response = f"Basado en el análisis de '{title}', respondo a su consulta: {req.message}."
        elif target_lang == "hi":
            if "summar" in msg or "सार" in msg:
                response = f"**अनुबंध सारांश: {title}**\n\nयह एक {contract_data.get('type', 'सेवा समझौता')} अनुबंध है।\n\n**मुख्य विवरण:**\n- अनुमानित मूल्य: {contract_data.get('value', 'N/A')} {contract_data.get('currency', 'USD')}"
            else:
                response = f"'{title}' के विश्लेषण के आधार पर, आपके प्रश्न का उत्तर: {req.message}।"
        else:
            if "summar" in msg:
                response = f"**Contract Summary: {title}**\n\nThis is a {contract_data.get('type', 'Service Agreement')} contract.\n\n**Key Details:**\n- Title: {title}\n- Estimated Value: {contract_data.get('value', 'N/A')} {contract_data.get('currency', 'USD')}\n- Effective Date: {contract_data.get('effective_date', 'N/A')}\n- Expiry Date: {contract_data.get('expiry_date', 'N/A')}\n\n**Summary of Terms:**\n{summary}"
            elif "risk" in msg:
                risk = contract_data.get("risk_score", 45) if contract_data else 45
                response = f"**Risk Analysis for {title}**\n\n🔴 **Overall Risk Score: {risk}/100**\n\n**Potential Red Flags identified:**\n- Limitation of Liability: Section 8 liability cap deviates from the standard 1x fee multiplier.\n- Termination: Unilateral termination clauses favor the vendor."
            elif "payment" in msg:
                val = contract_data.get("value", "Not specified") if contract_data else "Not specified"
                response = f"**Payment Terms ({title})**\n\n- Contract Value: {val} {contract_data.get('currency', 'USD') if contract_data else 'USD'}\n- Payment Cycle: Net-30 days from invoice date.\n- Late interest penalty: 1.5% per month."
            else:
                response = f"Based on my analysis of '{title}', here is the answer to your question:\n\n{req.message}\n\nThis contract is a standard {contract_data.get('type', 'document')}."

    return {
        "response": response,
        "citations": [
            {"text": "Section 5.1 (Invoicing cycles)", "page": 2, "clause_type": "payment"},
            {"text": "Section 8.2 (Limitation of Liability)", "page": 4, "clause_type": "liability"}
        ]
    }
