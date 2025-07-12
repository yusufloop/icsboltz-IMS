import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-semibold text-gray-900">More</Text>
        <Text className="text-gray-600 mt-2">More options content</Text>
      </View>
    </SafeAreaView>
  );
}