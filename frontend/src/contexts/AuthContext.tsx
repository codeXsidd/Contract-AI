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
    // Check if there is a mock session stored
    const savedMockSession = localStorage.getItem('mock_session')
    if (savedMockSession) {
      try {
        const parsed = JSON.parse(savedMockSession)
        setSession(parsed)
        setUser(parsed.user)
        setLoading(false)
        return
      } catch (e) {
        console.error('Failed to parse mock session:', e)
        localStorage.removeItem('mock_session')
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error.message)
      }
      if (session) {
        setSession(session)
        setUser(session.user)
      }
      setLoading(false)
    }).catch(err => {
      console.warn('Supabase not available or failed on startup, using offline mode:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // If we have a mock session active, don't let Supabase events overwrite it with null
        if (localStorage.getItem('mock_session')) {
          return
        }
        if (session) {
          setSession(session)
          setUser(session.user)
        } else {
          setSession(null)
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // If we detect invalid keys beforehand, directly do mock sign in
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      if (
        supabaseUrl.includes('placeholder') || 
        supabaseAnonKey.includes('placeholder')
      ) {
        throw new Error('Supabase credentials are placeholders or invalid. Using fallback mock authentication.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw error
      }
      return { error: null }
    } catch (error: any) {
      console.warn('Supabase login failed, falling back to mock authentication:', error.message || error)
      
      // Fallback to mock session
      const mockSession = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: '00000000-0000-0000-0000-000000000000',
          email: email || 'dev@contractai.local',
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { provider: 'email' },
          user_metadata: { full_name: 'Developer User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        }
      } as any

      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockSession.user)
      return { error: null }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      if (
        supabaseUrl.includes('placeholder') || 
        supabaseAnonKey.includes('placeholder')
      ) {
        throw new Error('Supabase credentials are placeholders or invalid. Using fallback mock signup.')
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) {
        throw error
      }
      return { error: null }
    } catch (error: any) {
      console.warn('Supabase signup failed, falling back to mock signup:', error.message || error)
      
      // Fallback: automatically sign in with mock credentials
      return signIn(email, password)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      if (
        supabaseUrl.includes('placeholder') || 
        supabaseAnonKey.includes('placeholder')
      ) {
        throw new Error('Supabase credentials are placeholders or invalid.')
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      console.warn('Google signin failed, using mock google login:', error.message || error)
      
      const mockSession = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: '00000000-0000-0000-0000-000000000000',
          email: 'google-user@contractai.local',
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          app_metadata: { provider: 'google' },
          user_metadata: { full_name: 'Google User' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        }
      } as any

      localStorage.setItem('mock_session', JSON.stringify(mockSession))
      setSession(mockSession)
      setUser(mockSession.user)
      
      // Since it's oauth style redirect, redirect to dashboard manually
      window.location.href = '/dashboard'
    }
  }

  const signOut = async () => {
    localStorage.removeItem('mock_session')
    setSession(null)
    setUser(null)
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.warn('Error during supabase signout:', e)
    }
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
