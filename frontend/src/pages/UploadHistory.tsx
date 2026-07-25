import React from 'react'
import { motion } from 'framer-motion'
import { History, FileText, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react'
import { formatDate } from '../utils'

const DEMO_HISTORY = [
  { id: '1', filename: 'Master_Service_Agreement_TechCorp.pdf', status: 'success', date: '2024-05-24T12:00:00Z', size: '1.2 MB' },
  { id: '2', filename: 'NDA_Alpha_Innovations.docx', status: 'success', date: '2024-05-22T09:30:00Z', size: '420 KB' },
  { id: '3', filename: 'Unlimited_Liability_Vendor.docx', status: 'success', date: '2024-05-18T15:45:00Z', size: '310 KB' },
  { id: '4', filename: 'Draft_Lease_Agreement.pdf', status: 'failed', error: 'File corrupted', date: '2024-05-10T11:20:00Z', size: '1.8 MB' },
]

export default function UploadHistory() {
  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Upload History</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Complete audit trail of uploaded files, parsing logs, and vector storage updates</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chart-container"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DEMO_HISTORY.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '14px 18px', background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <FileText size={18} color="#3b82f6" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.filename}
                </div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                  Uploaded {formatDate(item.date)} • {item.size}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {item.status === 'success' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '12px', fontWeight: 600 }}>
                    <CheckCircle size={14} /> Processed
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                    <AlertCircle size={14} /> Failed: {item.error}
                  </div>
                )}
                {item.status === 'success' && (
                  <button className="btn btn-ghost" style={{ padding: '6px' }}>
                    <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
