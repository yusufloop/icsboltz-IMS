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

export default function NewUserWeb() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    role: '',
    department: '',
    rank: ''
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showRankDropdown, setShowRankDropdown] = useState(false);

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
    router.push('/user');
    
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

    // Handle form submission
    console.log('User created:', formData);
    Alert.alert('Success', 'User has been created successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  // IMPROVEMENT: Added a handleBack function like the example for navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* 
        IMPROVEMENT: Header updated to match the example
        - Added a TouchableOpacity with a back arrow icon.
        - The button calls the new handleBack function.
        - Added a subtitle Text component below the main title.
      */}
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
              New User
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the information to create a new user profile
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
                  </View>
                </View>
              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  {/* 
                    IMPROVEMENT: Discard Button now matches the example's behavior
                    - Calls handleBack directly.
                    - Does not show a confirmation alert.
                  */}
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">
                      Discard
                    </Text>
                  </TouchableOpacity>

                  {/* Add User Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Add User
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