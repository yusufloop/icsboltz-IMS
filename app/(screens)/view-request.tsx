import { ICSBOLTZ_CURRENT_USER_ROLE, hasPermission } from '@/constants/UserRoles';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
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

const APPROVAL_LEVELS = [
  'Department Head',
  'General Manager',
  'Finance Director',
  'CEO Approval Required',
];

// --- MAIN COMPONENT ---
export default function ViewRequestScreen() {
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showApprovalLevelPicker, setShowApprovalLevelPicker] = useState(false);
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const canApprove = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'approve');
  const canReject = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'reject');
  const isRequester = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER';

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof RequestViewData, value: any) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && !isRequester) {
      updateField('dateNeededBy', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    if (isRequester) return;
    
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets[0]) {
        updateField('attachments', [...requestData.attachments, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleReject = () => {
    if (!requestData.rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    console.log('Request approved:', requestData.requestId);
    router.push('/requests');
  };

  const confirmReject = () => {
    console.log('Request rejected:', requestData.requestId, 'Reason:', requestData.rejectionReason);
    router.push('/requests');
  };

  const handleBack = () => {
    router.back();
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

  const isFieldEditable = (field: string) => {
    if (isRequester) return false;
    
    const editableFields = [
      'estimatedCost',
      'budgetCode',
      'approvalLevel',
      'rejectionReason',
      'hodComments',
      'managerComments'
    ];
    
    return editableFields.includes(field);
  };

  const getStatusStyle = (status: RequestViewData['status']) => {
    switch (status) {
      case 'Approved': return 'bg-green-100';
      case 'Rejected': return 'bg-red-100';
      case 'Under Review': return 'bg-yellow-100';
      case 'Pending': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusTextStyle = (status: RequestViewData['status']) => {
    switch (status) {
      case 'Approved': return 'text-green-800';
      case 'Rejected': return 'text-red-800';
      case 'Under Review': return 'text-yellow-800';
      case 'Pending': return 'text-blue-800';
      default: return 'text-gray-800';
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
          
          <View className="flex-1">
            <Text className="text-xl font-bold text-text-primary">
              View Request
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Request ID: {requestData.requestId}
            </Text>
          </View>

          <View className={`px-3 py-1 rounded-full ${getStatusStyle(requestData.status)}`}>
            <Text className={`text-sm font-semibold ${getStatusTextStyle(requestData.status)}`}>{requestData.status}</Text>
          </View>
        </Animated.View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: canApprove || canReject ? 140 : 40 }}
        >
          <Animated.View 
            entering={SlideInUp.delay(200).duration(400)}
            className="pt-4 space-y-6"
          >
            {/* Technical Information Section */}
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-4">Request Information</Text>
              
              <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <View className="space-y-4">
                  <View className="flex-row space-x-4">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-secondary mb-1">Request ID</Text>
                      <Text className="text-base font-mono text-text-primary">{requestData.requestId}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-secondary mb-1">Request Date</Text>
                      <Text className="text-base text-text-primary">{formatDate(requestData.requestDate)}</Text>
                    </View>
                  </View>
                  <View className="flex-row space-x-4">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-secondary mb-1">Requester</Text>
                      <Text className="text-base text-text-primary">{requestData.requesterName}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-text-secondary mb-1">Email</Text>
                      <Text className="text-base text-text-primary">{requestData.requesterEmail}</Text>
                    </View>
                  </View>
                  <View>
                    <Text className="text-sm font-medium text-text-secondary mb-1">Last Modified</Text>
                    <Text className="text-base text-text-primary">{formatDateTime(requestData.lastModified)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Request Details Section */}
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-4">Request Details</Text>
              <View className="mb-4">
                <Text className="text-sm font-medium text-text-secondary mb-2">Item Requested</Text>
                <TextInput value={requestData.itemRequested} editable={false} className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 opacity-60" />
              </View>
              <View className="flex-row space-x-4 mb-4">
                <View className="w-28">
                  <Text className="text-sm font-medium text-text-secondary mb-2">Quantity</Text>
                  <TextInput value={requestData.quantity} editable={false} className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 opacity-60" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-secondary mb-2">Phone No</Text>
                  <TextInput value={requestData.phoneNo} editable={false} className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 opacity-60" />
                </View>
              </View>
              <View className="mb-4">
                <Text className="text-sm font-medium text-text-secondary mb-2">Reason for Request</Text>
                <TextInput value={requestData.reasonForRequest} editable={false} multiline textAlignVertical="top" className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[100px] px-4 py-3 opacity-60" />
              </View>
              <View className="flex-row space-x-4 mb-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-secondary mb-2">Date Needed By</Text>
                  <TouchableOpacity disabled={true}>
                    <View className="bg-white rounded-lg shadow-sm border border-gray-100 opacity-60">
                      <View className="flex-row items-center justify-between px-4 py-3">
                        <Text className="text-base font-system text-text-primary">{requestData.dateNeededBy ? formatDate(requestData.dateNeededBy) : 'Not set'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-secondary mb-2">Priority</Text>
                  <TouchableOpacity disabled={true}>
                    <View className="rounded-lg flex-row items-center justify-between px-4 py-3 opacity-60" style={{ backgroundColor: getPriorityInfo(requestData.priority).bgColor }}>
                      <Text className="text-base font-medium font-system" style={{ color: getPriorityInfo(requestData.priority).color }}>{requestData.priority}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mb-4">
                <Text className="text-sm font-medium text-text-secondary mb-2">Charge To Department</Text>
                <TouchableOpacity disabled={true}>
                  <View className="bg-white rounded-lg shadow-sm border border-gray-100 opacity-60">
                    <View className="flex-row items-center justify-between px-4 py-3">
                      <Text className="text-base font-system text-text-primary">{requestData.chargeToDepartment || 'Not selected'}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Financial Information Section */}
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-4">Financial Information</Text>
              <View className="space-y-4">
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Estimated Cost</Text>
                    <TextInput value={requestData.estimatedCost} onChangeText={(text) => isFieldEditable('estimatedCost') && updateField('estimatedCost', text)} editable={isFieldEditable('estimatedCost')} className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('estimatedCost') ? 'opacity-60' : ''}`} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Budget Code</Text>
                    <TextInput value={requestData.budgetCode} onChangeText={(text) => isFieldEditable('budgetCode') && updateField('budgetCode', text)} editable={isFieldEditable('budgetCode')} className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('budgetCode') ? 'opacity-60' : ''}`} />
                  </View>
                </View>
                <View>
                  <Text className="text-sm font-medium text-text-secondary mb-2">Approval Level Required</Text>
                  <TouchableOpacity onPress={() => isFieldEditable('approvalLevel') && setShowApprovalLevelPicker(true)} disabled={!isFieldEditable('approvalLevel')}>
                    <View className={`bg-white rounded-lg shadow-sm border border-gray-100 ${!isFieldEditable('approvalLevel') ? 'opacity-60' : ''}`}>
                      <View className="flex-row items-center justify-between px-4 py-3">
                        <Text className="text-base font-system text-text-primary">{requestData.approvalLevel}</Text>
                        {isFieldEditable('approvalLevel') && <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Comments Section */}
            {(requestData.hodComments || requestData.managerComments || canReject) && (
              <View>
                <Text className="text-lg font-semibold text-text-primary mb-4">Comments & Feedback</Text>
                {requestData.hodComments && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Head of Department Comments</Text>
                    <TextInput value={requestData.hodComments} editable={false} multiline className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[80px] px-4 py-3 opacity-60" />
                  </View>
                )}
                {requestData.managerComments && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Manager Comments</Text>
                    <TextInput value={requestData.managerComments} editable={false} multiline className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[80px] px-4 py-3 opacity-60" />
                  </View>
                )}
                {canReject && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium text-text-secondary mb-2">Reason for Rejection <Text className="text-red-500">*</Text></Text>
                    <TextInput value={requestData.rejectionReason} onChangeText={(text) => updateField('rejectionReason', text)} placeholder="Please provide a detailed reason for rejection..." multiline textAlignVertical="top" className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[100px] px-4 py-3" />
                  </View>
                )}
              </View>
            )}

            {/* Attachments Section */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2">Attachments / Link</Text>
              {!isRequester && (
                <TouchableOpacity onPress={handleFileUpload}>
                  <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[80px]">
                    <Text className="text-base text-text-secondary font-system">Upload additional file</Text>
                  </View>
                </TouchableOpacity>
              )}
              {requestData.attachments.length > 0 && (
                <View className="mt-3 space-y-2">
                  {requestData.attachments.map((file, index) => (
                    <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                      <MaterialIcons name="attach-file" size={20} color="#8A8A8E" />
                      <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>{file.name}</Text>
                      {!isRequester && (
                        <TouchableOpacity onPress={() => updateField('attachments', requestData.attachments.filter((_, i) => i !== index))}>
                          <MaterialIcons name="close" size={20} color="#8A8A8E" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        {(canApprove || canReject) && (
          <Animated.View entering={FadeInDown.delay(300).duration(300)} className="absolute bottom-0 left-0 right-0 bg-bg-primary pt-3 pb-6 px-6 border-t border-gray-200">
            <View className="flex-row space-x-3">
              {canReject && (
                <View className="flex-1">
                  <TouchableOpacity onPress={handleReject} className="bg-red-600 rounded-xl py-4 active:opacity-80">
                    <Text className="text-white text-lg font-semibold text-center">Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
              {canApprove && (
                <View className="flex-1">
                  <TouchableOpacity onPress={handleApprove} className="bg-blue-500 rounded-xl py-4 active:opacity-80">
                    <Text className="text-white text-lg font-semibold text-center">Approve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* PICKER MODALS */}
        {showDatePicker && <DateTimePicker value={requestData.dateNeededBy || new Date()} mode="date" display="spinner" onChange={handleDateChange} minimumDate={new Date()} />}
        
        <Modal visible={showPriorityPicker} transparent animationType="fade" onRequestClose={() => setShowPriorityPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[300px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Priority</Text>
              {PRIORITY_OPTIONS.map((option) => (
                <TouchableOpacity key={option.value} onPress={() => { updateField('priority', option.value); setShowPriorityPicker(false); }} className="py-3 border-b border-gray-200 last:border-b-0">
                  <Text className="text-base font-medium text-center" style={{ color: option.color }}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowPriorityPicker(false)} className="mt-4"><Text className="text-base text-text-secondary text-center">Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showDepartmentPicker} transparent animationType="fade" onRequestClose={() => setShowDepartmentPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[300px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Department</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {DEPARTMENT_OPTIONS.map((department) => (
                  <TouchableOpacity key={department} onPress={() => { updateField('chargeToDepartment', department); setShowDepartmentPicker(false); }} className="py-3 border-b border-gray-200 last:border-b-0">
                    <Text className="text-base text-text-primary text-center">{department}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(false)} className="mt-4 p-6"><Text className="text-base text-text-secondary text-center">Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showApprovalLevelPicker} transparent animationType="fade" onRequestClose={() => setShowApprovalLevelPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl w-full max-w-[300px] max-h-[400px] shadow-lg">
              <Text className="text-lg font-semibold text-text-primary my-4 text-center">Select Approval Level</Text>
              <ScrollView showsVerticalScrollIndicator={false} className="px-6">
                {APPROVAL_LEVELS.map((level) => (
                  <TouchableOpacity key={level} onPress={() => { updateField('approvalLevel', level); setShowApprovalLevelPicker(false); }} className="py-3 border-b border-gray-200 last:border-b-0">
                    <Text className="text-base text-text-primary text-center">{level}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowApprovalLevelPicker(false)} className="mt-4 p-6"><Text className="text-base text-text-secondary text-center">Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Confirmation Modals */}
        <Modal visible={showApproveModal} transparent animationType="fade" onRequestClose={() => setShowApproveModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg items-center">
              <View className="bg-green-100 rounded-full p-3 mb-4"><MaterialIcons name="check-circle-outline" size={48} color="#34D399" /></View>
              <Text className="text-lg font-semibold text-text-primary mb-2 text-center">Approve Request</Text>
              <Text className="text-base text-text-secondary mb-6 text-center">Thank you for your approval! Your decision has been recorded.</Text>
              <TouchableOpacity onPress={confirmApprove} className="bg-blue-500 rounded-lg py-3 w-full active:opacity-80">
                <Text className="text-base font-semibold text-white text-center">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showRejectModal} transparent animationType="fade" onRequestClose={() => setShowRejectModal(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="bg-white rounded-2xl p-6 w-full max-w-[350px] shadow-lg items-center">
              <View className="bg-red-100 rounded-full p-3 mb-4"><MaterialIcons name="highlight-off" size={48} color="#F87171" /></View>
              <Text className="text-lg font-semibold text-text-primary mb-2 text-center">Confirm Rejection</Text>
              <Text className="text-base text-text-secondary mb-6 text-center">Are you sure you want to reject request {requestData.requestId}?</Text>
              <View className="flex-row space-x-3 w-full">
                <TouchableOpacity onPress={() => setShowRejectModal(false)} className="flex-1 bg-gray-100 rounded-lg py-3 active:opacity-80">
                  <Text className="text-base font-semibold text-gray-600 text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmReject} className="flex-1 bg-red-600 rounded-lg py-3 active:opacity-80">
                  <Text className="text-base font-semibold text-white text-center">Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}