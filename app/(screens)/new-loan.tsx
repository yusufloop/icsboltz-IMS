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
// Changed interface to reflect Loan data
interface LoanFormData {
  itemLoaned: string;
  brand: string;
  manufacturer: string;
  internalSerialNumber: string;
  manufacturerSerialNumber: string;
  modelNumber: string;
  specifications: string;
  quantity: string;
  reasonForLoan: string;
  phoneNo: string;
  loanStartDate: Date | null;
  loanEndDate: Date | null; // Added for loan functionality
  priority: 'Low' | 'Medium' | 'High' | null;
  chargeToDepartment: string;
  attachments: any[];
}

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low', color: '#30D158' },
  { label: 'Medium', value: 'Medium', color: '#FF9F0A' },
  { label: 'High', value: 'High', color: '#FF453A' },
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

// --- MAIN COMPONENT ---
// Changed component name
export default function NewLoanScreen() {
  // Updated state to use LoanFormData interface
  const [formData, setFormData] = useState<LoanFormData>({
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
    loanStartDate: null,
    loanEndDate: null, // Added for loan functionality
    priority: 'High', // Default to High
    chargeToDepartment: '',
    attachments: [],
  });

  // Updated date picker state to handle start and end dates
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof LoanFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Updated date change handlers for start and end dates
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      updateField('loanStartDate', selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      updateField('loanEndDate', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets[0]) {
        updateField('attachments', [...formData.attachments, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const showConfirmation = () => {
    // Updated validation to check for itemLoaned
    if (!formData.itemLoaned.trim()) {
      Alert.alert('Error', 'Please enter the item to loan');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Updated console log for loan submission
      console.log('New loan submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      // Updated success message for loan
      Alert.alert(
        'Success', 
        'Your loan has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit loan. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };
  
  // --- HELPER FUNCTIONS ---
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getPriorityInfo = (priority: string | null) => {
    const defaultOption = { color: '#FF453A', bgColor: '#FF453A20' }; // High
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    if (!option) return defaultOption;

    switch (option.value) {
      case 'High': return { color: '#FF453A', bgColor: '#FF453A20' };
      case 'Medium': return { color: '#FF9F0A', bgColor: '#FF9F0A20' };
      case 'Low': return { color: '#30D158', bgColor: '#30D15820' };
      default: return defaultOption;
    }
  };

  // --- RENDER ---
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header - Updated Text */}
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
              New Loan
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the information below for your loan
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
            {/* Item Loaned */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2">Item to Loan</Text>
              <TextInput
                value={formData.itemLoaned}
                onChangeText={(text) => updateField('itemLoaned', text)}
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Brand and Manufacturer Row */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Brand</Text>
                <TextInput
                  value={formData.brand}
                  onChangeText={(text) => updateField('brand', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Manufacturer</Text>
                <TextInput
                  value={formData.manufacturer}
                  onChangeText={(text) => updateField('manufacturer', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
            </View>

            {/* Serial Numbers Row */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Internal Serial Number</Text>
                <TextInput
                  value={formData.internalSerialNumber}
                  onChangeText={(text) => updateField('internalSerialNumber', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Manufacturer Serial Number</Text>
                <TextInput
                  value={formData.manufacturerSerialNumber}
                  onChangeText={(text) => updateField('manufacturerSerialNumber', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
            </View>

            {/* Model Number and Quantity Row */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Model Number</Text>
                <TextInput
                  value={formData.modelNumber}
                  onChangeText={(text) => updateField('modelNumber', text)}
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
              <View className="w-28">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Quantity</Text>
                <TextInput
                  value={formData.quantity}
                  onChangeText={(text) => updateField('quantity', text)}
                  keyboardType="numeric"
                  className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
                />
              </View>
            </View>

            {/* Specifications */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Specifications</Text>
              <TextInput
                value={formData.specifications}
                onChangeText={(text) => updateField('specifications', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[80px] px-4 py-3"
                placeholder="Additional specifications and identifiers"
              />
            </View>

            {/* Reason for Loan */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Reason for Loan</Text>
              <TextInput
                value={formData.reasonForLoan}
                onChangeText={(text) => updateField('reasonForLoan', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[100px] px-4 py-3"
              />
            </View>

            {/* Phone No */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Phone No</Text>
              <TextInput
                value={formData.phoneNo}
                onChangeText={(text) => updateField('phoneNo', text)}
                keyboardType="phone-pad"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Date Row - Updated for Start and End Date */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Loan Start Date</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className={`text-base font-system ${formData.loanStartDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {formData.loanStartDate ? formatDate(formData.loanStartDate) : 'Select date'}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Loan End Date</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className={`text-base font-system ${formData.loanEndDate ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {formData.loanEndDate ? formatDate(formData.loanEndDate) : 'Select date'}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Priority */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Priority</Text>
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

            {/* Charge To Department */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Charge To Department</Text>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.chargeToDepartment ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.chargeToDepartment || 'Select department'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Attachments / Link */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Attachments / Link</Text>
              <TouchableOpacity onPress={handleFileUpload}>
                <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                  <Text className="text-base text-text-secondary font-system">Upload file</Text>
                </View>
              </TouchableOpacity>
              
              {formData.attachments.length > 0 && (
                <View className="mt-3 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                      <MaterialIcons name="attach-file" size={20} color="#8A8A8E" />
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
            <Text className="text-white text-lg font-semibold text-center">Confirm</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* PICKER MODALS */}
        {showStartDatePicker && (
          <DateTimePicker 
            value={formData.loanStartDate || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleStartDateChange} 
            minimumDate={new Date()} 
          />
        )}
        
        {showEndDatePicker && (
          <DateTimePicker 
            value={formData.loanEndDate || formData.loanStartDate || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleEndDateChange} 
            minimumDate={formData.loanStartDate || new Date()} 
          />
        )}

        <Modal visible={showPriorityPicker} transparent animationType="fade" onRequestClose={() => setShowPriorityPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[300px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Priority</Text>
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

        <Modal visible={showDepartmentPicker} transparent animationType="fade" onRequestClose={() => setShowDepartmentPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[300px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Department</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {DEPARTMENT_OPTIONS.map((department) => (
                  <TouchableOpacity 
                    key={department} 
                    onPress={() => { 
                      updateField('chargeToDepartment', department); 
                      setShowDepartmentPicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center">{department}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(false)} className="mt-4 p-6">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modal */}
        <Modal visible={showConfirmationModal} transparent animationType="fade" onRequestClose={() => !isSubmitting && setShowConfirmationModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Confirm Loan Submission</Text>
              
              <Text className="text-base text-text-secondary mb-4 text-center">
                Are you sure you want to submit this loan request?
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Loan Summary:</Text>
                <Text className="text-sm text-text-secondary">Item: {formData.itemLoaned || 'Not specified'}</Text>
                <Text className="text-sm text-text-secondary">Priority: {formData.priority}</Text>
                <Text className="text-sm text-text-secondary">Department: {formData.chargeToDepartment || 'Not selected'}</Text>
                {formData.loanStartDate && (
                  <Text className="text-sm text-text-secondary">Start: {formatDate(formData.loanStartDate)}</Text>
                )}
                {formData.loanEndDate && (
                  <Text className="text-sm text-text-secondary">End: {formatDate(formData.loanEndDate)}</Text>
                )}
              </View>
              
              <Text className="text-xs text-text-secondary text-center mb-6">
                Once submitted, this loan will be processed by the relevant department.
              </Text>
              
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
                    {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
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