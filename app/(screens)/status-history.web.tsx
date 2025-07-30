import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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
  commentBy?: 'HoD' | 'GM' | 'Admin' | 'Requester';
}

// Static approval flow data (current state)
const approvalFlowSteps: ApprovalStep[] = [
  { title: 'Requester', status: 'Approved' },
  { title: 'Head of Department', status: 'Approved' },
  { title: 'General Manager', status: 'In Progress', stepNumber: 4 },
];

// Updated status history data
const statusHistory: StatusHistoryEntry[] = [
    {
    date: '18 Jul',
    time: '09:05',
    status: 'Request is under review by General Manager',
  },
  {
    date: '18 Jul',
    time: '09:00',
    status: 'Request has been approved by Head of Department',
    comment: 'All required changes have been made. Approved for final review.',
    commentBy: 'HoD'
  },
  {
    date: '17 Jul',
    time: '16:30',
    status: 'Request has been resubmitted by Ahmad Rahman',
    comment: 'I have attached the new quotations and updated the item specifications as requested.',
    commentBy: 'Requester'
  },
  {
    date: '17 Jul',
    time: '08:15',
    status: 'Request has been rejected by Head of Department',
    comment: 'The provided quotation is above budget. Please find an alternative or provide stronger justification for the current choice.',
    commentBy: 'HoD'
  },
  {
    date: '16 Jul',
    time: '10:20',
    status: 'Request is under review by Head of Department',
  },
  {
    date: '16 Jul',
    time: '09:00',
    status: 'Request created by Ahmad Rahman',
  },
];

// --- APPROVAL FLOW COMPONENT ---
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
                  {step.status === 'Approved' ? <MaterialIcons name="check" size={24} color={styles.iconColor} /> :
                   step.status === 'Rejected' ? <MaterialIcons name="close" size={24} color={styles.iconColor} /> :
                   <Text className={`text-base font-bold`} style={{ color: styles.iconColor }}>{step.stepNumber}</Text>}
                </View>
                <Text className={`mt-3 text-center text-sm ${styles.titleText}`}>{step.title}</Text>
                <Text className={`mt-1 text-center text-sm ${styles.statusText}`}>{step.status}</Text>
              </View>
              {!isLastStep && (
                <View className="flex-1 px-1" style={{ top: 18 }}>
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


export default function StatusHistoryWeb() {
  const params = useLocalSearchParams();
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  
  const requestData = {
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    itemRequested: (params.itemRequested as string) || 'MacBook Pro 16-inch M3 Max',
    quantity: (params.quantity as string) || '2',
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewDetails = () => {
    router.push('/view-request');
  };

  const handleToggleComment = (index: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    if (status.includes('approved') || status.includes('resubmitted')) return '#16A34A'; // Green
    if (status.includes('rejected')) return '#DC2626'; // Red
    if (status.includes('review')) return '#2563EB'; // Blue
    return '#6B7280'; // Gray
  };


  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity onPress={handleBack} className="mr-4 p-2 -ml-2 active:opacity-80">
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">Status History</Text>
            <Text className="text-sm text-text-secondary mt-1">Request ID: {requestData.requestId}</Text>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <ApprovalFlow steps={approvalFlowSteps} />
              <View className="border-t border-gray-200" />
              <View className="px-6 py-6">
                <Text className="text-lg font-bold text-text-primary mb-4">Request Details</Text>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-sm font-semibold text-text-primary">Request ID:</Text>
                  <Text className="text-sm font-mono text-text-primary">{requestData.requestId}</Text>
                </View>
                <View className="flex-row justify-between items-start">
                  <Text className="text-sm font-semibold text-text-primary flex-1">Item Requested:</Text>
                  <Text className="text-sm text-text-primary flex-2 text-right">
                    {requestData.itemRequested} (Qty: {requestData.quantity})
                  </Text>
                </View>
              </View>
              <View className="border-t border-gray-200" />
              <View>
                <View className="px-6 py-4 border-b border-gray-200">
                  <Text className="text-lg font-bold text-text-primary">Status History</Text>
                </View>
                <View className="px-6 pt-6">
                  {statusHistory.map((entry, index) => {
                    const isLast = index === statusHistory.length - 1;
                    const statusColor = getStatusColor(entry.status.toLowerCase());
                    const isCompleted = entry.status.toLowerCase().includes('approved') || entry.status.toLowerCase().includes('rejected') || entry.status.toLowerCase().includes('resubmitted');
                    const isExpanded = expandedComments.has(index);

                    return (
                      <View key={index} className="flex-row">
                        {/* Date/Time Column */}
                        {/* IMPROVEMENT: Added pt-1 for vertical alignment and text-right for clean lines */}
                        <View className="w-20 pt-1">
                          <Text className="text-sm text-gray-600 font-medium text-right">{entry.date}</Text>
                          <Text className="text-sm text-gray-500 text-right">{entry.time}</Text>
                        </View>

                        {/* Timeline Node/Line Column */}
                        {/* IMPROVEMENT: Changed margin to mx-4 for symmetrical spacing */}
                        <View className="items-center mx-4">
                          {/* IMPROVEMENT: Added pt-1 to vertically align the node with the first line of text */}
                          <View className="pt-1">
                             <View className={`w-4 h-4 rounded-full border-2 ${isCompleted ? 'bg-green-500 border-green-500' : 'bg-gray-300 border-gray-400'}`} />
                          </View>
                          {/* This view now correctly fills the space to draw the line */}
                          {!isLast && <View className="flex-1 w-0.5 bg-gray-300" />}
                        </View>

                        {/* Content Column */}
                        {/* IMPROVEMENT: Changed bottom padding to pb-8 for consistent vertical spacing */}
                        <View className="flex-1 pb-8">
                          <TouchableOpacity 
                            onPress={() => entry.comment && handleToggleComment(index)}
                            disabled={!entry.comment}
                            className="flex-row items-center mb-2"
                          >
                            <Text className="text-base font-medium flex-1" style={{ color: statusColor }}>
                              {entry.status}
                            </Text>
                            {entry.comment && (
                              <MaterialIcons 
                                name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={24}
                                color="#6B7280"
                              />
                            )}
                          </TouchableOpacity>
                          {isExpanded && entry.comment && (
                            <Animated.View 
                              entering={FadeIn.duration(300)} 
                              exiting={FadeOut.duration(200)}
                              className="bg-gray-50 p-4 rounded-lg mt-1"
                            >
                              <Text className="text-sm text-gray-700 leading-5">{entry.comment}</Text>
                              {entry.commentBy && (
                                <Text className="text-sm text-gray-500 mt-2 font-medium">- {entry.commentBy}</Text>
                              )}
                            </Animated.View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="bg-white border-t border-gray-200 px-6 py-4">
        <View className="max-w-2xl mx-auto w-full">
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={handleBack} className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80">
              <Text className="text-base font-semibold text-gray-700">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleViewDetails} className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80">
              <Text className="text-base font-semibold text-white">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}