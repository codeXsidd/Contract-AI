import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Upload, Handshake, GitCompare, BarChart3,
  FileBarChart, MessageSquare, Shield, Clock, Search, Settings,
  ChevronLeft, ChevronRight, Zap, FolderOpen, History, Bot, Scale, Activity
} from 'lucide-react'

interface SidebarSection {
  label?: string
  items: SidebarItem[]
}

interface SidebarItem {
  label: string
  path: string
  icon: React.ElementType
  badge?: string
  badgeColor?: string
}

const sidebarSections: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Contracts & Upload',
    items: [
      { label: 'All Contracts', path: '/contracts', icon: FileText },
      { label: 'Contract Search', path: '/contracts/search', icon: Search },
      { label: 'Upload Contract', path: '/upload', icon: Upload },
      { label: 'Upload History', path: '/upload/history', icon: History },
    ]
  },
  {
    label: 'AI Legal Tools',
    items: [
      { label: 'AI Negotiation Copilot', path: '/negotiate', icon: Handshake },
      { label: 'Compare Contracts', path: '/compare', icon: GitCompare },
      { label: 'RAG Contract Chatbot', path: '/chat', icon: MessageSquare },
      { label: 'Similarity Search', path: '/similarity', icon: Search },
    ]
  },
  {
    label: 'Analytics & Reports',
    items: [
      { label: 'Contract Analytics & Graph', path: '/graph', icon: BarChart3 },
      { label: 'Audit PDF Reports', path: '/reports', icon: FileBarChart },
    ]
  },
  {
    label: 'Compliance & Lifecycle',
    items: [
      { label: 'Regulatory Radar', path: '/compliance/radar', icon: Shield, badge: 'AI', badgeColor: '#ef4444' },
      { label: 'Compliance Checker', path: '/compliance', icon: Shield },
      { label: 'Deadline & Obligations', path: '/lifecycle', icon: Clock },
    ]
  },
  {
    items: [
      { label: 'Settings', path: '/settings', icon: Settings },
    ]
  }
]

interface SidebarProps {
  collapsed: boolean
  onCollapse: (v: boolean) => void
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <span>⚖️</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="sidebar-logo-text"
            >
              <span className="brand-title">Contract AI</span>
              <span className="brand-subtitle">Enterprise Legal Tech</span>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => onCollapse(!collapsed)}
          className="sidebar-toggle-btn"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav custom-scrollbar">
        {sidebarSections.map((section, sIdx) => (
          <div key={sIdx} className="sidebar-section">
            {section.label && !collapsed && (
              <div className="sidebar-section-label">{section.label}</div>
            )}

            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="nav-item-icon">
                    <Icon size={18} />
                  </div>

                  {!collapsed && (
                    <span className="nav-item-label">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span
                      className="nav-item-badge"
                      style={{ backgroundColor: item.badgeColor || '#3b82f6' }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="sidebar-active-indicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile / System Info */}
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="user-avatar">
            <span>AI</span>
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name font-semibold text-slate-200">Legal Pro User</span>
              <span className="user-role text-xs text-indigo-400">Enterprise Plan</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
