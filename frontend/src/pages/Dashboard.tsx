import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown,
  Activity, Zap, BarChart3, FileWarning, ArrowUpRight, RefreshCw,
  Shield, Scale, Plus
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getRiskColor } from '../utils'

// ============================================================
// MOCK DATA (replace with real API calls via React Query)
// ============================================================
const uploadTrends = [
  { month: 'Feb', count: 12 },
  { month: 'Mar', count: 19 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 28 },
  { month: 'Jun', count: 34 },
  { month: 'Jul', count: 41 },
]

const riskDistribution = [
  { name: 'Safe', value: 45, color: '#10b981' },
  { name: 'Moderate', value: 32, color: '#f59e0b' },
  { name: 'High Risk', value: 23, color: '#ef4444' },
]

const complianceTrends = [
  { month: 'Apr', gdpr: 72, hipaa: 68, iso: 75 },
  { month: 'May', gdpr: 78, hipaa: 72, iso: 80 },
  { month: 'Jun', gdpr: 82, hipaa: 76, iso: 83 },
  { month: 'Jul', gdpr: 87, hipaa: 82, iso: 88 },
]

const healthTrends = [
  { month: 'Feb', score: 64 },
  { month: 'Mar', score: 70 },
  { month: 'Apr', score: 68 },
  { month: 'May', score: 75 },
  { month: 'Jun', score: 80 },
  { month: 'Jul', score: 84 },
]

const recentActivity = [
  { id: 1, action: 'Contract uploaded', contract: 'Service Agreement v2', time: '2 min ago', type: 'upload', risk: 35 },
  { id: 2, action: 'Risk analysis completed', contract: 'NDA with TechCorp', time: '1 hr ago', type: 'analysis', risk: 72 },
  { id: 3, action: 'Compliance check passed', contract: 'Data Processing Addendum', time: '3 hr ago', type: 'compliance', risk: 18 },
  { id: 4, action: 'Contract approved', contract: 'Vendor Agreement 2024', time: '5 hr ago', type: 'approved', risk: 28 },
  { id: 5, action: 'Red flag detected', contract: 'Unlimited Liability Clause', time: '1 day ago', type: 'alert', risk: 91 },
]

const upcomingRenewals = [
  { id: 1, name: 'Microsoft Azure SLA', days: 7, value: '$48,000', risk: 25 },
  { id: 2, name: 'AWS Enterprise Agreement', days: 14, value: '$120,000', risk: 41 },
  { id: 3, name: 'Salesforce CRM Contract', days: 22, value: '$36,000', risk: 30 },
  { id: 4, name: 'Office 365 License', days: 30, value: '$22,000', risk: 18 },
]

const highRiskAlerts = [
  { id: 1, contract: 'Vendor Agreement - Alpha Corp', issue: 'Unlimited liability clause detected', severity: 'critical' },
  { id: 2, contract: 'NDA with StartupXYZ', issue: 'Missing arbitration clause', severity: 'high' },
  { id: 3, contract: 'Service Contract Q3', issue: 'One-sided termination terms', severity: 'high' },
]

// ============================================================
// STAT CARD COMPONENT
// ============================================================
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  iconColor: string
  iconBg: string
  trend?: { value: number; positive: boolean }
  subtitle?: string
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg, trend, subtitle }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="stat-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>{subtitle}</div>
          )}
          {trend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              {trend.positive ? (
                <TrendingUp size={13} color="#10b981" />
              ) : (
                <TrendingDown size={13} color="#ef4444" />
              )}
              <span style={{
                fontSize: '12px',
                color: trend.positive ? '#10b981' : '#ef4444',
                fontWeight: 600,
              }}>
                {trend.value}% vs last month
              </span>
            </div>
          )}
        </div>
        <div style={{
          width: '48px', height: '48px',
          background: iconBg,
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} color={iconColor} />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// CUSTOM TOOLTIP
// ============================================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
    }}>
      <div style={{ color: '#64748b', marginBottom: '4px' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  return (
    <div className="page-container">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
            Welcome back, {firstName} 👋
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Enterprise Contract Intelligence & NextGen AI Risk Engine
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/compliance/radar" className="btn btn-secondary" style={{ gap: '8px', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <Shield size={16} /> 📡 Regulatory Radar
          </Link>
          <Link to="/upload" className="btn btn-primary" style={{ gap: '8px' }}>
            <Plus size={16} /> Upload Contract
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard label="Total Contracts" value="147" icon={FileText} iconColor="#3b82f6" iconBg="rgba(59,130,246,0.15)" trend={{ value: 12, positive: true }} />
        <StatCard label="Active Contracts" value="89" icon={Activity} iconColor="#10b981" iconBg="rgba(16,185,129,0.15)" trend={{ value: 8, positive: true }} />
        <StatCard label="High Risk Contracts" value="23" icon={AlertTriangle} iconColor="#ef4444" iconBg="rgba(239,68,68,0.15)" trend={{ value: 3, positive: false }} />
        <StatCard label="Expiring Soon" value="7" icon={Clock} iconColor="#f59e0b" iconBg="rgba(245,158,11,0.15)" subtitle="Next 30 days" />
        <StatCard label="Compliance Score" value="87%" icon={Shield} iconColor="#a855f7" iconBg="rgba(168,85,247,0.15)" trend={{ value: 5, positive: true }} />
        <StatCard label="Avg Health Score" value="84" icon={Scale} iconColor="#06b6d4" iconBg="rgba(6,182,212,0.15)" trend={{ value: 9, positive: true }} />
      </motion.div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Upload trends */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Upload Trends</div>
              <div className="section-subtitle">Monthly contract uploads</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={uploadTrends}>
              <defs>
                <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Uploads" stroke="#3b82f6" strokeWidth={2} fill="url(#uploadGrad)" dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk distribution */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Risk Distribution</div>
              <div className="section-subtitle">By risk level</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {riskDistribution.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }} />
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{d.name}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: d.color }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* Compliance trends */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Compliance Trends</div>
              <div className="section-subtitle">Score by framework</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={complianceTrends} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px' }} />
              <Bar dataKey="gdpr" name="GDPR" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hipaa" name="HIPAA" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="iso" name="ISO 27001" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Health score trend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="chart-container">
          <div className="section-header">
            <div>
              <div className="section-title">Health Score Trend</div>
              <div className="section-subtitle">Average portfolio health</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={healthTrends}>
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
              <Area type="monotone" dataKey="score" name="Health" stroke="#10b981" strokeWidth={2} fill="url(#healthGrad)" dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Activity + Renewals + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '16px' }}>
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="chart-container">
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
            <Link to="/contracts" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recentActivity.map((a) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px', borderRadius: '10px', transition: 'background 0.2s',
                cursor: 'pointer',
              }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: a.type === 'alert' ? '#ef4444' : a.type === 'compliance' ? '#10b981' : a.type === 'approved' ? '#a855f7' : '#3b82f6',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.action}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.contract}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', color: '#334155' }}>{a.time}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: getRiskColor(a.risk) }}>{a.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Renewals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="chart-container">
          <div className="section-header">
            <div className="section-title">Upcoming Renewals</div>
            <Link to="/lifecycle/renewals" style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingRenewals.map((r) => (
              <div key={r.id} style={{
                padding: '12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, marginBottom: '6px' }}>
                  {r.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px',
                    color: r.days <= 7 ? '#ef4444' : r.days <= 14 ? '#f59e0b' : '#10b981',
                    fontWeight: 600,
                  }}>
                    {r.days} days
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{r.value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* High Risk Alerts */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="chart-container">
          <div className="section-header">
            <div className="section-title" style={{ color: '#f87171' }}>
              🚨 High Risk Alerts
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {highRiskAlerts.map((a) => (
              <div key={a.id} style={{
                padding: '12px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <AlertTriangle size={12} color="#ef4444" />
                  <span style={{
                    fontSize: '10px', fontWeight: 700, color: '#f87171',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>
                    {a.severity}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, marginBottom: '4px' }}>
                  {a.contract}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{a.issue}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
