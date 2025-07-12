import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumInput } from '@/components/ui/PremiumInput';

interface FormData {
  itemRequested: string;
  quantity: string;
  reasonForRequest: string;
  phoneNo: string;
  dateNeededBy: Date | null;
  priority: 'High' | 'Medium' | 'Low' | null;
  chargeToDepartment: string;
  attachments: any[];
}

export default function NewRequestScreen() {
  const [formData, setFormData] = useState<FormData>({
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

  const priorities = ['High', 'Medium', 'Low'] as const;
  const departments = [
    'Design Department',
    'Engineering Department', 
    'Marketing Department',
    'Sales Department',
    'HR Department',
    'Finance Department'
  ];

  const handleBack = () => {
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dateNeededBy: selectedDate }));
    }
  };

  const handlePrioritySelect = (priority: 'High' | 'Medium' | 'Low') => {
    setFormData(prev => ({ ...prev, priority }));
    setShowPriorityPicker(false);
  };

  const handleDepartmentSelect = (department: string) => {
    setFormData(prev => ({ ...prev, chargeToDepartment: department }));
    setShowDepartmentPicker(false);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, file]
        }));
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleConfirm = () => {
    // Validate required fields
    if (!formData.itemRequested.trim()) {
      Alert.alert('Error', 'Item Requested is required');
      return;
    }
    if (!formData.quantity.trim()) {
      Alert.alert('Error', 'Quantity is required');
      return;
    }
    if (!formData.reasonForRequest.trim()) {
      Alert.alert('Error', 'Reason for Request is required');
      return;
    }

    console.log('Form submitted:', formData);
    Alert.alert('Success', 'Request submitted successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#FF453A'; // destructive
      case 'Medium':
        return '#FF9F0A'; // warning
      case 'Low':
        return '#30D158'; // success
      default:
        return '#8A8A8E'; // text-secondary
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-bg-secondary shadow-sm">
          <TouchableOpacity 
            onPress={handleBack}
            className="p-2 mr-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-text-primary">
            New Requests
          </Text>
        </View>

        {/* Description */}
        <View className="px-4 pt-4 pb-6">
          <Text className="text-sm text-text-secondary">
            Fill in the information below for requests
          </Text>
        </View>

        {/* Form Content */}
        <View className="px-4 space-y-6">
          {/* Item Requested */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Item Requested
            </Text>
            <PremiumCard>
              <TextInput
                className="text-base text-text-primary font-system"
                value={formData.itemRequested}
                onChangeText={(text) => setFormData(prev => ({ ...prev, itemRequested: text }))}
                placeholder="Enter item requested"
                placeholderTextColor="#8A8A8E"
              />
            </PremiumCard>
          </View>

          {/* Quantity */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Quantity
            </Text>
            <View className="w-24">
              <PremiumCard>
                <TextInput
                  className="text-base text-text-primary font-system"
                  value={formData.quantity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
                  placeholder="0"
                  placeholderTextColor="#8A8A8E"
                  keyboardType="numeric"
                />
              </PremiumCard>
            </View>
          </View>

          {/* Reason for Request */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Reason for Request
            </Text>
            <PremiumCard>
              <TextInput
                className="text-base text-text-primary font-system"
                value={formData.reasonForRequest}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reasonForRequest: text }))}
                placeholder="Enter reason for request"
                placeholderTextColor="#8A8A8E"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
              />
            </PremiumCard>
          </View>

          {/* Phone No */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Phone No
            </Text>
            <PremiumCard>
              <TextInput
                className="text-base text-text-primary font-system"
                value={formData.phoneNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNo: text }))}
                placeholder="Enter phone number"
                placeholderTextColor="#8A8A8E"
                keyboardType="phone-pad"
              />
            </PremiumCard>
          </View>

          {/* Date Needed By & Priority Row */}
          <View className="flex-row space-x-4">
            {/* Date Needed By */}
            <View className="flex-1">
              <Text className="text-sm text-text-secondary mb-2 font-medium">
                Date Needed By
              </Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <PremiumCard>
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base font-system ${
                      formData.dateNeededBy ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {formData.dateNeededBy ? formatDate(formData.dateNeededBy) : 'Select date'}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>

            {/* Priority */}
            <View className="flex-1">
              <Text className="text-sm text-text-secondary mb-2 font-medium">
                Priority
              </Text>
              <TouchableOpacity onPress={() => setShowPriorityPicker(true)}>
                <PremiumCard>
                  <View className="flex-row items-center justify-between">
                    {formData.priority ? (
                      <View 
                        className="px-3 py-1 rounded-lg"
                        style={{ backgroundColor: getPriorityColor(formData.priority) + '20' }}
                      >
                        <Text 
                          className="text-sm font-medium"
                          style={{ color: getPriorityColor(formData.priority) }}
                        >
                          {formData.priority}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-base text-text-secondary font-system">
                        Select priority
                      </Text>
                    )}
                    <MaterialIcons name="chevron-right" size={20} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>
          </View>

          {/* Charge To Department */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Charge To Department
            </Text>
            <TouchableOpacity onPress={() => setShowDepartmentPicker(true)}>
              <PremiumCard>
                <View className="flex-row items-center justify-between">
                  <Text className={`text-base font-system ${
                    formData.chargeToDepartment ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {formData.chargeToDepartment || 'Select department'}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="keyboard-arrow-up" size={16} color="#8A8A8E" />
                    <MaterialIcons name="keyboard-arrow-down" size={16} color="#8A8A8E" />
                  </View>
                </View>
              </PremiumCard>
            </TouchableOpacity>
          </View>

          {/* Attachments / Link */}
          <View>
            <Text className="text-sm text-text-secondary mb-2 font-medium">
              Attachments / Link
            </Text>
            <TouchableOpacity onPress={handleFileUpload}>
              <View className="border border-gray-300 border-dashed rounded-lg p-4 bg-bg-secondary">
                <View className="items-center">
                  <MaterialIcons name="cloud-upload" size={24} color="#8A8A8E" />
                  <Text className="text-sm text-text-secondary mt-2">
                    Upload file
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Show uploaded files */}
            {formData.attachments.length > 0 && (
              <View className="mt-2 space-y-2">
                {formData.attachments.map((file, index) => (
                  <View key={index} className="flex-row items-center p-2 bg-gray-100 rounded-lg">
                    <MaterialIcons name="attach-file" size={16} color="#8A8A8E" />
                    <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>
                      {file.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setFormData(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <MaterialIcons name="close" size={16} color="#8A8A8E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.dateNeededBy || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Priority Picker Modal */}
        {showPriorityPicker && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-white rounded-xl p-4 mx-8 w-64">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Select Priority
              </Text>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  onPress={() => handlePrioritySelect(priority)}
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <View className="flex-row items-center justify-center">
                    <View 
                      className="px-4 py-2 rounded-lg"
                      style={{ backgroundColor: getPriorityColor(priority) + '20' }}
                    >
                      <Text 
                        className="text-base font-medium"
                        style={{ color: getPriorityColor(priority) }}
                      >
                        {priority}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setShowPriorityPicker(false)}
                className="mt-4 py-2"
              >
                <Text className="text-center text-primary font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Department Picker Modal */}
        {showDepartmentPicker && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-white rounded-xl p-4 mx-8 max-w-80">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Select Department
              </Text>
              <ScrollView className="max-h-64">
                {departments.map((department) => (
                  <TouchableOpacity
                    key={department}
                    onPress={() => handleDepartmentSelect(department)}
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
                className="mt-4 py-2"
              >
                <Text className="text-center text-primary font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Confirm Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-gray-200 p-4">
        <PremiumButton
          title="Confirm"
          onPress={handleConfirm}
          variant="gradient"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}