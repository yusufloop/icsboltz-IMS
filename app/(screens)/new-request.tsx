import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
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
import { getToolLifecycleRules, ToolLifecycleRule } from '../../services/toolLifecycleService';
import { getToolShelflifeRules, ToolShelflifeRule } from '../../services/toolShelflifeService';
import { getWarranties, WarrantyItem } from '../../services/warrantyService';

// --- INTERFACES AND CONSTANTS ---
interface RequestFormData {
  itemRequested: string;
  brand: string;
  manufacturer: string;
  internalSerialNumber: string;
  manufacturerSerialNumber: string;
  modelNumber: string;
  specifications: string;
  quantity: string;
  reasonForRequest: string;
  phoneNo: string;
  dateNeededBy: Date | null;
  priority: 'Low' | 'Medium' | 'High' | null;
  chargeToDepartment: string;
  attachments: any[];
  toolLifecycleRule: string;
  toolShelfLifeRule: string;
  toolWarranties: string;
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
export default function NewRequestScreen() {
  const [formData, setFormData] = useState<RequestFormData>({
    itemRequested: '',
    brand: '',
    manufacturer: '',
    internalSerialNumber: '',
    manufacturerSerialNumber: '',
    modelNumber: '',
    specifications: '',
    quantity: '',
    reasonForRequest: '',
    phoneNo: '',
    dateNeededBy: null,
    priority: 'High', // Default to High
    chargeToDepartment: '',
    attachments: [],
    toolLifecycleRule: '',
    toolShelfLifeRule: '',
    toolWarranties: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showLifecycleRulePicker, setShowLifecycleRulePicker] = useState(false);
  const [showShelfLifeRulePicker, setShowShelfLifeRulePicker] = useState(false);
  const [showWarrantiesPicker, setShowWarrantiesPicker] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rule data states
  const [lifecycleRules, setLifecycleRules] = useState<ToolLifecycleRule[]>([]);
  const [shelfLifeRules, setShelfLifeRules] = useState<ToolShelflifeRule[]>([]);
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof RequestFormData, value: any) => {
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateField('dateNeededBy', selectedDate);
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
    if (!formData.itemRequested.trim()) {
      Alert.alert('Error', 'Please enter the item requested');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('New request submitted:', formData);
      
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      // Show success message and navigate back
      Alert.alert(
        'Success', 
        'Your request has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
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
              New Tools
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Fill in the information below for your request
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
            {/* Item Requested */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2">Item Requested</Text>
              <TextInput
                value={formData.itemRequested}
                onChangeText={(text) => updateField('itemRequested', text)}
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Brand and Manufacturer Row */}
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
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
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
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
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
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
            <View className="mb-3">
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

            {/* Reason for Request */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Reason for Request</Text>
              <TextInput
                value={formData.reasonForRequest}
                onChangeText={(text) => updateField('reasonForRequest', text)}
                multiline
                textAlignVertical="top"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[100px] px-4 py-3"
              />
            </View>

            {/* Phone No */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Phone No</Text>
              <TextInput
                value={formData.phoneNo}
                onChangeText={(text) => updateField('phoneNo', text)}
                keyboardType="phone-pad"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Date and Priority Row */}
            <View className="flex-row space-x-4 mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Date Needed By</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className={`text-base font-system ${formData.dateNeededBy ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {formData.dateNeededBy ? formatDate(formData.dateNeededBy) : 'Select date'}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
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
            </View>

            {/* Charge To Department */}
            <View className="mb-3">
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

            {/* Tool Lifecycle Rule */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Tool Lifecycle Rule</Text>
              <TouchableOpacity onPress={() => setShowLifecycleRulePicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.toolLifecycleRule ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.toolLifecycleRule || 'Select lifecycle rule'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Tool Shelf Life Rule */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Tool Shelf Life Rule</Text>
              <TouchableOpacity onPress={() => setShowShelfLifeRulePicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.toolShelfLifeRule ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.toolShelfLifeRule || 'Select shelf life rule'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Tool Warranties */}
            <View className="mb-3">
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Tool Warranties</Text>
              <TouchableOpacity onPress={() => setShowWarrantiesPicker(true)}>
                <View className="bg-bg-secondary rounded-lg shadow-sm border border-gray-200">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.toolWarranties ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.toolWarranties || 'Select warranty'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Attachments / Link */}
            <View className="mb-3">
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
        {showDatePicker && (
          <DateTimePicker 
            value={formData.dateNeededBy || new Date()} 
            mode="date" 
            display="spinner" 
            onChange={handleDateChange} 
            minimumDate={new Date()} 
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

        {/* Tool Lifecycle Rule Picker Modal */}
        <Modal visible={showLifecycleRulePicker} transparent animationType="fade" onRequestClose={() => setShowLifecycleRulePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[350px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Lifecycle Rule</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {lifecycleRules.map((rule) => (
                  <TouchableOpacity 
                    key={rule.rule_id} 
                    onPress={() => { 
                      updateField('toolLifecycleRule', rule.rule_name); 
                      setShowLifecycleRulePicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center font-medium">{rule.rule_name}</Text>
                    <Text className="text-sm text-text-secondary text-center mt-1">{rule.tool_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowLifecycleRulePicker(false)} className="mt-4 p-6">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Tool Shelf Life Rule Picker Modal */}
        <Modal visible={showShelfLifeRulePicker} transparent animationType="fade" onRequestClose={() => setShowShelfLifeRulePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[350px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Shelf Life Rule</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {shelfLifeRules.map((rule) => (
                  <TouchableOpacity 
                    key={rule.rule_id} 
                    onPress={() => { 
                      updateField('toolShelfLifeRule', rule.rule_name); 
                      setShowShelfLifeRulePicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center font-medium">{rule.rule_name}</Text>
                    <Text className="text-sm text-text-secondary text-center mt-1">{rule.tool_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowShelfLifeRulePicker(false)} className="mt-4 p-6">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Tool Warranties Picker Modal */}
        <Modal visible={showWarrantiesPicker} transparent animationType="fade" onRequestClose={() => setShowWarrantiesPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[350px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Warranty</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {warranties.map((warranty) => (
                  <TouchableOpacity 
                    key={warranty.warranty_id} 
                    onPress={() => { 
                      updateField('toolWarranties', warranty.tool_name); 
                      setShowWarrantiesPicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center font-medium">{warranty.tool_name}</Text>
                    <Text className="text-sm text-text-secondary text-center mt-1">Duration: {warranty.duration} days</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowWarrantiesPicker(false)} className="mt-4 p-6">
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
                Are you sure you want to submit this request?
              </Text>
              
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Request Summary:</Text>
                <Text className="text-sm text-text-secondary">Item: {formData.itemRequested || 'Not specified'}</Text>
                <Text className="text-sm text-text-secondary">Priority: {formData.priority}</Text>
                <Text className="text-sm text-text-secondary">Department: {formData.chargeToDepartment || 'Not selected'}</Text>
              </View>
              
              <Text className="text-xs text-text-secondary text-center mb-6">
                Once submitted, this request will be processed by the relevant department.
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