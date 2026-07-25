import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Clock, AlertTriangle, CheckCircle, RefreshCw, Calendar,
  FileText, ArrowRight, Bell, Filter
} from 'lucide-react'
import { formatDate, getDaysRemaining } from '../utils'
import type { Deadline } from '../types'

const DEMO_DEADLINES: Deadline[] = [
  { id: '1', contract_id: 'c1', contract_title: 'Microsoft Azure SLA', type: 'renewal', date: '2024-08-01', status: 'upcoming', days_remaining: 7 },
  { id: '2', contract_id: 'c2', contract_title: 'AWS Enterprise Agreement', type: 'renewal', date: '2024-08-08', status: 'upcoming', days_remaining: 14 },
  { id: '3', contract_id: 'c3', contract_title: 'Vendor Agreement Q2', type: 'expiry', date: '2024-07-25', status: 'today', days_remaining: 0 },
  { id: '4', contract_id: 'c4', contract_title: 'NDA - Beta Corp', type: 'review', date: '2024-07-20', status: 'overdue', days_remaining: -4 },
  { id: '5', contract_id: 'c5', contract_title: 'SaaS License Pro', type: 'payment', date: '2024-08-15', status: 'upcoming', days_remaining: 21 },
  { id: '6', contract_id: 'c6', contract_title: 'Salesforce CRM', type: 'renewal', date: '2024-08-22', status: 'upcoming', days_remaining: 28 },
]

const DEMO_ACTIVE = [
  { id: 'c1', title: 'Master Service Agreement - TechCorp', value: '$120,000', expiry: '2025-02-01', health: 87, status: 'active' },
  { id: 'c2', title: 'Employment Agreement - Senior Engineer', value: '$180,000', expiry: '—', health: 93, status: 'active' },
  { id: 'c7', title: 'Data Processing Agreement - GDPR', value: '—', expiry: '2027-06-01', health: 91, status: 'active' },
  { id: 'c4', title: 'SaaS Subscription - CloudBase Pro', value: '$48,000', expiry: '2024-08-01', health: 81, status: 'active' },
]

const typeColors: Record<string, string> = {
  renewal: '#3b82f6',
  expiry: '#ef4444',
  review: '#f59e0b',
  payment: '#10b981',
  obligation: '#a855f7',
}

const typeIcons: Record<string, React.ElementType> = {
  renewal: RefreshCw,
  expiry: Clock,
  review: CheckCircle,
  payment: Calendar,
  obligation: FileText,
}

export default function Lifecycle() {
  const [activeTab, setActiveTab] = useState<'deadlines' | 'active' | 'expiring' | 'obligations'>('deadlines')
  const [filterType, setFilterType] = useState('all')

  const filteredDeadlines = DEMO_DEADLINES
    .filter(d => filterType === 'all' || d.type === filterType)
    .sort((a, b) => (a.days_remaining ?? 0) - (b.days_remaining ?? 0))

  const tabs = [
    { id: 'deadlines', label: 'Deadlines', icon: Clock },
    { id: 'active', label: 'Active Contracts', icon: CheckCircle },
    { id: 'expiring', label: 'Expiring Soon', icon: AlertTriangle },
    { id: 'obligations', label: 'Obligations', icon: FileText },
  ] as const

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
          Contract Lifecycle Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>
          Track deadlines, renewals, and obligations across all your contracts
        </p>
      </div>

      {/* Alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 18px', marginBottom: '20px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '12px',
        }}
      >
        <AlertTriangle size={18} color="#ef4444" />
        <div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#f87171' }}>1 contract overdue</span>
          <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>
            NDA - Beta Corp was due for review on Jul 20. Please take action.
          </span>
        </div>
        <button className="btn btn-danger" style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '12px' }}>
          View <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
                background: activeTab === tab.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeTab === tab.id ? '#60a5fa' : '#64748b',
              }}
            >
              <Icon size={15} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Deadlines tab */}
      {activeTab === 'deadlines' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Type filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['all', 'renewal', 'expiry', 'review', 'payment', 'obligation'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '6px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 500, transition: 'all 0.2s',
                  background: filterType === t ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                  color: filterType === t ? 'white' : '#64748b',
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredDeadlines.map((deadline, idx) => {
              const Icon = typeIcons[deadline.type] || Clock
              const color = typeColors[deadline.type] || '#3b82f6'
              const days = deadline.days_remaining ?? 0

              return (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px 20px',
                    background: 'rgba(15,15,26,0.9)',
                    border: `1px solid ${deadline.status === 'overdue' ? 'rgba(239,68,68,0.3)' : deadline.status === 'today' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: `${color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={color} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '3px' }}>
                      {deadline.contract_title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                        background: `${color}20`, color, border: `1px solid ${color}40`,
                        borderRadius: '100px', textTransform: 'capitalize',
                      }}>
                        {deadline.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>{formatDate(deadline.date)}</span>
                    </div>
                  </div>

                  {/* Days badge */}
                  <div style={{
                    padding: '8px 16px', borderRadius: '10px', textAlign: 'center',
                    background: deadline.status === 'overdue' ? 'rgba(239,68,68,0.15)' :
                                deadline.status === 'today' ? 'rgba(245,158,11,0.15)' :
                                days <= 7 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${deadline.status === 'overdue' ? 'rgba(239,68,68,0.3)' :
                                deadline.status === 'today' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    <div style={{
                      fontSize: '18px', fontWeight: 800, lineHeight: 1,
                      color: deadline.status === 'overdue' ? '#f87171' :
                             deadline.status === 'today' ? '#fbbf24' :
                             days <= 7 ? '#f87171' : '#94a3b8',
                    }}>
                      {deadline.status === 'overdue' ? `${Math.abs(days)}d` :
                       deadline.status === 'today' ? 'TODAY' : `${days}d`}
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase' }}>
                      {deadline.status === 'overdue' ? 'overdue' : deadline.status === 'today' ? '' : 'left'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }}>
                      <Bell size={14} /> Remind
                    </button>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      View <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Active contracts tab */}
      {activeTab === 'active' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DEMO_ACTIVE.map((contract, idx) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  background: 'rgba(15,15,26,0.9)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(16,185,129,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={20} color="#10b981" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{contract.title}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>
                    Expires: {contract.expiry} • Value: {contract.value}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{contract.health}%</div>
                  <div style={{ fontSize: '10px', color: '#475569' }}>Health</div>
                </div>
                <span className="badge badge-success">Active</span>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  View <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Expiring tab */}
      {activeTab === 'expiring' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredDeadlines.filter(d => d.type === 'renewal' || d.type === 'expiry').map((d, idx) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  background: 'rgba(15,15,26,0.9)',
                  border: `1px solid ${(d.days_remaining ?? 0) <= 7 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.2)'}`,
                  borderRadius: '14px',
                }}
              >
                <Clock size={20} color={(d.days_remaining ?? 0) <= 7 ? '#ef4444' : '#f59e0b'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>{d.contract_title}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>Due: {formatDate(d.date)}</div>
                </div>
                <div style={{
                  fontSize: '20px', fontWeight: 800,
                  color: (d.days_remaining ?? 0) <= 7 ? '#f87171' : '#fbbf24',
                }}>
                  {d.days_remaining}d
                </div>
                <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                  Renew <RefreshCw size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Obligations tab */}
      {activeTab === 'obligations' && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>
          <FileText size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontSize: '16px', fontWeight: 500 }}>Obligations Tracker</div>
          <div style={{ fontSize: '13px', marginTop: '6px' }}>
            Upload contracts to automatically extract and track obligations
          </div>
        </div>
      )}
    </div>
  )
}
