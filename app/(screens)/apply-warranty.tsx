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
interface WarrantyFormData {
  toolIdentifier: string;
  purchaseDate: Date | null;
  dateOfFailure: Date | null;
  warrantyProvider: string;
  claimType: 'Repair' | 'Replacement' | null;
  issueDescription: string;
  contactPerson: string;
  contactPhone: string;
  attachments: any[];
}

const CLAIM_TYPE_OPTIONS = ['Repair', 'Replacement'];

// --- MAIN COMPONENT ---
export default function WarrantyClaimScreen() {
  const [formData, setFormData] = useState<WarrantyFormData>({
    toolIdentifier: '',
    purchaseDate: null,
    dateOfFailure: new Date(),
    warrantyProvider: '',
    claimType: null,
    issueDescription: '',
    contactPerson: '',
    contactPhone: '',
    attachments: [],
  });

  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showFailureDatePicker, setShowFailureDatePicker] = useState(false);
  const [showClaimTypePicker, setShowClaimTypePicker] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof WarrantyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePurchaseDateChange = (event: any, selectedDate?: Date) => {
    setShowPurchaseDatePicker(false);
    if (selectedDate) {
      updateField('purchaseDate', selectedDate);
    }
  };

  const handleFailureDateChange = (event: any, selectedDate?: Date) => {
    setShowFailureDatePicker(false);
    if (selectedDate) {
      updateField('dateOfFailure', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true });
      if (!result.canceled) {
        updateField('attachments', [...formData.attachments, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const showConfirmation = () => {
    if (!formData.toolIdentifier.trim() || !formData.issueDescription.trim() || !formData.claimType) {
      Alert.alert('Incomplete Form', 'Please complete all required fields: Tool ID, Claim Type, and Issue Description.');
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
      
      Alert.alert(
        'Success', 
        'Your warranty claim has been submitted successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
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
            <Text className="text-xl font-bold text-text-primary">
              Tool Warranty Claim
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the details below to 
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              to submit a warranty claim
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
              <Text className="text-sm font-medium text-text-secondary mb-2">Tool ID / Serial Number</Text>
              <TextInput
                value={formData.toolIdentifier}
                onChangeText={(text) => updateField('toolIdentifier', text)}
                placeholder="e.g., DWT-088K or SN: 12345XYZ"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Claim Type */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Claim Type</Text>
              <TouchableOpacity onPress={() => setShowClaimTypePicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.claimType ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.claimType || 'Select claim type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Purchase Date and Date of Failure Row */}
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-text-secondary mb-2">Purchase Date</Text>
                <TouchableOpacity onPress={() => setShowPurchaseDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className={`text-base font-system ${formData.purchaseDate ? 'text-text-primary' : 'text-text-secondary'}`}>{formatDate(formData.purchaseDate)}</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2">Date of Failure</Text>
                <TouchableOpacity onPress={() => setShowFailureDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className="text-base font-system text-text-primary">{formatDate(formData.dateOfFailure)}</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Warranty Provider */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Warranty Provider</Text>
              <TextInput
                value={formData.warrantyProvider}
                onChangeText={(text) => updateField('warrantyProvider', text)}
                placeholder="e.g., DeWalt, Store, etc."
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Description of Issue */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Detailed Description of Issue</Text>
              <TextInput
                value={formData.issueDescription}
                onChangeText={(text) => updateField('issueDescription', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[120px] px-4 py-3"
                placeholder="Describe the problem in detail. What happened? When did it start?"
              />
            </View>
            
            {/* Contact Person and Phone Row */}
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-text-secondary mb-2">Contact Person</Text>
                <TextInput
                  value={formData.contactPerson}
                  onChangeText={(text) => updateField('contactPerson', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2">Contact Phone</Text>
                <TextInput
                  value={formData.contactPhone}
                  onChangeText={(text) => updateField('contactPhone', text)}
                  keyboardType="phone-pad"
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
            </View>

            {/* Attachments */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Attach Proof of Purchase / Photos of Defect</Text>
              <TouchableOpacity onPress={handleFileUpload}>
                <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                  <MaterialIcons name="upload-file" size={24} color="#8A8A8E" />
                  <Text className="text-base text-text-secondary font-system mt-2">Upload Documents</Text>
                </View>
              </TouchableOpacity>
              
              {formData.attachments.length > 0 && (
                <View className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                      <MaterialIcons name="description" size={20} color="#8A8A8E" />
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
            <Text className="text-white text-lg font-semibold text-center">Submit Claim</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* PICKER MODALS */}
        {showPurchaseDatePicker && (
          <DateTimePicker 
            value={formData.purchaseDate || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handlePurchaseDateChange} 
          />
        )}
        
        {showFailureDatePicker && (
          <DateTimePicker 
            value={formData.dateOfFailure || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleFailureDateChange}
          />
        )}

        <Modal visible={showClaimTypePicker} transparent animationType="fade" onRequestClose={() => setShowClaimTypePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Claim Type</Text>
              {CLAIM_TYPE_OPTIONS.map((type) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => { 
                    updateField('claimType', type); 
                    setShowClaimTypePicker(false); 
                  }} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <Text className="text-base text-blue-500 text-center">{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowClaimTypePicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmationModal} transparent animationType="fade" onRequestClose={() => !isSubmitting && setShowConfirmationModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Confirm Claim Submission</Text>
              <Text className="text-base text-text-secondary mb-4 text-center">
                Please review the details before submitting.
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-6">
                <Text className="text-sm font-semibold text-text-primary mb-2">Claim Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Claim Type: {formData.claimType}</Text>
                <Text className="text-sm text-text-secondary">Failure Date: {formatDate(formData.dateOfFailure)}</Text>
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