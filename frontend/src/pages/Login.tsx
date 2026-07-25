import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Scale, ArrowRight, Globe } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { session, signIn, signInWithGoogle, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!loading && session) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setIsLoading(false)
  }

  const features = [
    { icon: '🔍', text: 'AI-powered clause extraction & analysis' },
    { icon: '⚡', text: 'Real-time risk scoring & red flag detection' },
    { icon: '🤝', text: 'AI negotiation copilot & recommendations' },
    { icon: '🛡️', text: 'GDPR, HIPAA, ISO 27001 compliance checks' },
    { icon: '📊', text: 'Complete lifecycle & deadline management' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left panel */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0f2a 0%, #1a0a2e 50%, #0a1628 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          top: '-100px', left: '-100px', borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          bottom: '-50px', right: '-50px', borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '60px' }}
        >
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(59,130,246,0.4)',
          }}>
            <Scale size={26} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '24px', fontWeight: 800,
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Contract AI
            </div>
            <div style={{ fontSize: '12px', color: '#475569', letterSpacing: '0.5px' }}>
              Intelligence Platform
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 style={{
            fontSize: '36px', fontWeight: 800, lineHeight: 1.25,
            color: '#f1f5f9', marginBottom: '16px',
          }}>
            AI-Powered Contract Intelligence
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7, marginBottom: '40px' }}>
            Transform your contract management with enterprise-grade AI. Analyze, negotiate, and monitor contracts with unprecedented precision.
          </p>
        </motion.div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{f.icon}</span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>{f.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: '12px', marginTop: '40px' }}
        >
          {['Enterprise-Grade', 'SOC 2', 'GDPR Ready'].map(badge => (
            <span key={badge} style={{
              padding: '6px 14px',
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: '100px',
              fontSize: '11px',
              color: '#60a5fa',
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}>
              ✓ {badge}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px',
        background: '#0a0a0f',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '14px', color: '#475569' }}>
              Sign in to your Contract AI account
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={signInWithGoogle}
            style={{
              width: '100%', padding: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              color: '#e2e8f0', fontSize: '14px', fontWeight: 500,
              transition: 'all 0.2s', marginBottom: '24px',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <Globe size={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: '#334155' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                color: '#f87171',
                fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <div>
              <label className="input-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#475569', display: 'flex', padding: '0',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600 }}
            >
              {isLoading ? (
                <span style={{ opacity: 0.7 }}>Signing in...</span>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#475569' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
