from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime, date

# ============================================================
# GENERIC API RESPONSE WRAPPER
# ============================================================
class ApiResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None


# ============================================================
# CONTRACT SCHEMAS
# ============================================================
class ContractBase(BaseModel):
    title: str
    type: str
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    value: Optional[float] = None
    currency: str = "USD"

class ContractCreate(ContractBase):
    pass

class ContractUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    value: Optional[float] = None
    currency: Optional[str] = None

class PartySchema(BaseModel):
    name: str
    role: str
    email: Optional[EmailStr] = None

class ContractResponse(ContractBase):
    id: str
    user_id: str
    status: str
    upload_date: datetime
    file_url: str
    masked_file_url: Optional[str] = None
    risk_score: Optional[int] = None
    health_score: Optional[int] = None
    compliance_score: Optional[int] = None
    summary: Optional[str] = None
    is_pii_masked: bool
    language: str
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# ============================================================
# CLAUSE SCHEMAS
# ============================================================
class ClauseResponse(BaseModel):
    id: str
    contract_id: str
    type: str
    content: str
    risk_level: str
    risk_reason: Optional[str] = None
    severity: Optional[int] = None
    page_number: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

# ============================================================
# COMPLIANCE SCHEMAS
# ============================================================
class ComplianceRequest(BaseModel):
    frameworks: List[str]

class ComplianceViolation(BaseModel):
    rule: str
    description: str
    severity: str
    fix: str

class ComplianceResponse(BaseModel):
    contract_id: str
    framework: str
    score: int
    violations: List[ComplianceViolation]
    recommendations: List[str]

# ============================================================
# CHAT SCHEMAS
# ============================================================
class ChatMessageRequest(BaseModel):
    message: str

class CitationSchema(BaseModel):
    text: str
    page: Optional[int] = None
    clause_type: Optional[str] = None

class ChatMessageResponse(BaseModel):
    response: str
    citations: List[CitationSchema] = []

# ============================================================
# NEGOTIATION SCHEMAS
# ============================================================
class NegotiationSimulationRequest(BaseModel):
    clause_id: str
    new_text: str

class NegotiationRecommendation(BaseModel):
    clause_id: Optional[str] = None
    clause_type: str
    issue: str
    original_text: Optional[str] = None
    suggested_text: str
    explanation: str
    impact: str
    risk_reduction_pct: int

class NegotiationResponse(BaseModel):
    negotiation_score: int
    risk_reduction_pct: int
    recommendations: List[NegotiationRecommendation]

# ============================================================
# COMPARISON SCHEMAS
# ============================================================
class ComparisonRequest(BaseModel):
    contract_id_1: str
    contract_id_2: str

class DiffItemResponse(BaseModel):
    clauseType: str
    status: str
    originalText: Optional[str] = None
    modifiedText: Optional[str] = None
    explanation: Optional[str] = None

class ComparisonResponse(BaseModel):
    negotiation_score: int
    diffs: List[DiffItemResponse]

# ============================================================
# SIMILARITY SCHEMAS
# ============================================================
class SimilaritySearchTextRequest(BaseModel):
    query: str

class SimilarItemResponse(BaseModel):
    id: str
    title: str
    score: int
    matchedClauses: List[str]

class SimilaritySearchResponse(BaseModel):
    items: List[SimilarItemResponse]
