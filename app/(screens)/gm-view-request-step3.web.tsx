import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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

export default function GMViewRequestStep3Web() {
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

  const handleBack = () => {
    router.back();
  };

  const handleApprove = () => {
    if (!requestData.gmApproval.trim()) {
      Alert.alert('Error', 'Please provide comments for your approval');
      return;
    }

    Alert.alert(
      'Approve Request',
      `Are you sure you want to approve request ${requestData.requestId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            console.log('Request approved by GM:', requestData.requestId, 'Comments:', requestData.gmApproval);
            Alert.alert(
              'Success',
              'Request has been approved successfully!',
              [{ text: 'OK', onPress: () => router.push('/requests') }]
            );
          }
        }
      ]
    );
  };

  const handleReject = () => {
    if (!requestData.gmApproval.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject request ${requestData.requestId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            console.log('Request rejected by GM:', requestData.requestId, 'Reason:', requestData.gmApproval);
            Alert.alert(
              'Success',
              'Request has been rejected successfully!',
              [{ text: 'OK', onPress: () => router.push('/requests') }]
            );
          }
        }
      ]
    );
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center max-w-4xl mx-auto w-full">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4 p-2 -ml-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-text-primary">
              GM Review Request
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Request ID: {requestData.requestId}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Indicator */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="max-w-4xl mx-auto w-full">
          <View className="flex-row items-center justify-between">
            {/* Step 1 - Completed */}
            <TouchableOpacity 
              className="flex-row items-center flex-1"
              onPress={() => handleStepNavigation(1)}
              activeOpacity={0.7}
            >
              <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
                <MaterialIcons name="check" size={16} color="white" />
              </View>
              <View className="flex-1 h-1 bg-green-500 ml-2" />
            </TouchableOpacity>

            {/* Step 2 - Completed */}
            <TouchableOpacity 
              className="flex-row items-center flex-1"
              onPress={() => handleStepNavigation(2)}
              activeOpacity={0.7}
            >
              <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center ml-2">
                <MaterialIcons name="check" size={16} color="white" />
              </View>
              <View className="flex-1 h-1 bg-green-500 ml-2" />
            </TouchableOpacity>

            {/* Step 3 - Active */}
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={() => handleStepNavigation(3)}
              activeOpacity={0.7}
            >
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center ml-2">
                <Text className="text-white text-sm font-bold">3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            {/* Form Card */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Form Content */}
              <View className="px-6 py-6 space-y-6">
                
                {/* Request Summary Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">Request Summary</Text>

                  {/* Item Requested */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Item Requested</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                      <Text className="text-base text-text-primary">{requestData.itemRequested}</Text>
                    </View>
                  </View>

                  {/* Quantity */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Quantity</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[44px] justify-center">
                      <Text className="text-base text-text-primary">{requestData.quantity}</Text>
                    </View>
                  </View>

                  {/* Reason for Request */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">Reason For Request</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 min-h-[80px] justify-center">
                      <Text className="text-base text-text-primary">{requestData.reasonForRequest}</Text>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View className="border-t border-gray-200" />

                {/* GM Approval Section */}
                <View>
                  <Text className="text-lg font-bold text-text-primary mb-4">General Manager Decision</Text>
                  
                  {/* Approval from GM */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-text-primary mb-2">
                      Approval from GM <Text className="text-red-500">*</Text>
                    </Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 px-4 py-3 min-h-[100px]">
                      <TextInput
                        value={requestData.gmApproval}
                        onChangeText={(text) => setRequestData(prev => ({ ...prev, gmApproval: text }))}
                        placeholder="Please provide your comments and decision rationale..."
                        placeholderTextColor="#8A8A8E"
                        multiline
                        numberOfLines={4}
                        className="flex-1 text-base text-text-primary"
                        textAlignVertical="top"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  {/* Reject Button */}
                  <TouchableOpacity
                    onPress={handleReject}
                    className="flex-1 bg-red-500 border border-red-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Reject
                    </Text>
                  </TouchableOpacity>

                  {/* Approve Button */}
                  <TouchableOpacity
                    onPress={handleApprove}
                    className="flex-1 bg-green-500 border border-green-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">
                      Approve
                    </Text>
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
