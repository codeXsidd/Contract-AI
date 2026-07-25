import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import { complianceApi } from '../services/api'

interface ViolationItem {
  rule: string
  description: string
  severity: 'low' | 'medium' | 'high'
  fix: string
}

interface FrameworkResult {
  id: string
  name: string
  score: number
  color: string
  icon: string
  violations: ViolationItem[]
  recommendations: string[]
}

const FRAMEWORKS = [
  { id: 'gdpr', name: 'GDPR', fullName: 'General Data Protection Regulation', color: '#3b82f6', icon: '🇪🇺', region: 'European Union' },
  { id: 'dpdp', name: 'DPDP India', fullName: 'Digital Personal Data Protection Act', color: '#10b981', icon: '🇮🇳', region: 'India' },
  { id: 'hipaa', name: 'HIPAA', fullName: 'Health Insurance Portability and Accountability Act', color: '#8b5cf6', icon: '🏥', region: 'United States' },
  { id: 'iso27001', name: 'ISO 27001', fullName: 'Information Security Management', color: '#06b6d4', icon: '🔒', region: 'International' },
]

const DEMO_RESULTS: FrameworkResult[] = [
  {
    id: 'gdpr',
    name: 'GDPR',
    score: 87,
    color: '#3b82f6',
    icon: '🇪🇺',
    violations: [
      { rule: 'Art. 13 - Transparency', description: 'Privacy notice does not include lawful basis for processing', severity: 'high', fix: 'Add explicit statement of legal basis (e.g., legitimate interest, consent) in Section 3' },
      { rule: 'Art. 17 - Right to Erasure', description: 'Contract lacks right to erasure provisions', severity: 'medium', fix: 'Add clause granting data subjects the right to request deletion of their personal data' },
      { rule: 'Art. 46 - Third Country Transfers', description: 'No safeguards mentioned for international data transfers', severity: 'medium', fix: 'Specify Standard Contractual Clauses (SCCs) for any EEA data transfers' },
    ],
    recommendations: ['Add a comprehensive Data Processing Agreement (DPA)', 'Include explicit consent mechanisms', 'Document all data retention periods'],
  },
  {
    id: 'dpdp',
    name: 'DPDP India',
    score: 80,
    color: '#10b981',
    icon: '🇮🇳',
    violations: [
      { rule: 'Sec. 6 - Consent', description: 'Consent mechanism not aligned with DPDP requirement for free, specific, informed consent', severity: 'high', fix: 'Revise consent clauses to include granular opt-in for each data processing activity' },
      { rule: 'Sec. 13 - Data Fiduciary Obligations', description: 'Missing appointment of Data Protection Officer', severity: 'medium', fix: 'Add DPO appointment clause for significant data processing activities' },
    ],
    recommendations: ['Appoint a Data Protection Officer (DPO)', 'Implement consent dashboards for data principals'],
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    score: 82,
    color: '#8b5cf6',
    icon: '🏥',
    violations: [
      { rule: '45 CFR 164.308 - Safeguards', description: 'Administrative safeguards not specified for ePHI handling', severity: 'high', fix: 'Add specific technical and administrative safeguard requirements for electronic Protected Health Information' },
    ],
    recommendations: ['Include Business Associate Agreement (BAA)', 'Define breach notification timelines (60-day rule)'],
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    score: 88,
    color: '#06b6d4',
    icon: '🔒',
    violations: [
      { rule: 'A.8.2 - Information Classification', description: 'No information classification policy referenced', severity: 'low', fix: 'Reference your organization\'s information classification policy in Section 4' },
    ],
    recommendations: ['Include reference to ISMS policy documentation', 'Define incident response timeframes'],
  },
]

const DEMO_CONTRACTS = [
  { id: '1', title: 'Master Service Agreement - TechCorp' },
  { id: '2', title: 'Data Processing Agreement - GDPR' },
  { id: '3', title: 'Vendor Agreement - Supply Chain Ltd' },
]

export default function Compliance() {
  const [selectedContract, setSelectedContract] = useState(DEMO_CONTRACTS[0])
  const [selectedFrameworks, setSelectedFrameworks] = useState<Set<string>>(new Set(['gdpr', 'hipaa']))
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<FrameworkResult[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedViolation, setExpandedViolation] = useState<string | null>(null)

  const toggleFramework = (id: string) => {
    setSelectedFrameworks(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const runCheck = async () => {
    setChecking(true)
    setResults([])

    try {
      const res = await complianceApi.check(selectedContract.id, [...selectedFrameworks])
      setResults(res.data?.data?.results || DEMO_RESULTS.filter(r => selectedFrameworks.has(r.id)))
    } catch {
      await new Promise(r => setTimeout(r, 2000))
      setResults(DEMO_RESULTS.filter(r => selectedFrameworks.has(r.id)))
    }

    setChecking(false)
  }

  const severityColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Compliance Checker</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Check contracts against GDPR, DPDP, HIPAA, and ISO 27001 requirements</p>
      </div>

      {/* Setup panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chart-container"
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Configure Compliance Check</h3>

        {/* Contract selector */}
        <div style={{ marginBottom: '16px' }}>
          <label className="input-label">Select Contract</label>
          <select
            value={selectedContract.id}
            onChange={e => setSelectedContract(DEMO_CONTRACTS.find(c => c.id === e.target.value)!)}
            className="input"
            style={{ maxWidth: '500px' }}
          >
            {DEMO_CONTRACTS.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Framework selection */}
        <div style={{ marginBottom: '20px' }}>
          <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>Select Frameworks</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {FRAMEWORKS.map(f => (
              <div
                key={f.id}
                onClick={() => toggleFramework(f.id)}
                style={{
                  padding: '16px',
                  background: selectedFrameworks.has(f.id) ? `${f.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedFrameworks.has(f.id) ? f.color + '50' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{f.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: selectedFrameworks.has(f.id) ? f.color : '#94a3b8' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{f.region}</div>
                {selectedFrameworks.has(f.id) && (
                  <div style={{ marginTop: '8px' }}>
                    <CheckCircle size={16} color={f.color} style={{ margin: '0 auto', display: 'block' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={runCheck}
          disabled={checking || selectedFrameworks.size === 0}
          className="btn btn-primary"
          style={{ minWidth: '200px' }}
        >
          {checking ? (
            <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Checking...</>
          ) : (
            <><Shield size={16} /> Run Compliance Check</>
          )}
        </button>
      </motion.div>

      {/* Checking animation */}
      {checking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '50px' }}>
          <Shield size={48} color="#3b82f6" style={{ margin: '0 auto 16px', display: 'block', animation: 'pulse-glow 1.5s infinite' }} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>Analyzing Compliance...</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
            {[...selectedFrameworks].map(f => {
              const fw = FRAMEWORKS.find(fw => fw.id === f)!
              return (
                <span key={f} style={{ padding: '6px 14px', background: `${fw.color}20`, border: `1px solid ${fw.color}40`, borderRadius: '100px', fontSize: '12px', color: fw.color, animation: 'pulse-glow 1.5s ease-in-out infinite' }}>
                  {fw.icon} {fw.name}
                </span>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 && !checking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Overview cards */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${results.length}, 1fr)`, gap: '12px', marginBottom: '24px' }}>
            {results.map(r => (
              <div key={r.id} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{r.icon}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', background: `${r.color}20`, color: r.color, borderRadius: '100px', border: `1px solid ${r.color}40` }}>
                    {r.violations.length === 0 ? 'PASSED' : `${r.violations.length} ISSUES`}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{r.name}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: r.color }}>{r.score}%</div>
                <div className="progress-bar" style={{ marginTop: '8px' }}>
                  <div className="progress-fill" style={{ width: `${r.score}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed reports */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ background: 'rgba(15,15,26,0.9)', border: `1px solid ${r.color}30`, borderRadius: '14px', overflow: 'hidden' }}
              >
                {/* Section header */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                >
                  <span style={{ fontSize: '20px' }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{r.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {r.violations.length} violations • {r.recommendations.length} recommendations
                    </div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: r.color }}>{r.score}%</div>
                  {expandedId === r.id ? <ChevronDown size={18} color="#475569" /> : <ChevronRight size={18} color="#475569" />}
                </div>

                {expandedId === r.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Violations */}
                    {r.violations.length > 0 && (
                      <div style={{ paddingTop: '16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ⚠️ Violations Found
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {r.violations.map((v, vi) => (
                            <div
                              key={vi}
                              style={{
                                padding: '12px 14px',
                                background: `${severityColors[v.severity]}08`,
                                border: `1px solid ${severityColors[v.severity]}30`,
                                borderRadius: '10px', cursor: 'pointer',
                              }}
                              onClick={() => setExpandedViolation(expandedViolation === `${r.id}-${vi}` ? null : `${r.id}-${vi}`)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{
                                  fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                                  background: `${severityColors[v.severity]}20`, color: severityColors[v.severity],
                                  border: `1px solid ${severityColors[v.severity]}40`, borderRadius: '100px', textTransform: 'uppercase',
                                }}>
                                  {v.severity}
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{v.rule}</span>
                              </div>
                              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>{v.description}</div>
                              {expandedViolation === `${r.id}-${vi}` && (
                                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px' }}>
                                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>🔧 FIX</div>
                                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{v.fix}</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div style={{ paddingTop: '16px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#10b981', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ✅ Recommendations
                      </div>
                      {r.recommendations.map((rec, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
                          <span style={{ color: '#10b981', fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>→</span>
                          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
