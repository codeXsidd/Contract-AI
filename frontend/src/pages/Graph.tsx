import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, AlertTriangle, Shield, Activity,
  BarChart2, PieChart as PieIcon
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const riskTrend = [
  { month: 'Jan', safe: 30, moderate: 15, high: 10 },
  { month: 'Feb', safe: 32, moderate: 18, high: 8 },
  { month: 'Mar', safe: 35, moderate: 16, high: 12 },
  { month: 'Apr', safe: 38, moderate: 20, high: 9 },
  { month: 'May', safe: 40, moderate: 22, high: 7 },
  { month: 'Jun', safe: 42, moderate: 18, high: 6 },
  { month: 'Jul', safe: 45, moderate: 20, high: 5 },
]

const complianceTrend = [
  { month: 'Apr', gdpr: 72, dpdp: 65, hipaa: 68, iso: 75 },
  { month: 'May', gdpr: 78, dpdp: 70, hipaa: 72, iso: 80 },
  { month: 'Jun', gdpr: 82, dpdp: 75, hipaa: 76, iso: 83 },
  { month: 'Jul', gdpr: 87, dpdp: 80, hipaa: 82, iso: 88 },
]

const healthTrend = [
  { month: 'Feb', score: 64 }, { month: 'Mar', score: 70 }, { month: 'Apr', score: 68 },
  { month: 'May', score: 75 }, { month: 'Jun', score: 80 }, { month: 'Jul', score: 84 },
]

const contractStats = [
  { name: 'Service Agreements', count: 48, color: '#3b82f6' },
  { name: 'NDAs', count: 32, color: '#8b5cf6' },
  { name: 'Vendor Agreements', count: 28, color: '#06b6d4' },
  { name: 'Employment', count: 21, color: '#10b981' },
  { name: 'SaaS Licenses', count: 14, color: '#f59e0b' },
  { name: 'Other', count: 4, color: '#64748b' },
]

const radarData = [
  { category: 'Completeness', value: 85 },
  { category: 'Clarity', value: 72 },
  { category: 'Compliance', value: 87 },
  { category: 'Risk Mgmt', value: 68 },
  { category: 'Fairness', value: 79 },
  { category: 'Enforceability', value: 83 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px' }}>
      <div style={{ color: '#64748b', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'risk', label: 'Risk Analytics', icon: AlertTriangle },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'health', label: 'Health Trends', icon: Activity },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
]

export default function Graph() {
  const [activeTab, setActiveTab] = useState('risk')

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Analytics Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Deep insights into your contract portfolio performance</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
                background: activeTab === t.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeTab === t.id ? '#60a5fa' : '#64748b',
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* Risk Analytics */}
      {activeTab === 'risk' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="chart-container" style={{ gridColumn: '1 / -1' }}>
            <div className="section-header">
              <div>
                <div className="section-title">Risk Trend Over Time</div>
                <div className="section-subtitle">Monthly distribution of contract risk levels</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px' }} />
                <Bar dataKey="safe" name="Safe" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="section-header">
              <div>
                <div className="section-title">Contract Portfolio Radar</div>
                <div className="section-subtitle">Multi-dimensional quality assessment</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="section-header">
              <div>
                <div className="section-title">Top Risk Factors</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
              {[
                { factor: 'Unlimited Liability Clauses', count: 8, pct: 80, color: '#ef4444' },
                { factor: 'Missing Arbitration', count: 14, pct: 60, color: '#f59e0b' },
                { factor: 'Ambiguous Terms', count: 22, pct: 45, color: '#f59e0b' },
                { factor: 'Missing NDA', count: 5, pct: 30, color: '#3b82f6' },
                { factor: 'One-sided Termination', count: 11, pct: 25, color: '#3b82f6' },
              ].map(f => (
                <div key={f.factor}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{f.factor}</span>
                    <span style={{ fontSize: '12px', color: f.color, fontWeight: 600 }}>{f.count} contracts</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Compliance */}
      {activeTab === 'compliance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="chart-container" style={{ gridColumn: '1 / -1' }}>
            <div className="section-header">
              <div className="section-title">Compliance Score Trends</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={complianceTrend}>
                <defs>
                  {[['gdpr', '#3b82f6'], ['dpdp', '#10b981'], ['hipaa', '#8b5cf6'], ['iso', '#06b6d4']].map(([k, c]) => (
                    <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px' }} />
                <Area type="monotone" dataKey="gdpr" name="GDPR" stroke="#3b82f6" fill="url(#grad-gdpr)" strokeWidth={2} />
                <Area type="monotone" dataKey="dpdp" name="DPDP" stroke="#10b981" fill="url(#grad-dpdp)" strokeWidth={2} />
                <Area type="monotone" dataKey="hipaa" name="HIPAA" stroke="#8b5cf6" fill="url(#grad-hipaa)" strokeWidth={2} />
                <Area type="monotone" dataKey="iso" name="ISO 27001" stroke="#06b6d4" fill="url(#grad-iso)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {[
            { name: 'GDPR', score: 87, violations: 4, color: '#3b82f6' },
            { name: 'DPDP India', score: 80, violations: 7, color: '#10b981' },
            { name: 'HIPAA', score: 82, violations: 5, color: '#8b5cf6' },
            { name: 'ISO 27001', score: 88, violations: 3, color: '#06b6d4' },
          ].map(framework => (
            <div key={framework.name} className="chart-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>{framework.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{framework.violations} violations found</div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: framework.color }}>{framework.score}%</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${framework.score}%`, background: framework.color }} />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Health Trends */}
      {activeTab === 'health' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div className="chart-container">
            <div className="section-header">
              <div className="section-title">Average Health Score Trend</div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={healthTrend}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Health Score" stroke="#10b981" strokeWidth={2.5} fill="url(#healthGrad)" dot={{ fill: '#10b981', r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Statistics */}
      {activeTab === 'statistics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="chart-container">
            <div className="section-header">
              <div className="section-title">Contracts by Type</div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={contractStats} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="count">
                  {contractStats.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contractStats.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <div className="section-header">
              <div className="section-title">Key Portfolio Metrics</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Total Value', value: '$2.4M', color: '#3b82f6' },
                { label: 'Avg Contract Value', value: '$48K', color: '#8b5cf6' },
                { label: 'Avg Risk Score', value: '41', color: '#f59e0b' },
                { label: 'Avg Health Score', value: '84%', color: '#10b981' },
                { label: 'Expiring (30d)', value: '7', color: '#ef4444' },
                { label: 'Auto-renewing', value: '23', color: '#06b6d4' },
              ].map(m => (
                <div key={m.label} style={{
                  padding: '16px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
