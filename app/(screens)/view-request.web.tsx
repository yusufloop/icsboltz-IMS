import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ICSBOLTZ_CURRENT_USER_ROLE, hasPermission } from '@/constants/UserRoles';

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


// --- NEW APPROVAL FLOW INTERFACES AND DATA ---
type ApprovalStatus = 'Approved' | 'In Progress' | 'Rejected' | 'Pending';

interface ApprovalStep {
  title: string;
  status: ApprovalStatus;
  stepNumber?: number;
}

// This static array drives the new progress indicator.
// It can easily be replaced with dynamic data from a database.
const approvalFlowSteps: ApprovalStep[] = [
  { title: 'Requester', status: 'Approved' },
  { title: 'Head of Department', status: 'In Progress', stepNumber: 2 },
  { title: 'General Manager', status: 'Pending', stepNumber: 4 },
];


// --- NEW APPROVAL FLOW COMPONENT ---
const ApprovalFlow = ({ steps }: { steps: ApprovalStep[] }) => {
  const getStepStyles = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved':
        return {
          circle: 'bg-green-100 border-2 border-green-400',
          iconColor: '#16A34A',
          line: 'bg-green-400',
          statusText: 'text-green-600 font-semibold',
          titleText: 'text-gray-800 font-bold',
        };
      case 'In Progress':
        return {
          circle: 'bg-blue-500 border-2 border-blue-500',
          iconColor: '#FFFFFF',
          line: 'bg-gray-300',
          statusText: 'text-blue-500 font-semibold',
          titleText: 'text-gray-800 font-bold',
        };
      case 'Rejected':
         return {
          circle: 'bg-red-100 border-2 border-red-400',
          iconColor: '#DC2626',
          line: 'bg-gray-300',
          statusText: 'text-red-600 font-semibold',
          titleText: 'text-gray-800 font-bold',
        };
      default: // Pending
        return {
          circle: 'bg-gray-100 border-2 border-gray-300',
          iconColor: '#6B7280',
          line: 'bg-gray-300',
          statusText: 'text-gray-500',
          titleText: 'text-gray-500 font-medium',
        };
    }
  };

  return (
    <View className="px-6 py-8">
      <View className="flex-row items-start justify-between">
        {steps.map((step, index) => {
          const styles = getStepStyles(step.status);
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <View className="flex-1 items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${styles.circle}`}>
                  {step.status === 'Approved' ? (
                    <MaterialIcons name="check" size={24} color={styles.iconColor} />
                  ) : step.status === 'Rejected' ? (
                    <MaterialIcons name="close" size={24} color={styles.iconColor} />
                  ) : (
                    <Text className={`text-base font-bold`} style={{ color: styles.iconColor }}>
                      {step.stepNumber}
                    </Text>
                  )}
                </View>
                <Text className={`mt-3 text-center text-sm ${styles.titleText}`}>{step.title}</Text>
                <Text className={`mt-1 text-center text-sm ${styles.statusText}`}>{step.status}</Text>
              </View>

              {!isLastStep && (
                <View className="flex-1" style={{ top: 18 }}>
                  <View className={`h-1 rounded-full ${getStepStyles(steps[index].status).line}`} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};


export default function ViewRequestWeb() {
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

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showApprovalLevelDropdown, setShowApprovalLevelDropdown] = useState(false);

  const canApprove = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'approve');
  const canReject = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'reject');
  const isRequester = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER';

  const updateField = (field: keyof RequestViewData, value: any) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    if (isRequester) return;
    console.log('File upload clicked');
  };

  const handleApprove = () => {
    Alert.alert('Approve Request', `Are you sure you want to approve request ${requestData.requestId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', style: 'default', onPress: () => {
        console.log('Request approved:', requestData.requestId);
        Alert.alert('Success', 'Request has been approved successfully!', [{ text: 'OK', onPress: () => router.back() }]);
      }}
    ]);
  };

  const handleReject = () => {
    if (!requestData.rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    Alert.alert('Reject Request', `Are you sure you want to reject request ${requestData.requestId}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => {
        console.log('Request rejected:', requestData.requestId, 'Reason:', requestData.rejectionReason);
        Alert.alert('Success', 'Request has been rejected successfully!', [{ text: 'OK', onPress: () => router.back() }]);
      }}
    ]);
  };

  const handleBack = () => {
    router.back();
  };
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatDateTime = (date: Date) => date.toLocaleString('en-MY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const getPriorityInfo = (priority: string | null) => PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[2];

  const isFieldEditable = (field: string) => {
    if (isRequester) return false;
    const editableFields = ['estimatedCost', 'budgetCode', 'approvalLevel', 'rejectionReason', 'hodComments', 'managerComments'];
    return editableFields.includes(field);
  };

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
            <Text className="text-2xl font-bold text-text-primary">View Request</Text>
            <Text className="text-sm text-text-secondary mt-1">Request ID: {requestData.requestId}</Text>
          </View>
          {/* IMPROVEMENT: Status badge removed from here */}
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: canApprove || canReject ? 140 : 40 }}>
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* IMPROVEMENT: New ApprovalFlow component added */}
              <ApprovalFlow steps={approvalFlowSteps} />

              <View className="border-t border-gray-200" />

              <View className="px-6 py-6 space-y-6">
                
                {/* Request Information Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Request Information</Text>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Request ID</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base font-mono text-text-primary">{requestData.requestId}</Text></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Request Date</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{formatDate(requestData.requestDate)}</Text></View></View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Requester</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{requestData.requesterName}</Text></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Email</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{requestData.requesterEmail}</Text></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Last Modified</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{formatDateTime(requestData.lastModified)}</Text></View></View>
                </View>

                {/* Request Details Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Request Details</Text>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Item Requested</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('itemRequested') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={requestData.itemRequested} onChangeText={(text) => isFieldEditable('itemRequested') && updateField('itemRequested', text)} editable={isFieldEditable('itemRequested')} placeholder="Enter product name" placeholderTextColor="#8A8A8E" /></View></View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="w-32"><Text className="text-sm font-semibold text-text-primary mb-2">Quantity</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('quantity') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={requestData.quantity} onChangeText={(text) => isFieldEditable('quantity') && updateField('quantity', text)} editable={isFieldEditable('quantity')} keyboardType="numeric" placeholder="Enter quantity" placeholderTextColor="#8A8A8E" /></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Phone No</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('phoneNo') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={requestData.phoneNo} onChangeText={(text) => isFieldEditable('phoneNo') && updateField('phoneNo', text)} editable={isFieldEditable('phoneNo')} keyboardType="phone-pad" placeholder="Enter phone Number" placeholderTextColor="#8A8A8E" /></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Reason For Request</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[80px] ${isFieldEditable('reasonForRequest') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput value={requestData.reasonForRequest} onChangeText={(text) => isFieldEditable('reasonForRequest') && updateField('reasonForRequest', text)} editable={isFieldEditable('reasonForRequest')} placeholder="Enter why you requested the item" placeholderTextColor="#8A8A8E" multiline numberOfLines={3} className="flex-1 text-base text-text-primary" textAlignVertical="top" /></View></View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Date Needed By</Text><TouchableOpacity className={`rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] ${isRequester ? 'bg-gray-100' : 'bg-bg-secondary active:opacity-80'}`} disabled={isRequester}><MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} /><Text className="flex-1 text-base text-text-primary">{requestData.dateNeededBy ? formatDate(requestData.dateNeededBy) : 'Date'}</Text></TouchableOpacity></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Priority</Text><TouchableOpacity className={`rounded-lg border flex-row items-center px-4 py-3 min-h-[44px] ${isRequester ? 'opacity-60' : 'active:opacity-80'}`} style={{ backgroundColor: priorityInfo.bgColor, borderColor: priorityInfo.color + '40' }} onPress={() => !isRequester && setShowPriorityDropdown(!showPriorityDropdown)} disabled={isRequester}><Text className="flex-1 text-base font-medium" style={{ color: priorityInfo.color }}>{priorityInfo.label}</Text>{!isRequester && <MaterialIcons name="chevron-right" size={20} color={priorityInfo.color} />}</TouchableOpacity>{showPriorityDropdown && !isRequester && (<View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2"><>{PRIORITY_OPTIONS.map((option) => (<TouchableOpacity key={option.value} onPress={() => { updateField('priority', option.value); setShowPriorityDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"><Text className="text-base font-medium" style={{ color: option.color }}>{option.label}</Text></TouchableOpacity>))}</></View>)}</View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Charge to Department</Text><TouchableOpacity className={`rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] ${isRequester ? 'bg-gray-100' : 'bg-bg-secondary active:opacity-80'}`} onPress={() => !isRequester && setShowDepartmentDropdown(!showDepartmentDropdown)} disabled={isRequester}><Text className="flex-1 text-base text-text-primary">{requestData.chargeToDepartment || 'Marketing'}</Text>{!isRequester && <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />}</TouchableOpacity>{showDepartmentDropdown && !isRequester && (<View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2 max-h-48"><ScrollView showsVerticalScrollIndicator={false}>{DEPARTMENT_OPTIONS.map((department) => (<TouchableOpacity key={department} onPress={() => { updateField('chargeToDepartment', department); setShowDepartmentDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"><Text className="text-base text-text-primary">{department}</Text></TouchableOpacity>))}</ScrollView></View>)}</View>
                </View>

                {/* Financial Information Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Financial Information</Text>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Estimated Cost</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('estimatedCost') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={requestData.estimatedCost} onChangeText={(text) => isFieldEditable('estimatedCost') && updateField('estimatedCost', text)} editable={isFieldEditable('estimatedCost')} placeholder="Enter estimated cost" placeholderTextColor="#8A8A8E" /></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Budget Code</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('budgetCode') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={requestData.budgetCode} onChangeText={(text) => isFieldEditable('budgetCode') && updateField('budgetCode', text)} editable={isFieldEditable('budgetCode')} placeholder="Enter budget code" placeholderTextColor="#8A8A8E" /></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Approval Level Required</Text><TouchableOpacity className={`rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] ${isFieldEditable('approvalLevel') ? 'bg-bg-secondary active:opacity-80' : 'bg-gray-100'}`} onPress={() => isFieldEditable('approvalLevel') && setShowApprovalLevelDropdown(!showApprovalLevelDropdown)} disabled={!isFieldEditable('approvalLevel')}><Text className="flex-1 text-base text-text-primary">{requestData.approvalLevel}</Text>{isFieldEditable('approvalLevel') && <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />}</TouchableOpacity>{showApprovalLevelDropdown && isFieldEditable('approvalLevel') && (<View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2"><>{APPROVAL_LEVELS.map((level) => (<TouchableOpacity key={level} onPress={() => { updateField('approvalLevel', level); setShowApprovalLevelDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"><Text className="text-base text-text-primary">{level}</Text></TouchableOpacity>))}</></View>)}</View>
                </View>

                {/* Comments Section */}
                {(requestData.hodComments || requestData.managerComments || canReject) && (
                  <View>
                    <Text className="text-lg font-bold text-text-primary mb-4">Comments & Feedback</Text>
                    {requestData.hodComments && (<View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Head of Department Comments</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[80px] ${isFieldEditable('hodComments') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput value={requestData.hodComments} onChangeText={(text) => isFieldEditable('hodComments') && updateField('hodComments', text)} editable={isFieldEditable('hodComments')} multiline numberOfLines={3} className="flex-1 text-base text-text-primary" textAlignVertical="top" placeholder="HOD comments..." placeholderTextColor="#8A8A8E" /></View></View>)}
                    {requestData.managerComments && (<View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Manager Comments</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[80px] ${isFieldEditable('managerComments') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput value={requestData.managerComments} onChangeText={(text) => isFieldEditable('managerComments') && updateField('managerComments', text)} editable={isFieldEditable('managerComments')} multiline numberOfLines={3} className="flex-1 text-base text-text-primary" textAlignVertical="top" placeholder="Manager comments..." placeholderTextColor="#8A8A8E" /></View></View>)}
                    {canReject && (<View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Reason for Rejection <Text className="text-red-500">*</Text></Text><View className="rounded-lg bg-bg-secondary border border-gray-300 px-4 py-3 min-h-[100px]"><TextInput value={requestData.rejectionReason} onChangeText={(text) => updateField('rejectionReason', text)} placeholder="Please provide a detailed reason for rejection..." placeholderTextColor="#8A8A8E" multiline numberOfLines={4} className="flex-1 text-base text-text-primary" textAlignVertical="top" /></View></View>)}
                  </View>
                )}

                {/* Attachments Section */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Attachments / Link</Text>
                  {!isRequester && (<TouchableOpacity className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50" onPress={handleFileUpload}><View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center"><MaterialIcons name="cloud-upload" size={24} color="#9CA3AF" /></View><Text className="text-gray-500 text-center mb-2">Drag File/Image here</Text><Text className="text-gray-400 text-center mb-3">or</Text><Text className="text-blue-500 font-medium">Browse File/image</Text></TouchableOpacity>)}
                  {requestData.attachments.length > 0 && (
                    <View className="mt-3 space-y-2">
                      {requestData.attachments.map((file, index) => (
                        <View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg">
                          <MaterialIcons name="attach-file" size={20} color="#8A8A8E" />
                          <Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>{file.name}</Text>
                          {!isRequester && (<TouchableOpacity onPress={() => updateField('attachments', requestData.attachments.filter((_, i) => i !== index))}><MaterialIcons name="close" size={20} color="#8A8A8E" /></TouchableOpacity>)}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Sticky Footer with Action Buttons */}
              {(canApprove || canReject) && (
                <View className="border-t border-gray-200 px-6 py-4 bg-white">
                  <View className="flex-row space-x-4">
                    {canReject && (<TouchableOpacity onPress={handleReject} className="flex-1 bg-red-500 border border-red-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"><Text className="text-base font-semibold text-white">Reject</Text></TouchableOpacity>)}
                    {canApprove && (<TouchableOpacity onPress={handleApprove} className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"><Text className="text-base font-semibold text-white">Approve</Text></TouchableOpacity>)}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}