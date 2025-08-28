import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { LinearGradient } from 'expo-linear-gradient';

// Sample tool data
const currentTool = {
  id: 'TL-DWT-088K',
  name: 'DeWalt 20V MAX Cordless Drill',
  type: 'Power Tool',
  status: 'active',
  location: 'Warehouse A, Shelf 3-B',
  purchaseDate: '15 January 2023',
  toolLifeCycleRule: 'Quarterly Maintenance',
  toolShelfLifeRule: '5 Years from Purchase',
  warrantyInfo: '2-Year Limited Warranty (Expires: 14 Jan 2025)',
  toolImage: undefined, // Using an icon for now
};

export default function ToolDetailScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleEditTool = () => {
    // TODO: Navigate to edit tool page
    console.log('Edit tool');
  };

  const handleToolReplacement = () => {
    router.push('/tool-replacement');
  };

  const handleRepairReturn = () => {
    router.push('/repair-return');
  };

  const handleWarranty = () => {
    router.push('/apply-warranty');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-text-primary">Tool Detail</Text>
          <TouchableOpacity onPress={handleEditTool} className="p-2 -mr-2">
            <MaterialIcons name="edit" size={24} color="#0A84FF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Tool Header Card */}
        <View className="px-6 pt-6">
          <PremiumCard className="relative overflow-hidden">
            {/* Background Gradient */}
            <LinearGradient
              colors={['#0A84FF', '#409CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0"
            />
            
            {/* Content */}
            <View className="relative z-10 p-6">
              <View className="flex-row items-center">
                {/* Tool Image/Icon */}
                <View className="relative">
                  <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center border-2 border-white/30">
                    {currentTool.toolImage ? (
                      <Image source={{ uri: currentTool.toolImage }} className="w-full h-full rounded-full" />
                    ) : (
                      <MaterialIcons name="build" size={40} color="white" />
                    )}
                  </View>
                  {/* Status Indicator */}
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                    <View className="w-2 h-2 bg-white rounded-full" />
                  </View>
                </View>

                {/* Tool Info */}
                <View className="flex-1 ml-4">
                  <Text className="text-xl font-bold text-white mb-1">{currentTool.name}</Text>
                  <Text className="text-white/80 text-base mb-1">{currentTool.type}</Text>
                  <View className="flex-row items-center mt-2">
                    <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 text-sm ml-1">{currentTool.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          </PremiumCard>
        </View>

        {/* Page Content */}
        <View className="px-6 mt-6 pb-8">
          <View className="space-y-6">
            
            {/* Tool Information */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="info-outline" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Tool Information</Text>
              </View>
              
              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Tool ID</Text>
                  <Text className="text-text-primary font-medium">{currentTool.id}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Status</Text>
                  <Text className="text-text-primary font-medium capitalize">{currentTool.status}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Purchase Date</Text>
                  <Text className="text-text-primary font-medium">{currentTool.purchaseDate}</Text>
                </View>
              </View>
            </PremiumCard>

            {/* Maintenance & Warranty */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="shield" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Maintenance & Warranty</Text>
              </View>
              <View className="space-y-4">
                <View>
                  <Text className="text-text-secondary mb-1">Life Cycle Rule</Text>
                  <Text className="text-text-primary font-medium">{currentTool.toolLifeCycleRule}</Text>
                </View>
                <View>
                  <Text className="text-text-secondary mb-1">Shelf Life Rule</Text>
                  <Text className="text-text-primary font-medium">{currentTool.toolShelfLifeRule}</Text>
                </View>
                <View>
                  <Text className="text-text-secondary mb-1">Warranty</Text>
                  <Text className="text-text-primary font-medium">{currentTool.warrantyInfo}</Text>
                </View>
              </View>
            </PremiumCard>

            {/* Actions */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="build-circle" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Actions</Text>
              </View>
              
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={handleToolReplacement}
                  className="flex-row items-center p-4 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="swap-horiz" size={20} color="#34C759" />
                  <Text className="flex-1 ml-3 font-semibold text-text-primary">Tool Replacement / Damage</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleRepairReturn}
                  className="flex-row items-center p-4 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="home-repair-service" size={20} color="#FF9500" />
                  <Text className="flex-1 ml-3 font-semibold text-text-primary">Repair Return</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleWarranty}
                  className="flex-row items-center p-4 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="verified-user" size={20} color="#0A84FF" />
                  <Text className="flex-1 ml-3 font-semibold text-text-primary">Warranty</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
              </View>
            </PremiumCard>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}