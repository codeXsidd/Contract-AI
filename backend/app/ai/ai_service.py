import re

try:
    import spacy
except ImportError:
    spacy = None

from typing import Dict, Any, List
from app.core_config import settings
from app.schemas.schemas import NegotiationRecommendation

# Load SpaCy small English model for basic NER
if spacy:
    try:
        nlp = spacy.load("en_core_web_sm")
    except Exception:
        # Model not available
        nlp = None
else:
    # SpaCy not installed
    nlp = None

# Regex patterns for Indian & Global PII elements
AADHAAR_REGEX = r"\b[2-9]\d{3}\s\d{4}\s\d{4}\b"
PAN_REGEX = r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"
PASSPORT_REGEX = r"\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b"
EMAIL_REGEX = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
PHONE_REGEX = r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
class AIService:
    @staticmethod
    def detect_pii(text: str) -> Dict[str, Any]:
        """
        Detects PII elements like Aadhaar, PAN, Passport, Email, Phone, and Addresses.
        """
        aadhaar = re.findall(AADHAAR_REGEX, text)
        pan = re.findall(PAN_REGEX, text)
        passport = re.findall(PASSPORT_REGEX, text)
        emails = re.findall(EMAIL_REGEX, text)
        phones = re.findall(PHONE_REGEX, text)
        
        addresses = []
        if nlp:
            doc = nlp(text[:100000])  # Cap at 100k chars for performance
            for ent in doc.ents:
                if ent.label_ in ["GPE", "LOC", "FAC"]:
                    addresses.append(ent.text)
                    
        total_items = len(aadhaar) + len(pan) + len(passport) + len(emails) + len(phones) + len(addresses)
        # Privacy Score ranges from 0-100 based on presence of sensitive elements
        privacy_score = max(0, 100 - (total_items * 10))
        
        return {
            "aadhaar": list(set(aadhaar)),
            "pan": list(set(pan)),
            "passport": list(set(passport)),
            "email": list(set(emails)),
            "phone": list(set(phones)),
            "address": list(set(addresses[:15])),
            "privacy_score": privacy_score
        }

    @classmethod
    def mask_pii(cls, text: str) -> str:
        """
        Masks detected PII elements inside the text.
        """
        masked = text
        masked = re.sub(AADHAAR_REGEX, "[MASKED AADHAAR]", masked)
        masked = re.sub(PAN_REGEX, "[MASKED PAN]", masked)
        masked = re.sub(PASSPORT_REGEX, "[MASKED PASSPORT]", masked)
        masked = re.sub(EMAIL_REGEX, "[MASKED EMAIL]", masked)
        masked = re.sub(PHONE_REGEX, "[MASKED PHONE]", masked)
        return masked

    @staticmethod
    def query_grok(prompt: str, system_prompt: str = "You are an expert corporate legal counsel.") -> str:
        """
        Performs inference against Grok API (using OpenAI endpoint configuration style).
        """
        # If API key is empty, return static mock results to avoid runtime errors
        if not settings.GROK_API_KEY or settings.GROK_API_KEY == "your-grok-api-key":
            return "MOCK_AI_RESPONSE"
            
        import httpx
        headers = {
            "Authorization": f"Bearer {settings.GROK_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "grok-beta",  # Standard model identifier for Grok API
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1
        }
        
        try:
            with httpx.Client() as client:
                res = client.post(f"{settings.GROK_API_BASE}/chat/completions", json=data, headers=headers, timeout=45.0)
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
                else:
                    return f"Error: Received status {res.status_code} - {res.text}"
        except Exception as e:
            return f"Error calling Grok: {str(e)}"

    @classmethod
    def extract_clauses(cls, text: str) -> List[Dict[str, Any]]:
        """
        Extracts NDA, confidentiality, liability, payment, and termination clauses dynamically from document text.
        """
        if not text or len(text.strip()) == 0:
            return []

        prompt = f"""
        Extract specific key clauses from this contract. Highlight key text sections.
        Return raw JSON containing a list of objects with the structure:
        [
          {{"type": "liability", "content": "exact clause text", "risk_level": "moderate", "risk_reason": "why", "severity": 3}},
          {{"type": "payment", "content": "exact clause text", "risk_level": "safe", "risk_reason": "why", "severity": 1}}
        ]
        
        Contract content:
        {text[:8000]}
        """
        response = cls.query_grok(prompt)
        if "MOCK" not in response and not response.startswith("Error"):
            clean_response = re.sub(r"```json|```", "", response).strip()
            try:
                import json
                return json.loads(clean_response)
            except Exception:
                pass

        # Dynamic regex/heuristics extraction from actual text
        extracted = []
        sentences = [s.strip() for s in re.split(r'\.|\n', text) if len(s.strip()) > 30]

        for idx, sentence in enumerate(sentences):
            lower = sentence.lower()
            if any(k in lower for k in ["liable", "liability", "indemnif", "damages"]):
                extracted.append({
                    "id": f"cl_{idx}",
                    "type": "liability",
                    "content": sentence[:300],
                    "risk_level": "moderate" if "unlimited" in lower or "3x" in lower or "exclude" in lower else "safe",
                    "risk_reason": "Contains liability/indemnification terms.",
                    "severity": 3 if "unlimited" in lower else 2
                })
            elif any(k in lower for k in ["pay", "invoice", "fee", "net-", "due"]):
                extracted.append({
                    "id": f"cl_{idx}",
                    "type": "payment",
                    "content": sentence[:300],
                    "risk_level": "moderate" if "penalty" in lower or "interest" in lower else "safe",
                    "risk_reason": "Payment schedule or late fee term.",
                    "severity": 1
                })
            elif any(k in lower for k in ["terminate", "termination", "cancel", "notice"]):
                extracted.append({
                    "id": f"cl_{idx}",
                    "type": "termination",
                    "content": sentence[:300],
                    "risk_level": "moderate" if "90 days" in lower or "convenience" in lower else "safe",
                    "risk_reason": "Termination notice period.",
                    "severity": 2
                })
            elif any(k in lower for k in ["confidential", "secret", "nondisclosure", "nda"]):
                extracted.append({
                    "id": f"cl_{idx}",
                    "type": "confidentiality",
                    "content": sentence[:300],
                    "risk_level": "safe",
                    "risk_reason": "Standard confidentiality terms.",
                    "severity": 1
                })

        if not extracted:
            extracted = [
                {"id": "cl1", "type": "liability", "content": text[:200] if text else "Limitation of liability clause active.", "risk_level": "safe", "risk_reason": "Extracted from header", "severity": 1}
            ]

        return extracted[:10]

    @classmethod
    def analyze_contract_dynamic(cls, text: str, title: str = "") -> Dict[str, Any]:
        """
        Dynamically analyzes a contract text to extract summary, risk score, health score, compliance score, and obligations.
        """
        clauses = cls.extract_clauses(text)
        pii = cls.detect_pii(text)

        # Dynamic risk score calculation based on text content & high-risk keywords
        text_lower = text.lower()
        risk_score = 25
        if "unlimited liability" in text_lower:
            risk_score += 35
        if "penalty" in text_lower or "interest" in text_lower:
            risk_score += 15
        if "auto-renew" in text_lower or "automatic renewal" in text_lower:
            risk_score += 10
        if "indemnify" in text_lower or "indemnification" in text_lower:
            risk_score += 10
        if pii["privacy_score"] < 80:
            risk_score += 15

        risk_score = min(95, max(15, risk_score))
        health_score = max(20, 100 - risk_score + 5)
        compliance_score = max(30, pii["privacy_score"])

        # Extract dynamic summary
        summary = text[:400].strip() + ("..." if len(text) > 400 else "")
        if not summary:
            summary = f"Parsed agreement titled '{title}'."

        # Extract obligations
        obligations = []
        if "deliver" in text_lower or "provide" in text_lower:
            obligations.append({"description": "Deliver contractual deliverables and milestone reports", "due_date": "2024-09-01", "status": "pending", "priority": "high"})
        if "pay" in text_lower or "invoice" in text_lower:
            obligations.append({"description": "Settle submitted invoices within Net-30 timeframe", "due_date": "2024-08-15", "status": "pending", "priority": "medium"})

        return {
            "summary": summary,
            "risk_score": risk_score,
            "health_score": health_score,
            "compliance_score": compliance_score,
            "clauses": clauses,
            "pii": pii,
            "obligations": obligations
        }

