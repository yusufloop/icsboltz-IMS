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

const REPORT_TYPE_OPTIONS = ['Replacement', 'Damage Report'];

export default function ToolReplacementWebScreen() {
  const [formData, setFormData] = useState({
    toolIdentifier: '',
    reportType: '',
    dateOfIncident: '',
    priority: 'Medium',
    description: '',
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
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
    if (!formData.toolIdentifier.trim() || !formData.reportType || !formData.description.trim()) {
        alert('Please fill in all required fields: Tool ID, Report Type, and Description.');
        return;
      }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      alert('Your report has been submitted successfully!');
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to submit report. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };
  
  // Helper to get styling for the selected priority
  const getPriorityInfo = (priority: string) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1]; // Default to Medium
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
              Tool Replacement / Damage
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Report a damaged or request a replacement tool
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
                    Tool ID / Name
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.toolIdentifier}
                      onChangeText={(text) => handleInputChange('toolIdentifier', text)}
                      placeholder="e.g., DWT-088K or Cordless Drill"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Report Type Dropdown */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Report Type
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowReportTypeDropdown(!showReportTypeDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.reportType ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.reportType || 'Select report type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showReportTypeDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                      {REPORT_TYPE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            handleInputChange('reportType', option);
                            setShowReportTypeDropdown(false);
                          }}
                          className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <Text className="text-base text-text-primary">{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Date of Incident and Urgency Row */}
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Date of Incident</Text>
                    {/* Simplified for web: using a text input for date */}
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                       <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                       <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.dateOfIncident}
                        onChangeText={(text) => handleInputChange('dateOfIncident', text)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Urgency</Text>
                    <TouchableOpacity 
                      className="rounded-lg border flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                      onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      style={{ backgroundColor: selectedPriorityInfo.bgColor, borderColor: selectedPriorityInfo.borderColor }}
                    >
                      <Text className="flex-1 text-base font-medium" style={{ color: selectedPriorityInfo.color }}>
                        {selectedPriorityInfo.label}
                      </Text>
                      <MaterialIcons name="chevron-right" size={20} color={selectedPriorityInfo.color} />
                    </TouchableOpacity>
                  </View>
                </View>
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


                {/* Description of Damage/Reason for Replacement */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Description of Damage / Reason for Replacement
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[120px]">
                    <TextInput
                      value={formData.description}
                      onChangeText={(text) => handleInputChange('description', text)}
                      placeholder="Describe what happened, the condition of the tool, and why it needs attention."
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={5}
                      className="flex-1 text-base text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* File Upload Area */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Attach Photos of Damage
                  </Text>
                  <TouchableOpacity 
                    className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50"
                    onPress={handleFileUpload}
                  >
                    <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center">
                      <MaterialIcons name="add-a-photo" size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-500 text-center mb-2">
                      Drag photos here
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
                    <Text className="text-base font-semibold text-white">Submit Report</Text>
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
                Please review the details before submitting.
              </Text>
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Report Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Type: {formData.reportType}</Text>
                <Text className="text-sm text-text-secondary">Urgency: {formData.priority}</Text>
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