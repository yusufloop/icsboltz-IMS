import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RequesterDashboard from '@/components/dashboard/RequesterDashboard';

export default function RequesterDashboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <RequesterDashboard />
      </View>
    </SafeAreaView>
  );
}
