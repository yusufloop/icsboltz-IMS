import React, { useState } from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { EmailVerificationForm } from '@/components/auth/EmailVerificationForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

type AuthScreen = 'login' | 'register' | 'forgotPassword' | 'verification' | 'passwordReset';

export default function AuthIndex() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');
  const navigateToForgotPassword = () => setCurrentScreen('forgotPassword');
  const navigateToVerification = (email: string) => {
    setVerificationEmail(email);
    setCurrentScreen('verification');
  };
  const navigateToPasswordReset = (token: string) => {
    setResetToken(token);
    setCurrentScreen('passwordReset');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginForm
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
            onNavigateToVerification={navigateToVerification}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onNavigateToLogin={navigateToLogin}
            onNavigateToVerification={navigateToVerification}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            onNavigateToLogin={navigateToLogin}
            onNavigateToPasswordReset={navigateToPasswordReset}
          />
        );
      case 'verification':
        return (
          <EmailVerificationForm
            email={verificationEmail}
            onNavigateToLogin={navigateToLogin}
          />
        );
      case 'passwordReset':
        return (
          <PasswordResetForm
            resetToken={resetToken}
            onNavigateToLogin={navigateToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
            onNavigateToVerification={navigateToVerification}
          />
        );
    }
  };

  return (
    <AuthContainer>
      {renderCurrentScreen()}
    </AuthContainer>
  );
}