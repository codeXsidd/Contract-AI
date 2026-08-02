import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Bot, User, FileText, Sparkles, Clock, Trash2, Volume2 } from 'lucide-react'
import { chatApi } from '../services/api'
import { formatDate } from '../utils'
import { VoiceAssistant } from '../components/voice/VoiceAssistant'

import { useLanguage } from '../contexts/LanguageContext'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  citations?: { text: string; page?: number }[]
  timestamp: Date
  loading?: boolean
}

const QUICK_PROMPTS = [
  'Summarize this contract',
  'What are the key risks?',
  'Explain the payment terms',
  'Show all obligations',
  'When does this expire?',
  'Are there any red flags?',
  'List all parties involved',
  'Explain the termination clause',
]

const DEMO_CONTRACT_OPTIONS = [
  { id: '1', title: 'Master Service Agreement - TechCorp' },
  { id: '2', title: 'NDA - Alpha Innovations' },
  { id: '3', title: 'Vendor Agreement - Supply Chain Ltd' },
]

export default function Chat() {
  const { language } = useLanguage()
  const [selectedContract, setSelectedContract] = useState(DEMO_CONTRACT_OPTIONS[0])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'ai',
      content: `Hello! I'm your **Contract AI Assistant**. I've loaded **"${DEMO_CONTRACT_OPTIONS[0].title}"** and I'm ready to answer any questions about it.\n\nYou can ask me to:\n- Summarize the contract\n- Explain specific clauses\n- Identify risks or red flags\n- Show important dates and obligations`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    setInput('')

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    const aiMsgId = (Date.now() + 1).toString()
    const streamingMsg: Message = {
      id: aiMsgId,
      role: 'ai',
      content: '',
      timestamp: new Date(),
      loading: true,
    }

    setMessages(prev => [...prev, userMsg, streamingMsg])
    setIsLoading(true)

    try {
      // Try real-time streaming first
      let streamedContent = ''
      await new Promise<void>((resolve, reject) => {
        const controller = chatApi.streamMessage(
          selectedContract.id,
          messageText,
          language,
          (chunk) => {
            streamedContent += chunk
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId
                ? { ...m, content: streamedContent, loading: false }
                : m
            ))
          },
          (citations) => {
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId
                ? { ...m, loading: false, citations }
                : m
            ))
            resolve()
          }
        )
        // Safety timeout
        setTimeout(() => {
          if (streamedContent.length === 0) {
            controller.abort()
            reject(new Error('Stream timeout'))
          } else {
            resolve()
          }
        }, 12000)
      })
    } catch (_) {
      // Fallback to standard API if stream fails
      try {
        const res = await chatApi.sendMessage(selectedContract.id, messageText, language)
        const aiResponse = res.data?.data || res.data
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? {
                ...m,
                content: aiResponse?.response || aiResponse?.message || 'I analyzed the contract and found the following details for you.',
                citations: aiResponse?.citations || [],
                loading: false,
              }
            : m
        ))
      } catch (_err) {
        // Final demo fallback
        const demoResponses: Record<string, string> = {
          'summarize': `**Contract Summary**\n\nThis is a Master Service Agreement between TechCorp Inc. and Acme Solutions, effective February 2024.\n\n**Key Terms:**\n- Contract Value: $120,000 annually\n- Term: 12 months with auto-renewal\n- Payment: Net-30 from invoice date\n\n**Critical Dates:**\n- Effective: Feb 1, 2024\n- Expiry: Feb 1, 2025\n- Review Date: Nov 1, 2024`,
          'risk': `**Risk Analysis**\n\n🔴 **High Risk (2 items):**\n- Section 8.2: Liability cap is 3x contract value — industry standard is 1x\n- Section 12.4: Unilateral termination clause favoring vendor\n\n🟡 **Moderate Risk (3 items):**\n- Payment terms could be tightened\n- IP ownership clause lacks clarity\n\n✅ **Overall Risk Score: 45/100 (Moderate)**`,
          'payment': `**Payment Terms (Section 5)**\n\nPayment is due within **Net-30 days** from invoice date.\n\n- Late payment penalty: 1.5% per month\n- Preferred method: Wire transfer or ACH\n- Currency: USD only\n- Invoicing frequency: Monthly`,
          'default': `Based on my analysis of this contract, I found the following:\n\nThe contract establishes a service relationship with clear payment terms and deliverables. There are a few clauses that warrant attention, particularly around liability and termination rights.\n\nWould you like me to go deeper on any specific clause or provision?`,
        }
        const key = messageText.toLowerCase().includes('summar') ? 'summarize' :
                    messageText.toLowerCase().includes('risk') ? 'risk' :
                    messageText.toLowerCase().includes('payment') ? 'payment' : 'default'
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: demoResponses[key], loading: false }
            : m
        ))
      }
    }

    setIsLoading(false)
  }


  const renderMessage = (content: string) => {
    // Simple markdown-like rendering
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, color: '#f1f5f9', marginTop: i > 0 ? '8px' : '0' }}>{line.slice(2, -2)}</div>
      }
      if (line.startsWith('- ')) {
        return <div key={i} style={{ paddingLeft: '12px', color: '#cbd5e1', lineHeight: 1.6 }}>• {line.slice(2)}</div>
      }
      if (line.startsWith('🔴') || line.startsWith('🟡') || line.startsWith('✅')) {
        return <div key={i} style={{ color: '#e2e8f0', marginTop: '8px', fontWeight: 500 }}>{line}</div>
      }
      if (line === '') return <div key={i} style={{ height: '8px' }} />
      return <div key={i} style={{ color: '#cbd5e1', lineHeight: 1.6 }}>{line}</div>
    })
  }

  return (
    <div className="page-container" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
            AI Contract Chatbot
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            RAG-powered legal AI assistant with citation references
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedContract.id}
            onChange={e => {
              const c = DEMO_CONTRACT_OPTIONS.find(o => o.id === e.target.value)!
              setSelectedContract(c)
              setMessages([{
                id: 'init',
                role: 'ai',
                content: `Loaded **"${c.title}"**. How can I help you?`,
                timestamp: new Date(),
              }])
            }}
            className="input"
            style={{ fontSize: '13px', width: '280px' }}
          >
            {DEMO_CONTRACT_OPTIONS.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#13131f' }}>{c.title}</option>
            ))}
          </select>
          <button
            onClick={() => setMessages([{
              id: 'init', role: 'ai',
              content: `Chat cleared. Ask me anything about **"${selectedContract.title}"**.`,
              timestamp: new Date(),
            }])}
            className="btn btn-ghost"
            style={{ padding: '8px' }}
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Voice Assistant Chatbot Controls */}
      <div style={{ marginBottom: '16px' }}>
        <VoiceAssistant
          onTranscriptReceived={(transcriptText) => {
            sendMessage(transcriptText)
          }}
          textToRead={messages[messages.length - 1]?.content}
        />
      </div>

      {/* Contract Selector */}
      <div style={{ flex: 1, display: 'flex', gap: '16px', minHeight: 0 }}>
        {/* Messages */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'rgba(15,15,26,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
              >
                {/* Avatar */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: msg.role === 'ai' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'ai' ? <Bot size={16} color="white" /> : <User size={16} color="#94a3b8" />}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: '75%',
                  padding: '14px 16px',
                  borderRadius: msg.role === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}>
                  {msg.loading ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#3b82f6',
                          animation: `pulse-glow 1s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                      {renderMessage(msg.content)}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: msg.role === 'ai' ? '#334155' : 'rgba(255,255,255,0.5)', marginTop: '6px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '100px',
                    color: '#60a5fa',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    fontWeight: 500,
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.2)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask anything about this contract..."
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="btn btn-primary"
              style={{ padding: '10px 16px', minWidth: '100px' }}
            >
              {isLoading ? (
                <Sparkles size={16} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <><Send size={16} /> Send</>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="chart-container" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileText size={16} color="#3b82f6" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>Active Contract</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{selectedContract.title}</div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Risk Score', value: '45', color: '#f59e0b' },
                { label: 'Health Score', value: '72%', color: '#10b981' },
                { label: 'Compliance', value: '78%', color: '#3b82f6' },
                { label: 'Clauses', value: '12', color: '#a855f7' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container" style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI Capabilities
            </div>
            {[
              '📝 Contract summarization',
              '⚠️ Risk identification',
              '📊 Clause analysis',
              '📅 Date extraction',
              '🔍 Obligation tracking',
              '🤝 Negotiation hints',
            ].map(cap => (
              <div key={cap} style={{ fontSize: '12px', color: '#64748b', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {cap}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
