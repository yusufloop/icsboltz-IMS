import React, { useState } from 'react';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { EmailVerificationForm } from '@/components/auth/EmailVerificationForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';

type AuthScreen = 'login' | 'register' | 'forgotPassword' | 'verification';

export default function AuthIndex() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');
  const navigateToForgotPassword = () => setCurrentScreen('forgotPassword');
  const navigateToVerification = (email: string) => {
    setVerificationEmail(email);
    setCurrentScreen('verification');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginForm
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
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
          />
        );
      case 'verification':
        return (
          <EmailVerificationForm
            email={verificationEmail}
            onNavigateToLogin={navigateToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onNavigateToRegister={navigateToRegister}
            onNavigateToForgotPassword={navigateToForgotPassword}
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