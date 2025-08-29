import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- INTERFACES AND CONSTANTS ---
type ApprovalStatus = 'Approved' | 'In Progress' | 'Rejected' | 'Pending';

interface ApprovalStep {
  title: string;
  status: ApprovalStatus;
  stepNumber?: number;
}

interface StatusHistoryEntry {
  date: string;
  time: string;
  status: string;
  comment?: string;
  commentBy?: 'HoD' | 'GM' | 'Admin';
}

// Static approval flow data
const approvalFlowSteps: ApprovalStep[] = [
  { title: 'Requester', status: 'Approved' },
  { title: 'Head of Department', status: 'In Progress', stepNumber: 2 },
  { title: 'General Manager', status: 'Pending', stepNumber: 4 },
];

// Static status history data - can be easily replaced with database data
const statusHistory: StatusHistoryEntry[] = [
  {
    date: '17 Jul',
    time: '17:53',
    status: 'Request has been approved by General Manager',
    comment: 'Approved for immediate procurement. Budget allocated.',
    commentBy: 'GM'
  },
  {
    date: '17 Jul',
    time: '14:33',
    status: 'Request is under review by General Manager',
  },
  {
    date: '17 Jul',
    time: '07:18',
    status: 'Request has been approved by Head of Department',
    comment: 'Approved. Essential for team productivity.',
    commentBy: 'HoD'
  },
  {
    date: '17 Jul',
    time: '01:44',
    status: 'Request is under review by Head of Department',
  },
  {
    date: '16 Jul',
    time: '00:12',
    status: 'Request has been submitted for approval',
  },
  {
    date: '16 Jul',
    time: '22:55',
    status: 'Request created by Ahmad Rahman',
  },
];

// --- APPROVAL FLOW COMPONENT ---
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
    <View className="px-4 py-6">
      <View className="flex-row items-start justify-between">
        {steps.map((step, index) => {
          const styles = getStepStyles(step.status);
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <View className="flex-1 items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${styles.circle}`}>
                  {step.status === 'Approved' ? (
                    <MaterialIcons name="check" size={20} color={styles.iconColor} />
                  ) : step.status === 'Rejected' ? (
                    <MaterialIcons name="close" size={20} color={styles.iconColor} />
                  ) : (
                    <Text className={`text-sm font-bold`} style={{ color: styles.iconColor }}>
                      {step.stepNumber}
                    </Text>
                  )}
                </View>
                <Text className={`mt-2 text-center text-xs ${styles.titleText}`}>{step.title}</Text>
                <Text className={`mt-1 text-center text-xs ${styles.statusText}`}>{step.status}</Text>
              </View>

              {!isLastStep && (
                <View className="flex-1" style={{ top: 14 }}>
                  <View className={`h-0.5 rounded-full ${getStepStyles(steps[index].status).line}`} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

// --- STATUS TIMELINE COMPONENT ---
const StatusTimeline = ({ history }: { history: StatusHistoryEntry[] }) => {
  const getStatusColor = (status: string) => {
    if (status.includes('approved')) return '#16A34A'; // Green
    if (status.includes('rejected')) return '#DC2626'; // Red
    if (status.includes('review')) return '#2563EB'; // Blue
    return '#6B7280'; // Gray
  };

  return (
    <View className="px-4 py-4">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;
        const statusColor = getStatusColor(entry.status.toLowerCase());
        const isApproved = entry.status.toLowerCase().includes('approved');

        return (
          <View key={index} className="flex-row">
            {/* Date and Time Column */}
            <View className="w-16 mr-4">
              <Text className="text-xs text-gray-600 font-medium">{entry.date}</Text>
              <Text className="text-xs text-gray-500">{entry.time}</Text>
            </View>

            {/* Timeline Column */}
            <View className="items-center mr-4">
              <View 
                className={`w-3 h-3 rounded-full border-2 ${isApproved ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-400'}`}
              />
              {!isLast && (
                <View className="w-0.5 h-12 bg-gray-300 mt-1" />
              )}
            </View>

            {/* Content Column */}
            <View className="flex-1 pb-4">
              <Text 
                className="text-sm font-medium mb-1"
                style={{ color: statusColor }}
              >
                {entry.status}
              </Text>
              {entry.comment && (
                <View className="bg-gray-50 p-3 rounded-lg mt-2">
                  <Text className="text-xs text-gray-700 leading-4">
                    {entry.comment}
                  </Text>
                  {entry.commentBy && (
                    <Text className="text-xs text-gray-500 mt-1 font-medium">
                      - {entry.commentBy}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function StatusHistoryScreen() {
  const params = useLocalSearchParams();
  
  // Static request data - can be easily replaced with dynamic data
  const requestData = {
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    itemRequested: (params.itemRequested as string) || 'Torque Wrench',
    quantity: (params.quantity as string) || '2',
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewDetails = () => {
    router.push('/view-request');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2 -ml-2">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">Status History</Text>
            <Text className="text-sm text-gray-600 mt-1">Request ID: {requestData.requestId}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200">
          {/* Approval Flow */}
          <ApprovalFlow steps={approvalFlowSteps} />

          <View className="border-t border-gray-200" />

          {/* Request Details */}
          <View className="px-4 py-4">
            <Text className="text-base font-bold text-gray-900 mb-3">Request Details</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Request ID:</Text>
              <Text className="text-sm font-medium text-gray-900">{requestData.requestId}</Text>
            </View>
            <View className="flex-row justify-between items-start">
              <Text className="text-sm text-gray-600 flex-1">Item Requested:</Text>
              <Text className="text-sm font-medium text-gray-900 flex-2 text-right">
                {requestData.itemRequested} (Qty: {requestData.quantity})
              </Text>
            </View>
          </View>

          <View className="border-t border-gray-200" />

          {/* Status History Timeline */}
          <View className="py-2">
            <Text className="text-base font-bold text-gray-900 mb-2 px-4">Status History</Text>
            <StatusTimeline history={statusHistory} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="bg-white border-t border-gray-200 px-4 py-4">
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            onPress={handleBack}
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center"
          >
            <Text className="text-base font-semibold text-gray-700">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleViewDetails}
            className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center"
          >
            <Text className="text-base font-semibold text-white">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
