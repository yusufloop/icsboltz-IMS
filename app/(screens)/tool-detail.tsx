import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { LinearGradient } from 'expo-linear-gradient';

// Function to determine tool type based on name
const getToolType = (name: string) => {
  if (name.toLowerCase().includes('torque')) return 'Precision Tool';
  if (name.toLowerCase().includes('wrench')) return 'Hand Tool';
  if (name.toLowerCase().includes('genset') || name.toLowerCase().includes('power')) return 'Power Equipment';
  return 'General Tool';
};

// Function to get tool image based on name
const getToolImage = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('torque')) return require('@/assets/images/torque-wrench.jpg');
  if (lowerName.includes('box') || lowerName.includes('specialized')) return require('@/assets/images/special-box-tool.jpg');
  if (lowerName.includes('genset') || lowerName.includes('power')) return require('@/assets/images/genset.jpeg');
  return null;
};

// Function to generate tool ID based on name with randomization
const generateToolId = (name: string, id: string) => {
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const paddedRandom = randomNum.toString().padStart(3, '0');
  
  if (name.toLowerCase().includes('torque')) return `TL-TRQ-${paddedRandom}K`;
  if (name.toLowerCase().includes('aviation')) return `TL-AWS-${paddedRandom}K`;
  if (name.toLowerCase().includes('genset')) return `TL-PWG-${paddedRandom}K`;
  return `TL-GEN-${paddedRandom}K`;
};

// Function to generate random purchase date
const generateRandomPurchaseDate = () => {
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date(2024, 11, 31);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTime);
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `${randomDate.getDate()} ${months[randomDate.getMonth()]} ${randomDate.getFullYear()}`;
};

// Function to generate random maintenance schedule
const generateRandomMaintenance = () => {
  const schedules = [
    'Monthly Maintenance',
    'Quarterly Maintenance', 
    'Semi-Annual Maintenance',
    'Annual Maintenance',
    'Bi-Annual Maintenance',
    'Weekly Maintenance'
  ];
  return schedules[Math.floor(Math.random() * schedules.length)];
};

// Function to generate random shelf life
const generateRandomShelfLife = () => {
  const years = [3, 5, 7, 10, 15];
  const selectedYears = years[Math.floor(Math.random() * years.length)];
  return `${selectedYears} Years from Purchase`;
};

// Function to generate random warranty
const generateRandomWarranty = () => {
  const warranties = [
    '1-Year Limited Warranty',
    '2-Year Limited Warranty',
    '3-Year Limited Warranty',
    '5-Year Extended Warranty',
    '1-Year Full Coverage Warranty',
    '2-Year Comprehensive Warranty'
  ];
  const warranty = warranties[Math.floor(Math.random() * warranties.length)];
  
  // Generate random expiry date
  const currentYear = new Date().getFullYear();
  const expiryYear = currentYear + Math.floor(Math.random() * 3) + 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  const randomDay = Math.floor(Math.random() * 28) + 1;
  
  return `${warranty} (Expires: ${randomDay} ${randomMonth} ${expiryYear})`;
};

export default function ToolDetailScreen() {
  const params = useLocalSearchParams();
  
  // Get tool data from params or use defaults
  const toolName = (params.itemRequested as string) || 'Torque Wrench';
  const toolId = (params.id as string) || '1';
  
  const currentTool = {
    id: generateToolId(toolName, toolId),
    name: toolName,
    type: getToolType(toolName),
    status: 'active',
    location: 'Warehouse A, Shelf 3-B',
    purchaseDate: generateRandomPurchaseDate(),
    toolLifeCycleRule: generateRandomMaintenance(),
    toolShelfLifeRule: generateRandomShelfLife(),
    warrantyInfo: generateRandomWarranty(),
    toolImage: getToolImage(toolName),
  };
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
                  <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 overflow-hidden">
                    {currentTool.toolImage ? (
                      <Image source={currentTool.toolImage} className="w-16 h-16 rounded-full" resizeMode="contain" />
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
        <View className="px-6 mt-8 pb-8">
          <View className="space-y-8">
            
            {/* Tool Information */}
            <PremiumCard className="mb-6">
              <View className="flex-row items-center mb-6">
                <MaterialIcons name="info-outline" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Tool Information</Text>
              </View>
              
              <View className="space-y-5">
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
            <PremiumCard className="mb-6">
              <View className="flex-row items-center mb-6">
                <MaterialIcons name="shield" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Maintenance & Warranty</Text>
              </View>
              <View className="space-y-5">
                <View>
                  <Text className="text-text-secondary mb-2">Life Cycle Rule</Text>
                  <Text className="text-text-primary font-medium">{currentTool.toolLifeCycleRule}</Text>
                </View>
                <View>
                  <Text className="text-text-secondary mb-2">Shelf Life Rule</Text>
                  <Text className="text-text-primary font-medium">{currentTool.toolShelfLifeRule}</Text>
                </View>
                <View>
                  <Text className="text-text-secondary mb-2">Warranty</Text>
                  <Text className="text-text-primary font-medium">{currentTool.warrantyInfo}</Text>
                </View>
              </View>
            </PremiumCard>

            {/* Actions */}
            <PremiumCard className="p-6">
              <View className="flex-row items-center mb-6">
                <MaterialIcons name="build-circle" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Actions</Text>
              </View>
              
              <View className="space-y-4">
                <TouchableOpacity 
                  onPress={handleToolReplacement}
                  className="flex-row items-center p-5 mb-5 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="swap-horiz" size={20} color="#34C759" />
                  <Text className="flex-1 ml-4 font-semibold text-text-primary">Tool Replacement / Damage</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleRepairReturn}
                  className="flex-row items-center p-5 mb-5 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="home-repair-service" size={20} color="#FF9500" />
                  <Text className="flex-1 ml-4 font-semibold text-text-primary">Repair Return</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#C7C7CC" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleWarranty}
                  className="flex-row items-center p-5 mb-5 bg-gray-100 rounded-lg"
                >
                  <MaterialIcons name="verified-user" size={20} color="#0A84FF" />
                  <Text className="flex-1 ml-4 font-semibold text-text-primary">Warranty</Text>
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
