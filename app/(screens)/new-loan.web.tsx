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

// Changed component name to NewLoanWeb
export default function NewLoanWeb() {
  // Updated state variable names for clarity and added loanEndDate
  const [formData, setFormData] = useState({
    itemLoaned: '',
    brand: '',
    manufacturer: '',
    internalSerialNumber: '',
    manufacturerSerialNumber: '',
    modelNumber: '',
    specifications: '',
    quantity: '',
    reasonForLoan: '',
    phoneNo: '',
    loanStartDate: '',
    loanEndDate: '', // Essential field for a loan
    priority: 'High',
    department: 'Marketing'
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log('File upload clicked for loan');
  };

  const showConfirmation = () => {
    // Basic validation
    if (!formData.itemLoaned.trim()) {
      alert('Please enter the item to loan before submitting.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle form submission for loan
      console.log('New loan submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      // Show success message
      alert('Your loan has been submitted successfully!');
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit loan. Please try again.');
    }
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
      {/* Header - Updated text for "New Loan" */}
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
              New Loan
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the information below for your loan
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

                {/* Item to Loan */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Item to Loan
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.itemLoaned}
                      onChangeText={(text) => handleInputChange('itemLoaned', text)}
                      placeholder="Enter product name"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Brand and Manufacturer Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Brand
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.brand}
                        onChangeText={(text) => handleInputChange('brand', text)}
                        placeholder="Enter brand"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Manufacturer
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.manufacturer}
                        onChangeText={(text) => handleInputChange('manufacturer', text)}
                        placeholder="Enter manufacturer"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                </View>

                {/* Serial Numbers Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Internal Serial Number
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.internalSerialNumber}
                        onChangeText={(text) => handleInputChange('internalSerialNumber', text)}
                        placeholder="Enter internal serial number"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Manufacturer Serial Number
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.manufacturerSerialNumber}
                        onChangeText={(text) => handleInputChange('manufacturerSerialNumber', text)}
                        placeholder="Enter manufacturer serial number"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                </View>

                {/* Model Number and Quantity Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Model Number
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.modelNumber}
                        onChangeText={(text) => handleInputChange('modelNumber', text)}
                        placeholder="Enter model number"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="w-40">
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
                </View>

                {/* Specifications */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Specifications
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[80px]">
                    <TextInput
                      value={formData.specifications}
                      onChangeText={(text) => handleInputChange('specifications', text)}
                      placeholder="Additional specifications and identifiers"
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={3}
                      className="flex-1 text-base text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Reason For Loan */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Reason for Loan
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[80px]">
                    <TextInput
                      value={formData.reasonForLoan}
                      onChangeText={(text) => handleInputChange('reasonForLoan', text)}
                      placeholder="Enter why you are loaning the item"
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

                {/* Loan Start and End Date */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Loan Start Date
                    </Text>
                    <TouchableOpacity className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80">
                      <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                      <Text className="flex-1 text-base text-gray-500">Start Date</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Loan End Date
                    </Text>
                    <TouchableOpacity className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80">
                      <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                      <Text className="flex-1 text-base text-gray-500">End Date</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Priority Dropdown */}
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

                {/* Department Dropdown */}
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

              {/* Sticky Footer with Action Buttons - Updated text */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">
                      Discard
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showConfirmation}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Add Loan
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center px-6" style={{zIndex: 9999}}>
          <View className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-text-primary">Confirm Loan Submission</Text>
            </View>
            
            <View className="px-6 py-4">
              <Text className="text-base text-text-secondary mb-4">
                Are you sure you want to submit this loan request?
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Loan Summary:</Text>
                <Text className="text-sm text-text-secondary">Item: {formData.itemLoaned || 'Not specified'}</Text>
                <Text className="text-sm text-text-secondary">Priority: {formData.priority}</Text>
                <Text className="text-sm text-text-secondary">Department: {formData.department}</Text>
                {formData.loanStartDate && (
                  <Text className="text-sm text-text-secondary">Start Date: {formData.loanStartDate}</Text>
                )}
                {formData.loanEndDate && (
                  <Text className="text-sm text-text-secondary">End Date: {formData.loanEndDate}</Text>
                )}
              </View>
              
              <Text className="text-xs text-text-secondary">
                Once submitted, this loan will be processed by the relevant department.
              </Text>
            </View>
            
            <View className="px-6 py-4 border-t border-gray-200 flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowConfirmationModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
              >
                <Text className="text-base font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
              >
                {isSubmitting ? (
                  <Text className="text-base font-semibold text-white">Submitting...</Text>
                ) : (
                  <Text className="text-base font-semibold text-white">Confirm Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}