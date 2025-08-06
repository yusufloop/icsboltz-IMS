import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { LinearGradient } from 'expo-linear-gradient';

// Sample English user data
const currentUser = {
  id: 'USR001',
  name: 'Ahmad Zulkifli bin Rahman',
  email: 'ahmad.zulkifli@icsboltz.com.my',
  phoneNumber: '+60 12-345 6789',
  employeeId: 'EMP2024001',
  department: 'Information Technology',
  position: 'System Manager',
  role: 'HEAD_OF_DEPARTMENT',
  joinDate: '15 January 2020',
  location: 'Kuala Lumpur, Malaysia',
  profilePicture: undefined,
  status: 'active',
  lastLogin: '30 July 2025, 11:45 AM',
  totalRequests: 47,
  approvedRequests: 42,
  pendingRequests: 3,
  rejectedRequests: 2,
  bio: 'Experienced System Manager with over 8 years in the information technology field. Expert in IT infrastructure management and cybersecurity.',
};

const achievements = [
  { icon: 'star', title: 'Employee of the Month', description: '2024', color: '#FFD700' },
  { icon: 'security', title: 'IT Security Certificate', description: 'ISO 27001', color: '#0A84FF' },
  { icon: 'trending-up', title: 'High Productivity', description: '98% Approval Rate', color: '#30D158' },
];

export default function UserProfileScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page
    console.log('Edit profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-text-primary">User Profile</Text>
          <TouchableOpacity onPress={handleEditProfile} className="p-2 -mr-2">
            <MaterialIcons name="edit" size={24} color="#0A84FF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
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
                {/* Profile Picture */}
                <View className="relative">
                  <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center border-2 border-white/30">
                    {currentUser.profilePicture ? (
                      <Image source={{ uri: currentUser.profilePicture }} className="w-full h-full rounded-full" />
                    ) : (
                      <MaterialIcons name="person" size={40} color="white" />
                    )}
                  </View>
                  {/* Status Indicator */}
                  <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                    <View className="w-2 h-2 bg-white rounded-full" />
                  </View>
                </View>

                {/* User Info */}
                <View className="flex-1 ml-4">
                  <Text className="text-xl font-bold text-white mb-1">{currentUser.name}</Text>
                  <Text className="text-white/80 text-base mb-1">{currentUser.position}</Text>
                  <Text className="text-white/70 text-sm">{currentUser.department}</Text>
                  <View className="flex-row items-center mt-2">
                    <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 text-sm ml-1">{currentUser.location}</Text>
                  </View>
                </View>
              </View>

              {/* Quick Stats */}
              <View className="flex-row justify-between mt-6 pt-4 border-t border-white/20">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{currentUser.totalRequests}</Text>
                  <Text className="text-white/70 text-xs">Total Requests</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{currentUser.approvedRequests}</Text>
                  <Text className="text-white/70 text-xs">Approved</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{currentUser.pendingRequests}</Text>
                  <Text className="text-white/70 text-xs">Pending</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-white">{Math.round((currentUser.approvedRequests / currentUser.totalRequests) * 100)}%</Text>
                  <Text className="text-white/70 text-xs">Approval Rate</Text>
                </View>
              </View>
            </View>
          </PremiumCard>
        </View>

        {/* Page Content */}
        <View className="px-6 mt-6 pb-8">
          <View className="space-y-6">
            {/* Personal Information */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="person-outline" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Personal Information</Text>
              </View>
              
              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Employee ID</Text>
                  <Text className="text-text-primary font-medium">{currentUser.employeeId}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Email</Text>
                  <Text className="text-text-primary font-medium">{currentUser.email}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Phone</Text>
                  <Text className="text-text-primary font-medium">{currentUser.phoneNumber}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Join Date</Text>
                  <Text className="text-text-primary font-medium">{currentUser.joinDate}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-text-secondary">Last Login</Text>
                  <Text className="text-text-primary font-medium">{currentUser.lastLogin}</Text>
                </View>
              </View>
            </PremiumCard>

            {/* Bio */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="description" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Bio</Text>
              </View>
              <Text className="text-text-secondary leading-6">{currentUser.bio}</Text>
            </PremiumCard>

            {/* Achievements */}
            <PremiumCard>
              <View className="flex-row items-center mb-4">
                <MaterialIcons name="emoji-events" size={24} color="#0A84FF" />
                <Text className="text-lg font-semibold text-text-primary ml-3">Achievements</Text>
              </View>
              
              <View className="space-y-3">
                {achievements.map((achievement, index) => (
                  <View key={index} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: achievement.color + '20' }}
                    >
                      <MaterialIcons 
                        name={achievement.icon as any} 
                        size={20} 
                        color={achievement.color} 
                      />
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-text-primary">{achievement.title}</Text>
                      <Text className="text-text-secondary text-sm">{achievement.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </PremiumCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}