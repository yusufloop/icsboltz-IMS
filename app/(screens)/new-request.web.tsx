import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getToolLifecycleRules, ToolLifecycleRule } from '../../services/toolLifecycleService';
import { getToolShelflifeRules, ToolShelflifeRule } from '../../services/toolShelflifeService';
import { getWarranties, WarrantyItem } from '../../services/warrantyService';

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
    brand: '',
    manufacturer: '',
    internalSerialNumber: '',
    manufacturerSerialNumber: '',
    modelNumber: '',
    specifications: '',
    quantity: '',
    reason: '',
    phoneNo: '',
    dateNeeded: '',
    priority: 'High',
    department: 'Marketing',
    toolLifecycleRule: '',
    toolShelfLifeRule: '',
    toolWarranties: ''
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showLifecycleRuleDropdown, setShowLifecycleRuleDropdown] = useState(false);
  const [showShelfLifeRuleDropdown, setShowShelfLifeRuleDropdown] = useState(false);
  const [showWarrantiesDropdown, setShowWarrantiesDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- STATE FOR RULE DATA ---
  const [lifecycleRules, setLifecycleRules] = useState<ToolLifecycleRule[]>([]);
  const [shelfLifeRules, setShelfLifeRules] = useState<ToolShelflifeRule[]>([]);
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Load rule data on component mount
  useEffect(() => {
    const loadRuleData = async () => {
      try {
        const [lifecycleData, shelfLifeData, warrantyData] = await Promise.all([
          getToolLifecycleRules(),
          getToolShelflifeRules(),
          getWarranties()
        ]);
        setLifecycleRules(lifecycleData);
        setShelfLifeRules(shelfLifeData);
        setWarranties(warrantyData);
      } catch (error) {
        console.error('Error loading rule data:', error);
      }
    };
    loadRuleData();
  }, []);

  const handleFileUpload = () => {
    // Handle file upload logic here
    console.log('File upload clicked');
  };

  const showConfirmation = () => {
    // Basic validation
    if (!formData.itemName.trim()) {
      alert('Please enter the item name before submitting.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle form submission
      console.log('Form submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      // Show success message
      alert('Your request has been submitted successfully!');
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit request. Please try again.');
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
              New Tools
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

                {/* Tool Lifecycle Rule */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Tool Lifecycle Rule
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowLifecycleRuleDropdown(!showLifecycleRuleDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.toolLifecycleRule ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.toolLifecycleRule || 'Select lifecycle rule'}
                    </Text>
                    <MaterialIcons name={showLifecycleRuleDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showLifecycleRuleDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                      <ScrollView>
                        {lifecycleRules.map((rule) => (
                          <TouchableOpacity
                            key={rule.rule_id}
                            onPress={() => {
                              handleInputChange('toolLifecycleRule', rule.rule_name);
                              setShowLifecycleRuleDropdown(false);
                            }}
                            className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                          >
                            <Text className="text-base text-text-primary font-medium">{rule.rule_name}</Text>
                            <Text className="text-sm text-text-secondary">{rule.tool_name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Tool Shelf Life Rule */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Tool Shelf Life Rule
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowShelfLifeRuleDropdown(!showShelfLifeRuleDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.toolShelfLifeRule ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.toolShelfLifeRule || 'Select shelf life rule'}
                    </Text>
                    <MaterialIcons name={showShelfLifeRuleDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showShelfLifeRuleDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                      <ScrollView>
                        {shelfLifeRules.map((rule) => (
                          <TouchableOpacity
                            key={rule.rule_id}
                            onPress={() => {
                              handleInputChange('toolShelfLifeRule', rule.rule_name);
                              setShowShelfLifeRuleDropdown(false);
                            }}
                            className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                          >
                            <Text className="text-base text-text-primary font-medium">{rule.rule_name}</Text>
                            <Text className="text-sm text-text-secondary">{rule.tool_name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Tool Warranties */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Tool Warranties
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowWarrantiesDropdown(!showWarrantiesDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.toolWarranties ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.toolWarranties || 'Select warranty'}
                    </Text>
                    <MaterialIcons name={showWarrantiesDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showWarrantiesDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                      <ScrollView>
                        {warranties.map((warranty) => (
                          <TouchableOpacity
                            key={warranty.warranty_id}
                            onPress={() => {
                              handleInputChange('toolWarranties', warranty.tool_name);
                              setShowWarrantiesDropdown(false);
                            }}
                            className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                          >
                            <Text className="text-base text-text-primary font-medium">{warranty.tool_name}</Text>
                            <Text className="text-sm text-text-secondary">Duration: {warranty.duration} days</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
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
                    onPress={showConfirmation}
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center px-6" style={{zIndex: 9999}}>
          <View className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-text-primary">Confirm Submission</Text>
            </View>
            
            <View className="px-6 py-4">
              <Text className="text-base text-text-secondary mb-4">
                Are you sure you want to submit this request?
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Request Summary:</Text>
                <Text className="text-sm text-text-secondary">Item: {formData.itemName || 'Not specified'}</Text>
                <Text className="text-sm text-text-secondary">Priority: {formData.priority}</Text>
                <Text className="text-sm text-text-secondary">Department: {formData.department}</Text>
              </View>
              
              <Text className="text-xs text-text-secondary">
                Once submitted, this request will be processed by the relevant department.
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