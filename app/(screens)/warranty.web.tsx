import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  getWarranties, 
  addWarranty, 
  deleteWarranty,
  WarrantyItem,
  availableTools 
} from '../../services/warrantyService';

export default function WarrantyWebScreen() {
  const [warranties, setWarranties] = useState<WarrantyItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toolName, setToolName] = useState('');
  const [warrantyFile, setWarrantyFile] = useState(''); // This will now hold a file name or path
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      setFetchLoading(true);
      const data = await getWarranties();
      setWarranties(data);
    } catch (error) {
      console.error('Error fetching warranties:', error);
      Alert.alert('Error', 'Failed to fetch warranties');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddWarranty = async () => {
    // IMPROVEMENT: Check is now for warrantyFile, not just a URL
    if (!toolName.trim() || !warrantyFile.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert('Error', 'Please fill in all fields, including the warranty file.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      Alert.alert('Error', 'Please enter dates in YYYY-MM-DD format');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const newWarranty = {
        tool_name: toolName.trim(),
        warranty_file: warrantyFile.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim()
      };

      await addWarranty(newWarranty);
      
      await fetchWarranties();
      
      setToolName('');
      setWarrantyFile('');
      setStartDate('');
      setEndDate('');
      setShowAddForm(false);
      setShowToolDropdown(false);
      
      Alert.alert('Success', 'Warranty added successfully');
    } catch (error) {
      console.error('Error adding warranty:', error);
      Alert.alert('Error', 'Failed to add warranty');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarranty = async (warrantyId: string) => {
    if (window.confirm('Are you sure you want to delete this warranty record?')) {
      try {
        await deleteWarranty(warrantyId);
        await fetchWarranties();
        Alert.alert('Success', 'Warranty deleted successfully');
      } catch (error) {
        console.error('Error deleting warranty:', error);
        Alert.alert('Error', 'Failed to delete warranty');
      }
    }
  };

  const handleViewWarranty = async (warrantyFile: string) => {
    try {
      window.open(warrantyFile, '_blank');
    } catch (error) {
      console.error('Error opening warranty:', error);
      Alert.alert('Error', 'Failed to open warranty document');
    }
  };

  const handleBack = () => {
    router.back();
  };

  // IMPROVEMENT: New handler for the file upload UI
  const handleFileUpload = () => {
    // In a real app, this would open a file picker.
    // For now, we'll simulate selecting a file.
    console.log('File upload initiated');
    Alert.alert('File Upload', 'This would open a file picker to select your warranty document.');
    setWarrantyFile('simulated-warranty.pdf');
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'expiring_soon': return 'text-yellow-600';
      case 'expired': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'expiring_soon': return 'Expiring Soon';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const handleToolSelect = (tool: string) => {
    setToolName(tool);
    setShowToolDropdown(false);
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
              Tool Warranties
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Manage tool warranty documents and expiration dates
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
          <View className="max-w-4xl mx-auto w-full space-y-6">
            {/* Current Warranties Table */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <View className="px-6 py-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-text-primary">Current Tool Warranties</Text>
              </View>
              
              {fetchLoading ? (
                <View className="px-6 py-12 text-center"><Text className="text-text-secondary text-center">Loading...</Text></View>
              ) : warranties.length === 0 ? (
                <View className="px-6 py-12 text-center"><Text className="text-text-secondary text-center">No warranties found</Text></View>
              ) : (
                <View className="overflow-hidden">
                  <View className="bg-gray-50 flex-row py-3 px-6 border-b border-gray-200">
                    <Text className="text-text-primary font-semibold flex-1">Tool Name</Text>
                    <Text className="text-text-primary font-semibold w-32 text-center">Warranty File</Text>
                    <Text className="text-text-primary font-semibold w-28 text-center">Start Date</Text>
                    <Text className="text-text-primary font-semibold w-28 text-center">End Date</Text>
                    <Text className="text-text-primary font-semibold w-24 text-center">Duration</Text>
                    <Text className="text-text-primary font-semibold w-24 text-center">Status</Text>
                    <Text className="text-text-primary font-semibold w-20 text-center">Action</Text>
                  </View>
                  
                  {warranties.map((warranty, index) => (
                    <View key={warranty.warranty_id} className={`flex-row items-center py-4 px-6 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <Text className="text-text-primary flex-1 font-medium">{warranty.tool_name}</Text>
                      <View className="w-32 flex-row justify-center">
                        <TouchableOpacity onPress={() => handleViewWarranty(warranty.warranty_file)} className="flex-row items-center px-2 py-1 bg-blue-50 rounded active:opacity-80">
                          <MaterialIcons name="description" size={16} color="#3B82F6" />
                          <Text className="text-blue-600 text-xs font-medium ml-1">View</Text>
                        </TouchableOpacity>
                      </View>
                      <Text className="text-text-primary w-28 text-center text-sm">{formatDate(warranty.start_date)}</Text>
                      <Text className="text-text-primary w-28 text-center text-sm">{formatDate(warranty.end_date)}</Text>
                      <Text className="text-primary w-24 text-center font-semibold">{warranty.duration} days</Text>
                      <View className="w-24 flex-row justify-center">
                        <Text className={`text-xs font-semibold ${getStatusColor(warranty.status)}`}>{getStatusText(warranty.status)}</Text>
                      </View>
                      <View className="w-20 flex-row justify-center">
                        <TouchableOpacity onPress={() => handleDeleteWarranty(warranty.warranty_id!)} className="p-2 active:opacity-80">
                          <MaterialIcons name="delete" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Add New Button */}
            {!showAddForm && (
              <View className="flex-row justify-center">
                <TouchableOpacity onPress={() => setShowAddForm(true)} className="active:opacity-80">
                  <LinearGradient colors={['#409CFF', '#0A84FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-lg px-8 py-3 min-h-[44px] items-center justify-center">
                    <Text className="text-base font-semibold text-white">Add New Warranty</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Add New Form */}
            {showAddForm && (
              <View className="bg-white rounded-lg shadow-sm border border-gray-200">
                <View className="px-6 py-4 border-b border-gray-200">
                  <Text className="text-xl font-bold text-text-primary">Add New Warranty</Text>
                </View>
                
                <View className="px-6 py-6 space-y-6">
                  {/* 
                    IMPROVEMENT 1: Dropdown now pushes content.
                    - The parent View no longer uses `relative`.
                    - The dropdown list is rendered inside the layout flow, not absolutely positioned.
                  */}
                  <View>
                    <Text className="text-sm font-semibold text-text-primary mb-2">Tool Name</Text>
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowToolDropdown(!showToolDropdown)}
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]"
                      >
                        <Text className={`flex-1 text-base ${toolName ? 'text-text-primary' : 'text-gray-400'}`}>
                          {toolName || 'Select tool'}
                        </Text>
                        <MaterialIcons 
                          name={showToolDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                          size={20} 
                          color="#8A8A8E" 
                        />
                      </TouchableOpacity>
                      
                      {showToolDropdown && (
                        <View className="bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48">
                          <ScrollView showsVerticalScrollIndicator={true}>
                            {availableTools.map((tool, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => handleToolSelect(tool)}
                                className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                              >
                                <Text className="text-base text-text-primary">{tool}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* 
                    IMPROVEMENT 2: Replaced text input with a file upload dropzone.
                  */}
                  <View>
                    <Text className="text-sm font-semibold text-text-primary mb-2">Warranty File</Text>
                    {warrantyFile ? (
                      <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                          <MaterialIcons name="attach-file" size={20} color="#3B82F6" />
                          <Text className="text-blue-700 ml-2 flex-1" numberOfLines={1}>{warrantyFile}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setWarrantyFile('')} className="p-1">
                          <MaterialIcons name="close" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        className="border-2 border-dashed rounded-lg p-6 items-center justify-center border-gray-300 bg-gray-50"
                        onPress={handleFileUpload}
                      >
                        <MaterialIcons name="cloud-upload" size={32} color="#9CA3AF" />
                        <Text className="text-blue-500 font-medium mt-2">Browse File/Image</Text>
                        <Text className="text-gray-500 text-xs mt-1">Select the warranty document to upload</Text>
                      </TouchableOpacity>
                    )}
                  </View>


                  <View>
                    <Text className="text-sm font-semibold text-text-primary mb-2">Start Date (YYYY-MM-DD)</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput className="flex-1 text-base text-text-primary" placeholder="2024-01-01" value={startDate} onChangeText={setStartDate} placeholderTextColor="#8A8A8E" />
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-text-primary mb-2">End Date (YYYY-MM-DD)</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                      <TextInput className="flex-1 text-base text-text-primary" placeholder="2024-12-31" value={endDate} onChangeText={setEndDate} placeholderTextColor="#8A8A8E" />
                    </View>
                  </View>

                  <View className="flex-row space-x-4 pt-4">
                    <TouchableOpacity
                      onPress={() => {
                        setShowAddForm(false);
                        setToolName('');
                        setWarrantyFile('');
                        setStartDate('');
                        setEndDate('');
                        setShowToolDropdown(false);
                      }}
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                    >
                      <Text className="text-base font-semibold text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleAddWarranty} disabled={loading} className="flex-1 active:opacity-80">
                      <LinearGradient colors={['#409CFF', '#0A84FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-lg px-4 py-3 min-h-[44px] items-center justify-center">
                        <Text className="text-base font-semibold text-white">{loading ? "Adding..." : "Add Warranty"}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}