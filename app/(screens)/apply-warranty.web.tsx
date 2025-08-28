import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- CONSTANTS FOR DROPDOWNS ---
const CLAIM_TYPE_OPTIONS = ['Repair', 'Replacement'];

export default function WarrantyClaimWebScreen() {
  const [formData, setFormData] = useState({
    toolIdentifier: '',
    purchaseDate: '',
    dateOfFailure: '',
    warrantyProvider: '',
    claimType: '',
    issueDescription: '',
    contactPerson: '',
    contactPhone: '',
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showClaimTypeDropdown, setShowClaimTypeDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    // This would trigger a file input dialog in a real web app
    console.log('File upload clicked');
  };

  const showConfirmation = () => {
    if (!formData.toolIdentifier.trim() || !formData.issueDescription.trim() || !formData.claimType) {
      alert('Please complete all required fields: Tool ID, Claim Type, and Issue Description.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Warranty claim submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      alert('Your warranty claim has been submitted successfully!');
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit claim. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
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
              Tool Warranty Claim
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the details below to submit a warranty claim
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
                
                {/* Tool Identifier */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Tool ID / Serial Number
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.toolIdentifier}
                      onChangeText={(text) => handleInputChange('toolIdentifier', text)}
                      placeholder="e.g., DWT-088K or SN: 12345XYZ"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Claim Type Dropdown */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Claim Type
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowClaimTypeDropdown(!showClaimTypeDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.claimType ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.claimType || 'Select claim type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showClaimTypeDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                      {CLAIM_TYPE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            handleInputChange('claimType', option);
                            setShowClaimTypeDropdown(false);
                          }}
                          className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <Text className="text-base text-text-primary">{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                
                {/* Purchase Date and Date of Failure Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Purchase Date</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                       <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                       <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.purchaseDate}
                        onChangeText={(text) => handleInputChange('purchaseDate', text)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Date of Failure</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                       <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                       <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.dateOfFailure}
                        onChangeText={(text) => handleInputChange('dateOfFailure', text)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                </View>

                {/* Warranty Provider */}
                 <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Warranty Provider</Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.warrantyProvider}
                      onChangeText={(text) => handleInputChange('warrantyProvider', text)}
                      placeholder="e.g., DeWalt, Store, etc."
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Description of Issue */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Detailed Description of Issue
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[120px]">
                    <TextInput
                      value={formData.issueDescription}
                      onChangeText={(text) => handleInputChange('issueDescription', text)}
                      placeholder="Describe the problem in detail. What happened? When did it start?"
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={5}
                      className="flex-1 text-base text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>
                
                {/* Contact Person and Phone Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Contact Person</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.contactPerson}
                        onChangeText={(text) => handleInputChange('contactPerson', text)}
                        placeholder="Enter contact name"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Contact Phone</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.contactPhone}
                        onChangeText={(text) => handleInputChange('contactPhone', text)}
                        placeholder="Enter phone number"
                        placeholderTextColor="#8A8A8E"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                </View>

                {/* Attachments */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Attach Proof of Purchase / Photos of Defect
                  </Text>
                  <TouchableOpacity 
                    className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50"
                    onPress={handleFileUpload}
                  >
                    <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center">
                      <MaterialIcons name="upload-file" size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-500 text-center mb-2">
                      Drag files here
                    </Text>
                    <Text className="text-gray-400 text-center mb-3">or</Text>
                    <Text className="text-blue-500 font-medium">Browse Files</Text>
                  </TouchableOpacity>
                </View>

              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">Discard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showConfirmation}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">Submit Claim</Text>
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
              <Text className="text-xl font-bold text-text-primary">Confirm Claim Submission</Text>
            </View>
            <View className="px-6 py-4">
              <Text className="text-base text-text-secondary mb-4">
                Please review the details before submitting.
              </Text>
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Claim Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Claim Type: {formData.claimType}</Text>
                <Text className="text-sm text-text-secondary">Failure Date: {formData.dateOfFailure || 'Not set'}</Text>
              </View>
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
                <Text className="text-base font-semibold text-white">
                  {isSubmitting ? 'Submitting...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}