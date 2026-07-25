import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, Shield, AlertTriangle, Scale, Activity, ArrowLeft, Download,
  Layers, CheckCircle, RefreshCw, AlertCircle, FileCheck, ListTodo, Edit3
} from 'lucide-react'
import { getRiskColor, getRiskLabel, getStatusBadgeClass, formatDate, formatCurrency } from '../utils'
import { analysisApi, complianceApi, lifecycleApi } from '../services/api'
import type { Contract, Clause, RedFlag, Obligation } from '../types'

import { VoiceAssistant } from '../components/voice/VoiceAssistant'
import { ContractTimeMachine } from '../components/analytics/ContractTimeMachine'
import { BusinessImpactSimulator } from '../components/analytics/BusinessImpactSimulator'
import { ContractKnowledgeGraph } from '../components/graph/ContractKnowledgeGraph'
import { HealthScoreTimeline } from '../components/analytics/HealthScoreTimeline'

// Demo Fallbacks
const DEMO_CONTRACT: Contract = {
  id: '1', user_id: 'u1', title: 'Master Service Agreement - TechCorp', status: 'active', type: 'Service Agreement',
  upload_date: '2024-01-15', effective_date: '2024-02-01', expiry_date: '2025-02-01', value: 120000, currency: 'USD',
  file_url: '#', risk_score: 28, health_score: 87, compliance_score: 92, created_at: '2024-01-15', updated_at: '2024-01-15',
  summary: 'This is a standard Master Service Agreement (MSA) setting out the framework under which TechCorp provides professional IT consulting and software customization services to Acme Solutions. The agreement includes terms for payment, intellectual property, confidentiality, limitation of liability, and termination.',
  parties: [{ name: 'TechCorp Consulting Inc.', role: 'Provider' }, { name: 'Acme Solutions Ltd', role: 'Client' }],
}

const DEMO_CLAUSES: Clause[] = [
  { id: 'c1', contract_id: '1', type: 'liability', content: 'Neither party shall be liable for indirect, incidental, or consequential damages. TechCorp\'s maximum liability shall not exceed the total fees paid under this Agreement.', risk_level: 'safe', risk_reason: 'Standard mutual liability exclusion with standard cap.', severity: 1 },
  { id: 'c2', contract_id: '1', type: 'payment', content: 'Client shall pay all invoices within thirty (30) days of receipt. Late payments shall accumulate interest at a rate of 1.5% per month.', risk_level: 'moderate', risk_reason: 'Late payment fee is slightly higher than usual bank rates.', severity: 3 },
  { id: 'c3', contract_id: '1', type: 'termination', content: 'Either party may terminate this Agreement with ninety (90) days written notice. Immediate termination is permitted for uncured material breach.', risk_level: 'moderate', risk_reason: '90-day period is long for consulting arrangements; typically 30-60 days.', severity: 3 },
]

const DEMO_RED_FLAGS: RedFlag[] = [
  { type: 'Liability Cap', description: 'Liability is capped strictly at historical fees paid, rather than a fixed multiplier of standard value.', severity: 'medium' },
  { type: 'NDA', description: 'Mutual NDA clause does not cover data processing transfers specifically.', severity: 'low' },
]

const DEMO_OBLIGATIONS: Obligation[] = [
  { id: 'ob1', contract_id: '1', description: 'Deliver quarterly consulting report', due_date: '2024-09-01', status: 'pending', priority: 'medium' },
  { id: 'ob2', contract_id: '1', description: 'Pay invoice #3010', due_date: '2024-08-15', status: 'pending', priority: 'high' },
]

export default function ContractDetails() {
  const { id } = useParams<{ id: string }>()
  const [contract, setContract] = useState<Contract>(DEMO_CONTRACT)
  const [clauses, setClauses] = useState<Clause[]>(DEMO_CLAUSES)
  const [redFlags, setRedFlags] = useState<RedFlag[]>(DEMO_RED_FLAGS)
  const [obligations, setObligations] = useState<Obligation[]>(DEMO_OBLIGATIONS)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'overview' | 'clauses' | 'risks' | 'obligations' | 'time-machine' | 'simulator' | 'graph' | 'health'>('overview')

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const [cRes, clRes, rfRes, obRes] = await Promise.all([
          analysisApi.getSummary(id || ''),
          analysisApi.getClauses(id || ''),
          analysisApi.getRedFlags(id || ''),
          lifecycleApi.getObligations(id || ''),
        ])

        setContract(cRes.data?.data || DEMO_CONTRACT)
        setClauses(clRes.data?.data || DEMO_CLAUSES)
        setRedFlags(rfRes.data?.data || DEMO_RED_FLAGS)
        setObligations(obRes.data?.data || DEMO_OBLIGATIONS)
      } catch {
        // demo fallbacks
      }
      setLoading(false)
    }

    fetchAllData()
  }, [id])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '10px' }} />
        <span style={{ color: '#64748b' }}>Analyzing details...</span>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Back button */}
      <Link to="/contracts" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', marginBottom: '20px', fontSize: '13px' }}>
        <ArrowLeft size={14} /> Back to Contracts
      </Link>

      {/* Header card */}
      <div className="chart-container" style={{ marginBottom: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className={getStatusBadgeClass(contract.status)}>{contract.status.replace('_', ' ')}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{contract.type}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>{contract.title}</h1>
            <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>Uploaded on {formatDate(contract.upload_date)}</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary">
              <Download size={14} /> Download PDF
            </button>
            <Link to="/negotiate" className="btn btn-primary">
              <Edit3 size={14} /> AI Redline
            </Link>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

        {/* Big numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Risk Score', value: contract.risk_score, color: getRiskColor(contract.risk_score ?? 0), icon: AlertTriangle, desc: getRiskLabel(contract.risk_score ?? 0) },
            { label: 'Health Score', value: contract.health_score, color: '#10b981', icon: Scale, desc: 'Portfolio grade' },
            { label: 'Compliance Score', value: `${contract.compliance_score}%`, color: '#3b82f6', icon: Shield, desc: 'GDPR / ISO compliance' },
            { label: 'Contract Value', value: contract.value ? formatCurrency(contract.value, contract.currency) : '—', color: '#a855f7', icon: Activity, desc: 'Estimated fee baseline' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '12px', marginBottom: '6px' }}>
                  <span>{stat.label}</span>
                  <Icon size={14} color={stat.color} />
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{stat.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Voice Legal Assistant Integration */}
      <div style={{ marginBottom: '24px' }}>
        <VoiceAssistant textToRead={contract.summary} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'time-machine', label: '⏳ Time Machine', icon: Activity },
          { id: 'simulator', label: '💼 Impact Simulator', icon: Scale },
          { id: 'graph', label: '🕸️ Knowledge Graph', icon: FileText },
          { id: 'health', label: '📉 Health Score', icon: Activity },
          { id: 'clauses', label: 'Extracted Clauses', icon: FileCheck },
          { id: 'risks', label: 'Red Flags', icon: AlertCircle },
          { id: 'obligations', label: 'Obligations', icon: ListTodo },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
                background: activeSection === tab.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeSection === tab.id ? '#60a5fa' : '#64748b',
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeSection === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chart-container">
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>Executive Summary</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{contract.summary}</p>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginTop: '24px', marginBottom: '12px' }}>Contract Parties</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {contract.parties?.map((p, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{p.role}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginTop: '4px' }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'time-machine' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ContractTimeMachine contractId={contract.id} />
            </motion.div>
          )}

          {activeSection === 'simulator' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <BusinessImpactSimulator />
            </motion.div>
          )}

          {activeSection === 'graph' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ContractKnowledgeGraph />
            </motion.div>
          )}

          {activeSection === 'health' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <HealthScoreTimeline />
            </motion.div>
          )}

          {activeSection === 'clauses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clauses.map((cl) => (
                <div key={cl.id} className="chart-container" style={{ borderLeft: `4px solid ${cl.risk_level === 'safe' ? '#10b981' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', textTransform: 'capitalize' }}>
                      {cl.type} Provision
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                      background: cl.risk_level === 'safe' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: cl.risk_level === 'safe' ? '#34d399' : '#fbbf24',
                    }}>
                      {cl.risk_level}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px', fontStyle: 'italic', marginBottom: '10px' }}>
                    "{cl.content}"
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    <strong>AI Analysis:</strong> {cl.risk_reason}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'risks' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {redFlags.map((rf, idx) => (
                <div key={idx} className="chart-container" style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <AlertTriangle size={16} color="#ef4444" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{rf.type}</span>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                      background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    }}>{rf.severity}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{rf.description}</div>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'obligations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {obligations.map((ob) => (
                <div key={ob.id} className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{ob.description}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Due date: {formatDate(ob.due_date)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                      background: ob.priority === 'high' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
                      color: ob.priority === 'high' ? '#f87171' : '#64748b',
                    }}>{ob.priority} priority</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                      background: 'rgba(16,185,129,0.15)', color: '#34d399',
                    }}>{ob.status}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-container" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Important Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Effective Date', val: formatDate(contract.effective_date) },
                { label: 'Expiry Date', val: formatDate(contract.expiry_date) },
                { label: 'Obligations due', val: `${obligations.length} pending` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
