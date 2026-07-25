import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileBarChart, Download, FileText, ArrowRight, Shield, AlertTriangle, Scale, RefreshCw } from 'lucide-react'
import { reportsApi } from '../services/api'
import { downloadBlob } from '../utils'

const DEMO_REPORTS = [
  { id: '1', title: 'Executive Risk Summary - TechCorp', type: 'risk', date: '2024-05-24', size: '1.2 MB' },
  { id: '2', title: 'DPA Compliance Audit - GDPR', type: 'compliance', date: '2024-05-22', size: '840 KB' },
  { id: '3', title: 'Complete Lifecycle Report', type: 'lifecycle', date: '2024-05-18', size: '2.1 MB' },
]

const DEMO_CONTRACTS = [
  { id: '1', title: 'Master Service Agreement - TechCorp' },
  { id: '2', title: 'NDA - Alpha Innovations' },
  { id: '3', title: 'Vendor Agreement - Supply Chain Ltd' },
]

export default function Reports() {
  const [selectedContract, setSelectedContract] = useState(DEMO_CONTRACTS[0].id)
  const [reportType, setReportType] = useState<'full' | 'risk' | 'compliance'>('full')
  const [generating, setGenerating] = useState(false)
  const [reports, setReports] = useState(DEMO_REPORTS)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      let res
      let filename = 'report.pdf'
      if (reportType === 'full') {
        res = await reportsApi.generatePDF(selectedContract)
        filename = `Full_Report_${selectedContract}.pdf`
      } else {
        res = await reportsApi.generateRiskReport(selectedContract)
        filename = `Risk_Report_${selectedContract}.pdf`
      }

      downloadBlob(res.data, filename)

      // Add to generated list
      const newReport = {
        id: Math.random().toString(36).substr(2, 9),
        title: `${reportType.toUpperCase()} Report - Contract #${selectedContract}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        size: '1.4 MB',
      }
      setReports(prev => [newReport, ...prev])
    } catch {
      await new Promise(r => setTimeout(r, 2000))
      const newReport = {
        id: Math.random().toString(36).substr(2, 9),
        title: `${reportType.toUpperCase()} Report - Contract #${selectedContract}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        size: '1.4 MB',
      }
      setReports(prev => [newReport, ...prev])
    }
    setGenerating(false)
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Reports & Redlines</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Generate audit-ready PDF summaries, risk profiles, and compliance audits</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Generate Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="chart-container"
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>Generate Legal Report</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="input-label">Select Contract</label>
              <select value={selectedContract} onChange={e => setSelectedContract(e.target.value)} className="input">
                {DEMO_CONTRACTS.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: '10px', display: 'block' }}>Report Template</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'full', name: 'Full PDF Summary', icon: FileText, desc: 'Includes summary, risks, compliance, obligations & redlines.' },
                  { id: 'risk', name: 'Risk Analytics', icon: AlertTriangle, desc: 'Detailed breakdown of high-risk clauses and warning signs.' },
                  { id: 'compliance', name: 'Compliance Audit', icon: Shield, desc: 'Verification checklist for GDPR, HIPAA, and DPDP rules.' },
                ].map(tmpl => {
                  const Icon = tmpl.icon
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setReportType(tmpl.id as any)}
                      style={{
                        padding: '16px 12px',
                        background: reportType === tmpl.id ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${reportType === tmpl.id ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={20} color={reportType === tmpl.id ? '#3b82f6' : '#64748b'} style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '13px', fontWeight: 700, color: reportType === tmpl.id ? '#3b82f6' : '#cbd5e1' }}>{tmpl.name}</div>
                      <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px', lineHeight: 1.3 }}>{tmpl.desc}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {generating ? (
              <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating Report...</>
            ) : (
              <><Download size={16} /> Compile & Download Report</>
            )}
          </button>
        </motion.div>

        {/* History Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chart-container"
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Download History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {reports.map((rep, idx) => (
              <div
                key={rep.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
                }}
              >
                <div style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileBarChart size={18} color="#3b82f6" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {rep.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    {rep.date} • {rep.size}
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '6px' }} title="Download file">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
