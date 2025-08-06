import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- CONSTANTS FOR DROPDOWNS ---
const ROLE_OPTIONS = [
  'Admin',
  'Manager', 
  'Employee',
  'Supervisor'
];

const DEPARTMENT_OPTIONS = [
  'Marketing',
  'Sales',
  'IT',
  'HR',
  'Finance',
  'Operations'
];

const RANK_OPTIONS = [
  'CEO',
  'Director',
  'Manager',
  'Senior',
  'Junior',
  'Intern'
];

const STATUS_OPTIONS = [
  'Active',
  'Suspended',
  'Terminated',
  'On Leave',
  'Pending'
];

// Status color mapping
const STATUS_COLORS: { [key: string]: string } = {
  'Active': 'bg-green-500',
  'Suspended': 'bg-orange-500',
  'Terminated': 'bg-red-600',
  'On Leave': 'bg-blue-500',
  'Pending': 'bg-gray-400',
};

export default function ViewUserWeb() {
  // Pre-filled form data (in real app, this would come from props or API)
  const [formData, setFormData] = useState({
    name: 'Muhammad Faiz bin Salleh',
    email: 'm.faiz@icsboltz.com.my',
    phoneNo: '012-876 5432',
    role: 'Developer',
    department: 'IT',
    rank: 'Junior',
    status: 'Active',
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showRankDropdown, setShowRankDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    // Handle image upload logic here
    console.log('Image upload clicked');
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter the user name');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter the email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!formData.phoneNo.trim()) {
      Alert.alert('Error', 'Please enter the phone number');
      return;
    }

    if (!formData.role) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (!formData.department) {
      Alert.alert('Error', 'Please select a department');
      return;
    }

    if (!formData.rank) {
      Alert.alert('Error', 'Please select a rank');
      return;
    }

    if (!formData.status) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    // Handle form submission
    console.log('User updated:', formData);
    Alert.alert('Success', 'User has been updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || 'bg-gray-400';
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 p-2 -ml-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">
              Edit User
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Update user information and settings
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 py-6">
          <View className="max-w-4xl mx-auto w-full">
            {/* Form Card */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Form Content */}
              <View className="px-6 py-6">
                <View className="flex-row space-x-8">
                  {/* Left Column - Image Upload */}
                  <View className="flex-1 max-w-sm">
                    <TouchableOpacity 
                      className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50 min-h-[280px] justify-center"
                      onPress={handleImageUpload}
                    >
                      <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-full mb-4 items-center justify-center">
                        <MaterialIcons name="person" size={24} color="#9CA3AF" />
                      </View>
                      <Text className="text-gray-500 text-center mb-2">
                        Drag image here
                      </Text>
                      <Text className="text-gray-400 text-center mb-3">or</Text>
                      <Text className="text-blue-500 font-medium">Browse image</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Right Column - Form Fields */}
                  <View className="flex-1 max-w-lg space-y-6">
                    {/* Name */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Name
                      </Text>
                      <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={formData.name}
                          onChangeText={(text) => handleInputChange('name', text)}
                          placeholder="Enter name"
                          placeholderTextColor="#8A8A8E"
                        />
                      </View>
                    </View>

                    {/* Email */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Email
                      </Text>
                      <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={formData.email}
                          onChangeText={(text) => handleInputChange('email', text)}
                          placeholder="Enter email"
                          placeholderTextColor="#8A8A8E"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>

                    {/* Phone No */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Phone No
                      </Text>
                      <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={formData.phoneNo}
                          onChangeText={(text) => handleInputChange('phoneNo', text)}
                          placeholder="Enter Phone Number"
                          placeholderTextColor="#8A8A8E"
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>

                    {/* Role Dropdown */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Role
                      </Text>
                      <TouchableOpacity 
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                        onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                      >
                        <Text className={`flex-1 text-base ${formData.role ? 'text-text-primary' : 'text-gray-500'}`}>
                          {formData.role || 'Select Role'}
                        </Text>
                        <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                      </TouchableOpacity>

                      {showRoleDropdown && (
                        <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                          <ScrollView>
                            {ROLE_OPTIONS.map((option) => (
                              <TouchableOpacity
                                key={option}
                                onPress={() => {
                                  handleInputChange('role', option);
                                  setShowRoleDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                              >
                                <Text className="text-base text-text-primary">{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Department Dropdown */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Department
                      </Text>
                      <TouchableOpacity 
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                        onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                      >
                        <Text className={`flex-1 text-base ${formData.department ? 'text-text-primary' : 'text-gray-500'}`}>
                          {formData.department || 'Select Department'}
                        </Text>
                        <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                      </TouchableOpacity>

                      {showDepartmentDropdown && (
                        <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                          <ScrollView>
                            {DEPARTMENT_OPTIONS.map((option) => (
                              <TouchableOpacity
                                key={option}
                                onPress={() => {
                                  handleInputChange('department', option);
                                  setShowDepartmentDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                              >
                                <Text className="text-base text-text-primary">{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Rank Dropdown */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Rank
                      </Text>
                      <TouchableOpacity 
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                        onPress={() => setShowRankDropdown(!showRankDropdown)}
                      >
                        <Text className={`flex-1 text-base ${formData.rank ? 'text-text-primary' : 'text-gray-500'}`}>
                          {formData.rank || 'Select Rank'}
                        </Text>
                        <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                      </TouchableOpacity>

                      {showRankDropdown && (
                        <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                          <ScrollView>
                            {RANK_OPTIONS.map((option) => (
                              <TouchableOpacity
                                key={option}
                                onPress={() => {
                                  handleInputChange('rank', option);
                                  setShowRankDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                              >
                                <Text className="text-base text-text-primary">{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Status Dropdown */}
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">
                        Status
                      </Text>
                      <TouchableOpacity 
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                        onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                      >
                        <View className="flex-row items-center flex-1">
                          <View className={`w-3 h-3 rounded-full ${getStatusColor(formData.status)} mr-3`} />
                          <Text className={`text-base ${formData.status ? 'text-text-primary' : 'text-gray-500'}`}>
                            {formData.status || 'Select Status'}
                          </Text>
                        </View>
                        <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                      </TouchableOpacity>

                      {showStatusDropdown && (
                        <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                          <ScrollView>
                            {STATUS_OPTIONS.map((option) => (
                              <TouchableOpacity
                                key={option}
                                onPress={() => {
                                  handleInputChange('status', option);
                                  setShowStatusDropdown(false);
                                }}
                                className="px-4 py-3 border-b border-gray-200 last:border-b-0 flex-row items-center"
                              >
                                <View className={`w-3 h-3 rounded-full ${getStatusColor(option)} mr-3`} />
                                <Text className="text-base text-text-primary">{option}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Save Changes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
