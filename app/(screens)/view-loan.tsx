import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumStatusBadge } from '@/components/ui/PremiumStatusBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
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
// Interface updated for Loan data
interface LoanViewData {
  // Basic loan fields
  itemLoaned: string;
  quantity: string;
  reasonForLoan: string;
  phoneNo: string;
  loanStartDate: Date | null;
  loanEndDate: Date | null; // Added field for loans
  priority: 'Low' | 'Medium' | 'High' | null;
  chargeToDepartment: string;
  attachments: any[];
  
  // Technical/Administrative fields
  loanId: string;
  loanDate: Date;
  borrowerName: string;
  borrowerEmail: string;
  status: 'Active' | 'Returned' | 'Overdue' | 'Pending Approval';
  estimatedValue: string; // Changed from cost
  assetCode: string; // Changed from budgetCode
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
// Renamed component
export default function ViewLoanScreen() {
  const params = useLocalSearchParams();
  
  // Updated state with loan-specific mock data
  const [loanData, setLoanData] = useState<LoanViewData>({
    itemLoaned: (params.itemLoaned as string) || 'Epson Projector EB-X05',
    quantity: (params.quantity as string) || '1',
    reasonForLoan: (params.reasonForLoan as string) || 'For client presentation in the main conference room on Friday.',
    phoneNo: (params.phoneNo as string) || '+60198765432',
    loanStartDate: params.loanStartDate ? new Date(params.loanStartDate as string) : new Date('2025-03-10'),
    loanEndDate: params.loanEndDate ? new Date(params.loanEndDate as string) : new Date('2025-03-15'),
    priority: (params.priority as 'Low' | 'Medium' | 'High') || 'Medium',
    chargeToDepartment: (params.chargeToDepartment as string) || 'Sales Department',
    attachments: [],
    
    loanId: (params.loanId as string) || 'LOAN-2025-000456',
    loanDate: new Date('2025-03-08'),
    borrowerName: (params.borrowerName as string) || 'Siti Nurhaliza',
    borrowerEmail: (params.borrowerEmail as string) || 'siti.nurhaliza@icsboltz.com.my',
    status: (params.status as 'Active' | 'Returned' | 'Overdue' | 'Pending Approval') || 'Pending Approval',
    estimatedValue: (params.estimatedValue as string) || 'RM 2,500.00',
    assetCode: (params.assetCode as string) || 'IT-ASSET-0123',
    approvalLevel: (params.approvalLevel as string) || 'Department Head',
    lastModified: new Date(),
    
    hodComments: (params.hodComments as string) || '',
    managerComments: (params.managerComments as string) || '',
    rejectionReason: '',
  });

  // Updated state for date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showApprovalLevelPicker, setShowApprovalLevelPicker] = useState(false);
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const canApprove = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'approve');
  const canReject = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'reject');
  const isBorrower = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER'; // Assuming Requester role borrows items

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof LoanViewData, value: any) => {
    setLoanData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate && !isBorrower) {
      updateField('loanStartDate', selectedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate && !isBorrower) {
      updateField('loanEndDate', selectedDate);
    }
  };

  const handleFileUpload = async () => {
    if (isBorrower) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets[0]) {
        updateField('attachments', [...loanData.attachments, result.assets[0]]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleApprove = () => setShowApproveModal(true);

  const handleReject = () => {
    if (!loanData.rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    setShowRejectModal(true);
  };

  const confirmApproveLoan = () => {
    console.log('Loan approved:', loanData.loanId);
    router.push('/loan');
  };

  const confirmRejectLoan = () => {
    console.log('Loan rejected:', loanData.loanId, 'Reason:', loanData.rejectionReason);
    router.push('/loan');
  };

  const handleBack = () => router.back();
  
  // --- HELPER FUNCTIONS ---
  const formatDate = (date: Date) => date.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatDateTime = (date: Date) => date.toLocaleString('en-MY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getPriorityInfo = (priority: string | null) => {
    const defaultOption = { color: '#FF453A', bgColor: '#FF453A20' }; // High
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    if (!option) return defaultOption;
    return { color: option.color, bgColor: `${option.color}20` };
  };

  const isFieldEditable = (field: string) => {
    if (isBorrower) return false;
    const editableFields = ['estimatedValue', 'assetCode', 'approvalLevel', 'rejectionReason', 'hodComments', 'managerComments'];
    return editableFields.includes(field);
  };

  // --- RENDER ---
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header - Updated for Loans */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          className="flex-row items-center px-4 py-3"
        >
          <TouchableOpacity onPress={handleBack} className="p-2 -ml-2 mr-2 active:opacity-70">
            <MaterialIcons name="arrow-back" size={28} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-text-primary">View Loan</Text>
            <Text className="text-sm text-text-secondary mt-1">Loan ID: {loanData.loanId}</Text>
          </View>
          <PremiumStatusBadge 
            status={
              loanData.status === 'Returned' ? 'success' :
              loanData.status === 'Overdue' ? 'error' :
              loanData.status === 'Active' ? 'warning' : 'info'
            }
            text={loanData.status}
          />
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
              <Text className="text-lg font-semibold text-text-primary mb-4">Loan Information</Text>
              <PremiumCard>
                <View className="space-y-4">
                  <View className="flex-row space-x-4">
                    <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-1">Loan ID</Text><Text className="text-base font-mono text-text-primary">{loanData.loanId}</Text></View>
                    <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-1">Loan Date</Text><Text className="text-base text-text-primary">{formatDate(loanData.loanDate)}</Text></View>
                  </View>
                  <View className="flex-row space-x-4">
                    <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-1">Borrower</Text><Text className="text-base text-text-primary">{loanData.borrowerName}</Text></View>
                    <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-1">Email</Text><Text className="text-base text-text-primary">{loanData.borrowerEmail}</Text></View>
                  </View>
                  <View><Text className="text-sm font-medium text-text-secondary mb-1">Last Modified</Text><Text className="text-base text-text-primary">{formatDateTime(loanData.lastModified)}</Text></View>
                </View>
              </PremiumCard>
            </View>

            {/* Loan Details Section */}
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-4">Loan Details</Text>
              <View className="mb-4"><Text className="text-sm font-medium text-text-secondary mb-2">Item Loaned</Text><TextInput value={loanData.itemLoaned} editable={isFieldEditable('itemLoaned')} className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('itemLoaned') ? 'opacity-60' : ''}`} /></View>
              <View className="flex-row space-x-4 mb-4">
                <View className="w-28"><Text className="text-sm font-medium text-text-secondary mb-2">Quantity</Text><TextInput value={loanData.quantity} editable={isFieldEditable('quantity')} keyboardType="numeric" className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('quantity') ? 'opacity-60' : ''}`} /></View>
                <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Phone No</Text><TextInput value={loanData.phoneNo} editable={isFieldEditable('phoneNo')} keyboardType="phone-pad" className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('phoneNo') ? 'opacity-60' : ''}`} /></View>
              </View>
              <View className="mb-4"><Text className="text-sm font-medium text-text-secondary mb-2">Reason for Loan</Text><TextInput value={loanData.reasonForLoan} editable={isFieldEditable('reasonForLoan')} multiline textAlignVertical="top" className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 min-h-[100px] px-4 py-3 ${!isFieldEditable('reasonForLoan') ? 'opacity-60' : ''}`} /></View>
              
              {/* Updated Date and Priority Row for Loans */}
              <View className="flex-row space-x-4 mb-4">
                <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Loan Start Date</Text><TouchableOpacity onPress={() => !isBorrower && setShowStartDatePicker(true)} disabled={isBorrower}><PremiumCard padding="" style={{ opacity: isBorrower ? 0.6 : 1 }}><View className="flex-row items-center justify-between px-4 py-3"><Text className="text-base font-system text-text-primary">{loanData.loanStartDate ? formatDate(loanData.loanStartDate) : 'Not set'}</Text>{!isBorrower && <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />}</View></PremiumCard></TouchableOpacity></View>
                <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Loan End Date</Text><TouchableOpacity onPress={() => !isBorrower && setShowEndDatePicker(true)} disabled={isBorrower}><PremiumCard padding="" style={{ opacity: isBorrower ? 0.6 : 1 }}><View className="flex-row items-center justify-between px-4 py-3"><Text className="text-base font-system text-text-primary">{loanData.loanEndDate ? formatDate(loanData.loanEndDate) : 'Not set'}</Text>{!isBorrower && <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />}</View></PremiumCard></TouchableOpacity></View>
              </View>
              
              <View className="flex-row space-x-4 mb-4">
                <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Priority</Text><TouchableOpacity onPress={() => !isBorrower && setShowPriorityPicker(true)} disabled={isBorrower}><View className="rounded-lg flex-row items-center justify-between px-4 py-3" style={{ backgroundColor: getPriorityInfo(loanData.priority).bgColor, opacity: isBorrower ? 0.6 : 1 }}><Text className="text-base font-medium font-system" style={{ color: getPriorityInfo(loanData.priority).color }}>{loanData.priority}</Text>{!isBorrower && <MaterialIcons name="chevron-right" size={24} color={getPriorityInfo(loanData.priority).color} />}</View></TouchableOpacity></View>
                <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Charge To Department</Text><TouchableOpacity onPress={() => !isBorrower && setShowDepartmentPicker(true)} disabled={isBorrower}><PremiumCard padding="" style={{ opacity: isBorrower ? 0.6 : 1 }}><View className="flex-row items-center justify-between px-4 py-3"><Text className="text-base font-system text-text-primary">{loanData.chargeToDepartment || 'Not selected'}</Text>{!isBorrower && <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />}</View></PremiumCard></TouchableOpacity></View>
              </View>
            </View>

            {/* Asset Information Section */}
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-4">Asset Information</Text>
              <View className="space-y-4">
                <View className="flex-row space-x-4">
                  <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Estimated Value</Text><TextInput value={loanData.estimatedValue} editable={isFieldEditable('estimatedValue')} className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('estimatedValue') ? 'opacity-60' : ''}`} /></View>
                  <View className="flex-1"><Text className="text-sm font-medium text-text-secondary mb-2">Asset Code</Text><TextInput value={loanData.assetCode} editable={isFieldEditable('assetCode')} className={`bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3 ${!isFieldEditable('assetCode') ? 'opacity-60' : ''}`} /></View>
                </View>
                <View><Text className="text-sm font-medium text-text-secondary mb-2">Approval Level Required</Text><TouchableOpacity onPress={() => isFieldEditable('approvalLevel') && setShowApprovalLevelPicker(true)} disabled={!isFieldEditable('approvalLevel')}><PremiumCard padding="" style={{ opacity: !isFieldEditable('approvalLevel') ? 0.6 : 1 }}><View className="flex-row items-center justify-between px-4 py-3"><Text className="text-base font-system text-text-primary">{loanData.approvalLevel}</Text>{isFieldEditable('approvalLevel') && <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />}</View></PremiumCard></TouchableOpacity></View>
              </View>
            </View>

            {/* Comments and Attachments etc. remain structurally similar */}
            {/* ... */}
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        {(canApprove || canReject) && (
          <Animated.View entering={FadeInDown.delay(300).duration(300)} className="absolute bottom-0 left-0 right-0 bg-bg-primary pt-3 pb-6 px-6 border-t border-gray-200">
            <View className="flex-row space-x-3">
              {canReject && <View className="flex-1"><PremiumButton title="Reject" onPress={handleReject} variant="destructive" size="lg" /></View>}
              {canApprove && <View className="flex-1"><PremiumButton title="Approve" onPress={handleApprove} variant="gradient" size="lg" /></View>}
            </View>
          </Animated.View>
        )}

        {/* PICKER MODALS */}
        {showStartDatePicker && <DateTimePicker value={loanData.loanStartDate || new Date()} mode="date" display="spinner" onChange={handleStartDateChange} minimumDate={new Date()} />}
        {showEndDatePicker && <DateTimePicker value={loanData.loanEndDate || loanData.loanStartDate || new Date()} mode="date" display="spinner" onChange={handleEndDateChange} minimumDate={loanData.loanStartDate || new Date()} />}
        
        {/* Other Modals (Priority, Department, Approval Level) remain the same */}
        {/* ... */}

        {/* Confirmation Modals - Updated for Loans */}
        <ConfirmationModal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} onConfirm={confirmApproveLoan} title="Approve Loan" message="Thank you for your approval! Your decision has been recorded." confirmText="OK" type="success" showIcon={true} />
        <ConfirmationModal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} onConfirm={confirmRejectLoan} title="Confirm Rejection" message={`Are you sure you want to reject loan ${loanData.loanId}?`} confirmText="Reject" cancelText="Cancel" type="error" showIcon={true} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}