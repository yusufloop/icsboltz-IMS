import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ChevronRight, MessageCircle } from 'lucide-react-native';

interface MenuItemProps {
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

function MenuItem({ title, icon, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity 
      className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        {icon && <View className="mr-3">{icon}</View>}
        <Text className="text-base text-gray-700 font-medium">{title}</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const handleDemurrageCharge = () => {
    console.log('Navigate to Demurrage Charge');
  };

  const handleHelpSupport = () => {
    console.log('Navigate to Help & Support');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <Star size={24} color="#000" />
        <Text className="text-xl font-bold text-gray-900 ml-3">More</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Menu Items */}
        <View className="mt-6">
          <MenuItem
            title="Demurrage Charge"
            onPress={handleDemurrageCharge}
          />
          
          <View className="h-20" />
          
          <MenuItem
            title="Help & Support"
            icon={<MessageCircle size={20} color="#6b7280" />}
            onPress={handleHelpSupport}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}