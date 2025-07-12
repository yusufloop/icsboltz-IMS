import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function AuthScreen() {
  const navigateToTabs = () => {
    router.replace('/(tabs)');
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
          Login Screen
        </Text>
        
        <TouchableOpacity
          onPress={navigateToTabs}
          style={{
            backgroundColor: '#0A84FF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            marginBottom: 16
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            Go to Dashboard (Skip Auth)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToRegister}
          style={{
            backgroundColor: '#F2F2F7',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#1C1C1E', fontWeight: '600' }}>
            Go to Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}