import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ChevronRight, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MoreScreen() {
  const handleDemurrageCharge = () => {
    router.push('/(tabs)/user');
  };

  const handleHelpSupport = () => {
    // Navigate to help & support
    console.log('Navigate to Help & Support');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-gray-50">
          <Star size={24} color="#000" />
          <Text className="text-xl font-bold text-gray-900 ml-3">More</Text>
        </View>

        {/* Content */}
        <View className="flex-1 pt-5">
          {/* Demurrage Charge Section */}
          <View className="bg-white mx-5 mb-5 rounded-3xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 bg-white min-h-14" onPress={handleDemurrageCharge}>
              <Text className="text-base text-black font-normal">Demurrage Charge</Text>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>

          {/* Help & Support Section */}
          <View className="bg-white mx-5 mb-5 rounded-3xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between px-5 py-4 bg-white min-h-14" onPress={handleHelpSupport}>
              <View className="flex-row items-center flex-1">
                <MessageCircle size={20} color="#8E8E93" className="mr-3" />
                <Text className="text-base text-black font-normal">Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}