import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Sun, Moon, Search, User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

interface TopbarProps {
  pageTitle?: string
}

export default function Topbar({ pageTitle }: TopbarProps) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, text: 'Service Agreement expires in 7 days', type: 'warning', time: '2h ago' },
    { id: 2, text: 'New contract uploaded successfully', type: 'success', time: '4h ago' },
    { id: 3, text: 'High risk clause detected in NDA', type: 'danger', time: '1d ago' },
  ]

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {pageTitle && (
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            {pageTitle}
          </h1>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search */}
        <Link
          to="/contracts/search"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '13px',
            transition: 'all 0.2s',
          }}
        >
          <Search size={14} />
          <span>Search contracts...</span>
          <span style={{
            marginLeft: '8px',
            padding: '1px 6px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
            fontSize: '10px',
          }}>⌘K</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #0a0a0f',
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: 'absolute', top: '46px', right: 0,
              width: '320px',
              background: '#13131f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '12px',
              zIndex: 200,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              <div style={{
                fontSize: '13px', fontWeight: 600, color: '#94a3b8',
                marginBottom: '10px', padding: '0 4px',
              }}>
                Notifications
              </div>
              {notifications.map((n) => (
                <div key={n.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px', borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  marginBottom: '4px',
                }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: n.type === 'warning' ? '#f59e0b' : n.type === 'danger' ? '#ef4444' : '#10b981',
                    marginTop: '5px', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 700, color: 'white',
            }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.2 }}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </div>
              <div style={{ fontSize: '10px', color: '#475569' }}>Pro Plan</div>
            </div>
            <ChevronDown size={14} color="#475569" />
          </button>

          {userMenuOpen && (
            <div style={{
              position: 'absolute', top: '46px', right: 0,
              width: '200px',
              background: '#13131f',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '8px',
              zIndex: 200,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {[
                { icon: User, label: 'Profile', path: '/settings' },
                { icon: Settings, label: 'Settings', path: '/settings' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px',
                    color: '#94a3b8', textDecoration: 'none',
                    fontSize: '13px', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0' }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8' }}
                >
                  <item.icon size={15} />
                  {item.label}
                </Link>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <button
                onClick={signOut}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '8px',
                  color: '#f87171', background: 'transparent',
                  border: 'none', fontSize: '13px', width: '100%',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(userMenuOpen || notifOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100 }}
          onClick={() => { setUserMenuOpen(false); setNotifOpen(false) }}
        />
      )}
    </header>
  )
}
