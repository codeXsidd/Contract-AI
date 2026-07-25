import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Handshake, Zap, AlertTriangle, CheckCircle, TrendingUp, ArrowRight, RefreshCw, FileText } from 'lucide-react'
import { getRiskColor } from '../utils'
import { negotiationApi } from '../services/api'

interface Recommendation {
  id: string
  clauseType: string
  issue: string
  originalText: string
  suggestedText: string
  explanation: string
  impact: 'low' | 'medium' | 'high'
  riskReduction: number
}

const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    clauseType: 'Liability',
    issue: 'Liability cap exceeds industry standard',
    originalText: 'Vendor\'s total aggregate liability shall not exceed three (3) times the total fees paid in the twelve months preceding the claim.',
    suggestedText: 'Vendor\'s total aggregate liability shall not exceed one (1) times the total fees paid in the twelve months preceding the claim.',
    explanation: 'The current 3x liability cap is significantly above the industry standard of 1x. This exposes the client to elevated financial risk in case of disputes.',
    impact: 'high',
    riskReduction: 35,
  },
  {
    id: '2',
    clauseType: 'Termination',
    issue: 'Unilateral termination rights favor vendor',
    originalText: 'Either party may terminate this Agreement for any reason with 90 days written notice.',
    suggestedText: 'Either party may terminate this Agreement for convenience with 30 days written notice, or immediately upon a material breach uncured within 15 days of notice.',
    explanation: 'The 90-day notice for termination is too long. Industry standard is 30 days for convenience, with immediate termination rights for material breach.',
    impact: 'medium',
    riskReduction: 20,
  },
  {
    id: '3',
    clauseType: 'Arbitration',
    issue: 'Missing arbitration clause',
    originalText: '[No arbitration clause found]',
    suggestedText: 'Any dispute arising from this Agreement shall be resolved by binding arbitration under AAA Commercial Rules. Arbitration shall take place in [City], [State]. The prevailing party may recover reasonable attorney\'s fees.',
    explanation: 'Without an arbitration clause, disputes are resolved in court, which is significantly more expensive and time-consuming. Adding arbitration protects both parties.',
    impact: 'medium',
    riskReduction: 18,
  },
  {
    id: '4',
    clauseType: 'Data Privacy',
    issue: 'Data processing terms need GDPR alignment',
    originalText: 'Vendor will process customer data as necessary for service delivery.',
    suggestedText: 'Vendor agrees to process Customer Personal Data only on documented instructions from Customer, implement appropriate technical and organizational security measures, and not transfer Personal Data outside the EEA without adequate safeguards per GDPR Article 46.',
    explanation: 'The current data clause is too vague for GDPR compliance. The suggested language provides clear processing boundaries and security requirements.',
    impact: 'high',
    riskReduction: 28,
  },
]

const DEMO_CONTRACTS = [
  { id: '1', title: 'Master Service Agreement - TechCorp' },
  { id: '2', title: 'NDA - Alpha Innovations' },
  { id: '3', title: 'Vendor Agreement - Supply Chain Ltd' },
]

export default function Negotiate() {
  const [selectedContract, setSelectedContract] = useState(DEMO_CONTRACTS[0])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [negotiationScore, setNegotiationScore] = useState(0)
  const [totalRiskReduction, setTotalRiskReduction] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())

  const runAnalysis = async () => {
    setAnalyzing(true)
    setAnalyzed(false)
    setRecommendations([])

    try {
      const res = await negotiationApi.analyze(selectedContract.id)
      const data = res.data?.data
      setRecommendations(data?.recommendations || DEMO_RECOMMENDATIONS)
      setNegotiationScore(data?.negotiation_score || 62)
      setTotalRiskReduction(data?.risk_reduction_pct || 35)
    } catch {
      // Use demo data
      await new Promise(r => setTimeout(r, 2000))
      setRecommendations(DEMO_RECOMMENDATIONS)
      setNegotiationScore(62)
      setTotalRiskReduction(35)
    }

    setAnalyzing(false)
    setAnalyzed(true)
  }

  const toggleAccept = (id: string) => {
    setAcceptedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const impactColors = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
            AI Negotiation Copilot
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Detect risky clauses, get AI-powered negotiation recommendations, and reduce contract risk
          </p>
        </div>
      </div>

      {/* Contract selector + trigger */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', gap: '12px', alignItems: 'center',
          padding: '20px', marginBottom: '24px',
          background: 'rgba(15,15,26,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
        }}
      >
        <FileText size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
        <select
          value={selectedContract.id}
          onChange={e => {
            const c = DEMO_CONTRACTS.find(o => o.id === e.target.value)!
            setSelectedContract(c)
            setAnalyzed(false)
            setRecommendations([])
          }}
          className="input"
          style={{ flex: 1, maxWidth: '400px' }}
        >
          {DEMO_CONTRACTS.map(c => (
            <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
          ))}
        </select>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="btn btn-primary"
          style={{ minWidth: '200px' }}
        >
          {analyzing ? (
            <>
              <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing...
            </>
          ) : (
            <>
              <Zap size={16} /> Analyze for Negotiation
            </>
          )}
        </button>
      </motion.div>

      {/* Analyzing state */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px' }}
        >
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}>
            <Zap size={36} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
            AI Analyzing Contract...
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Detecting risky clauses, checking legal implications, and generating recommendations
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px' }}>
            {['Clause extraction', 'Risk detection', 'Market comparison', 'Recommendation generation'].map((step, i) => (
              <span key={step} style={{
                padding: '6px 12px',
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '100px',
                fontSize: '12px', color: '#60a5fa',
                animation: `pulse-glow 1s ease-in-out ${i * 0.3}s infinite`,
              }}>
                {step}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {analyzed && !analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Score cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {[
              {
                label: 'Negotiation Score',
                value: negotiationScore,
                suffix: '/100',
                color: getRiskColor(negotiationScore),
                icon: Handshake,
                desc: 'Current negotiation leverage',
              },
              {
                label: 'Potential Risk Reduction',
                value: `${totalRiskReduction}%`,
                suffix: '',
                color: '#10b981',
                icon: TrendingUp,
                desc: 'If all recommendations applied',
              },
              {
                label: 'Issues Detected',
                value: recommendations.length,
                suffix: ' issues',
                color: '#f59e0b',
                icon: AlertTriangle,
                desc: `${recommendations.filter(r => r.impact === 'high').length} high priority`,
              },
            ].map(card => {
              const Icon = card.icon
              return (
                <div key={card.label} className="stat-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{card.label}</div>
                      <div style={{ fontSize: '36px', fontWeight: 800, color: card.color }}>
                        {card.value}<span style={{ fontSize: '16px', color: '#475569' }}>{card.suffix}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>{card.desc}</div>
                    </div>
                    <div style={{ padding: '10px', background: `${card.color}20`, borderRadius: '12px' }}>
                      <Icon size={22} color={card.color} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recommendations list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
              Negotiation Recommendations ({recommendations.length})
            </h2>
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                style={{
                  background: 'rgba(15,15,26,0.9)',
                  border: `1px solid ${acceptedIds.has(rec.id) ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '16px 20px', cursor: 'pointer',
                  }}
                  onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                    background: impactColors[rec.impact],
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
                        {rec.clauseType}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                        background: `${impactColors[rec.impact]}20`,
                        color: impactColors[rec.impact],
                        border: `1px solid ${impactColors[rec.impact]}40`,
                        borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {rec.impact} impact
                      </span>
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                        -{rec.riskReduction}% risk
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      {rec.issue}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); toggleAccept(rec.id) }}
                      className={`btn ${acceptedIds.has(rec.id) ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {acceptedIds.has(rec.id) ? <><CheckCircle size={14} /> Accepted</> : 'Accept'}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedId === rec.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div style={{ paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Original */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          ❌ Current Clause
                        </div>
                        <div style={{
                          padding: '12px',
                          background: 'rgba(239,68,68,0.06)',
                          border: '1px solid rgba(239,68,68,0.15)',
                          borderRadius: '10px',
                          fontSize: '13px', color: '#94a3b8', lineHeight: 1.6,
                          fontStyle: 'italic',
                        }}>
                          "{rec.originalText}"
                        </div>
                      </div>

                      {/* Suggested */}
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          ✅ Suggested Alternative
                        </div>
                        <div style={{
                          padding: '12px',
                          background: 'rgba(16,185,129,0.06)',
                          border: '1px solid rgba(16,185,129,0.15)',
                          borderRadius: '10px',
                          fontSize: '13px', color: '#94a3b8', lineHeight: 1.6,
                        }}>
                          "{rec.suggestedText}"
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div style={{
                      marginTop: '16px', padding: '14px',
                      background: 'rgba(59,130,246,0.06)',
                      border: '1px solid rgba(59,130,246,0.15)',
                      borderRadius: '10px',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#60a5fa', marginBottom: '6px' }}>
                        💡 AI Explanation
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                        {rec.explanation}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          {acceptedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px', padding: '20px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: '16px' }}>
                  ✅ {acceptedIds.size} recommendation{acceptedIds.size > 1 ? 's' : ''} accepted
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  Estimated risk reduction: {recommendations.filter(r => acceptedIds.has(r.id)).reduce((sum, r) => sum + r.riskReduction, 0)}%
                </div>
              </div>
              <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Export Redline <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {!analyzed && !analyzing && (
        <div style={{
          textAlign: 'center', padding: '80px 40px',
          background: 'rgba(15,15,26,0.6)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
        }}>
          <Handshake size={52} color="#334155" style={{ margin: '0 auto 16px', display: 'block' }} />
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
            Ready to Negotiate
          </div>
          <div style={{ fontSize: '14px', color: '#334155', maxWidth: '400px', margin: '0 auto' }}>
            Select a contract above and click "Analyze for Negotiation" to get AI-powered recommendations
          </div>
        </div>
      )}
    </div>
  )
}
