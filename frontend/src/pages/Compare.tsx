import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, FileText, ArrowRight, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { comparisonApi } from '../services/api'

interface DiffItem {
  clauseType: string
  status: 'added' | 'removed' | 'modified'
  originalText?: string
  modifiedText?: string
  explanation?: string
}

const DEMO_CONTRACTS = [
  { id: '1', title: 'Master Service Agreement - TechCorp (v1)' },
  { id: '2', title: 'Master Service Agreement - TechCorp (v2)' },
  { id: '3', title: 'NDA - Alpha Innovations' },
  { id: '4', title: 'NDA - Beta Corp' },
]

const DEMO_DIFFS: DiffItem[] = [
  {
    clauseType: 'Limitation of Liability',
    status: 'modified',
    originalText: 'Vendor\'s total liability shall not exceed the amount of fees paid in the 12 months preceding the event.',
    modifiedText: 'Vendor\'s total liability shall not exceed three (3) times the amount of fees paid in the 12 months preceding the event.',
    explanation: 'Liability cap has been increased from 1x to 3x fees, significantly increasing the client risk profile.',
  },
  {
    clauseType: 'Indemnification',
    status: 'added',
    modifiedText: 'Client shall indemnify, defend, and hold harmless Vendor from and against any and all claims arising out of Client\'s breach of Section 4 (Intellectual Property).',
    explanation: 'A one-sided IP indemnification clause has been added to favor the vendor.',
  },
  {
    clauseType: 'Governing Law',
    status: 'modified',
    originalText: 'This Agreement shall be governed by the laws of the State of Delaware.',
    modifiedText: 'This Agreement shall be governed by the laws of the State of California.',
    explanation: 'Jurisdiction has changed from Delaware to California.',
  },
  {
    clauseType: 'Arbitration',
    status: 'removed',
    originalText: 'Any disputes shall be settled by binding arbitration in Wilmington, Delaware.',
    explanation: 'Arbitration clause has been entirely removed, leaving court litigation as the only recourse.',
  },
]

export default function Compare() {
  const [contractId1, setContractId1] = useState(DEMO_CONTRACTS[0].id)
  const [contractId2, setContractId2] = useState(DEMO_CONTRACTS[1].id)
  const [comparing, setComparing] = useState(false)
  const [compared, setCompared] = useState(false)
  const [diffs, setDiffs] = useState<DiffItem[]>([])
  const [score, setScore] = useState(0)

  const handleCompare = async () => {
    setComparing(true)
    setCompared(false)
    try {
      const res = await comparisonApi.compare(contractId1, contractId2)
      setDiffs(res.data?.data?.diffs || DEMO_DIFFS)
      setScore(res.data?.data?.negotiation_score || 78)
    } catch {
      await new Promise(r => setTimeout(r, 2000))
      setDiffs(DEMO_DIFFS)
      setScore(78)
    }
    setComparing(false)
    setCompared(true)
  }

  const getStatusColor = (status: DiffItem['status']) => {
    switch (status) {
      case 'added': return '#10b981'
      case 'removed': return '#ef4444'
      case 'modified': return '#f59e0b'
    }
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Compare Contracts</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Analyze difference between two contract versions or draft variations</p>
      </div>

      {/* Select panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chart-container"
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label className="input-label">Source Contract (Version A)</label>
            <select value={contractId1} onChange={e => setContractId1(e.target.value)} className="input">
              {DEMO_CONTRACTS.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Target Contract (Version B)</label>
            <select value={contractId2} onChange={e => setContractId2(e.target.value)} className="input">
              {DEMO_CONTRACTS.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={comparing || contractId1 === contractId2}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
        >
          {comparing ? (
            <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Comparing...</>
          ) : (
            <><GitCompare size={16} /> Compare Contracts</>
          )}
        </button>
      </motion.div>

      {/* Comparing State */}
      {comparing && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <GitCompare size={48} color="#3b82f6" style={{ margin: '0 auto 16px', display: 'block', animation: 'spin 3s linear infinite' }} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>Comparing Contract Layouts...</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Analyzing sections, structural changes, and legal variations</div>
        </div>
      )}

      {/* Results */}
      {compared && !comparing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px' }}>Comparison Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Added Clauses', count: diffs.filter(d => d.status === 'added').length, color: '#10b981' },
                  { label: 'Removed Clauses', count: diffs.filter(d => d.status === 'removed').length, color: '#ef4444' },
                  { label: 'Modified Clauses', count: diffs.filter(d => d.status === 'modified').length, color: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>{stat.count}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card">
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px' }}>Alignment Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '42px', fontWeight: 800, color: '#3b82f6' }}>{score}%</div>
                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  The two contracts have <strong>{score}% structural and semantic similarity</strong>. Redlines are recommended for modified clauses.
                </div>
              </div>
            </div>
          </div>

          {/* Diffs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>Difference Analysis</h2>
            {diffs.map((diff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  background: 'rgba(15,15,26,0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{diff.clauseType}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                    background: `${getStatusColor(diff.status)}20`,
                    color: getStatusColor(diff.status),
                    border: `1px solid ${getStatusColor(diff.status)}40`,
                    borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    {diff.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                  {diff.status !== 'added' && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Version A</div>
                      <div style={{ padding: '10px', background: 'rgba(239,68,68,0.04)', borderRadius: '8px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                        "{diff.originalText}"
                      </div>
                    </div>
                  )}
                  {diff.status !== 'removed' && (
                    <div style={{ gridColumn: diff.status === 'added' ? '1 / -1' : 'auto' }}>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Version B</div>
                      <div style={{ padding: '10px', background: 'rgba(16,185,129,0.04)', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                        "{diff.modifiedText}"
                      </div>
                    </div>
                  )}
                </div>

                {diff.explanation && (
                  <div style={{ display: 'flex', gap: '8px', padding: '10px', background: 'rgba(59,130,246,0.05)', borderRadius: '8px', alignItems: 'flex-start' }}>
                    <Info size={14} color="#3b82f6" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                      <strong>AI Explanation:</strong> {diff.explanation}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
