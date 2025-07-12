import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 bg-white">
          <Text className="text-2xl font-bold text-gray-900">More</Text>
        </View>

        {/* About Section */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 px-6 mb-3">About</Text>
          <View className="bg-white">
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">App Version</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">What's New</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4">
              <Text className="text-base text-gray-900">Rate App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 px-6 mb-3">Settings</Text>
          <View className="bg-white">
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Account Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4">
              <Text className="text-base text-gray-900">Language</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-gray-900 px-6 mb-3">Support</Text>
          <View className="bg-white">
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4">
              <Text className="text-base text-gray-900">Report a Problem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View className="mt-6 mb-8">
          <Text className="text-lg font-bold text-gray-900 px-6 mb-3">Legal</Text>
          <View className="bg-white">
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4 border-b border-gray-200">
              <Text className="text-base text-gray-900">Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-4">
              <Text className="text-base text-gray-900">Licenses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}