import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- INTERFACES AND CONSTANTS ---
interface RequestViewData {
  // Basic request fields
  itemRequested: string;
  quantity: string;
  reasonForRequest: string;
  phoneNo: string;
  dateNeededBy: Date | null;
  priority: 'Low' | 'Medium' | 'High' | null;
  chargeToDepartment: string;
  attachments: any[];
  
  // Technical/Administrative fields
  requestId: string;
  requestDate: Date;
  requesterName: string;
  requesterEmail: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Under Review';
  estimatedCost: string;
  budgetCode: string;
  approvalLevel: string;
  lastModified: Date;
  
  // Comments and feedback
  hodComments: string;
  managerComments: string;
  rejectionReason: string;
}

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low', color: '#30D158', bgColor: '#30D15820' },
  { label: 'Medium', value: 'Medium', color: '#FF9F0A', bgColor: '#FF9F0A20' },
  { label: 'High', value: 'High', color: '#FF453A', bgColor: '#FF453A20' },
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

const APPROVAL_LEVELS = [
  'Department Head',
  'General Manager',
  'Finance Director',
  'CEO Approval Required',
];

export default function GMViewRequestStep1() {
  const params = useLocalSearchParams();
  
  // Initialize with mock data - in real app, this would come from API
  const [requestData, setRequestData] = useState<RequestViewData>({
    // Basic fields (some editable based on role)
    itemRequested: (params.itemRequested as string) || 'MacBook Pro 16-inch M3 Max',
    quantity: (params.quantity as string) || '2',
    reasonForRequest: (params.reasonForRequest as string) || 'Required for new developers joining the team. Current laptops are outdated and affecting productivity.',
    phoneNo: (params.phoneNo as string) || '+60123456789',
    dateNeededBy: params.dateNeededBy ? new Date(params.dateNeededBy as string) : new Date('2025-02-15'),
    priority: (params.priority as 'Low' | 'Medium' | 'High') || 'High',
    chargeToDepartment: (params.chargeToDepartment as string) || 'Engineering Department',
    attachments: [],
    
    // Technical/Administrative fields (mostly read-only)
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    requestDate: new Date('2025-01-10'),
    requesterName: (params.requesterName as string) || 'Ahmad Rahman',
    requesterEmail: (params.requesterEmail as string) || 'ahmad.rahman@icsboltz.com',
    status: (params.status as 'Pending' | 'Approved' | 'Rejected' | 'Under Review') || 'Pending',
    estimatedCost: (params.estimatedCost as string) || 'RM 15,000.00',
    budgetCode: (params.budgetCode as string) || 'IT-EQUIP-2025-Q1',
    approvalLevel: (params.approvalLevel as string) || 'General Manager',
    lastModified: new Date(),
    
    // Comments (editable for rejection reason)
    hodComments: (params.hodComments as string) || '',
    managerComments: (params.managerComments as string) || '',
    rejectionReason: '',
  });

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showApprovalLevelDropdown, setShowApprovalLevelDropdown] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof RequestViewData, value: any) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  const handleContinue = () => {
    // Navigate to step 2 with current data
    router.push({
      pathname: './gm-view-request-step2',
      params: {
        ...requestData,
        dateNeededBy: requestData.dateNeededBy?.toISOString(),
        requestDate: requestData.requestDate.toISOString(),
        lastModified: requestData.lastModified.toISOString(),
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleStepNavigation = (step: number) => {
    if (step === 1) return; // Already on step 1
    if (step === 2) {
      handleContinue();
    }
    // Step 3 not accessible from step 1
  };
  
  // --- HELPER FUNCTIONS ---
  const formatDate = (date: Date) => date.toLocaleDateString('en-MY', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const formatDateTime = (date: Date) => date.toLocaleString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getPriorityInfo = (priority: string | null) => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    return option || PRIORITY_OPTIONS[2]; // Default to High
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Approved': return { color: '#30D158', bgColor: '#30D15820', text: 'Approved' };
      case 'Rejected': return { color: '#FF453A', bgColor: '#FF453A20', text: 'Rejected' };
      case 'Under Review': return { color: '#FF9F0A', bgColor: '#FF9F0A20', text: 'Under Review' };
      default: return { color: '#007AFF', bgColor: '#007AFF20', text: 'Pending' };
    }
  };

  const statusInfo = getStatusInfo(requestData.status);
  const priorityInfo = getPriorityInfo(requestData.priority);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-3 p-2 -ml-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-primary">
              GM Review Request
            </Text>
            <Text className="text-xs text-text-secondary mt-1">
              Request ID: {requestData.requestId}
            </Text>
          </View>
          
          {/* Status Badge */}
          <View 
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: statusInfo.bgColor }}
          >
            <Text className="text-xs font-medium" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Indicator */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          {/* Step 1 - Active */}
          <TouchableOpacity 
            className="flex-row items-center flex-1"
            onPress={() => handleStepNavigation(1)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">1</Text>
            </View>
            <View className="flex-1 h-0.5 bg-blue-500 ml-2" />
          </TouchableOpacity>

          {/* Step 2 - Inactive */}
          <TouchableOpacity 
            className="flex-row items-center flex-1"
            onPress={() => handleStepNavigation(2)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-gray-300 items-center justify-center ml-2">
              <Text className="text-gray-600 text-xs font-bold">2</Text>
            </View>
            <View className="flex-1 h-0.5 bg-gray-300 ml-2" />
          </TouchableOpacity>

          {/* Step 3 - Inactive */}
          <View className="flex-row items-center">
            <View className="w-6 h-6 rounded-full bg-gray-300 items-center justify-center ml-2">
              <Text className="text-gray-600 text-xs font-bold">3</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 py-4">
          {/* Form Card */}
          <View className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Form Content */}
            <View className="px-4 py-4 space-y-4">
              
              {/* Request Information Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">Request Information</Text>
                
                {/* Request ID and Date Row */}
                <View className="flex-row space-x-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Request ID</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                      <Text className="text-sm font-mono text-text-primary">{requestData.requestId}</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Request Date</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                      <Text className="text-sm text-text-primary">{formatDate(requestData.requestDate)}</Text>
                    </View>
                  </View>
                </View>

                {/* Requester Information */}
                <View className="flex-row space-x-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Requester</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                      <Text className="text-sm text-text-primary">{requestData.requesterName}</Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Email</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                      <Text className="text-sm text-text-primary">{requestData.requesterEmail}</Text>
                    </View>
                  </View>
                </View>

                {/* Last Modified */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Last Modified</Text>
                  <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                    <Text className="text-sm text-text-primary">{formatDateTime(requestData.lastModified)}</Text>
                  </View>
                </View>
              </View>

              {/* Request Details Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">Request Details</Text>

                {/* Item Requested */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Item Requested</Text>
                  <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[36px] bg-bg-secondary">
                    <TextInput
                      className="flex-1 text-sm text-text-primary"
                      value={requestData.itemRequested}
                      onChangeText={(text) => updateField('itemRequested', text)}
                      placeholder="Enter product name"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Quantity and Phone Row */}
                <View className="flex-row space-x-3 mb-3">
                  <View className="w-24">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Quantity</Text>
                    <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[36px] bg-bg-secondary">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        value={requestData.quantity}
                        onChangeText={(text) => updateField('quantity', text)}
                        keyboardType="numeric"
                        placeholder="Qty"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Phone No</Text>
                    <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[36px] bg-bg-secondary">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        value={requestData.phoneNo}
                        onChangeText={(text) => updateField('phoneNo', text)}
                        keyboardType="phone-pad"
                        placeholder="Enter phone number"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                </View>

                {/* Reason for Request */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Reason For Request</Text>
                  <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[60px] bg-bg-secondary">
                    <TextInput
                      value={requestData.reasonForRequest}
                      onChangeText={(text) => updateField('reasonForRequest', text)}
                      placeholder="Enter why you requested the item"
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={3}
                      className="flex-1 text-sm text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Date and Priority Row */}
                <View className="flex-row space-x-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Date Needed By</Text>
                    <TouchableOpacity 
                      className="rounded-lg border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px] bg-bg-secondary active:opacity-80"
                    >
                      <MaterialIcons
                        name="calendar-today"
                        size={16}
                        color="#8A8A8E"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="flex-1 text-sm text-text-primary">
                        {requestData.dateNeededBy ? formatDate(requestData.dateNeededBy) : 'Date'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Priority</Text>
                    <TouchableOpacity 
                      className="rounded-lg border flex-row items-center px-3 py-2 min-h-[36px] active:opacity-80"
                      style={{ 
                        backgroundColor: priorityInfo.bgColor,
                        borderColor: priorityInfo.color + '40'
                      }}
                      onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                    >
                      <Text className="flex-1 text-sm font-medium" style={{ color: priorityInfo.color }}>
                        {priorityInfo.label}
                      </Text>
                      <MaterialIcons name="chevron-right" size={16} color={priorityInfo.color} />
                    </TouchableOpacity>
                    
                    {/* Priority Dropdown */}
                    {showPriorityDropdown && (
                      <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                        {PRIORITY_OPTIONS.map((option) => (
                          <TouchableOpacity 
                            key={option.value}
                            onPress={() => { 
                              updateField('priority', option.value); 
                              setShowPriorityDropdown(false); 
                            }}
                            className="px-3 py-2 border-b border-gray-200 last:border-b-0 active:opacity-80"
                          >
                            <Text className="text-sm font-medium" style={{ color: option.color }}>
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Charge To Department */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Charge to Department</Text>
                  <TouchableOpacity 
                    className="rounded-lg border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px] bg-bg-secondary active:opacity-80"
                    onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                  >
                    <Text className="flex-1 text-sm text-text-primary">
                      {requestData.chargeToDepartment || 'Marketing'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={16} color="#8A8A8E" />
                  </TouchableOpacity>
                  
                  {/* Department Dropdown */}
                  {showDepartmentDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 max-h-40">
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {DEPARTMENT_OPTIONS.map((department) => (
                          <TouchableOpacity 
                            key={department}
                            onPress={() => { 
                              updateField('chargeToDepartment', department); 
                              setShowDepartmentDropdown(false); 
                            }}
                            className="px-3 py-2 border-b border-gray-200 last:border-b-0 active:opacity-80"
                          >
                            <Text className="text-sm text-text-primary">{department}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              {/* Financial Information Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">Financial Information</Text>
                
                {/* Estimated Cost and Budget Code Row */}
                <View className="flex-row space-x-3 mb-3">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Estimated Cost</Text>
                    <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[36px] bg-bg-secondary">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        value={requestData.estimatedCost}
                        onChangeText={(text) => updateField('estimatedCost', text)}
                        placeholder="Enter cost"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-text-primary mb-2">Budget Code</Text>
                    <View className="rounded-lg border border-gray-300 px-3 py-2 min-h-[36px] bg-bg-secondary">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        value={requestData.budgetCode}
                        onChangeText={(text) => updateField('budgetCode', text)}
                        placeholder="Enter code"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                </View>

                {/* Approval Level */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Approval Level Required</Text>
                  <TouchableOpacity 
                    className="rounded-lg border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px] bg-bg-secondary active:opacity-80"
                    onPress={() => setShowApprovalLevelDropdown(!showApprovalLevelDropdown)}
                  >
                    <Text className="flex-1 text-sm text-text-primary">
                      {requestData.approvalLevel}
                    </Text>
                    <MaterialIcons name="unfold-more" size={16} color="#8A8A8E" />
                  </TouchableOpacity>
                  
                  {/* Approval Level Dropdown */}
                  {showApprovalLevelDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                      {APPROVAL_LEVELS.map((level) => (
                        <TouchableOpacity 
                          key={level}
                          onPress={() => { 
                            updateField('approvalLevel', level); 
                            setShowApprovalLevelDropdown(false); 
                          }}
                          className="px-3 py-2 border-b border-gray-200 last:border-b-0 active:opacity-80"
                        >
                          <Text className="text-sm text-text-primary">{level}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Attachments Section */}
              <View>
                <Text className="text-xs font-semibold text-text-primary mb-2">Attachments / Link</Text>
                <TouchableOpacity 
                  className="border-2 border-dashed rounded-lg p-6 items-center border-gray-300 bg-gray-50"
                  onPress={handleFileUpload}
                >
                  <View className="w-12 h-12 border-2 border-dashed border-gray-400 rounded-lg mb-3 items-center justify-center">
                    <MaterialIcons name="cloud-upload" size={20} color="#9CA3AF" />
                  </View>
                  <Text className="text-gray-500 text-center mb-2 text-sm">
                    Drag File/Image here
                  </Text>
                  <Text className="text-gray-400 text-center mb-2 text-xs">or</Text>
                  <Text className="text-blue-500 font-medium text-sm">Browse File/image</Text>
                </TouchableOpacity>
                
                {requestData.attachments.length > 0 && (
                  <View className="mt-3 space-y-2">
                    {requestData.attachments.map((file, index) => (
                      <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                        <MaterialIcons name="attach-file" size={16} color="#8A8A8E" />
                        <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>{file.name}</Text>
                        <TouchableOpacity onPress={() => updateField('attachments', requestData.attachments.filter((_, i) => i !== index))}>
                          <MaterialIcons name="close" size={16} color="#8A8A8E" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Sticky Footer with Continue Button */}
            <View className="border-t border-gray-200 px-4 py-3 bg-white">
              <TouchableOpacity
                onPress={handleContinue}
                className="w-full bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[40px] items-center justify-center active:opacity-80"
              >
                <Text className="text-sm font-semibold text-white">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
