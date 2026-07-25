import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import AppLayout from './layouts/AppLayout'

// Import all pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Contracts from './pages/Contracts'
import ContractDetails from './pages/ContractDetails'
import SearchContracts from './pages/SearchContracts'
import UploadContract from './pages/Upload'
import UploadHistory from './pages/UploadHistory'
import Negotiate from './pages/Negotiate'
import Compare from './pages/Compare'
import Graph from './pages/Graph'
import Reports from './pages/Reports'
import Chat from './pages/Chat'
import Compliance from './pages/Compliance'
import Lifecycle from './pages/Lifecycle'
import Similarity from './pages/Similarity'
import Settings from './pages/Settings'
import { LanguageProvider } from './contexts/LanguageContext'
import { RegulatoryRadarView } from './components/compliance/RegulatoryRadarView'

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Main Application Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Contracts */}
            <Route path="contracts" element={<Contracts />} />
            <Route path="contracts/:id" element={<ContractDetails />} />
            <Route path="contracts/search" element={<SearchContracts />} />

            {/* Upload */}
            <Route path="upload" element={<UploadContract />} />
            <Route path="upload/history" element={<UploadHistory />} />

            {/* AI Core Features */}
            <Route path="negotiate" element={<Negotiate />} />
            <Route path="negotiate/recommendations" element={<Negotiate />} />
            <Route path="negotiate/simulator" element={<Negotiate />} />
            <Route path="compare" element={<Compare />} />
            <Route path="compare/versions" element={<Compare />} />
            
            {/* Graph / Analytics */}
            <Route path="graph" element={<Graph />} />
            <Route path="graph/risk" element={<Graph />} />
            <Route path="graph/compliance" element={<Graph />} />
            <Route path="graph/health" element={<Graph />} />

            {/* Reports */}
            <Route path="reports" element={<Reports />} />
            <Route path="reports/risk" element={<Reports />} />
            <Route path="reports/compliance" element={<Reports />} />

            {/* AI Chat */}
            <Route path="chat" element={<Chat />} />
            <Route path="chat/legal" element={<Chat />} />

            {/* Compliance */}
            <Route path="compliance" element={<Compliance />} />
            <Route path="compliance/radar" element={<RegulatoryRadarView />} />
            <Route path="compliance/:framework" element={<Compliance />} />

            {/* Lifecycle */}
            <Route path="lifecycle" element={<Lifecycle />} />
            <Route path="lifecycle/active" element={<Lifecycle />} />
            <Route path="lifecycle/expiring" element={<Lifecycle />} />
            <Route path="lifecycle/renewals" element={<Lifecycle />} />
            <Route path="lifecycle/obligations" element={<Lifecycle />} />

            {/* Tools */}
            <Route path="similarity" element={<Similarity />} />
            <Route path="settings" element={<Settings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
)
}
