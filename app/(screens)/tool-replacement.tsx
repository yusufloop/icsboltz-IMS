import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- INTERFACES AND CONSTANTS ---
interface ReplacementFormData {
  toolIdentifier: string;
  reportType: 'Replacement' | 'Damage Report' | null;
  dateOfIncident: Date | null;
  priority: 'Low' | 'Medium' | 'High' | null;
  description: string;
  attachments: any[];
}

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low', color: '#30D158' },
  { label: 'Medium', value: 'Medium', color: '#FF9F0A' },
  { label: 'High', value: 'High', color: '#FF453A' },
];

const REPORT_TYPE_OPTIONS = ['Replacement', 'Damage Report'];

// --- MAIN COMPONENT ---
export default function ToolReplacementScreen() {
  const [formData, setFormData] = useState<ReplacementFormData>({
    toolIdentifier: '',
    reportType: null,
    dateOfIncident: new Date(),
    priority: 'Medium',
    description: '',
    attachments: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showReportTypePicker, setShowReportTypePicker] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof ReplacementFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateField('dateOfIncident', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Allow only images for damage reports
        multiple: true,
      });
      if (!result.canceled) {
        updateField('attachments', [...formData.attachments, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const showConfirmation = () => {
    if (!formData.toolIdentifier.trim() || !formData.reportType || !formData.description.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields: Tool ID, Report Type, and Description.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Tool Replacement/Damage report submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      Alert.alert(
        'Success', 
        'Your report has been submitted successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit the report. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };
  
  // --- HELPER FUNCTIONS ---
  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toISOString().split('T')[0];
  };

  const getPriorityInfo = (priority: string | null) => {
    const defaultOption = { color: '#FF9F0A', bgColor: '#FF9F0A20' }; // Medium
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    if (!option) return defaultOption;
    return { color: option.color, bgColor: `${option.color}20` };
  };

  // --- RENDER ---
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          className="flex-row items-center px-4 py-3"
        >
          <TouchableOpacity 
            onPress={handleBack}
            className="p-2 -ml-2 mr-2 active:opacity-70"
          >
            <MaterialIcons name="arrow-back" size={28} color="#1C1C1E" />
          </TouchableOpacity>
          
          <View>
            <Text className="text-lg font-bold text-text-primary">
              Tool Replacement / Damage
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Report a damaged or
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              request a replacement tool
            </Text>
          </View>
        </Animated.View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Animated.View 
            entering={SlideInUp.delay(200).duration(400)}
            className="pt-4 space-y-6"
          >
            {/* Tool Identifier */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Tool ID / Name</Text>
              <TextInput
                value={formData.toolIdentifier}
                onChangeText={(text) => updateField('toolIdentifier', text)}
                placeholder="e.g., DWT-088K or Cordless Drill"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Report Type */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Report Type</Text>
              <TouchableOpacity onPress={() => setShowReportTypePicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.reportType ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.reportType || 'Select report type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Date of Incident and Priority Row */}
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-text-secondary mb-2">Date of Incident</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className="text-base font-system text-text-primary">
                        {formatDate(formData.dateOfIncident)}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2">Urgency</Text>
                <TouchableOpacity onPress={() => setShowPriorityPicker(true)}>
                  <View 
                    className="rounded-lg flex-row items-center justify-between px-4 py-3"
                    style={{ backgroundColor: getPriorityInfo(formData.priority).bgColor }}
                  >
                    <Text className="text-base font-medium font-system" style={{ color: getPriorityInfo(formData.priority).color }}>
                      {formData.priority}
                    </Text>
                    <MaterialIcons name="chevron-right" size={24} color={getPriorityInfo(formData.priority).color} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description of Damage/Reason for Replacement */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Description of Damage / Reason for Replacement</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[120px] px-4 py-3"
                placeholder="Describe what happened, the condition of the tool, and why it needs attention."
              />
            </View>

            {/* Attachments */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Attach Photos of Damage</Text>
              <TouchableOpacity onPress={handleFileUpload}>
                <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                  <MaterialIcons name="add-a-photo" size={24} color="#8A8A8E" />
                  <Text className="text-base text-text-secondary font-system mt-2">Upload Photos</Text>
                </View>
              </TouchableOpacity>
              
              {formData.attachments.length > 0 && (
                <View className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                      <MaterialIcons name="image" size={20} color="#8A8A8E" />
                      <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>{file.name}</Text>
                      <TouchableOpacity onPress={() => updateField('attachments', formData.attachments.filter((_, i) => i !== index))}>
                        <MaterialIcons name="close" size={20} color="#8A8A8E" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Sticky Confirm Button */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(300)}
          className="absolute bottom-0 left-0 right-0 bg-bg-primary pt-3 pb-6 px-6 border-t border-gray-200"
        >
          <TouchableOpacity 
            onPress={showConfirmation} 
            className="bg-blue-500 rounded-xl py-4 active:opacity-80"
          >
            <Text className="text-white text-lg font-semibold text-center">Submit Report</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* PICKER MODALS */}
        {showDatePicker && (
          <DateTimePicker 
            value={formData.dateOfIncident || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleDateChange} 
          />
        )}

        <Modal visible={showReportTypePicker} transparent animationType="fade" onRequestClose={() => setShowReportTypePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[300px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Report Type</Text>
              {REPORT_TYPE_OPTIONS.map((type) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => { 
                    updateField('reportType', type); 
                    setShowReportTypePicker(false); 
                  }} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <Text className="text-base text-blue-500 text-center">{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowReportTypePicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showPriorityPicker} transparent animationType="fade" onRequestClose={() => setShowPriorityPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[300px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Urgency</Text>
              {PRIORITY_OPTIONS.map((option) => (
                <TouchableOpacity 
                  key={option.value} 
                  onPress={() => { 
                    updateField('priority', option.value); 
                    setShowPriorityPicker(false); 
                  }} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <Text className="text-base font-medium text-center" style={{ color: option.color }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowPriorityPicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmationModal} transparent animationType="fade" onRequestClose={() => !isSubmitting && setShowConfirmationModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Confirm Submission</Text>
              <Text className="text-base text-text-secondary mb-4 text-center">
                Please review the details before submitting.
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-6">
                <Text className="text-sm font-semibold text-text-primary mb-2">Report Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Type: {formData.reportType}</Text>
                <Text className="text-sm text-text-secondary">Urgency: {formData.priority}</Text>
              </View>
              
              <View className="flex-row space-x-3">
                <TouchableOpacity 
                  onPress={() => setShowConfirmationModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-base font-semibold text-gray-600 text-center">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleConfirmedSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 rounded-lg py-3 active:opacity-80"
                >
                  <Text className="text-base font-semibold text-white text-center">
                    {isSubmitting ? 'Submitting...' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}