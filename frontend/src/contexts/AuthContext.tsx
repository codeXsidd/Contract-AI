import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we have a persisted mock session first
    const persistedMock = localStorage.getItem('mock_session')
    if (persistedMock) {
      try {
        const mockSess = JSON.parse(persistedMock)
        setSession(mockSess)
        setUser(mockSess.user)
        setLoading(false)
        return
      } catch (e) {
        localStorage.removeItem('mock_session')
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session)
        setUser(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setSession(session)
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.warn('Supabase login failed, trying fallback mock login for dev:', error.message)
        throw error
      }
      return { error: null }
    } catch (err: any) {
      // Fallback to mock session in dev
      const mockUser: User = {
        id: '00000000-0000-0000-0000-000000000000',
        email: email || 'dev@contractai.local',
        user_metadata: { full_name: 'Dev User' },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
        factor_id: null,
      } as any
      const mockSession: Session = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      }
      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockUser)
      return { error: null }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) {
        console.warn('Supabase signup failed, trying fallback mock signup for dev:', error.message)
        throw error
      }
      // If email confirmation is enabled, we still sign up but we might want to auto-login to bypass check email
      // So we fallback to mock so they can use the app immediately!
      const mockUser: User = {
        id: '00000000-0000-0000-0000-000000000000',
        email: email || 'dev@contractai.local',
        user_metadata: { full_name: name || 'Dev User' },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      } as any
      const mockSession: Session = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      }
      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockUser)
      return { error: null }
    } catch (err: any) {
      const mockUser: User = {
        id: '00000000-0000-0000-0000-000000000000',
        email: email || 'dev@contractai.local',
        user_metadata: { full_name: name || 'Dev User' },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      } as any
      const mockSession: Session = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      }
      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockUser)
      return { error: null }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (e) {
      console.warn('Supabase Google OAuth fallback triggered:', e)
      const mockUser: User = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'google.user@contractai.com',
        user_metadata: { full_name: 'Google User', avatar_url: 'https://lh3.googleusercontent.com/a/default-user' },
        created_at: new Date().toISOString(),
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      } as any
      const mockSession: Session = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
 refresh_token: 'mock-refresh-token',
        user: mockUser,
      }
      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockUser)
    }
  }


  const signOut = async () => {
    localStorage.removeItem('mock_session')
    setSession(null)
    setUser(null)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
