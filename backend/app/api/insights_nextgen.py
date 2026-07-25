from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel

router = APIRouter(prefix="/analytics", tags=["NextGen Analytics"])

class ImpactSimulationRequest(BaseModel):
    payment_terms_days: int = 30
    liability_cap_percent: int = 100
    notice_period_days: int = 30
    sla_uptime_percent: float = 99.5

@router.get("/{contract_id}/time-machine")
def get_time_machine_projection(contract_id: str) -> Dict[str, Any]:
    """
    Predicts future legal, financial, and compliance risks over 0, 3, 6, and 12 months.
    """
    return {
        "contract_id": contract_id,
        "current_risk": 28,
        "projections": [
            {
                "month": "Month 0 (Today)",
                "risk_score": 28,
                "status": "Low Risk",
                "reasons": ["Standard terms active", "All insurance policies valid"]
            },
            {
                "month": "Month 3",
                "risk_score": 38,
                "status": "Moderate Risk",
                "reasons": ["Annual price indexation clause review due", "Quarterly audit requirement"]
            },
            {
                "month": "Month 6",
                "risk_score": 65,
                "status": "High Risk",
                "reasons": [
                    "Vendor pricing escalates +15% automatically",
                    "Cyber liability insurance policy expires",
                    "90-day non-renewal notice window opens"
                ]
            },
            {
                "month": "Month 12",
                "risk_score": 78,
                "status": "Critical Risk",
                "reasons": [
                    "Automatic multi-year renewal locks in without opt-out",
                    "Uncapped SLA penalty clause becomes active"
                ]
            }
        ],
        "key_triggers": [
            {"date": "In 90 Days", "event": "Vendor Pricing Change (+15%)", "severity": "High"},
            {"date": "In 180 Days", "event": "Insurance Expiry", "severity": "Critical"},
            {"date": "In 270 Days", "event": "Auto-Renewal Window Opens", "severity": "Medium"}
        ]
    }

@router.get("/{contract_id}/health-timeline")
def get_health_score_timeline(contract_id: str) -> Dict[str, Any]:
    """
    Returns monthly historic and projected contract health timeline with AI explanation annotations.
    """
    return {
        "contract_id": contract_id,
        "timeline": [
            {"month": "Jan", "health_score": 95, "event": "Contract Executed cleanly"},
            {"month": "Feb", "health_score": 93, "event": "Minor SLA delivery delay logged"},
            {"month": "Mar", "health_score": 82, "event": "New DPDP regulatory requirement flagged"},
            {"month": "Apr", "health_score": 80, "event": "Quarterly vendor performance review"},
            {"month": "May", "health_score": 74, "event": "Sub-vendor compliance gap identified"},
            {"month": "Jun", "health_score": 65, "event": "Insurance policy renewal deadline pending"},
            {"month": "Jul (Current)", "health_score": 68, "event": "Interim risk mitigation applied"},
            {"month": "Aug (Projected)", "health_score": 60, "event": "Upcoming auto-renewal trigger point"},
            {"month": "Sep (Projected)", "health_score": 41, "event": "Unhedged price indexation activates"}
        ],
        "insights": [
            "Contract health dropped 30% since execution due to unmanaged insurance renewal and regulatory changes.",
            "Immediate action on insurance policy renewal will restore score back to 85%."
        ]
    }

@router.post("/{contract_id}/simulate-impact")
def simulate_business_impact(contract_id: str, body: ImpactSimulationRequest) -> Dict[str, Any]:
    """
    Simulates Cash Flow, Revenue, Vendor Dependency, and Operational Delay impacts based on parameter changes.
    """
    # Calculate dynamic simulation metrics
    days_delta = body.payment_terms_days - 30
    working_capital_impact = - (days_delta * 1.4)
    cash_flow_risk = max(10, min(95, 20 + int(days_delta * 1.2)))
    
    liability_risk = "Low" if body.liability_cap_percent <= 100 else ("High" if body.liability_cap_percent > 300 else "Medium")
    vendor_dependency = "High" if body.notice_period_days > 60 else "Moderate"
    operational_delay_risk = max(5, int((100 - body.sla_uptime_percent) * 35))

    return {
        "contract_id": contract_id,
        "input_parameters": body.model_dump(),
        "simulated_metrics": {
            "cash_flow_risk_score": cash_flow_risk,
            "working_capital_change_pct": round(working_capital_impact, 1),
            "revenue_risk_level": liability_risk,
            "vendor_dependency_level": vendor_dependency,
            "operational_delay_risk_pct": operational_delay_risk
        },
        "cascade_chain": [
            f"Payment Terms adjusted from 30 to {body.payment_terms_days} days",
            f"Working Capital changes by {round(working_capital_impact, 1)}%",
            f"Cash Flow Risk Score shifts to {cash_flow_risk}%",
            f"SLA target at {body.sla_uptime_percent}% carries {operational_delay_risk}% operational delay risk"
        ],
        "recommendation": "Maintain payment terms below 60 days to avoid cash flow stress, and cap total liability at 100% contract value."
    }

@router.get("/{contract_id}/knowledge-graph")
def get_contract_knowledge_graph(contract_id: str) -> Dict[str, Any]:
    """
    Returns nodes and relational links for clause inter-dependencies.
    """
    return {
        "contract_id": contract_id,
        "nodes": [
            {"id": "c1", "label": "Termination Clause", "type": "Clause", "risk": "High"},
            {"id": "c2", "label": "Penalty Clause ($50k)", "type": "Financial", "risk": "High"},
            {"id": "c3", "label": "Liability Cap ($1M)", "type": "Legal", "risk": "Medium"},
            {"id": "c4", "label": "Cyber Insurance ($2M)", "type": "Compliance", "risk": "Low"},
            {"id": "c5", "label": "SLA Uptime (99.9%)", "type": "Operational", "risk": "Medium"},
            {"id": "c6", "label": "Auto-Renewal (30 Days)", "type": "Lifecycle", "risk": "High"}
        ],
        "links": [
            {"source": "c1", "target": "c2", "relation": "Triggers penalty upon breach"},
            {"source": "c2", "target": "c3", "relation": "Subject to maximum cap"},
            {"source": "c3", "target": "c4", "relation": "Requires back-to-back coverage"},
            {"source": "c5", "target": "c2", "relation": "Failure triggers penalty credit"},
            {"source": "c6", "target": "c1", "relation": "Locks termination window"}
        ]
    }

