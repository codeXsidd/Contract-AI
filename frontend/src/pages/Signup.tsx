import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Scale, ArrowRight, Globe, Building } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const { session, signUp, signInWithGoogle, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', org: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!loading && session) return <Navigate to="/dashboard" replace />

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)
    const { error } = await signUp(form.email, form.password, form.name)
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0f',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}
        >
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>✉️</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>
            Check your email
          </h2>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>
            We've sent a verification link to <strong style={{ color: '#3b82f6' }}>{form.email}</strong>.
            Click the link to activate your account.
          </p>
          <Link to="/login" className="btn btn-secondary" style={{ marginTop: '24px', display: 'inline-flex' }}>
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.15), transparent)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '460px', position: 'relative' }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          }}>
            <Scale size={20} color="white" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: '20px', fontWeight: 800,
            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Contract AI
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '24px' }}>
            Start your 14-day free trial. No credit card required.
          </p>

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
              transition: 'all 0.2s', marginBottom: '20px',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <Globe size={18} /> Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: '#334155' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px', color: '#f87171', fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe" className="input" style={{ paddingLeft: '38px' }} />
                </div>
              </div>
              <div>
                <label className="input-label">Organization</label>
                <div style={{ position: 'relative' }}>
                  <Building size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input name="org" type="text" value={form.org} onChange={handleChange} placeholder="Acme Corp" className="input" style={{ paddingLeft: '38px' }} />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="name@company.com" className="input" style={{ paddingLeft: '38px' }} />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className="input" style={{ paddingLeft: '38px', paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: '0' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
              By creating an account, you agree to our{' '}
              <span style={{ color: '#3b82f6' }}>Terms of Service</span> and{' '}
              <span style={{ color: '#3b82f6' }}>Privacy Policy</span>.
            </p>

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '15px', fontWeight: 600 }}>
              {isLoading ? 'Creating account...' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#475569' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
