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
interface RepairReturnFormData {
  toolIdentifier: string;
  transactionType: 'Sending for Repair' | 'Returning after Repair' | 'Returning from Loan' | null;
  repairVendor: string;
  transactionDate: Date | null;
  expectedReturnDate: Date | null;
  conditionNotes: string;
  attachments: any[];
}

const TRANSACTION_TYPE_OPTIONS = [
  'Sending for Repair', 
  'Returning after Repair', 
  'Returning from Loan'
];

// --- MAIN COMPONENT ---
export default function RepairReturnScreen() {
  const [formData, setFormData] = useState<RepairReturnFormData>({
    toolIdentifier: '',
    transactionType: null,
    repairVendor: '',
    transactionDate: new Date(),
    expectedReturnDate: null,
    conditionNotes: '',
    attachments: [],
  });

  const [showTransactionDatePicker, setShowTransactionDatePicker] = useState(false);
  const [showExpectedDatePicker, setShowExpectedDatePicker] = useState(false);
  const [showTransactionTypePicker, setShowTransactionTypePicker] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof RepairReturnFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTransactionDateChange = (event: any, selectedDate?: Date) => {
    setShowTransactionDatePicker(false);
    if (selectedDate) {
      updateField('transactionDate', selectedDate);
    }
  };

  const handleExpectedDateChange = (event: any, selectedDate?: Date) => {
    setShowExpectedDatePicker(false);
    if (selectedDate) {
      updateField('expectedReturnDate', selectedDate);
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
    if (!formData.toolIdentifier.trim() || !formData.transactionType) {
      Alert.alert('Incomplete Form', 'Please provide the Tool ID and Transaction Type.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Repair/Return form submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      Alert.alert(
        'Success', 
        'Your transaction has been logged successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to log the transaction. Please try again.');
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
              Tool Repair / Return
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Log a repair or 
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              return transaction for a tool
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

            {/* Transaction Type */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Transaction Type</Text>
              <TouchableOpacity onPress={() => setShowTransactionTypePicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.transactionType ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.transactionType || 'Select transaction type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Conditional Fields based on Transaction Type */}
            {formData.transactionType === 'Sending for Repair' && (
              <>
                {/* Repair Vendor */}
                <View className="mb-3">
                  <Text className="text-sm font-medium text-text-secondary mb-2">Repair Vendor / Shop</Text>
                  <TextInput
                    value={formData.repairVendor}
                    onChangeText={(text) => updateField('repairVendor', text)}
                    placeholder="e.g., Certified Power Tools Inc."
                    className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                  />
                </View>

                {/* Date Sent and Expected Return Date Row */}
                <View className="flex-row space-x-4 mb-3">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Date Sent</Text>
                    <TouchableOpacity onPress={() => setShowTransactionDatePicker(true)}>
                      <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                        <View className="flex-row items-center justify-between px-4 py-3">
                          <Text className="text-base font-system text-text-primary">{formatDate(formData.transactionDate)}</Text>
                          <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Expected Return</Text>
                    <TouchableOpacity onPress={() => setShowExpectedDatePicker(true)}>
                      <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                        <View className="flex-row items-center justify-between px-4 py-3">
                          <Text className={`text-base font-system ${formData.expectedReturnDate ? 'text-text-primary' : 'text-text-secondary'}`}>{formatDate(formData.expectedReturnDate)}</Text>
                          <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Date Returned (for other transaction types) */}
            {formData.transactionType && formData.transactionType !== 'Sending for Repair' && (
               <View className="mb-3">
                <Text className="text-sm font-medium text-text-secondary mb-2">Date of Return</Text>
                <TouchableOpacity onPress={() => setShowTransactionDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className="text-base font-system text-text-primary">{formatDate(formData.transactionDate)}</Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Condition Notes */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Notes on Condition / Repair</Text>
              <TextInput
                value={formData.conditionNotes}
                onChangeText={(text) => updateField('conditionNotes', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[120px] px-4 py-3"
                placeholder="Describe the tool's condition, the reason for repair, or any relevant details."
              />
            </View>

            {/* Attachments */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Attach Receipts / Photos</Text>
              <TouchableOpacity onPress={handleFileUpload}>
                <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                  <MaterialIcons name="attach-file" size={24} color="#8A8A8E" />
                  <Text className="text-base text-text-secondary font-system mt-2">Upload Files</Text>
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
            <Text className="text-white text-lg font-semibold text-center">Log Transaction</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* PICKER MODALS */}
        {showTransactionDatePicker && (
          <DateTimePicker 
            value={formData.transactionDate || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleTransactionDateChange} 
          />
        )}
        
        {showExpectedDatePicker && (
          <DateTimePicker 
            value={formData.expectedReturnDate || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleExpectedDateChange}
            minimumDate={formData.transactionDate || new Date()}
          />
        )}

        <Modal visible={showTransactionTypePicker} transparent animationType="fade" onRequestClose={() => setShowTransactionTypePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Transaction Type</Text>
              {TRANSACTION_TYPE_OPTIONS.map((type) => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => { 
                    updateField('transactionType', type); 
                    setShowTransactionTypePicker(false); 
                  }} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <Text className="text-base text-blue-500 text-center">{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowTransactionTypePicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmationModal} transparent animationType="fade" onRequestClose={() => !isSubmitting && setShowConfirmationModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Confirm Transaction</Text>
              <Text className="text-base text-text-secondary mb-4 text-center">
                Please review the details before submitting.
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-6">
                <Text className="text-sm font-semibold text-text-primary mb-2">Transaction Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Type: {formData.transactionType}</Text>
                <Text className="text-sm text-text-secondary">Date: {formatDate(formData.transactionDate)}</Text>
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