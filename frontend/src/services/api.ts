import axios from 'axios'
import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach Supabase JWT or Mock JWT
apiClient.interceptors.request.use(
  async (config) => {
    const savedMockSession = localStorage.getItem('mock_session')
    if (savedMockSession) {
      try {
        const parsed = JSON.parse(savedMockSession)
        if (parsed?.access_token) {
          config.headers.Authorization = `Bearer ${parsed.access_token}`
          return config
        }
      } catch (e) {
        console.error('Error parsing mock session in interceptor:', e)
      }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mock_session')
      try {
        await supabase.auth.signOut()
      } catch (e) {}
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================================
// CONTRACT API
// ============================================================
export const contractsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get('/api/contracts', { params }),

  getById: (id: string) =>
    apiClient.get(`/api/contracts/${id}`),

  upload: (formData: FormData, onProgress?: (pct: number) => void) =>
    apiClient.post('/api/contracts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    }),

  delete: (id: string) =>
    apiClient.delete(`/api/contracts/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/contracts/${id}/status`, { status }),

  getVersions: (id: string) =>
    apiClient.get(`/api/contracts/${id}/versions`),

  search: (query: string) =>
    apiClient.get('/api/contracts/search', { params: { q: query } }),

  streamAnalysis: (contractId: string, onStep: (data: { progress: number; stage: string; status: string }) => void) => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/contracts/${contractId}/stream-analysis`)
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onStep(data)
        if (data.progress >= 100 || data.status === 'completed') {
          eventSource.close()
        }
      } catch (e) {
        console.error('SSE Error:', e)
      }
    }
    eventSource.onerror = () => eventSource.close()
    return eventSource
  },
}

// ============================================================
// AI ANALYSIS API
// ============================================================
export const analysisApi = {
  analyze: (contractId: string) =>
    apiClient.post(`/api/analysis/${contractId}/full`),

  getSummary: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/summary`),

  getClauses: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/clauses`),

  getRiskReport: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/risk`),

  getHealthScore: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/health`),

  detectPII: (contractId: string) =>
    apiClient.post(`/api/analysis/${contractId}/pii`),

  maskPII: (contractId: string) =>
    apiClient.post(`/api/analysis/${contractId}/pii/mask`),

  getRedFlags: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/red-flags`),

  getRecommendations: (contractId: string) =>
    apiClient.get(`/api/analysis/${contractId}/recommendations`),
}

// ============================================================
// COMPLIANCE API
// ============================================================
export const complianceApi = {
  check: (contractId: string, frameworks: string[]) =>
    apiClient.post(`/api/compliance/${contractId}`, { frameworks }),

  getReport: (contractId: string) =>
    apiClient.get(`/api/compliance/${contractId}`),
}

// ============================================================
// CHAT API
// ============================================================
export const chatApi = {
  sendMessage: (contractId: string, message: string, targetLanguage: string = 'en') =>
    apiClient.post(`/api/chat/${contractId}`, { message, target_language: targetLanguage }),

  getHistory: (contractId: string) =>
    apiClient.get(`/api/chat/${contractId}/history`),

  clearHistory: (contractId: string) =>
    apiClient.delete(`/api/chat/${contractId}/history`),

  streamMessage: (
    contractId: string,
    message: string,
    targetLanguage: string = 'en',
    onChunk: (chunk: string) => void,
    onDone: (citations: Array<{text: string; page?: number; clause_type?: string}>) => void
  ) => {
    // Use fetch with SSE streaming for real-time chat
    const controller = new AbortController()
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

    fetch(`${baseUrl}/api/chat/${contractId}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, target_language: targetLanguage }),
      signal: controller.signal,
    }).then(async (res) => {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.chunk) onChunk(data.chunk)
              if (data.done) onDone(data.citations || [])
            } catch (_) { /* ignore parse errors */ }
          }
        }
      }
    }).catch((e) => { if (e.name !== 'AbortError') console.error('Stream error:', e) })

    return controller
  },
}


// ============================================================
// NEGOTIATION API
// ============================================================
export const negotiationApi = {
  analyze: (contractId: string) =>
    apiClient.post(`/api/negotiation/${contractId}/analyze`),

  getSession: (contractId: string) =>
    apiClient.get(`/api/negotiation/${contractId}`),

  simulate: (contractId: string, clauseId: string, newText: string) =>
    apiClient.post(`/api/negotiation/${contractId}/simulate`, {
      clause_id: clauseId,
      new_text: newText,
    }),
}

// ============================================================
// COMPARISON API
// ============================================================
export const comparisonApi = {
  compare: (contractId1: string, contractId2: string) =>
    apiClient.post('/api/compare', { contract_id_1: contractId1, contract_id_2: contractId2 }),
}

// ============================================================
// SIMILARITY API
// ============================================================
export const similarityApi = {
  search: (contractId: string) =>
    apiClient.post(`/api/similarity/${contractId}`),

  searchByText: (query: string) =>
    apiClient.post('/api/similarity/text', { query }),
}

// ============================================================
// REPORTS API
// ============================================================
export const reportsApi = {
  generatePDF: (contractId: string) =>
    apiClient.post(`/api/reports/${contractId}/pdf`, {}, { responseType: 'blob' }),

  generateRiskReport: (contractId: string) =>
    apiClient.post(`/api/reports/${contractId}/risk`, {}, { responseType: 'blob' }),
}

// ============================================================
// ANALYTICS API
// ============================================================
export const analyticsApi = {
  getDashboard: () =>
    apiClient.get('/api/analytics/dashboard'),

  getUploadTrends: () =>
    apiClient.get('/api/analytics/upload-trends'),

  getRiskDistribution: () =>
    apiClient.get('/api/analytics/risk-distribution'),

  getComplianceTrends: () =>
    apiClient.get('/api/analytics/compliance-trends'),
}

// ============================================================
// DEADLINES / LIFECYCLE API
// ============================================================
export const lifecycleApi = {
  getDeadlines: () =>
    apiClient.get('/api/lifecycle/deadlines'),

  getExpiring: () =>
    apiClient.get('/api/lifecycle/expiring'),

  getObligations: (contractId?: string) =>
    apiClient.get('/api/lifecycle/obligations', { params: { contract_id: contractId } }),

  updateObligationStatus: (obligationId: string, status: string) =>
    apiClient.patch(`/api/lifecycle/obligations/${obligationId}`, { status }),
}
