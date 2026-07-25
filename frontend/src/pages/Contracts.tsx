import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FileText, Search, Filter, MoreVertical, Eye, Download, Trash2,
  Plus, ChevronDown, AlertTriangle, CheckCircle, Clock, Activity,
  ArrowUpRight
} from 'lucide-react'
import { formatDate, formatCurrency, getRiskColor, getStatusBadgeClass, getRiskLabel } from '../utils'
import type { Contract } from '../types'

// Demo data
const DEMO_CONTRACTS: Contract[] = [
  { id: '1', user_id: 'u1', title: 'Master Service Agreement - TechCorp', status: 'active', type: 'Service Agreement', upload_date: '2024-01-15', effective_date: '2024-02-01', expiry_date: '2025-02-01', value: 120000, currency: 'USD', file_url: '#', risk_score: 28, health_score: 87, compliance_score: 92, created_at: '2024-01-15', updated_at: '2024-01-15', version: 1 },
  { id: '2', user_id: 'u1', title: 'NDA - Alpha Innovations', status: 'active', type: 'NDA', upload_date: '2024-02-03', effective_date: '2024-02-03', expiry_date: '2026-02-03', value: undefined, currency: 'USD', file_url: '#', risk_score: 45, health_score: 72, compliance_score: 78, created_at: '2024-02-03', updated_at: '2024-02-03', version: 1 },
  { id: '3', user_id: 'u1', title: 'Vendor Agreement - Supply Chain Ltd', status: 'under_review', type: 'Vendor Agreement', upload_date: '2024-03-10', effective_date: '2024-04-01', expiry_date: '2025-03-31', value: 85000, currency: 'USD', file_url: '#', risk_score: 72, health_score: 54, compliance_score: 61, created_at: '2024-03-10', updated_at: '2024-03-10', version: 2 },
  { id: '4', user_id: 'u1', title: 'SaaS Subscription - CloudBase Pro', status: 'active', type: 'SaaS Contract', upload_date: '2024-03-20', effective_date: '2024-04-01', expiry_date: '2024-08-01', value: 48000, currency: 'USD', file_url: '#', risk_score: 35, health_score: 81, compliance_score: 88, created_at: '2024-03-20', updated_at: '2024-03-20', version: 1 },
  { id: '5', user_id: 'u1', title: 'Employment Agreement - Senior Engineer', status: 'approved', type: 'Employment Contract', upload_date: '2024-04-05', effective_date: '2024-05-01', value: 180000, currency: 'USD', file_url: '#', risk_score: 18, health_score: 93, compliance_score: 95, created_at: '2024-04-05', updated_at: '2024-04-05', version: 1 },
  { id: '6', user_id: 'u1', title: 'Unlimited Liability Vendor Contract', status: 'draft', type: 'Vendor Agreement', upload_date: '2024-05-01', file_url: '#', risk_score: 91, health_score: 32, compliance_score: 45, created_at: '2024-05-01', updated_at: '2024-05-01', value: 200000, currency: 'USD', version: 1 },
  { id: '7', user_id: 'u1', title: 'Data Processing Agreement - GDPR', status: 'active', type: 'DPA', upload_date: '2024-05-15', effective_date: '2024-06-01', expiry_date: '2027-06-01', file_url: '#', risk_score: 22, health_score: 91, compliance_score: 97, created_at: '2024-05-15', updated_at: '2024-05-15', value: undefined, version: 1 },
  { id: '8', user_id: 'u1', title: 'Licensing Agreement - Patent Bundle', status: 'expired', type: 'License Agreement', upload_date: '2023-06-01', effective_date: '2023-07-01', expiry_date: '2024-06-30', value: 320000, currency: 'USD', file_url: '#', risk_score: 55, health_score: 62, compliance_score: 70, created_at: '2023-06-01', updated_at: '2024-06-30', version: 3 },
]

const STATUS_OPTIONS = ['all', 'active', 'draft', 'under_review', 'approved', 'expired', 'renewed']
const RISK_OPTIONS = ['all', 'safe', 'moderate', 'high']

export default function Contracts() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'upload_date' | 'risk_score' | 'health_score' | 'title'>('upload_date')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = DEMO_CONTRACTS
    .filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchRisk = riskFilter === 'all' ||
        (riskFilter === 'safe' && (c.risk_score ?? 0) <= 30) ||
        (riskFilter === 'moderate' && (c.risk_score ?? 0) > 30 && (c.risk_score ?? 0) <= 60) ||
        (riskFilter === 'high' && (c.risk_score ?? 0) > 60)
      return matchSearch && matchStatus && matchRisk
    })
    .sort((a, b) => {
      if (sortBy === 'upload_date') return new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
      if (sortBy === 'risk_score') return (b.risk_score ?? 0) - (a.risk_score ?? 0)
      if (sortBy === 'health_score') return (b.health_score ?? 0) - (a.health_score ?? 0)
      return a.title.localeCompare(b.title)
    })

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '22px' }}>All Contracts</h1>
          <p className="section-subtitle">{filtered.length} contracts found</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          <Plus size={16} /> New Contract
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', gap: '12px', marginBottom: '20px',
          flexWrap: 'wrap', alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input" style={{ width: 'auto', paddingRight: '32px' }}>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} style={{ background: '#13131f' }}>
              {s === 'all' ? 'All Status' : s.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="input" style={{ width: 'auto', paddingRight: '32px' }}>
          {RISK_OPTIONS.map(r => (
            <option key={r} value={r} style={{ background: '#13131f' }}>
              {r === 'all' ? 'All Risk' : r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="input" style={{ width: 'auto', paddingRight: '32px' }}>
          <option value="upload_date" style={{ background: '#13131f' }}>Sort: Date</option>
          <option value="risk_score" style={{ background: '#13131f' }}>Sort: Risk</option>
          <option value="health_score" style={{ background: '#13131f' }}>Sort: Health</option>
          <option value="title" style={{ background: '#13131f' }}>Sort: Name</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(15,15,26,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Type</th>
              <th>Status</th>
              <th>Risk Score</th>
              <th>Health</th>
              <th>Expiry</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contract, idx) => (
              <motion.tr
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: `rgba(${contract.risk_score! > 60 ? '239,68,68' : contract.risk_score! > 30 ? '245,158,11' : '16,185,129'}, 0.15)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={16} color={getRiskColor(contract.risk_score ?? 0)} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '13px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {contract.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>v{contract.version} • {formatDate(contract.upload_date)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>
                    {contract.type}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(contract.status)}>
                    {contract.status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: `conic-gradient(${getRiskColor(contract.risk_score ?? 0)} ${(contract.risk_score ?? 0) * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: getRiskColor(contract.risk_score ?? 0) }}>
                          {contract.risk_score}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: getRiskColor(contract.risk_score ?? 0) }}>
                      {getRiskLabel(contract.risk_score ?? 0)}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <div className="progress-bar" style={{ width: '80px' }}>
                      <div className="progress-fill" style={{
                        width: `${contract.health_score ?? 0}%`,
                        background: getRiskColor(100 - (contract.health_score ?? 0)),
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                      {contract.health_score}%
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: contract.expiry_date ? '#94a3b8' : '#334155' }}>
                    {contract.expiry_date ? formatDate(contract.expiry_date) : '—'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {contract.value ? formatCurrency(contract.value, contract.currency) : '—'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Link to={`/contracts/${contract.id}`} className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }}>
                      <Eye size={14} /> View
                    </Link>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }}>
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FileText size={40} color="#334155" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '16px', color: '#475569', fontWeight: 500 }}>No contracts found</div>
            <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
