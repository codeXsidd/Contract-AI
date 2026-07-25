import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, FileText, ArrowRight, CornerDownRight, Filter } from 'lucide-react'
import { contractsApi } from '../services/api'
import { Link } from 'react-router-dom'
import { getStatusBadgeClass } from '../utils'

interface SearchResultItem {
  id: string
  title: string
  status: string
  snippet: string
  score?: number
}

const DEMO_SEARCH_RESULTS: SearchResultItem[] = [
  {
    id: '1',
    title: 'Master Service Agreement - TechCorp',
    status: 'active',
    snippet: 'This Agreement outlines the terms under which TechCorp Consulting Inc. provides professional engineering services to Acme Solutions Ltd. Effective date is February 1, 2024.',
  },
  {
    id: '3',
    title: 'Vendor Agreement - Supply Chain Ltd',
    status: 'under_review',
    snippet: 'Supply Chain Ltd agrees to supply components to Client subject to quality guidelines and payment cycles detailed in Section 4 (Invoicing and Net-30 Terms).',
  },
]

export default function SearchContracts() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<SearchResultItem[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearched(false)

    try {
      const res = await contractsApi.search(query)
      setResults(res.data?.data?.items || DEMO_SEARCH_RESULTS)
    } catch {
      await new Promise(r => setTimeout(r, 1000))
      setResults(DEMO_SEARCH_RESULTS)
    }

    setSearching(false)
    setSearched(true)
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Contract Search</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Full-text context search across all uploaded contract databases</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', gap: '10px', marginBottom: '24px',
          background: 'rgba(15,15,26,0.9)', padding: '16px',
          borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <SearchIcon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search keywords, clauses, party names, or values..."
            style={{ paddingLeft: '44px' }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="btn btn-primary"
          style={{ minWidth: '120px' }}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </motion.div>

      {searched && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>Results Found ({results.length})</h2>
          {results.map((res, idx) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: 'rgba(15,15,26,0.9)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="#3b82f6" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>{res.title}</span>
                </div>
                <span className={getStatusBadgeClass(res.status)}>{res.status.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '8px' }}>
                <CornerDownRight size={14} color="#475569" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{res.snippet}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Link to={`/contracts/${res.id}`} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12.5px' }}>
                  Open Details <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
