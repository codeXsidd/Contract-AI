import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Sun, Globe, Monitor, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme, ThemeMode } from '../contexts/ThemeContext'
import { useLanguage, LanguageCode } from '../contexts/LanguageContext'

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || 'Legal Pro User',
    org: 'Acme Solutions Ltd',
    notifications: true,
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
  }

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  ]

  const themes: { mode: ThemeMode; label: string; desc: string; icon: any }[] = [
    { mode: 'system', label: t('systemPreference'), desc: t('systemPreferenceDesc'), icon: Monitor },
    { mode: 'dark', label: t('darkMode'), desc: t('darkModeDesc'), icon: Moon },
    { mode: 'light', label: t('lightMode'), desc: t('lightModeDesc'), icon: Sun },
  ]

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>{t('settings')}</h1>
        <p style={{ fontSize: '14px', color: '#64748b' }}>{t('settingsDescription')}</p>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {/* Multilingual Support Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="chart-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '10px', display: 'flex' }}>
              <Globe size={18} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t('multilingualSupport')}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{t('multilingualSupportDescription')}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {languages.map((lang) => {
              const isSelected = language === lang.code
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: isSelected ? 600 : 400 }}>
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {isSelected && <Check size={16} color="#3b82f6" />}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* System Preference & Theme Mode Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="chart-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', borderRadius: '10px', padding: '8px', display: 'flex' }}>
              <Monitor size={18} color="#a855f7" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t('systemAppearance')}</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{t('systemAppearanceDescription')}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {themes.map((tItem) => {
              const Icon = tItem.icon
              const isSelected = theme === tItem.mode
              return (
                <button
                  key={tItem.mode}
                  type="button"
                  onClick={() => setTheme(tItem.mode)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.02)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: isSelected ? '#c084fc' : '#e2e8f0' }}>
                      <Icon size={16} />
                      <span>{tItem.label}</span>
                    </div>
                    {isSelected && <Check size={16} color="#c084fc" />}
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{tItem.desc}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="chart-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <User size={18} color="#3b82f6" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t('profileInfo')}</h3>
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="input-label">{t('fullName')}</label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="input-label">{t('organization')}</label>
              <input
                type="text"
                className="input"
                value={profile.org}
                onChange={e => setProfile({ ...profile, org: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? t('savingPreferences') : t('saveSettings')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
