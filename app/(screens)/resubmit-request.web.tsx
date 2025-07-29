import React, { useState } from 'react';
// IMPROVEMENT: Import Platform to check the Operating System
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// IMPROVEMENT: Import the actual native date picker library
import DateTimePicker from '@react-native-community/datetimepicker';

// --- CONSTANTS FOR DROPDOWNS ---
const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low', color: '#16A34A', bgColor: '#DCFCE7', borderColor: '#4ADE80' },
  { label: 'Medium', value: 'Medium', color: '#EA580C', bgColor: '#FFF7ED', borderColor: '#FB923C' },
  { label: 'High', value: 'High', color: '#DC2626', bgColor: '#FEE2E2', borderColor: '#F87171' },
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


export default function ResubmitRequestWeb() {
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState({
    itemName: (params.itemRequested as string) || '',
    quantity: (params.quantity as string) || '',
    reason: (params.reasonForRequest as string) || '',
    phoneNo: (params.phoneNo as string) || '',
    dateNeeded: params.dateNeededBy ? new Date(params.dateNeededBy as string) : new Date(), // Default to today
    priority: (params.priority as string) || 'High',
    department: (params.chargeToDepartment as string) || 'Marketing',
    hodComments: (params.hodComments as string) || 'Request requires additional documentation and clarification on budget allocation. Please provide detailed specifications and updated cost estimates.'
  });

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  // IMPROVEMENT: This state now controls the visibility of the native picker
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);


  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // IMPROVEMENT: This is the handler for the native DateTimePicker
  const onDateChange = (event: any, selectedDate?: Date) => {
    // Hide the picker on Android after selection
    if (Platform.OS === 'android') {
      setDatePickerVisible(false);
    }
    // Set the new date if one was selected
    if (selectedDate) {
      handleInputChange('dateNeeded', selectedDate);
    }
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  const handleSubmit = () => {
    console.log('Form resubmitted:', formData);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const getPriorityInfo = (priority: string) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return 'Select a Date';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const priorityInfo = getPriorityInfo(formData.priority);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2 -ml-2 active:opacity-80">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">Resubmit Request</Text>
            <Text className="text-sm text-text-secondary mt-1">Update your request based on the feedback below</Text>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <View className="px-6 py-6 space-y-6">
                
                {/* Comments and other fields remain unchanged */}
                <View><Text className="text-sm font-semibold text-text-primary mb-2">Comments from Head of Department</Text><View className="bg-red-50 border border-red-200 rounded-lg p-4"><View className="flex-row items-start mb-2"><MaterialIcons name="info-outline" size={20} color="#FF453A" style={{ marginRight: 8, marginTop: 2 }} /><Text className="text-sm font-medium text-red-700 flex-1">Please address the following feedback:</Text></View><Text className="text-base text-red-800 leading-relaxed">{formData.hodComments}</Text></View></View>
                <View><Text className="text-sm font-semibold text-text-primary mb-2">File/Image Upload</Text><TouchableOpacity className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50" onPress={handleFileUpload}><View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center"><MaterialIcons name="cloud-upload" size={24} color="#9CA3AF" /></View><Text className="text-gray-500 text-center mb-2">Drag File/Image here</Text><Text className="text-gray-400 text-center mb-3">or</Text><Text className="text-blue-500 font-medium">Browse File/image</Text></TouchableOpacity></View>
                <View><Text className="text-sm font-semibold text-text-primary mb-2">Item Name</Text><View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]"><TextInput className="flex-1 text-base text-text-primary" value={formData.itemName} onChangeText={(text) => handleInputChange('itemName', text)} placeholder="Enter product name" placeholderTextColor="#8A8A8E" /></View></View>
                <View><Text className="text-sm font-semibold text-text-primary mb-2">Quantity</Text><View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]"><TextInput className="flex-1 text-base text-text-primary" value={formData.quantity} onChangeText={(text) => handleInputChange('quantity', text)} placeholder="Enter quantity" placeholderTextColor="#8A8A8E" keyboardType="numeric" /></View></View>
                <View><Text className="text-sm font-semibold text-text-primary mb-2">Reason For Request</Text><View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[80px]"><TextInput value={formData.reason} onChangeText={(text) => handleInputChange('reason', text)} placeholder="Enter why you requested the item" placeholderTextColor="#8A8A8E" multiline numberOfLines={3} className="flex-1 text-base text-text-primary" textAlignVertical="top" /></View></View>
                <View><Text className="text-sm font-semibold text-text-primary mb-2">Phone No</Text><View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]"><TextInput className="flex-1 text-base text-text-primary" value={formData.phoneNo} onChangeText={(text) => handleInputChange('phoneNo', text)} placeholder="Enter phone Number" placeholderTextColor="#8A8A8E" keyboardType="phone-pad" /></View></View>

                {/* Date Needed By - Now with platform-specific logic */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Date Needed By</Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setDatePickerVisible(true)}
                  >
                    <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                    <Text className={`flex-1 text-base ${formData.dateNeeded ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formatDateForDisplay(formData.dateNeeded)}
                    </Text>
                  </TouchableOpacity>
                  
                  {/*
                    HOW IT WORKS:
                    - We check if the picker should be visible AND if the platform is NOT web.
                    - If so, we render the actual native DateTimePicker from the library.
                    - The `onChange` handler updates our state.
                  */}
                  {isDatePickerVisible && Platform.OS !== 'web' && (
                    <DateTimePicker
                      value={formData.dateNeeded || new Date()}
                      mode="date"
                      display="default" // "spinner" on iOS for the wheel style
                      onChange={onDateChange}
                    />
                  )}
                  {/*
                    WEB FALLBACK:
                    - This will only render on the web.
                    - In a real app, you'd replace this with an <input type="date"> component.
                  */}
                   {isDatePickerVisible && Platform.OS === 'web' && (
                      <Modal transparent={true} visible={isDatePickerVisible} animationType="fade">
                          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}} onPress={() => setDatePickerVisible(false)}>
                              <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                                  <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 20}}>Web Date Picker Simulation</Text>
                                  <Button title="Select Today" onPress={() => { onDateChange(null, new Date()); setDatePickerVisible(false); }} />
                              </View>
                          </TouchableOpacity>
                      </Modal>
                  )}
                </View>

                {/* Priority Dropdown (Fixed) */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Priority</Text>
                  <TouchableOpacity 
                    className="rounded-lg border flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    style={{ backgroundColor: priorityInfo.bgColor, borderColor: priorityInfo.borderColor }}
                  >
                    <Text className={`flex-1 text-base font-medium`} style={{ color: priorityInfo.color }}>{formData.priority}</Text>
                    <MaterialIcons name="chevron-right" size={20} color={priorityInfo.color} />
                  </TouchableOpacity>
                  {showPriorityDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                      {PRIORITY_OPTIONS.map((option) => (
                        <TouchableOpacity key={option.value} onPress={() => { handleInputChange('priority', option.value); setShowPriorityDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                          <Text className="text-base" style={{ color: option.color }}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Department Dropdown (Fixed) */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Charge to Department</Text>
                  <TouchableOpacity className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80" onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}>
                    <Text className="flex-1 text-base text-text-primary">{formData.department}</Text>
                    <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                  </TouchableOpacity>
                  {showDepartmentDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48">
                      <ScrollView>
                        {DEPARTMENT_OPTIONS.map((option) => (
                          <TouchableOpacity key={option} onPress={() => { handleInputChange('department', option); setShowDepartmentDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0">
                            <Text className="text-base text-text-primary">{option}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

              </View>

              {/* Sticky Footer */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  <TouchableOpacity onPress={handleBack} className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80">
                    <Text className="text-base font-semibold text-gray-600">Discard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSubmit} className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80">
                    <Text className="text-base font-semibold text-white">Resubmit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}