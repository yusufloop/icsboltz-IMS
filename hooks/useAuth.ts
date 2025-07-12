import { useState, useCallback } from 'react';
import { User, AuthState, LoginCredentials, RegisterCredentials, ResetPasswordData, VerificationData } from '@/types/auth';

// Simulated user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
  },
];

// Simulated pending verifications
const pendingVerifications: { [email: string]: string } = {};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  });

  const [error, setError] = useState<string | null>(null);

  const simulateDelay = (ms: number = 1500) => 
    new Promise(resolve => setTimeout(resolve, ms));

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await simulateDelay();

      // Simulate authentication
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Simulate password check (in real app, this would be hashed)
      if (credentials.password !== 'password123') {
        throw new Error('Invalid password');
      }

      if (!user.isEmailVerified) {
        throw new Error('Please verify your email before logging in');
      }

      console.log('🔐 Login successful for:', credentials.email);
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await simulateDelay();

      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === credentials.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        isEmailVerified: false,
        createdAt: new Date(),
      };

      mockUsers.push(newUser);

      // Generate verification code
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      pendingVerifications[credentials.email] = verificationCode;

      console.log('📧 Verification email sent to:', credentials.email);
      console.log('🔑 Verification code:', verificationCode);

      setAuthState(prev => ({ ...prev, isLoading: false }));

      return { 
        success: true, 
        message: 'Registration successful! Please check your email for verification code.',
        email: credentials.email 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyEmail = useCallback(async (data: VerificationData) => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await simulateDelay(1000);

      const expectedCode = pendingVerifications[data.email];
      if (!expectedCode) {
        throw new Error('No verification code found for this email');
      }

      if (data.code !== expectedCode) {
        throw new Error('Invalid verification code');
      }

      // Update user verification status
      const user = mockUsers.find(u => u.email === data.email);
      if (user) {
        user.isEmailVerified = true;
        delete pendingVerifications[data.email];
        
        console.log('✅ Email verified for:', data.email);
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      }

      return { success: true, message: 'Email verified successfully!' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const forgotPassword = useCallback(async (data: ResetPasswordData) => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await simulateDelay();

      const user = mockUsers.find(u => u.email === data.email);
      if (!user) {
        throw new Error('No account found with this email address');
      }

      console.log('📧 Password reset email sent to:', data.email);
      console.log('🔗 Reset link: https://yourapp.com/reset-password?token=abc123');

      setAuthState(prev => ({ ...prev, isLoading: false }));

      return { 
        success: true, 
        message: 'Password reset link sent to your email!' 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    await simulateDelay(500);
    
    console.log('👋 User logged out');
    
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    
    setError(null);
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
    forgotPassword,
    logout,
    clearError,
  };
}