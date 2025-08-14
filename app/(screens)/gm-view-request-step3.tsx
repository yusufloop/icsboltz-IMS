import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

// --- INTERFACES AND CONSTANTS ---
interface RequestViewData {
  itemRequested: string;
  quantity: string;
  reasonForRequest: string;
  requestId: string;
  hodApproval: 'approved' | 'rejected' | null;
  hodComments: string;
  gmApproval: string;
}

export default function GMViewRequestStep3() {
  const params = useLocalSearchParams();
  
  // Initialize with data from previous steps
  const [requestData, setRequestData] = useState<RequestViewData>({
    itemRequested: (params.itemRequested as string) || 'MacBook Pro 16-inch M3 Max',
    quantity: (params.quantity as string) || '2',
    reasonForRequest: (params.reasonForRequest as string) || 'Required for new developers joining the team. Current laptops are outdated and affecting productivity.',
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    hodApproval: (params.hodApproval as 'approved' | 'rejected') || 'approved',
    hodComments: (params.hodComments as string) || 'This request is justified and within budget. The team needs these laptops for the new project starting next month.',
    gmApproval: '', // Empty for GM to fill
  });

  // Confirmation modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleApprove = () => {
    if (!requestData.gmApproval.trim()) {
      Alert.alert('Error', 'Please provide comments for your approval');
      return;
    }
    setShowApproveModal(true);
  };

  const handleReject = () => {
    if (!requestData.gmApproval.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    console.log('Request approved by GM:', requestData.requestId, 'Comments:', requestData.gmApproval);
    router.push('/requests');
  };

  const confirmReject = () => {
    console.log('Request rejected by GM:', requestData.requestId, 'Reason:', requestData.gmApproval);
    router.push('/requests');
  };

  const handleStepNavigation = (step: number) => {
    if (step === 1) {
      // Navigate back to step 1
      router.push({
        pathname: './gm-view-request-step1',
        params: params
      });
    } else if (step === 2) {
      router.back(); // Go back to step 2
    } else if (step === 3) {
      return; // Already on step 3
    }
  };

  const getHoDApprovalInfo = (approval: 'approved' | 'rejected' | null) => {
    switch (approval) {
      case 'approved':
        return { 
          color: '#30D158', 
          bgColor: '#30D15820', 
          text: 'This request has been approved by HoD' 
        };
      case 'rejected':
        return { 
          color: '#FF453A', 
          bgColor: '#FF453A20', 
          text: 'This request has been rejected by HoD' 
        };
      default:
        return { 
          color: '#FF9F0A', 
          bgColor: '#FF9F0A20', 
          text: 'Pending HoD approval' 
        };
    }
  };

  const hodApprovalInfo = getHoDApprovalInfo(requestData.hodApproval);

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
        </View>
      </View>

      {/* Progress Indicator */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          {/* Step 1 - Completed */}
          <TouchableOpacity 
            className="flex-row items-center flex-1"
            onPress={() => handleStepNavigation(1)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
              <MaterialIcons name="check" size={12} color="white" />
            </View>
            <View className="flex-1 h-0.5 bg-green-500 ml-2" />
          </TouchableOpacity>

          {/* Step 2 - Completed */}
          <TouchableOpacity 
            className="flex-row items-center flex-1"
            onPress={() => handleStepNavigation(2)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center ml-2">
              <MaterialIcons name="check" size={12} color="white" />
            </View>
            <View className="flex-1 h-0.5 bg-green-500 ml-2" />
          </TouchableOpacity>

          {/* Step 3 - Active */}
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => handleStepNavigation(3)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center ml-2">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
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
              
              {/* Request Summary Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">Request Summary</Text>

                {/* Item Requested */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Item Requested</Text>
                  <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                    <Text className="text-sm text-text-primary">{requestData.itemRequested}</Text>
                  </View>
                </View>

                {/* Quantity */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Quantity</Text>
                  <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[36px] justify-center">
                    <Text className="text-sm text-text-primary">{requestData.quantity}</Text>
                  </View>
                </View>

                {/* Reason for Request */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Reason For Request</Text>
                  <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[60px] justify-center">
                    <Text className="text-sm text-text-primary">{requestData.reasonForRequest}</Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200" />

              {/* GM Approval Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">General Manager Decision</Text>
                
                {/* Approval from GM */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">
                    Approval from GM <Text className="text-red-500">*</Text>
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 px-3 py-3 min-h-[80px]">
                    <TextInput
                      value={requestData.gmApproval}
                      onChangeText={(text) => setRequestData(prev => ({ ...prev, gmApproval: text }))}
                      placeholder="Please provide your comments and decision rationale..."
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={4}
                      className="flex-1 text-sm text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Sticky Footer with Action Buttons */}
            <View className="border-t border-gray-200 px-4 py-3 bg-white">
              <View className="flex-row space-x-3">
                {/* Reject Button */}
                <TouchableOpacity
                  onPress={handleReject}
                  className="flex-1 bg-red-500 border border-red-600 rounded-lg px-4 py-3 min-h-[40px] items-center justify-center active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-white">
                    Reject
                  </Text>
                </TouchableOpacity>

                {/* Approve Button */}
                <TouchableOpacity
                  onPress={handleApprove}
                  className="flex-1 bg-green-500 border border-green-600 rounded-lg px-4 py-3 min-h-[40px] items-center justify-center active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-white">
                    Approve
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={confirmApprove}
        title="Approve Request"
        message="Thank you for your approval! Your decision has been recorded."
        confirmText="OK"
        type="success"
        showIcon={true}
      />

      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmReject}
        title="Confirm Rejection"
        message={`Are you sure you want to reject request ${requestData.requestId}?`}
        confirmText="Reject"
        cancelText="Cancel"
        type="error"
        showIcon={true}
      />
    </SafeAreaView>
  );
}
