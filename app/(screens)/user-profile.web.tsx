import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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

export default function UserProfileWebScreen() {
  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page
    console.log('Edit profile');
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        {/* Adjust the max-w- class here to control the overall width of the content */}
        <View className="flex-row items-center justify-between px-8 py-6 max-w-5xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-text-primary">User Profile</Text>
          <TouchableOpacity onPress={handleEditProfile} className="p-2 -mr-2 hover:bg-gray-100 rounded-lg">
            {/* <MaterialIcons name="edit" size={24} color="#0A84FF" /> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Adjust the max-w- class here to control the overall width of the content */}
        <View className="max-w-4xl mx-auto w-full px-8 py-8">
          {/* Profile Header Card */}
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
                {/* Profile Picture */}
                <View className="relative">
                  <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-2 border-white/30">
                    {currentUser.profilePicture ? (
                      <Image source={{ uri: currentUser.profilePicture }} className="w-full h-full rounded-full" />
                    ) : (
                      <MaterialIcons name="person" size={48} color="white" />
                    )}
                  </View>
                  {/* Status Indicator */}
                  <View className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-white items-center justify-center">
                    <View className="w-3 h-3 bg-white rounded-full" />
                  </View>
                </View>

                {/* User Info */}
                <View className="flex-1 ml-6">
                  <Text className="text-2xl font-bold text-white mb-2">{currentUser.name}</Text>
                  <Text className="text-white/80 text-lg mb-1">{currentUser.position}</Text>
                  <Text className="text-white/70 text-base">{currentUser.department}</Text>
                  <View className="flex-row items-center mt-3">
                    <MaterialIcons name="location-on" size={16} color="rgba(255,255,255,0.7)" />
                    <Text className="text-white/70 text-base ml-2">{currentUser.location}</Text>
                  </View>
                </View>
              </View>

              {/* Quick Stats */}
              <View className="flex-row justify-between mt-8 pt-6 border-t border-white/20">
                <View className="items-center">
                  <Text className="text-3xl font-bold text-white">{currentUser.totalRequests}</Text>
                  <Text className="text-white/70 text-sm mt-1">Total Requests</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-white">{currentUser.approvedRequests}</Text>
                  <Text className="text-white/70 text-sm mt-1">Approved</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-white">{currentUser.pendingRequests}</Text>
                  <Text className="text-white/70 text-sm mt-1">Pending</Text>
                </View>
                <View className="items-center">
                  <Text className="text-3xl font-bold text-white">{Math.round((currentUser.approvedRequests / currentUser.totalRequests) * 100)}%</Text>
                  <Text className="text-white/70 text-sm mt-1">Approval Rate</Text>
                </View>
              </View>
            </View>
          </PremiumCard>

          {/* Content */}
          <View className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <View className="space-y-6">
              {/* Personal Information */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="person-outline" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Personal Information</Text>
                </View>
                
                <View className="space-y-5">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Employee ID</Text>
                    <Text className="text-text-primary font-medium text-base">{currentUser.employeeId}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Email</Text>
                    <Text className="text-text-primary font-medium text-base">{currentUser.email}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Phone</Text>
                    <Text className="text-text-primary font-medium text-base">{currentUser.phoneNumber}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Join Date</Text>
                    <Text className="text-text-primary font-medium text-base">{currentUser.joinDate}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-text-secondary text-base">Last Login</Text>
                    <Text className="text-text-primary font-medium text-base">{currentUser.lastLogin}</Text>
                  </View>
                </View>
              </PremiumCard>

              {/* Bio */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="description" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Bio</Text>
                </View>
                <Text className="text-text-secondary leading-7 text-base">{currentUser.bio}</Text>
              </PremiumCard>
            </View>

            {/* Right Column */}
            <View className="space-y-6">
              {/* Achievements */}
              <PremiumCard>
                <View className="flex-row items-center mb-6">
                  <MaterialIcons name="emoji-events" size={28} color="#0A84FF" />
                  <Text className="text-xl font-semibold text-text-primary ml-3">Achievements</Text>
                </View>
                
                <View className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <View key={index} className="flex-row items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: achievement.color + '20' }}
                      >
                        <MaterialIcons 
                          name={achievement.icon as any} 
                          size={24} 
                          color={achievement.color} 
                        />
                      </View>
                      <View className="flex-1 ml-4">
                        <Text className="font-semibold text-text-primary text-base">{achievement.title}</Text>
                        <Text className="text-text-secondary">{achievement.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </PremiumCard>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}