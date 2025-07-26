import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

const APPROVAL_LEVELS = [
  'Department Head',
  'General Manager',
  'Finance Director',
  'CEO Approval Required',
];

export default function GMViewRequestStep1Web() {
  const params = useLocalSearchParams();
  
  const [requestData, setRequestData] = useState<RequestViewData>({
    itemRequested: (params.itemRequested as string) || 'MacBook Pro 16-inch M3 Max',
    quantity: (params.quantity as string) || '2',
    reasonForRequest: (params.reasonForRequest as string) || 'Required for new developers joining the team. Current laptops are outdated and affecting productivity.',
    phoneNo: (params.phoneNo as string) || '+60123456789',
    dateNeededBy: params.dateNeededBy ? new Date(params.dateNeededBy as string) : new Date('2025-02-15'),
    priority: (params.priority as 'Low' | 'Medium' | 'High') || 'High',
    chargeToDepartment: (params.chargeToDepartment as string) || 'Engineering Department',
    attachments: [],
    
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    requestDate: new Date('2025-01-10'),
    requesterName: (params.requesterName as string) || 'Ahmad Rahman',
    requesterEmail: (params.requesterEmail as string) || 'ahmad.rahman@icsboltz.com',
    status: (params.status as 'Pending' | 'Approved' | 'Rejected' | 'Under Review') || 'Pending',
    estimatedCost: (params.estimatedCost as string) || 'RM 15,000.00',
    budgetCode: (params.budgetCode as string) || 'IT-EQUIP-2025-Q1',
    approvalLevel: (params.approvalLevel as string) || 'General Manager',
    lastModified: new Date(),
    
    hodComments: (params.hodComments as string) || '',
    managerComments: (params.managerComments as string) || '',
    rejectionReason: '',
  });

  const [showApprovalLevelDropdown, setShowApprovalLevelDropdown] = useState(false);

  const updateField = (field: keyof RequestViewData, value: any) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    console.log('File upload area clicked, but action is disabled in view mode.');
    Alert.alert("Read-Only", "Attachments can only be viewed in this screen.");
  };

  const handleContinue = () => {
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
    if (step === 1) return;
    if (step === 2) {
      handleContinue();
    }
  };
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });

  const formatDateTime = (date: Date) => date.toLocaleString('en-MY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getPriorityInfo = (priority: string | null) => PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];

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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2 -ml-2 active:opacity-80">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">GM Review Request</Text>
            <Text className="text-sm text-text-secondary mt-1">Request ID: {requestData.requestId}</Text>
          </View>
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: statusInfo.bgColor }}>
            <Text className="text-sm font-medium" style={{ color: statusInfo.color }}>{statusInfo.text}</Text>
          </View>
        </View>
      </View>

      {/* Progress Indicator */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="max-w-4xl mx-auto w-full">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity className="flex-row items-center flex-1" onPress={() => handleStepNavigation(1)} activeOpacity={0.7}>
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-sm font-bold">1</Text>
              </View>
              <View className="flex-1 h-1 bg-blue-500 ml-2" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center flex-1" onPress={() => handleStepNavigation(2)} activeOpacity={0.7}>
              <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center ml-2">
                <Text className="text-gray-600 text-sm font-bold">2</Text>
              </View>
              <View className="flex-1 h-1 bg-gray-300 ml-2" />
            </TouchableOpacity>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center ml-2">
                <Text className="text-gray-600 text-sm font-bold">3</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <View className="px-6 py-6 space-y-6">
                
                {/* Request Information Section (Read-Only) */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Request Information</Text>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Request ID</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base font-mono text-text-primary">{requestData.requestId}</Text>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Request Date</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base text-text-primary">{formatDate(requestData.requestDate)}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Requester</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base text-text-primary">{requestData.requesterName}</Text>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Email</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base text-text-primary">{requestData.requesterEmail}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Last Modified</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                      <Text className="text-base text-text-primary">{formatDateTime(requestData.lastModified)}</Text>
                    </View>
                  </View>
                </View>

                {/* Request Details Section (Read-Only) */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Request Details</Text>
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Item Requested</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                      <Text className="text-base text-text-primary">{requestData.itemRequested}</Text>
                    </View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="w-32">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Quantity</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base text-text-primary">{requestData.quantity}</Text>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Phone No</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                        <Text className="text-base text-text-primary">{requestData.phoneNo}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Reason For Request</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[80px]">
                      <Text className="text-base text-text-primary">{requestData.reasonForRequest}</Text>
                    </View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Date Needed By</Text>
                      <View className="rounded-lg bg-gray-100 border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                        <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                        <Text className="flex-1 text-base text-text-primary">
                          {requestData.dateNeededBy ? formatDate(requestData.dateNeededBy) : 'Date'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Priority</Text>
                      <View className="rounded-lg border flex-row items-center px-4 py-3 min-h-[44px]" style={{ backgroundColor: priorityInfo.bgColor, borderColor: priorityInfo.color + '40' }}>
                        <Text className="flex-1 text-base font-medium" style={{ color: priorityInfo.color }}>{priorityInfo.label}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Charge to Department</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                      <Text className="text-base text-text-primary">{requestData.chargeToDepartment}</Text>
                    </View>
                  </View>
                </View>

                {/* Financial Information Section (Editable) */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Financial Information</Text>
                  
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Estimated Cost</Text>
                      <View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] bg-white">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={requestData.estimatedCost}
                          onChangeText={(text) => updateField('estimatedCost', text)}
                          placeholder="Enter estimated cost"
                          placeholderTextColor="#8A8A8E"
                        />
                      </View>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Budget Code</Text>
                      <View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] bg-white">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={requestData.budgetCode}
                          onChangeText={(text) => updateField('budgetCode', text)}
                          placeholder="Enter budget code"
                          placeholderTextColor="#8A8A8E"
                        />
                      </View>
                    </View>
                  </View>
                  
                  {/*
                    IMPROVEMENT: Dropdown Implementation
                    - The wrapper View no longer needs a z-index (`z-10`).
                    - The dropdown View is now rendered *conditionally* right after the button.
                    - By removing `absolute`, `top-full`, etc., the dropdown now exists in the normal layout flow.
                    - When `showApprovalLevelDropdown` is true, this View will be rendered and will physically push any content below it downwards.
                  */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Approval Level Required</Text>
                    <TouchableOpacity 
                      className="rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] bg-white active:opacity-80"
                      onPress={() => setShowApprovalLevelDropdown(!showApprovalLevelDropdown)}
                    >
                      <Text className="flex-1 text-base text-text-primary">{requestData.approvalLevel}</Text>
                      <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                    </TouchableOpacity>
                    
                    {/* Conditionally rendered dropdown view - now part of the layout flow */}
                    {showApprovalLevelDropdown && (
                      <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                        {APPROVAL_LEVELS.map((level) => (
                          <TouchableOpacity 
                            key={level}
                            onPress={() => { 
                              updateField('approvalLevel', level); 
                              setShowApprovalLevelDropdown(false); 
                            }}
                            className="px-4 py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"
                          >
                            <Text className="text-base text-text-primary">{level}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  
                </View>

                {/* Attachments Section (Read-Only) */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Attachments / Link</Text>
                  <TouchableOpacity className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-100" onPress={handleFileUpload}>
                    <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center">
                      <MaterialIcons name="cloud-upload" size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-500 text-center mb-2">Attachments are view-only</Text>
                    <Text className="text-blue-500 font-medium">No new files can be uploaded</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <TouchableOpacity onPress={handleContinue} className="w-full bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80">
                  <Text className="text-base font-semibold text-white">Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}