import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- CONSTANTS FOR DROPDOWNS ---
const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low', color: '#30D158', bgColor: '#30D15820', borderColor: '#30D15840' },
  { label: 'Medium', value: 'Medium', color: '#FF9F0A', bgColor: '#FF9F0A20', borderColor: '#FF9F0A40' },
  { label: 'High', value: 'High', color: '#FF453A', bgColor: '#FF453A20', borderColor: '#FF453A40' },
];

const DEPARTMENT_OPTIONS = [
  'Design Department',
  'Engineering Department',
  'Marketing Department',
  'Sales Department',
  'HR Department',
  'Finance Department',
  'Operations Department',
];

export default function NewRequestWeb() {
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    reason: '',
    phoneNo: '',
    dateNeeded: '',
    priority: 'High',
    department: 'Marketing'
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log('File upload clicked');
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };
  
  // Helper to get styling for the selected priority
  const getPriorityInfo = (priority: string) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2]; // Default to High
  };

  const selectedPriorityInfo = getPriorityInfo(formData.priority);

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
              New Requests
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the information below for your request
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
          <View className="max-w-2xl mx-auto w-full">
            {/* Form Card */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Form Content */}
              <View className="px-6 py-6 space-y-6">
                {/* File Upload Area */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    File/Image Upload
                  </Text>
                  <TouchableOpacity 
                    className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50"
                    onPress={handleFileUpload}
                  >
                    <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center">
                      <MaterialIcons name="cloud-upload" size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-500 text-center mb-2">
                      Drag File/Image here
                    </Text>
                    <Text className="text-gray-400 text-center mb-3">or</Text>
                    <Text className="text-blue-500 font-medium">Browse File/image</Text>
                  </TouchableOpacity>
                </View>

                {/* Item Name */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Item Name
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.itemName}
                      onChangeText={(text) => handleInputChange('itemName', text)}
                      placeholder="Enter product name"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Quantity */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Quantity
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.quantity}
                      onChangeText={(text) => handleInputChange('quantity', text)}
                      placeholder="Enter quantity"
                      placeholderTextColor="#8A8A8E"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Reason For Request */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Reason For Request
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[80px]">
                    <TextInput
                      value={formData.reason}
                      onChangeText={(text) => handleInputChange('reason', text)}
                      placeholder="Enter why you requested the item"
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={3}
                      className="flex-1 text-base text-text-primary"
                      textAlignVertical="top"
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
                      placeholder="Enter phone Number"
                      placeholderTextColor="#8A8A8E"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Date Needed By */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Date Needed By
                  </Text>
                  <TouchableOpacity className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80">
                    <MaterialIcons
                      name="calendar-today"
                      size={20}
                      color="#8A8A8E"
                      style={{ marginRight: 12 }}
                    />
                    <Text className="flex-1 text-base text-gray-500">Date</Text>
                  </TouchableOpacity>
                </View>

                {/* 
                  IMPROVEMENT: Priority Dropdown
                  - The field is wrapped in a View to contain both the button and the dropdown list.
                  - The TouchableOpacity now toggles the `showPriorityDropdown` state.
                  - The styles and text are now dynamic based on the selected priority.
                  - A conditional block `{showPriorityDropdown && ...}` renders the list, pushing content below it.
                */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Priority
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg border flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    style={{ 
                      backgroundColor: selectedPriorityInfo.bgColor, 
                      borderColor: selectedPriorityInfo.borderColor 
                    }}
                  >
                    <Text className="flex-1 text-base font-medium" style={{ color: selectedPriorityInfo.color }}>
                      {selectedPriorityInfo.label}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color={selectedPriorityInfo.color} />
                  </TouchableOpacity>

                  {showPriorityDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                      {PRIORITY_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          onPress={() => {
                            handleInputChange('priority', option.value);
                            setShowPriorityDropdown(false);
                          }}
                          className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <Text className="text-base" style={{ color: option.color }}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* 
                  IMPROVEMENT: Department Dropdown
                  - The TextInput has been replaced with a TouchableOpacity to act as a dropdown trigger.
                  - It toggles the `showDepartmentDropdown` state.
                  - The conditional block below renders the scrollable list of departments.
                */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Charge to Department
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                  >
                    <Text className="flex-1 text-base text-text-primary">
                      {formData.department}
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
              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  {/* Discard Button */}
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">
                      Discard
                    </Text>
                  </TouchableOpacity>

                  {/* Add Request Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Add Requests
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