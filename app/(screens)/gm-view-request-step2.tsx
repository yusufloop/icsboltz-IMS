import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
}

export default function GMViewRequestStep2() {
  const params = useLocalSearchParams();
  
  // Initialize with data from step 1
  const [requestData, setRequestData] = useState<RequestViewData>({
    itemRequested: (params.itemRequested as string) || 'MacBook Pro 16-inch M3 Max',
    quantity: (params.quantity as string) || '2',
    reasonForRequest: (params.reasonForRequest as string) || 'Required for new developers joining the team. Current laptops are outdated and affecting productivity.',
    requestId: (params.requestId as string) || 'REQ-2025-001234',
    hodApproval: 'approved', // Mock data - in real app this would come from API
    hodComments: 'This request is justified and within budget. The team needs these laptops for the new project starting next month.',
  });

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Navigate to step 3 with current data
    router.push({
      pathname: './gm-view-request-step3',
      params: {
        ...params, // Pass through all original params
        ...requestData, // Include current step data
      }
    });
  };

  const handleStepNavigation = (step: number) => {
    if (step === 1) {
      router.back(); // Go back to step 1
    } else if (step === 2) {
      return; // Already on step 2
    } else if (step === 3) {
      handleContinue();
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

          {/* Step 2 - Active */}
          <TouchableOpacity 
            className="flex-row items-center flex-1"
            onPress={() => handleStepNavigation(2)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center ml-2">
              <Text className="text-white text-xs font-bold">2</Text>
            </View>
            <View className="flex-1 h-0.5 bg-blue-500 ml-2" />
          </TouchableOpacity>

          {/* Step 3 - Inactive */}
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => handleStepNavigation(3)}
            activeOpacity={0.7}
          >
            <View className="w-6 h-6 rounded-full bg-gray-300 items-center justify-center ml-2">
              <Text className="text-gray-600 text-xs font-bold">3</Text>
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

              {/* HoD Approval Section */}
              <View>
                <Text className="text-base font-bold text-text-primary mb-3">Department Approval</Text>
                
                {/* Approval from HoD */}
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-text-primary mb-2">Approval from HoD</Text>
                  <View 
                    className="rounded-lg border px-3 py-2 min-h-[36px] justify-center"
                    style={{ 
                      backgroundColor: hodApprovalInfo.bgColor,
                      borderColor: hodApprovalInfo.color + '40'
                    }}
                  >
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: hodApprovalInfo.color }}
                    >
                      {hodApprovalInfo.text}
                    </Text>
                  </View>
                </View>

                {/* HoD Comments */}
                {requestData.hodComments && (
                  <View className="mb-3">
                    <Text className="text-xs font-semibold text-text-primary mb-2">HoD Comments</Text>
                    <View className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 min-h-[60px] justify-center">
                      <Text className="text-sm text-text-primary">{requestData.hodComments}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Sticky Footer with Navigation Buttons */}
            <View className="border-t border-gray-200 px-4 py-3 bg-white">
              <View className="flex-row space-x-3">
                {/* Back Button */}
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[40px] items-center justify-center active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-gray-700">
                    Back
                  </Text>
                </TouchableOpacity>

                {/* Continue Button */}
                <TouchableOpacity
                  onPress={handleContinue}
                  className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[40px] items-center justify-center active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-white">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
