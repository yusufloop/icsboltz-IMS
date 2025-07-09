import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { useAuth } from '@/hooks/useAuth';

interface EmailVerificationFormProps {
  email: string;
  onNavigateToLogin: () => void;
}

export function EmailVerificationForm({ email, onNavigateToLogin }: EmailVerificationFormProps) {
  const [code, setCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  
  const { verifyEmail, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!code.trim()) {
      errors.code = 'Verification code is required';
    } else if (code.length !== 6) {
      errors.code = 'Verification code must be 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyEmail = async () => {
    if (!validateForm()) return;
    
    await verifyEmail({ email, code: code.trim().toUpperCase() });
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
        <View style={styles.iconContainer}>
          <Mail size={48} color="#3b82f6" />
        </View>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <View style={styles.form}>
        <AuthInput
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          placeholder="Enter 6-digit code"
          autoCapitalize="characters"
          maxLength={6}
          error={fieldErrors.code}
        />

        <AuthButton
          title="Verify Email"
          onPress={handleVerifyEmail}
          loading={isLoading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Resend</Text>
          </TouchableOpacity>
        </View>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  email: {
    fontWeight: '600',
    color: '#3b82f6',
    fontFamily: 'Inter-SemiBold',
  },
  form: {
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#6b7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});