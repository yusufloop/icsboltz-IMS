import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard'; // Ensure this component does NOT have padding
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';

// ... (interfaces and constants remain the same)
interface NewRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (requestData: RequestFormData) => void;
}

interface RequestFormData {
  itemRequested: string;
  quantity: string;
  reasonForRequest: string;
  phoneNo: string;
  dateNeededBy: Date | null;
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


export function NewRequestModal({ visible, onClose, onSubmit }: NewRequestModalProps) {
  // ... (all state and handler functions remain the same)
  const [formData, setFormData] = useState<RequestFormData>({
    itemRequested: '',
    quantity: '',
    reasonForRequest: '',
    phoneNo: '',
    dateNeededBy: null,
    priority: null,
    chargeToDepartment: '',
    attachments: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);

  const updateField = (field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateField('dateNeededBy', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        updateField('attachments', [...formData.attachments, file]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.itemRequested.trim()) {
      Alert.alert('Error', 'Please enter the item requested');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      itemRequested: '',
      quantity: '',
      reasonForRequest: '',
      phoneNo: '',
      dateNeededBy: null,
      priority: null,
      chargeToDepartment: '',
      attachments: [],
    });
  };

  const formatDate = (date: Date) => {
    // A more standard format from the screenshot
    return date.toISOString().split('T')[0];
  };

  const getPriorityColor = (priority: string | null) => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    return option?.color || '#FF453A'; // Default to High color as per screenshot
  };

  const getPriorityBgColor = (priority: string | null) => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    if (!option) return '#FF453A1A'; // Light red for High default
    switch(option.value) {
      case 'High': return '#FF453A20';
      case 'Medium': return '#FF9F0A20';
      case 'Low': return '#30D15820';
      default: return '#F2F2F7';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-bg-primary">
        <KeyboardAvoidingView 
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.delay(100).duration(300)}
            className="flex-row items-center px-4 py-4" // FIX: Removed extra bg and shadow, SafeAreaView handles this
          >
            <TouchableOpacity 
              onPress={onClose}
              className="p-2 -ml-2 mr-3 active:opacity-80" // FIX: Negative margin to align better
            >
              <MaterialIcons name="arrow-back" size={28} color="#1C1C1E" />
            </TouchableOpacity>
            
            <View className="flex-1">
              <Text className="text-2xl font-bold text-text-primary">
                New Requests
              </Text>
              <Text className="text-sm text-text-secondary mt-1">
                Fill in the information below for requests
              </Text>
            </View>
          </Animated.View>

          {/* Form Content */}
          <ScrollView 
            className="flex-1 px-6" // FIX: Increased horizontal padding for more breathing room
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }} // FIX: Increased bottom padding
          >
            <Animated.View 
              entering={SlideInUp.delay(200).duration(400)}
              className="pt-4 space-y-8" // FIX: Increased vertical spacing between fields
            >
              {/* Item Requested */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Item Requested
                </Text>
                <PremiumCard>
                  {/* FIX: Moved padding here and removed from PremiumCard */}
                  <TextInput
                    value={formData.itemRequested}
                    onChangeText={(text) => updateField('itemRequested', text)}
                    placeholder="Logitech MX Master 3S Mouse"
                    placeholderTextColor="#AEAEB2"
                    className="text-base text-text-primary font-system px-4 py-3"
                  />
                </PremiumCard>
              </View>

              {/* Quantity */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Quantity
                </Text>
                <View className="w-28">
                  <PremiumCard>
                    {/* FIX: Moved padding here */}
                    <TextInput
                      value={formData.quantity}
                      onChangeText={(text) => updateField('quantity', text)}
                      placeholder="20"
                      placeholderTextColor="#AEAEB2"
                      keyboardType="numeric"
                      className="text-base text-text-primary font-system px-4 py-3"
                    />
                  </PremiumCard>
                </View>
              </View>

              {/* Reason for Request */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Reason for Request
                </Text>
                <PremiumCard>
                  {/* FIX: Added padding here */}
                  <TextInput
                    value={formData.reasonForRequest}
                    onChangeText={(text) => updateField('reasonForRequest', text)}
                    placeholder="For the two new designers..."
                    placeholderTextColor="#AEAEB2"
                    multiline
                    textAlignVertical="top"
                    className="text-base text-text-primary font-system min-h-[100px] px-4 py-3"
                  />
                </PremiumCard>
              </View>

              {/* Phone No */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Phone No
                </Text>
                <PremiumCard>
                  {/* FIX: Moved padding here */}
                  <TextInput
                    value={formData.phoneNo}
                    onChangeText={(text) => updateField('phoneNo', text)}
                    placeholder="0123456789"
                    placeholderTextColor="#AEAEB2"
                    keyboardType="phone-pad"
                    className="text-base text-text-primary font-system px-4 py-3"
                  />
                </PremiumCard>
              </View>

              {/* Date and Priority Row */}
              <View className="flex-row space-x-4">
                {/* Date Needed By */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-secondary mb-3">
                    Date Needed By
                  </Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <PremiumCard>
                      <View className="flex-row items-center justify-between px-4 py-3">
                        <Text className={`text-base font-system ${
                          formData.dateNeededBy ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {formData.dateNeededBy 
                            ? formatDate(formData.dateNeededBy)
                            : 'Select date'
                          }
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
                      </View>
                    </PremiumCard>
                  </TouchableOpacity>
                </View>

                {/* Priority */}
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-secondary mb-3">
                    Priority
                  </Text>
                   {/* FIX: Replicated visual style from screenshot */}
                  <TouchableOpacity onPress={() => setShowPriorityPicker(true)}>
                    <View 
                      className="rounded-lg flex-row items-center justify-between px-4 py-3"
                      style={{ backgroundColor: getPriorityBgColor(formData.priority) }}
                    >
                      <Text 
                        className="text-base font-medium font-system"
                        style={{ color: getPriorityColor(formData.priority) }}
                      >
                        {formData.priority || 'High'}
                      </Text>
                      <MaterialIcons name="chevron-right" size={24} color={getPriorityColor(formData.priority)} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Charge To Department */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Charge To Department
                </Text>
                <TouchableOpacity onPress={() => setShowDepartmentPicker(true)}>
                  <PremiumCard>
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className={`text-base font-system ${
                        formData.chargeToDepartment ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {formData.chargeToDepartment || 'Select department'}
                      </Text>
                      <View>
                        <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                      </View>
                    </View>
                  </PremiumCard>
                </TouchableOpacity>
              </View>

              {/* Attachments / Link */}
              <View>
                <Text className="text-sm font-medium text-text-secondary mb-3">
                  Attachments / Link
                </Text>
                <TouchableOpacity onPress={handleFileUpload}>
                  <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                    <Text className="text-base text-text-secondary font-system">
                      Upload file
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {formData.attachments.length > 0 && (
                  <View className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                        <MaterialIcons name="attach-file" size={20} color="#8A8A8E" />
                        <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>
                          {file.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const newAttachments = formData.attachments.filter((_, i) => i !== index);
                            updateField('attachments', newAttachments);
                          }}
                        >
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
            <PremiumButton
              title="Confirm"
              onPress={handleSubmit}
              variant="gradient"
              size="lg"
            />
          </Animated.View>

          {/* ... (Modals for pickers remain the same) ... */}
           {showDatePicker && (
            <DateTimePicker
              value={formData.dateNeededBy || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          <Modal
            visible={showPriorityPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPriorityPicker(false)}
          >
             <View className="flex-1 bg-black/50 justify-center items-center px-4">
              <PremiumCard style={{ width: '100%', maxWidth: 300 }}>
                <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                  Select Priority
                </Text>
                {PRIORITY_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      updateField('priority', option.value);
                      setShowPriorityPicker(false);
                    }}
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text 
                      className="text-base font-medium text-center"
                      style={{ color: option.color }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setShowPriorityPicker(false)}
                  className="mt-4"
                >
                  <Text className="text-base text-text-secondary text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </PremiumCard>
            </View>
          </Modal>

          <Modal
            visible={showDepartmentPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDepartmentPicker(false)}
          >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
              <PremiumCard style={{ width: '100%', maxWidth: 300, maxHeight: 400 }}>
                <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                  Select Department
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {DEPARTMENT_OPTIONS.map((department) => (
                    <TouchableOpacity
                      key={department}
                      onPress={() => {
                        updateField('chargeToDepartment', department);
                        setShowDepartmentPicker(false);
                      }}
                      className="py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <Text className="text-base text-text-primary text-center">
                        {department}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={() => setShowDepartmentPicker(false)}
                  className="mt-4"
                >
                  <Text className="text-base text-text-secondary text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </PremiumCard>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}