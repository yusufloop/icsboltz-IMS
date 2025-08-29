import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '@/lib/auth';
import { EnvironmentCheck } from '@/components/EnvironmentCheck';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [loaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Show a basic loading fallback instead of null - React Native compatible
    const { View, Text } = require('react-native');
    return (
      <View style={{ 
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff'
      }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <EnvironmentCheck>
      <AuthProvider>
        <Slot />
        <StatusBar style="auto" />
      </AuthProvider>
    </EnvironmentCheck>
  );
}