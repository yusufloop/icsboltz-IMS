import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Platform } from 'react-native';

interface EnvironmentCheckProps {
  children: React.ReactNode;
}

export function EnvironmentCheck({ children }: EnvironmentCheckProps) {
  const requiredEnvVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    'EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorCard}>
            <Text style={styles.title}>
              Environment Configuration Error
            </Text>
            <Text style={styles.message}>
              Missing required environment variables:
            </Text>
            <View style={styles.variableList}>
              {missingVars.map(varName => (
                <View key={varName} style={styles.variableItem}>
                  <Text style={styles.variableText}>
                    {varName}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.instruction}>
              Please check your eas.json configuration and ensure all required environment variables are set for the {Platform.OS} build.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 20,
    maxWidth: 600,
    width: '100%',
  },
  title: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
  variableList: {
    marginBottom: 16,
  },
  variableItem: {
    backgroundColor: '#fecaca',
    padding: 8,
    marginVertical: 2,
    borderRadius: 4,
  },
  variableText: {
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    textAlign: 'center',
  },
  instruction: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
});