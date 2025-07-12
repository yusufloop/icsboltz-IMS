import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

// Types for authentication
export interface AuthUser {
  id: string
  email: string
  name?: string
  first_name?: string
  last_name?: string
  email_verified: boolean
  is_active: boolean
  created_at: string
  last_login_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
}

export interface VerificationData {
  email: string
  code: string
}

export interface ResetPasswordData {
  email: string
  token: string
  newPassword: string
}

export interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string; email?: string }>
  verifyEmail: (data: VerificationData) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; error?: string }>
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  clearError: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth
export function useAuth(): AuthContextType {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      setUser({
        id: data.user_id,
        email: data.email,
        name: data.name,
        first_name: data.first_name,
        last_name: data.last_name,
        email_verified: data.email_verified,
        is_active: data.is_active,
        created_at: data.created_at,
        last_login_at: data.last_login_at,
      })
    } catch (err) {
      console.error('Error fetching user profile:', err)
      setError('Failed to load user profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      // First check if user exists and is active
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, email_verified, is_active, failed_login_attempts, locked_until')
        .eq('email', credentials.email)
        .single()

      if (userError || !userData) {
        throw new Error('Invalid email or password')
      }

      // Check if account is locked
      if (userData.locked_until && new Date(userData.locked_until) > new Date()) {
        throw new Error('Account is temporarily locked. Please try again later.')
      }

      // Check if account is active
      if (!userData.is_active) {
        throw new Error('Account is deactivated. Please contact support.')
      }

      // Attempt login with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        // Increment failed login attempts
        await supabase
          .from('users')
          .update({ 
            failed_login_attempts: (userData.failed_login_attempts || 0) + 1,
            locked_until: userData.failed_login_attempts >= 4 
              ? new Date(Date.now() + 15 * 60 * 1000).toISOString() // Lock for 15 minutes
              : null
          })
          .eq('user_id', userData.user_id)

        throw new Error('Invalid email or password')
      }

      // Check if email is verified
      if (!userData.email_verified) {
        // Sign out if not verified
        await supabase.auth.signOut()
        setIsLoading(false)
        return { success: false, needsVerification: true, error: 'Please verify your email before logging in' }
      }

      // Update last login and reset failed attempts
      await supabase
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          failed_login_attempts: 0,
          locked_until: null
        })
        .eq('user_id', userData.user_id)

      setIsLoading(false)
      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', credentials.email)
        .single()

      if (existingUser) {
        throw new Error('User already exists with this email')
      }

      // Create user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Insert user into our users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            user_id: data.user.id,
            email: credentials.email,
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            name: `${credentials.first_name} ${credentials.last_name}`,
            email_verified: false,
            is_active: true,
          })

        if (insertError) throw insertError

        // Generate and send verification code
        await generateVerificationCode(credentials.email, data.user.id)
      }

      setIsLoading(false)
      return { 
        success: true, 
        email: credentials.email,
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Generate verification code
  const generateVerificationCode = async (email: string, userId: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  // Save to database
  const { error } = await supabase
    .from('email_verifications')
    .insert({
      user_id: userId,
      email,
      verification_code: code,
      verification_token: token,
      expires_at: expiresAt.toISOString(),
    })

  if (error) throw error

  // Send email using your chosen service
  const emailResult = await emailService.sendVerificationEmail(email, code)
  
  if (!emailResult.success) {
    throw new Error('Failed to send verification email')
  }

  return { code, token }
}

  // Verify email function
  const verifyEmail = async (data: VerificationData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Find verification record
      const { data: verification, error: verificationError } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('email', data.email)
        .eq('verification_code', data.code)
        .is('verified_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (verificationError || !verification) {
        throw new Error('Invalid or expired verification code')
      }

      // Update verification record
      await supabase
        .from('email_verifications')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', verification.id)

      // Update user as verified
      await supabase
        .from('users')
        .update({ email_verified: true })
        .eq('user_id', verification.user_id)

      setIsLoading(false)
      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', email)
        .single()

      if (userError || !userData) {
        throw new Error('No account found with this email address')
      }

      // Generate reset token and code
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      // Insert password reset record
      const { error } = await supabase
        .from('password_resets')
        .insert({
          user_id: userData.user_id,
          email,
          reset_token: resetToken,
          reset_code: resetCode,
          expires_at: expiresAt.toISOString(),
        })

      if (error) throw error

      // In a real app, you would send the email here
      console.log(`📧 Password reset code for ${email}: ${resetCode}`)

      setIsLoading(false)
      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Reset password function
  const resetPassword = async (data: ResetPasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Find valid reset token
      const { data: resetData, error: resetError } = await supabase
        .from('password_resets')
        .select('*')
        .eq('reset_token', data.token)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (resetError || !resetData) {
        throw new Error('Invalid or expired reset token')
      }

      // Update password with Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (updateError) throw updateError

      // Mark reset token as used
      await supabase
        .from('password_resets')
        .update({ used_at: new Date().toISOString() })
        .eq('id', resetData.id)

      setIsLoading(false)
      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Resend verification function
  const resendVerification = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Find user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id')
        .eq('email', email)
        .single()

      if (userError || !userData) {
        throw new Error('User not found')
      }

      // Generate new verification code
      await generateVerificationCode(email, userData.user_id)

      setIsLoading(false)
      return { success: true }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend verification'
      setError(errorMessage)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setError(null)
    setIsLoading(false)
  }

  // Clear error function
  const clearError = () => {
    setError(null)
  }

  return {
    user,
    session,
    isLoading,
    error,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
    logout,
    clearError,
  }
}

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}