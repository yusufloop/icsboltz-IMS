import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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

export default function ToolDetailWebScreen() {
  const params = useLocalSearchParams();
  
  // Get tool data from params or use defaults
  const toolName = (params.itemRequested as string) || (params.name as string) || 'Torque Wrench';
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-text-primary">Tool Detail</Text>
          <TouchableOpacity onPress={handleEditTool} className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
            {/* <MaterialIcons name="edit" size={24} color="#0A84FF" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="max-w-4xl mx-auto w-full px-8 py-8">
          {/* Tool Header Card */}
          <PremiumCard className="relative overflow-hidden mb-8">
            {/* Background Gradient */}
            <LinearGradient
              colors={['#0A84FF', '#409CFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="absolute inset-0"
            />
            
            {/* Content */}
            <View className="relative z-10 p-8">
              <View className="flex-row items-center">
                {/* Tool Image/Icon */}
                <View className="relative">
                  <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-2 border-white/30 overflow-hidden">
                    {currentTool.toolImage ? (
                      <Image source={currentTool.toolImage} className="w-20 h-20 rounded-full" resizeMode="contain" />
                    ) : (
                      <MaterialIcons name="build" size={48} color="white" />
                    )}
                  </View>
                  {/* Status Indicator */}
                  <View className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                    <View className="w-3 h-3 bg-white rounded-full" />
                  </View>
                </View>

                {/* Tool Info */}
                <View className="flex-1 ml-6">
                  <Text className="text-2xl font-bold text-white mb-2">{currentTool.name}</Text>
                  <Text className="text-white/80 text-lg mb-1">{currentTool.type}</Text>
                  <View className="flex-row items-center mt-3">
                    <MaterialIcons name="location-on" size={16} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 text-base ml-2">{currentTool.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          </PremiumCard>

          {/* Content */}
          <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <View className="space-y-6">
              {/* Tool Information */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="info-outline" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Tool Information</Text>
                </View>
                
                <View className="space-y-5">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Tool ID</Text>
                    <Text className="text-text-primary font-medium text-base">{currentTool.id}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Status</Text>
                    <Text className="text-text-primary font-medium text-base capitalize">{currentTool.status}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Purchase Date</Text>
                    <Text className="text-text-primary font-medium text-base">{currentTool.purchaseDate}</Text>
                  </View>
                </View>
              </PremiumCard>

              {/* Maintenance & Warranty */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="shield" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Maintenance & Warranty</Text>
                </View>
                <View className="space-y-5">
                  <View>
                    <Text className="text-text-secondary text-base mb-1">Life Cycle Rule</Text>
                    <Text className="text-text-primary font-medium text-base">{currentTool.toolLifeCycleRule}</Text>
                  </View>
                  <View>
                    <Text className="text-text-secondary text-base mb-1">Shelf Life Rule</Text>
                    <Text className="text-text-primary font-medium text-base">{currentTool.toolShelfLifeRule}</Text>
                  </View>
                  <View>
                    <Text className="text-text-secondary text-base mb-1">Warranty</Text>
                    <Text className="text-text-primary font-medium text-base">{currentTool.warrantyInfo}</Text>
                  </View>
                </View>
              </PremiumCard>
            </View>

            {/* Right Column */}
            <View className="space-y-6">
              {/* Actions */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="build-circle" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Actions</Text>
                </View>
                
                <View className="space-y-4">
                  <TouchableOpacity 
                    onPress={handleToolReplacement}
                    className="flex-row items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MaterialIcons name="swap-horiz" size={24} color="#34C759" />
                    <Text className="flex-1 ml-4 font-semibold text-text-primary text-base">Tool Replacement / Damage</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleRepairReturn}
                    className="flex-row items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MaterialIcons name="home-repair-service" size={24} color="#FF9500" />
                    <Text className="flex-1 ml-4 font-semibold text-text-primary text-base">Repair Return</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleWarranty}
                    className="flex-row items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MaterialIcons name="verified-user" size={24} color="#0A84FF" />
                    <Text className="flex-1 ml-4 font-semibold text-text-primary text-base">Warranty</Text>
                    <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
                  </TouchableOpacity>
                </View>
              </PremiumCard>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}