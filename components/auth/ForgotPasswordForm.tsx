import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthButton } from './AuthButton';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';

interface ForgotPasswordFormProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordForm({ onNavigateToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { forgotPassword, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;
    
    const result = await forgotPassword({ email: email.trim() });
    
    if (result.success) {
      setSuccessMessage(result.message || '');
    }
  };

  return (
    <AuthCard>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onNavigateToLogin}
      >
        <ArrowLeft size={20} color="#6b7280" />
        <Text style={styles.backText}>Back to login</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <View style={styles.form}>
        <AuthInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
        />

        <AuthButton
          title="Send Reset Link"
          onPress={handleForgotPassword}
          loading={isLoading}
        />

        {successMessage && (
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.loginButtonText}>Return to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  form: {
    gap: 4,
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});