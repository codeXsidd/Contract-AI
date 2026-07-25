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
        Uses Grok to extractNDA, confidentiality, liability, and payment clauses.
        """
        prompt = f"""
        Extract specific clause clauses from this contract. Highlight key text sections.
        Return raw JSON containing a list of objects with the structure:
        [
          {{"type": "liability", "content": "exact clause text", "risk_level": "high", "risk_reason": "why", "severity": 4}},
          {{"type": "payment", "content": "exact clause text", "risk_level": "safe", "risk_reason": "why", "severity": 1}}
        ]
        
        Contract content:
        {text[:8000]}
        """
        # Parse result or fallback
        response = cls.query_grok(prompt)
        if "MOCK" in response or "Error" in response:
            return [
                {"type": "liability", "content": "Limitation of liability is capped at 3x annual fees.", "risk_level": "moderate", "risk_reason": "3x is higher than average", "severity": 3},
                {"type": "payment", "content": "All fees are due within 30 days of receiving the invoice.", "risk_level": "safe", "risk_reason": "Standard Net-30 condition", "severity": 1}
            ]
        
        # Strip code blocks
        clean_response = re.sub(r"```json|```", "", response).strip()
        try:
            import json
            return json.loads(clean_response)
        except Exception:
            return [{"type": "other", "content": "Extracted clause payload format invalid", "risk_level": "moderate"}]
