import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

// --- CONSTANTS FOR DROPDOWNS ---
const TRANSACTION_TYPE_OPTIONS = [
  'Sending for Repair', 
  'Returning after Repair', 
  'Returning from Loan'
];

export default function RepairReturnWebScreen() {
  const [formData, setFormData] = useState({
    toolIdentifier: '',
    transactionType: '',
    repairVendor: '',
    transactionDate: '',
    expectedReturnDate: '',
    conditionNotes: '',
  });

  // --- STATE FOR DROPDOWN VISIBILITY ---
  const [showTransactionTypeDropdown, setShowTransactionTypeDropdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = () => {
    // This would trigger a file input dialog in a real web app
    console.log('File upload clicked');
  };

  const showConfirmation = () => {
    if (!formData.toolIdentifier.trim() || !formData.transactionType) {
      alert('Please provide the Tool ID and Transaction Type.');
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setShowConfirmationModal(false);
      setIsSubmitting(false);
      
      alert('Your transaction has been logged successfully!');
      router.back();
    } catch (error) {
      setIsSubmitting(false);
      alert('Failed to log the transaction. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

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
              Tool Repair / Return
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Log a repair or return transaction for a tool
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 py-6">
          <View className="max-w-2xl mx-auto w-full">
            {/* Form Card */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Form Content */}
              <View className="px-6 py-6 space-y-6">
                
                {/* Tool Identifier */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Tool ID / Name
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                    <TextInput
                      className="flex-1 text-base text-text-primary"
                      value={formData.toolIdentifier}
                      onChangeText={(text) => handleInputChange('toolIdentifier', text)}
                      placeholder="e.g., DWT-088K or Cordless Drill"
                      placeholderTextColor="#8A8A8E"
                    />
                  </View>
                </View>

                {/* Transaction Type Dropdown */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Transaction Type
                  </Text>
                  <TouchableOpacity 
                    className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px] active:opacity-80"
                    onPress={() => setShowTransactionTypeDropdown(!showTransactionTypeDropdown)}
                  >
                    <Text className={`flex-1 text-base ${formData.transactionType ? 'text-text-primary' : 'text-gray-500'}`}>
                      {formData.transactionType || 'Select transaction type'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={20} color="#8A8A8E" />
                  </TouchableOpacity>

                  {showTransactionTypeDropdown && (
                    <View className="bg-white border border-gray-200 rounded-lg shadow-md mt-2">
                      {TRANSACTION_TYPE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            handleInputChange('transactionType', option);
                            setShowTransactionTypeDropdown(false);
                          }}
                          className="px-4 py-3 border-b border-gray-200 last:border-b-0"
                        >
                          <Text className="text-base text-text-primary">{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Conditional Fields */}
                {formData.transactionType === 'Sending for Repair' && (
                  <>
                    <View>
                      <Text className="text-sm font-semibold text-text-primary mb-2">Repair Vendor / Shop</Text>
                      <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                        <TextInput
                          className="flex-1 text-base text-text-primary"
                          value={formData.repairVendor}
                          onChangeText={(text) => handleInputChange('repairVendor', text)}
                          placeholder="e.g., Certified Power Tools Inc."
                          placeholderTextColor="#8A8A8E"
                        />
                      </View>
                    </View>
                    <View className="flex-row space-x-4">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-text-primary mb-2">Date Sent</Text>
                        <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                           <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                           <TextInput
                            className="flex-1 text-base text-text-primary"
                            value={formData.transactionDate}
                            onChangeText={(text) => handleInputChange('transactionDate', text)}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#8A8A8E"
                          />
                        </View>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-text-primary mb-2">Expected Return</Text>
                        <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                           <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                           <TextInput
                            className="flex-1 text-base text-text-primary"
                            value={formData.expectedReturnDate}
                            onChangeText={(text) => handleInputChange('expectedReturnDate', text)}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#8A8A8E"
                          />
                        </View>
                      </View>
                    </View>
                  </>
                )}

                {formData.transactionType && formData.transactionType !== 'Sending for Repair' && (
                  <View>
                    <Text className="text-sm font-semibold text-text-primary mb-2">Date of Return</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                       <MaterialIcons name="calendar-today" size={20} color="#8A8A8E" style={{ marginRight: 12 }} />
                       <TextInput
                        className="flex-1 text-base text-text-primary"
                        value={formData.transactionDate}
                        onChangeText={(text) => handleInputChange('transactionDate', text)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>
                )}

                {/* Notes on Condition */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Notes on Condition / Repair
                  </Text>
                  <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row px-4 py-3 min-h-[120px]">
                    <TextInput
                      value={formData.conditionNotes}
                      onChangeText={(text) => handleInputChange('conditionNotes', text)}
                      placeholder="Describe the tool's condition, the reason for repair, or any relevant details."
                      placeholderTextColor="#8A8A8E"
                      multiline
                      numberOfLines={5}
                      className="flex-1 text-base text-text-primary"
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* File Upload Area */}
                <View>
                  <Text className="text-sm font-semibold text-text-primary mb-2">
                    Attach Receipts / Photos
                  </Text>
                  <TouchableOpacity 
                    className="border-2 border-dashed rounded-lg p-8 items-center border-gray-300 bg-gray-50"
                    onPress={handleFileUpload}
                  >
                    <View className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg mb-4 items-center justify-center">
                      <MaterialIcons name="attach-file" size={24} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-500 text-center mb-2">
                      Drag files here
                    </Text>
                    <Text className="text-gray-400 text-center mb-3">or</Text>
                    <Text className="text-blue-500 font-medium">Browse Files</Text>
                  </TouchableOpacity>
                </View>

              </View>

              {/* Sticky Footer with Action Buttons */}
              <View className="border-t border-gray-200 px-6 py-4 bg-white">
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-gray-600">Discard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={showConfirmation}
                    className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                  >
                    <Text className="text-base font-semibold text-white">Log Transaction</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <View className="absolute inset-0 bg-black/50 flex-1 justify-center items-center px-6" style={{zIndex: 9999}}>
          <View className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <View className="px-6 py-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-text-primary">Confirm Transaction</Text>
            </View>
            <View className="px-6 py-4">
              <Text className="text-base text-text-secondary mb-4">
                Please review the details before submitting.
              </Text>
              <View className="bg-gray-50 rounded-lg p-4 mb-4">
                <Text className="text-sm font-semibold text-text-primary mb-2">Transaction Summary:</Text>
                <Text className="text-sm text-text-secondary" numberOfLines={1}>Tool: {formData.toolIdentifier}</Text>
                <Text className="text-sm text-text-secondary">Type: {formData.transactionType}</Text>
                <Text className="text-sm text-text-secondary">Date: {formData.transactionDate || 'Not set'}</Text>
              </View>
            </View>
            <View className="px-6 py-4 border-t border-gray-200 flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowConfirmationModal(false)}
                disabled={isSubmitting}
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
              >
                <Text className="text-base font-semibold text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 border border-blue-600 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
              >
                <Text className="text-base font-semibold text-white">
                  {isSubmitting ? 'Submitting...' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}