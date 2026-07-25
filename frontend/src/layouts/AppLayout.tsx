import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../contexts/AuthContext'

export default function AppLayout() {
  const { session, loading } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0a0f',
        flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: '48px', height: '48px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'float 2s ease-in-out infinite',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
        }}>
          <span style={{ fontSize: '24px' }}>⚖️</span>
        </div>
        <div style={{
          fontSize: '14px', color: '#475569',
          animation: 'pulse-glow 1.5s ease-in-out infinite',
        }}>
          Loading Contract AI...
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
      <div
        className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Topbar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
