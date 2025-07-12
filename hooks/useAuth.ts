import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase, handleSupabaseError, TABLES } from '@/lib/supabase';
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials, 
  EmailVerificationData,
  ForgotPasswordData,
  PasswordResetData,
  AuthResponse 
} from '@/types/auth';
import bcrypt from 'bcryptjs';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const VERIFICATION_CODE_LENGTH = 6;
const TOKEN_EXPIRY_HOURS = 24;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    session: null,
  });

  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            session: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          session: null,
        });
      }
    } catch (err) {
      console.error('Get session error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Load user error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        session,
      });
    } catch (err) {
      console.error('Load user profile error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const generateVerificationCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateToken = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  };

  const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };

  const checkAccountLockout = (user: any): boolean => {
    if (user.locked_until) {
      const lockoutTime = new Date(user.locked_until);
      const now = new Date();
      return now < lockoutTime;
    }
    return false;
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Check if user exists and get their info
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', credentials.email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if account is locked
      if (checkAccountLockout(user)) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Account is temporarily locked due to too many failed attempts');
        return { success: false, error: 'Account is temporarily locked' };
      }

      // Check if account is active
      if (!user.is_active) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Account is deactivated. Please contact support.');
        return { success: false, error: 'Account is deactivated' };
      }

      // Verify password
      const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
      
      if (!isValidPassword) {
        // Increment failed login attempts
        const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
        const updateData: any = { failed_login_attempts: newFailedAttempts };

        // Lock account if max attempts reached
        if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutTime = new Date(Date.now() + LOCKOUT_DURATION);
          updateData.locked_until = lockoutTime.toISOString();
        }

        await supabase
          .from(TABLES.USERS)
          .update(updateData)
          .eq('user_id', user.user_id);

        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if email is verified
      if (!user.email_verified) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Please verify your email before logging in');
        return { 
          success: false, 
          error: 'Email not verified',
          data: { email: user.email, requiresVerification: true }
        };
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError(handleSupabaseError(authError));
        return { success: false, error: handleSupabaseError(authError) };
      }

      // Reset failed login attempts and update last login
      await supabase
        .from(TABLES.USERS)
        .update({
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      console.log('✅ Login successful for:', credentials.email);
      return { success: true, message: 'Login successful' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Passwords do not match');
        return { success: false, error: 'Passwords do not match' };
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from(TABLES.USERS)
        .select('user_id, email_verified')
        .eq('email', credentials.email.toLowerCase())
        .single();

      if (existingUser) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        if (existingUser.email_verified) {
          setError('An account with this email already exists');
          return { success: false, error: 'Account already exists' };
        } else {
          // User exists but not verified, allow re-registration
          await supabase
            .from(TABLES.USERS)
            .delete()
            .eq('user_id', existingUser.user_id);
        }
      }

      // Hash password
      const passwordHash = await hashPassword(credentials.password);

      // Create user in database
      const { data: newUser, error: userError } = await supabase
        .from(TABLES.USERS)
        .insert({
          email: credentials.email.toLowerCase(),
          password_hash: passwordHash,
          first_name: credentials.first_name.trim(),
          last_name: credentials.last_name.trim(),
          name: `${credentials.first_name.trim()} ${credentials.last_name.trim()}`,
          email_verified: false,
          is_active: true,
          failed_login_attempts: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError(handleSupabaseError(userError));
        return { success: false, error: handleSupabaseError(userError) };
      }

      // Generate verification code and token
      const verificationCode = generateVerificationCode();
      const verificationToken = generateToken();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create email verification record
      const { error: verificationError } = await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .insert({
          user_id: newUser.user_id,
          email: credentials.email.toLowerCase(),
          verification_code: verificationCode,
          verification_token: verificationToken,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      if (verificationError) {
        console.error('Verification record error:', verificationError);
      }

      // Update user with verification token
      await supabase
        .from(TABLES.USERS)
        .update({
          email_verification_token: verificationToken,
          email_verification_expires_at: expiresAt.toISOString(),
          email_verification_attempts: 0,
        })
        .eq('user_id', newUser.user_id);

      console.log('📧 Verification email would be sent to:', credentials.email);
      console.log('🔑 Verification code:', verificationCode);

      setAuthState(prev => ({ ...prev, isLoading: false }));

      return { 
        success: true, 
        message: 'Registration successful! Please check your email for verification code.',
        data: { 
          email: credentials.email,
          verificationCode, // In production, this would be sent via email
          userId: newUser.user_id 
        }
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyEmail = useCallback(async (data: EmailVerificationData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find verification record
      const { data: verification, error: verificationError } = await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .select('*')
        .eq('email', data.email.toLowerCase())
        .eq('verification_code', data.verification_code.toUpperCase())
        .is('verified_at', null)
        .single();

      if (verificationError || !verification) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid verification code');
        return { success: false, error: 'Invalid verification code' };
      }

      // Check if code has expired
      const now = new Date();
      const expiresAt = new Date(verification.expires_at);
      if (now > expiresAt) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Verification code has expired');
        return { success: false, error: 'Verification code has expired' };
      }

      // Mark verification as completed
      await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .update({
          verified_at: new Date().toISOString(),
        })
        .eq('id', verification.id);

      // Update user as verified
      await supabase
        .from(TABLES.USERS)
        .update({
          email_verified: true,
          email_verification_token: null,
          email_verification_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', verification.user_id);

      console.log('✅ Email verified for:', data.email);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Email verified successfully!' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resendVerificationCode = useCallback(async (email: string): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find user
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('User not found');
        return { success: false, error: 'User not found' };
      }

      if (user.email_verified) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Email is already verified');
        return { success: false, error: 'Email is already verified' };
      }

      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const verificationToken = generateToken();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create new verification record
      await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .insert({
          user_id: user.user_id,
          email: email.toLowerCase(),
          verification_code: verificationCode,
          verification_token: verificationToken,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      // Update user verification info
      await supabase
        .from(TABLES.USERS)
        .update({
          email_verification_token: verificationToken,
          email_verification_expires_at: expiresAt.toISOString(),
          email_verification_attempts: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      console.log('📧 New verification code sent to:', email);
      console.log('🔑 New verification code:', verificationCode);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: true, 
        message: 'New verification code sent!',
        data: { verificationCode } // In production, this would be sent via email
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find user
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', data.email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        // Don't reveal if email exists for security
        return { 
          success: true, 
          message: 'If an account with this email exists, you will receive a password reset link.' 
        };
      }

      // Generate reset token and code
      const resetToken = generateToken();
      const resetCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create password reset record
      await supabase
        .from(TABLES.PASSWORD_RESETS)
        .insert({
          user_id: user.user_id,
          email: data.email.toLowerCase(),
          reset_token: resetToken,
          reset_code: resetCode,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      // Update user with reset token
      await supabase
        .from(TABLES.USERS)
        .update({
          password_reset_token: resetToken,
          password_reset_expires_at: expiresAt.toISOString(),
          password_reset_attempts: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      console.log('📧 Password reset email would be sent to:', data.email);
      console.log('🔑 Reset code:', resetCode);
      console.log('🔗 Reset token:', resetToken);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email!',
        data: { resetCode, resetToken } // In production, these would be sent via email
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (data: PasswordResetData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      if (data.new_password !== data.confirm_password) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Passwords do not match');
        return { success: false, error: 'Passwords do not match' };
      }

      // Find password reset record
      const { data: resetRecord, error: resetError } = await supabase
        .from(TABLES.PASSWORD_RESETS)
        .select('*')
        .eq('reset_token', data.reset_token)
        .is('used_at', null)
        .single();

      if (resetError || !resetRecord) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid or expired reset token');
        return { success: false, error: 'Invalid or expired reset token' };
      }

      // Check if token has expired
      const now = new Date();
      const expiresAt = new Date(resetRecord.expires_at);
      if (now > expiresAt) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Reset token has expired');
        return { success: false, error: 'Reset token has expired' };
      }

      // Hash new password
      const newPasswordHash = await hashPassword(data.new_password);

      // Update user password
      await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: newPasswordHash,
          password_reset_token: null,
          password_reset_expires_at: null,
          password_reset_attempts: 0,
          failed_login_attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', resetRecord.user_id);

      // Mark reset token as used
      await supabase
        .from(TABLES.PASSWORD_RESETS)
        .update({
          used_at: new Date().toISOString(),
        })
        .eq('id', resetRecord.id);

      console.log('✅ Password reset successful for user:', resetRecord.user_id);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Password reset successful!' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      console.log('👋 User logged out');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        session: null,
      });
      
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    ...authState,
    error,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };
}

// Auth Context
const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};