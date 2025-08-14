import { ICSBOLTZ_CURRENT_USER_ROLE, hasPermission } from '@/constants/UserRoles';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- INTERFACES AND CONSTANTS - UPDATED FOR LOANS ---
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
  status: 'Pending Approval' | 'Active' | 'Returned' | 'Overdue';
  estimatedValue: string;
  assetCode: string;
  approvalLevel: string;
  lastModified: Date;

  // Comments and feedback
  hodComments: string;
  managerComments: string;
  decisionComments: string; 
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


// --- APPROVAL FLOW COMPONENT (Can be reused) ---
type ApprovalStatus = 'Approved' | 'In Progress' | 'Rejected' | 'Pending';

interface ApprovalStep {
  title: string;
  status: ApprovalStatus;
  stepNumber?: number;
}

const approvalFlowSteps: ApprovalStep[] = [
  { title: 'Borrower', status: 'Approved' },
  { title: 'Head of Department', status: 'In Progress', stepNumber: 2 },
  { title: 'Asset Manager', status: 'Pending', stepNumber: 3 },
];

const ApprovalFlow = ({ steps }: { steps: ApprovalStep[] }) => {
  const getStepStyles = (status: ApprovalStatus) => {
    switch (status) {
      case 'Approved': return { circle: 'bg-green-100 border-2 border-green-400', iconColor: '#16A34A', line: 'bg-green-400', statusText: 'text-green-600 font-semibold', titleText: 'text-gray-800 font-bold' };
      case 'In Progress': return { circle: 'bg-blue-500 border-2 border-blue-500', iconColor: '#FFFFFF', line: 'bg-gray-300', statusText: 'text-blue-500 font-semibold', titleText: 'text-gray-800 font-bold' };
      case 'Rejected': return { circle: 'bg-red-100 border-2 border-red-400', iconColor: '#DC2626', line: 'bg-gray-300', statusText: 'text-red-600 font-semibold', titleText: 'text-gray-800 font-bold' };
      default: return { circle: 'bg-gray-100 border-2 border-gray-300', iconColor: '#6B7280', line: 'bg-gray-300', statusText: 'text-gray-500', titleText: 'text-gray-500 font-medium' };
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
                  {step.status === 'Approved' ? <MaterialIcons name="check" size={24} color={styles.iconColor} /> : step.status === 'Rejected' ? <MaterialIcons name="close" size={24} color={styles.iconColor} /> : <Text className={`text-base font-bold`} style={{ color: styles.iconColor }}>{step.stepNumber}</Text>}
                </View>
                <Text className={`mt-3 text-center text-sm ${styles.titleText}`}>{step.title}</Text>
                <Text className={`mt-1 text-center text-sm ${styles.statusText}`}>{step.status}</Text>
              </View>
              {!isLastStep && (<View className="flex-1" style={{ top: 18 }}><View className={`h-1 rounded-full ${getStepStyles(steps[index].status).line}`} /></View>)}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

// --- MAIN COMPONENT - RENAMED ---
export default function ViewLoanWeb() {
  const params = useLocalSearchParams();

  // State updated for Loan data
  const [loanData, setLoanData] = useState<LoanViewData>({
    itemLoaned: (params.itemLoaned as string) || 'Epson Projector EB-X05',
    quantity: (params.quantity as string) || '1',
    reasonForLoan: (params.reasonForLoan as string) || 'Client presentation in main conference room.',
    phoneNo: (params.phoneNo as string) || '+60123456789',
    loanStartDate: params.loanStartDate ? new Date(params.loanStartDate as string) : new Date('2025-08-20'),
    loanEndDate: params.loanEndDate ? new Date(params.loanEndDate as string) : new Date('2025-08-27'),
    priority: (params.priority as 'Low' | 'Medium' | 'High') || 'Medium',
    chargeToDepartment: (params.chargeToDepartment as string) || 'Sales Department',
    attachments: [],
    loanId: (params.loanId as string) || 'LOAN-2025-00334',
    loanDate: new Date('2025-08-18'),
    borrowerName: (params.borrowerName as string) || 'Siti Nurhaliza',
    borrowerEmail: (params.borrowerEmail as string) || 'siti.nurhaliza@icsboltz.com.my',
    status: (params.status as 'Pending Approval' | 'Active' | 'Returned' | 'Overdue') || 'Pending Approval',
    estimatedValue: (params.estimatedValue as string) || 'RM 2,500.00',
    assetCode: (params.assetCode as string) || 'IT-AV-015',
    approvalLevel: (params.approvalLevel as string) || 'Department Head',
    lastModified: new Date(),
    hodComments: (params.hodComments as string) || '',
    managerComments: (params.managerComments as string) || '',
    decisionComments: '',
  });

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showApprovalLevelDropdown, setShowApprovalLevelDropdown] = useState(false);
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [decisionCommentError, setDecisionCommentError] = useState(false);

  const canApprove = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'approve');
  const canReject = hasPermission(ICSBOLTZ_CURRENT_USER_ROLE, 'reject');
  const isBorrower = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER';

  const updateField = (field: keyof LoanViewData, value: any) => {
    setLoanData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => { if (isBorrower) return; console.log('File upload clicked for loan'); };

  const handleApproveLoan = () => {
    if (!loanData.decisionComments.trim()) { setDecisionCommentError(true); return; }
    setDecisionCommentError(false);
    setShowApproveModal(true);
  };

  const handleRejectLoan = () => {
    if (!loanData.decisionComments.trim()) { setDecisionCommentError(true); return; }
    setDecisionCommentError(false);
    setShowRejectModal(true);
  };

  const confirmApproveLoan = () => {
    console.log('Loan approved:', loanData.loanId, 'Comments:', loanData.decisionComments);
    router.push('/loan'); // Navigate to the loan list page
  };

  const confirmRejectLoan = () => {
    console.log('Loan rejected:', loanData.loanId, 'Reason:', loanData.decisionComments);
    router.push('/loan'); // Navigate to the loan list page
  };

  const handleBack = () => router.back();
  const formatDate = (date: Date) => date.toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' });
  const formatDateTime = (date: Date) => date.toLocaleString('en-MY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const getPriorityInfo = (priority: string | null) => PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  const isFieldEditable = (field: keyof LoanViewData) => { if (isBorrower) return false; return ['estimatedValue', 'assetCode', 'approvalLevel', 'hodComments', 'managerComments'].includes(field); };
  const priorityInfo = getPriorityInfo(loanData.priority);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header - Updated for loans */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2 -ml-2 active:opacity-80"><MaterialIcons name="arrow-back" size={24} color="#1C1C1E" /></TouchableOpacity>
          <View className="flex-1"><Text className="text-2xl font-bold text-text-primary">View Loan</Text><Text className="text-sm text-text-secondary mt-1">Loan ID: {loanData.loanId}</Text></View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: canApprove || canReject ? 140 : 40 }}>
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <ApprovalFlow steps={approvalFlowSteps} />
              <View className="border-t border-gray-200" />
              <View className="px-6 py-6 space-y-6">

                {/* Loan Information Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Loan Information</Text>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Loan ID</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base font-mono text-text-primary">{loanData.loanId}</Text></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Date of Loan</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{formatDate(loanData.loanDate)}</Text></View></View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Borrower</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{loanData.borrowerName}</Text></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Email</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{loanData.borrowerEmail}</Text></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Last Modified</Text><View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center"><Text className="text-base text-text-primary">{formatDateTime(loanData.lastModified)}</Text></View></View>
                </View>

                {/* Loan Details Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Loan Details</Text>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Item Loaned</Text><View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] bg-gray-100"><TextInput className="flex-1 text-base text-text-primary" value={loanData.itemLoaned} editable={false} /></View></View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="w-32"><Text className="text-sm font-semibold text-text-primary mb-2">Quantity</Text><View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] bg-gray-100"><TextInput className="flex-1 text-base text-text-primary" value={loanData.quantity} editable={false} /></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Phone No</Text><View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] bg-gray-100"><TextInput className="flex-1 text-base text-text-primary" value={loanData.phoneNo} editable={false} /></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Reason For Loan</Text><View className="rounded-lg border border-gray-300 px-4 py-3 min-h-[80px] bg-gray-100"><TextInput value={loanData.reasonForLoan} editable={false} multiline className="flex-1 text-base text-text-primary" textAlignVertical="top" /></View></View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Loan Start Date</Text><TouchableOpacity className="rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] bg-gray-100" disabled={true}><MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} /><Text className="flex-1 text-base text-text-primary">{loanData.loanStartDate ? formatDate(loanData.loanStartDate) : 'Date'}</Text></TouchableOpacity></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Loan End Date</Text><TouchableOpacity className="rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] bg-gray-100" disabled={true}><MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} /><Text className="flex-1 text-base text-text-primary">{loanData.loanEndDate ? formatDate(loanData.loanEndDate) : 'Date'}</Text></TouchableOpacity></View>
                  </View>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Priority</Text><TouchableOpacity className="rounded-lg border flex-row items-center px-4 py-3 min-h-[44px] opacity-60" style={{ backgroundColor: priorityInfo.bgColor, borderColor: priorityInfo.color + '40' }} disabled={true}><Text className="flex-1 text-base font-medium" style={{ color: priorityInfo.color }}>{priorityInfo.label}</Text></TouchableOpacity></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Charge to Department</Text><TouchableOpacity className="rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] bg-gray-100" disabled={true}><Text className="flex-1 text-base text-text-primary">{loanData.chargeToDepartment || 'Marketing'}</Text></TouchableOpacity></View>
                  </View>
                </View>

                {/* Asset Information Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Asset Information</Text>
                  <View className="flex-row space-x-4 mb-4">
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Estimated Value</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('estimatedValue') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={loanData.estimatedValue} onChangeText={(text) => updateField('estimatedValue', text)} editable={isFieldEditable('estimatedValue')} /></View></View>
                    <View className="flex-1"><Text className="text-sm font-semibold text-text-primary mb-2">Asset Code</Text><View className={`rounded-lg border border-gray-300 px-4 py-3 min-h-[44px] ${isFieldEditable('assetCode') ? 'bg-bg-secondary' : 'bg-gray-100'}`}><TextInput className="flex-1 text-base text-text-primary" value={loanData.assetCode} onChangeText={(text) => updateField('assetCode', text)} editable={isFieldEditable('assetCode')} /></View></View>
                  </View>
                  <View className="mb-4"><Text className="text-sm font-semibold text-text-primary mb-2">Approval Level Required</Text><TouchableOpacity className={`rounded-lg border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] ${isFieldEditable('approvalLevel') ? 'bg-bg-secondary active:opacity-80' : 'bg-gray-100'}`} onPress={() => isFieldEditable('approvalLevel') && setShowApprovalLevelDropdown(true)} disabled={!isFieldEditable('approvalLevel')}><Text className="flex-1 text-base text-text-primary">{loanData.approvalLevel}</Text>{isFieldEditable('approvalLevel') && <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />}</TouchableOpacity>{showApprovalLevelDropdown && isFieldEditable('approvalLevel') && (<View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2"><>{APPROVAL_LEVELS.map((level) => (<TouchableOpacity key={level} onPress={() => { updateField('approvalLevel', level); setShowApprovalLevelDropdown(false); }} className="px-4 py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"><Text className="text-base text-text-primary">{level}</Text></TouchableOpacity>))}</></View>)}</View>
                </View>

                {/* Decision Rationale Section */}
                {(canApprove || canReject) && (
                  <View>
                    <Text className="text-lg font-bold text-text-primary mb-4">Decision Rationale</Text>
                    <View className="mb-4">
                      <Text className="text-sm font-semibold text-text-primary mb-2">Comments / Rationale <Text className="text-red-500">*</Text></Text>
                      <View className={`rounded-lg bg-bg-secondary border px-4 py-3 min-h-[100px] ${decisionCommentError ? 'border-red-500' : 'border-gray-300'}`}>
                        <TextInput value={loanData.decisionComments} onChangeText={(text) => { updateField('decisionComments', text); if (decisionCommentError) { setDecisionCommentError(false); } }} placeholder="Please provide comments for approval or a reason for rejection..." placeholderTextColor="#8A8A8E" multiline numberOfLines={4} className="flex-1 text-base text-text-primary" textAlignVertical="top" />
                      </View>
                    </View>
                  </View>
                )}

                {/* Attachments Section */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">Attachments / Link</Text>
                  {!isBorrower && (<TouchableOpacity className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50" onPress={handleFileUpload}><View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center"><MaterialIcons name="cloud-upload" size={24} color="#9CA3AF" /></View><Text className="text-gray-500 text-center mb-2">Drag File/Image here</Text><Text className="text-gray-400 text-center mb-3">or</Text><Text className="text-blue-500 font-medium">Browse File/image</Text></TouchableOpacity>)}
                  {loanData.attachments.length > 0 && (<View className="mt-3 space-y-2">{loanData.attachments.map((file, index) => (<View key={index} className="flex-row items-center bg-gray-100 p-3 rounded-lg"><MaterialIcons name="attach-file" size={20} color="#8A8A8E" /><Text className="text-sm text-text-primary ml-2 flex-1" numberOfLines={1}>{file.name}</Text>{!isBorrower && (<TouchableOpacity onPress={() => updateField('attachments', loanData.attachments.filter((_, i) => i !== index))}><MaterialIcons name="close" size={20} color="#8A8A8E" /></TouchableOpacity>)}</View>))}</View>)}
                </View>
              </View>

              {/* Sticky Footer */}
              {(canApprove || canReject) && (
                <View className="border-t border-gray-200 px-6 py-4 bg-white">
                  <View className="flex-row space-x-4">
                    {canReject && (<TouchableOpacity onPress={handleRejectLoan} className="flex-1 bg-red-500 border border-red-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"><Text className="text-base font-semibold text-white">Reject</Text></TouchableOpacity>)}
                    {canApprove && (<TouchableOpacity onPress={handleApproveLoan} className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"><Text className="text-base font-semibold text-white">Approve</Text></TouchableOpacity>)}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modals */}
      <ConfirmationModal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} onConfirm={confirmApproveLoan} title="Approve Loan" message="Thank you for your approval! The loan has been recorded." confirmText="OK" type="success" showIcon={true} />
      <ConfirmationModal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} onConfirm={confirmRejectLoan} title="Confirm Rejection" message={`Are you sure you want to reject this loan (${loanData.loanId})?`} confirmText="Reject" cancelText="Cancel" type="error" showIcon={true} />
    </View>
  );
}