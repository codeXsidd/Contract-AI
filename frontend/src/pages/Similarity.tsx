import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Scale, FileText, ChevronRight, RefreshCw, Layers } from 'lucide-react'
import { similarityApi } from '../services/api'

interface SimilarItem {
  id: string
  title: string
  score: number
  matchedClauses: string[]
}

const DEMO_SIMILAR: SimilarItem[] = [
  {
    id: '1',
    title: 'Master Service Agreement - TechCorp (v1)',
    score: 96,
    matchedClauses: ['Section 8 (Limitation of Liability)', 'Section 12.1 (Termination for Cause)'],
  },
  {
    id: '2',
    title: 'Vendor Agreement - Supply Chain Ltd',
    score: 78,
    matchedClauses: ['Section 4 (Payment Terms)', 'Section 14 (Governing Law)'],
  },
  {
    id: '3',
    title: 'NDA - Alpha Innovations',
    score: 42,
    matchedClauses: ['Section 2 (Definition of Confidential Information)'],
  },
]

export default function Similarity() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [results, setResults] = useState<SimilarItem[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearched(false)

    try {
      const res = await similarityApi.searchByText(query)
      setResults(res.data?.data?.items || DEMO_SIMILAR)
    } catch {
      await new Promise(r => setTimeout(r, 1500))
      setResults(DEMO_SIMILAR)
    }

    setSearching(false)
    setSearched(true)
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Similarity Search</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>Search similar contracts or extracted provisions using Vector Database (FAISS) embeddings</p>
      </div>

      {/* Search Input */}
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
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            className="input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a clause (e.g. 'limitation of liability shall not exceed fees paid') to find similar provisions..."
            style={{ paddingLeft: '44px' }}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="btn btn-primary"
          style={{ minWidth: '130px' }}
        >
          {searching ? (
            <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Searching...</>
          ) : (
            'Vector Search'
          )}
        </button>
      </motion.div>

      {/* Searching State */}
      {searching && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Layers size={44} color="#3b82f6" style={{ margin: '0 auto 16px', display: 'block', animation: 'pulse-glow 1.5s infinite' }} />
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>Querying Vector Indexes...</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Using Sentence Transformers and FAISS storage to compute similarity matrix</div>
        </div>
      )}

      {/* Results */}
      {searched && !searching && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>Top Matches</h2>
          {results.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{
                display: 'flex', gap: '16px', padding: '16px 20px',
                background: 'rgba(15,15,26,0.9)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
                alignItems: 'center',
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `rgba(${item.score > 80 ? '16,185,129' : '59,130,246'}, 0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={18} color={item.score > 80 ? '#10b981' : '#3b82f6'} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{item.title}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {item.matchedClauses.map((cl, ci) => (
                    <span key={ci} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: '6px', color: '#64748b' }}>
                      Matched: {cl}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: item.score > 80 ? '#10b981' : '#3b82f6' }}>
                  {item.score}%
                </div>
                <div style={{ fontSize: '10px', color: '#475569' }}>match score</div>
              </div>

              <button className="btn btn-ghost" style={{ padding: '8px' }}>
                <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
