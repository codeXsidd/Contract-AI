from supabase import create_client, Client
from app.core_config import settings
import logging

logger = logging.getLogger(__name__)

import uuid
from datetime import datetime

class MockDB:
    """Fallback mock database client for local dev when Supabase isn't configured."""
    _storage = {
        "contracts": [],
        "clauses": [],
        "risk_reports": [],
        "compliance_reports": [],
        "obligations": [],
        "negotiations": [],
        "chat_history": []
    }
    
    def __init__(self):
        if not self._storage["contracts"]:
            # Prepopulate with demo contracts matching IDs in frontend
            demo_contracts = [
                {
                    "id": "1",
                    "user_id": "00000000-0000-0000-0000-000000000000",
                    "title": "Master Service Agreement - TechCorp",
                    "type": "Service Agreement",
                    "status": "active",
                    "effective_date": "2024-02-01",
                    "expiry_date": "2025-02-01",
                    "value": 120000.0,
                    "currency": "USD",
                    "file_url": "storage://contracts/msa_techcorp.pdf",
                    "risk_score": 45,
                    "health_score": 80,
                    "compliance_score": 87,
                    "summary": "This is a Master Service Agreement between TechCorp Inc. and Acme Solutions, effective February 2024.",
                    "is_pii_masked": False,
                    "language": "English",
                    "version": 1,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "id": "2",
                    "user_id": "00000000-0000-0000-0000-000000000000",
                    "title": "NDA - Alpha Innovations",
                    "type": "NDA",
                    "status": "under_review",
                    "effective_date": "2024-03-15",
                    "expiry_date": "2025-03-15",
                    "value": 0.0,
                    "currency": "USD",
                    "file_url": "storage://contracts/nda_alpha.pdf",
                    "risk_score": 25,
                    "health_score": 90,
                    "compliance_score": 93,
                    "summary": "Mutual Non-Disclosure Agreement between Alpha Innovations and TechCorp to protect confidential info during collaboration.",
                    "is_pii_masked": False,
                    "language": "English",
                    "version": 1,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                },
                {
                    "id": "3",
                    "user_id": "00000000-0000-0000-0000-000000000000",
                    "title": "Vendor Agreement - Supply Chain Ltd",
                    "type": "Vendor Agreement",
                    "status": "draft",
                    "effective_date": "2024-05-10",
                    "expiry_date": "2025-05-10",
                    "value": 45000.0,
                    "currency": "USD",
                    "file_url": "storage://contracts/vendor_supply.pdf",
                    "risk_score": 55,
                    "health_score": 75,
                    "compliance_score": 80,
                    "summary": "Supply chain logistics vendor services contract detailing delivery targets and service level credits.",
                    "is_pii_masked": False,
                    "language": "English",
                    "version": 1,
                    "created_at": datetime.utcnow().isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            ]
            self._storage["contracts"].extend(demo_contracts)
            
            # Prepopulate clauses table for demo contracts
            demo_clauses = [
                {"id": "cl1", "contract_id": "1", "type": "liability", "content": "Neither party shall be liable for indirect, incidental, or consequential damages. TechCorp's maximum liability shall not exceed three (3) times the total fees paid under this Agreement.", "risk_level": "moderate", "risk_reason": "3x is higher than average", "severity": 3, "page_number": 4},
                {"id": "cl2", "contract_id": "1", "type": "payment", "content": "Client shall pay all invoices within thirty (30) days of receipt. Late payments shall accumulate interest at a rate of 1.5% per month.", "risk_level": "moderate", "risk_reason": "Late payment fee is slightly higher than usual bank rates.", "severity": 3, "page_number": 2},
                {"id": "cl3", "contract_id": "1", "type": "termination", "content": "Either party may terminate this Agreement with ninety (90) days written notice. Immediate termination is permitted for uncured material breach.", "risk_level": "moderate", "risk_reason": "90-day period is long for consulting arrangements; typically 30-60 days.", "severity": 3, "page_number": 5},
                {"id": "cl4", "contract_id": "2", "type": "confidentiality", "content": "Receiving Party shall keep all Disclosing Party Confidential Information strictly secret for a period of five (5) years.", "risk_level": "safe", "risk_reason": "Standard confidentiality duration", "severity": 1, "page_number": 1}
            ]
            self._storage["clauses"].extend(demo_clauses)
            
            # Prepopulate obligations
            demo_obligations = [
                {"id": "ob1", "contract_id": "1", "description": "Deliver quarterly consulting report", "due_date": "2024-09-01", "status": "pending", "priority": "medium"},
                {"id": "ob2", "contract_id": "1", "description": "Pay invoice #3010", "due_date": "2024-08-15", "status": "pending", "priority": "high"},
                {"id": "ob3", "contract_id": "3", "description": "Weekly status updates", "due_date": "2024-07-28", "status": "pending", "priority": "low"}
            ]
            self._storage["obligations"].extend(demo_obligations)

    def table(self, name):
        self.current_table = name
        self.filters = []
        return self
        
    def select(self, *args):
        return self
        
    def insert(self, data):
        if isinstance(data, list):
            inserted = []
            for item in data:
                item_copy = dict(item)
                if "id" not in item_copy:
                    item_copy["id"] = str(uuid.uuid4())
                if "created_at" not in item_copy:
                    item_copy["created_at"] = datetime.utcnow().isoformat()
                self._storage.setdefault(self.current_table, []).append(item_copy)
                inserted.append(item_copy)
            self.last_result = inserted
        else:
            item_copy = dict(data)
            if "id" not in item_copy:
                item_copy["id"] = str(uuid.uuid4())
            if "created_at" not in item_copy:
                item_copy["created_at"] = datetime.utcnow().isoformat()
            self._storage.setdefault(self.current_table, []).append(item_copy)
            self.last_result = [item_copy]
        return self
        
    def update(self, data):
        items = self._storage.setdefault(self.current_table, [])
        updated_items = []
        for item in items:
            match = True
            for f_col, f_val in self.filters:
                if str(item.get(f_col)) != str(f_val):
                    match = False
                    break
            if match:
                item.update(data)
                updated_items.append(item)
        self.last_result = updated_items
        return self
        
    def eq(self, column, value):
        self.filters.append((column, value))
        return self
        
    def execute(self):
        if hasattr(self, "last_result"):
            res = self.last_result
            delattr(self, "last_result")
            class MockResult:
                data = res
            return MockResult()
            
        items = self._storage.get(self.current_table, [])
        filtered = []
        for item in items:
            match = True
            for f_col, f_val in self.filters:
                if str(item.get(f_col)) != str(f_val):
                    match = False
                    break
            if match:
                filtered.append(item)
                
        class MockResult:
            data = filtered
        return MockResult()

supabase_client = None

try:
    # Use the anon key (publishable key) — this is the correct key for server-side access
    api_key = settings.SUPABASE_KEY or settings.SUPABASE_ANON_KEY
    if api_key and settings.SUPABASE_URL and "your-project" not in settings.SUPABASE_URL:
        supabase_client = create_client(settings.SUPABASE_URL, api_key)
        logger.info("✅ Supabase client initialized successfully")
    else:
        raise ValueError("Supabase credentials not configured")
except Exception as e:
    logger.warning(f"⚠️  Failed to initialize Supabase client: {e}. Falling back to Mock DB Client for local development.")
    supabase_client = MockDB()

def get_db():
    return supabase_client
