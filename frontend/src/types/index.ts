// ============================================================
// CONTRACT AI - TYPE DEFINITIONS
// ============================================================

export type ContractStatus =
  | 'draft'
  | 'under_review'
  | 'approved'
  | 'active'
  | 'expired'
  | 'renewed'
  | 'terminated'

export type RiskLevel = 'safe' | 'moderate' | 'high'
export type ClauseType =
  | 'nda'
  | 'confidentiality'
  | 'liability'
  | 'payment'
  | 'arbitration'
  | 'termination'
  | 'force_majeure'
  | 'data_privacy'
  | 'intellectual_property'
  | 'renewal'
  | 'indemnification'
  | 'other'

export type ComplianceFramework = 'gdpr' | 'dpdp' | 'hipaa' | 'iso27001'

// ============================================================
// CONTRACT
// ============================================================
export interface Contract {
  id: string
  user_id: string
  title: string
  status: ContractStatus
  type: string
  upload_date: string
  effective_date?: string
  expiry_date?: string
  value?: number
  currency?: string
  file_url: string
  masked_file_url?: string
  risk_score?: number
  health_score?: number
  compliance_score?: number
  parties?: Party[]
  summary?: string
  is_pii_masked?: boolean
  language?: string
  version?: number
  created_at: string
  updated_at: string
}

export interface Party {
  name: string
  role: string
  email?: string
}

export interface ContractVersion {
  id: string
  contract_id: string
  version_num: number
  file_url: string
  notes?: string
  created_at: string
}

// ============================================================
// CLAUSE
// ============================================================
export interface Clause {
  id: string
  contract_id: string
  type: ClauseType
  content: string
  risk_level: RiskLevel
  risk_reason?: string
  severity?: number
  page_number?: number
  start_char?: number
  end_char?: number
}

// ============================================================
// RISK ANALYSIS
// ============================================================
export interface RiskReport {
  id: string
  contract_id: string
  risk_score: number
  risk_category: RiskLevel
  breakdown: RiskBreakdownItem[]
  red_flags: RedFlag[]
  summary: string
  recommendations: string[]
  created_at: string
}

export interface RiskBreakdownItem {
  category: string
  score: number
  explanation: string
}

export interface RedFlag {
  type: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  clause_id?: string
}

// ============================================================
// COMPLIANCE
// ============================================================
export interface ComplianceReport {
  id: string
  contract_id: string
  framework: ComplianceFramework
  score: number
  violations: ComplianceViolation[]
  recommendations: string[]
  created_at: string
}

export interface ComplianceViolation {
  rule: string
  description: string
  severity: 'low' | 'medium' | 'high'
  fix: string
}

// ============================================================
// OBLIGATION
// ============================================================
export interface Obligation {
  id: string
  contract_id: string
  description: string
  due_date?: string
  responsible_party?: string
  status: 'pending' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high'
}

// ============================================================
// CHAT
// ============================================================
export interface ChatMessage {
  id: string
  contract_id: string
  user_id: string
  message: string
  response?: string
  sender: 'user' | 'ai'
  citations?: Citation[]
  created_at: string
}

export interface Citation {
  text: string
  page?: number
  clause_type?: string
}

// ============================================================
// NEGOTIATION
// ============================================================
export interface NegotiationSession {
  id: string
  contract_id: string
  negotiation_score: number
  risk_reduction_pct: number
  recommendations: NegotiationRecommendation[]
  created_at: string
}

export interface NegotiationRecommendation {
  clause_id?: string
  clause_type: ClauseType
  issue: string
  original_text?: string
  suggested_text: string
  explanation: string
  impact: 'low' | 'medium' | 'high'
}

// ============================================================
// DEADLINE / LIFECYCLE
// ============================================================
export interface Deadline {
  id: string
  contract_id: string
  contract_title?: string
  type: 'renewal' | 'expiry' | 'review' | 'payment' | 'obligation'
  date: string
  days_remaining?: number
  status: 'upcoming' | 'overdue' | 'today'
  notified?: boolean
}

// ============================================================
// SIMILARITY
// ============================================================
export interface SimilarContract {
  contract_id: string
  title: string
  similarity_score: number
  matching_clauses: string[]
}

// ============================================================
// ANALYTICS
// ============================================================
export interface DashboardStats {
  total_contracts: number
  active_contracts: number
  high_risk_contracts: number
  expiring_soon: number
  avg_compliance_score: number
  avg_health_score: number
}

export interface UploadTrend {
  date: string
  count: number
}

export interface RiskDistribution {
  level: string
  count: number
  percentage: number
}

// ============================================================
// USER
// ============================================================
export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  organization?: string
  role?: string
  plan?: 'free' | 'pro' | 'enterprise'
  preferences?: {
    language: string
    theme: 'dark' | 'light'
    notifications: boolean
  }
}

// ============================================================
// API RESPONSE WRAPPERS
// ============================================================
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}
