import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  getToolLifecycleRules, 
  addToolLifecycleRule, 
  deleteToolLifecycleRule,
  ToolLifecycleRule,
  availableTools 
} from '../../services/toolLifecycleService';

export default function ToolLifecycleRulesScreen() {
  const [toolLifecycleRules, setToolLifecycleRules] = useState<ToolLifecycleRule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [toolName, setToolName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showToolDropdown, setShowToolDropdown] = useState(false);

  useEffect(() => {
    fetchToolLifecycleRules();
  }, []);

  const fetchToolLifecycleRules = async () => {
    try {
      setFetchLoading(true);
      const data = await getToolLifecycleRules();
      setToolLifecycleRules(data);
    } catch (error) {
      console.error('Error fetching tool lifecycle rules:', error);
      Alert.alert('Error', 'Failed to fetch tool lifecycle rules');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleAddToolLifecycleRule = async () => {
    if (!ruleName.trim() || !toolName.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      Alert.alert('Error', 'Please enter dates in YYYY-MM-DD format');
      return;
    }

    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      const newRule = {
        rule_name: ruleName.trim(),
        tool_name: toolName.trim(),
        start_date: startDate.trim(),
        end_date: endDate.trim()
      };

      await addToolLifecycleRule(newRule);
      
      // Refresh the list
      await fetchToolLifecycleRules();
      
      // Reset form
      setRuleName('');
      setToolName('');
      setStartDate('');
      setEndDate('');
      setShowAddForm(false);
      setShowToolDropdown(false);
      
      Alert.alert('Success', 'Tool lifecycle rule added successfully');
    } catch (error) {
      console.error('Error adding tool lifecycle rule:', error);
      Alert.alert('Error', 'Failed to add tool lifecycle rule');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToolLifecycleRule = async (ruleId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this tool lifecycle rule?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteToolLifecycleRule(ruleId);
              await fetchToolLifecycleRules(); // Refresh the list
              Alert.alert('Success', 'Tool lifecycle rule deleted successfully');
            } catch (error) {
              console.error('Error deleting tool lifecycle rule:', error);
              Alert.alert('Error', 'Failed to delete tool lifecycle rule');
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleToolSelect = (tool: string) => {
    setToolName(tool);
    setShowToolDropdown(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={handleBack}
            className="mr-3 p-2 -ml-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={20} color="#1C1C1E" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-lg font-bold text-text-primary">
              Tool Life Cycle Rules
            </Text>
            <Text className="text-xs text-text-secondary mt-1">
              Manage tool lifecycle rules and maintenance schedules
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content Container */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 py-4">
          <View className="space-y-4">
            {/* Current Tool Lifecycle Rules */}
            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
              <View className="px-4 py-3 border-b border-gray-200">
                <Text className="text-base font-bold text-text-primary">Current Tool Lifecycle Rules</Text>
              </View>
              
              {fetchLoading ? (
                <View className="px-4 py-8 text-center">
                  <Text className="text-text-secondary text-center text-sm">Loading...</Text>
                </View>
              ) : toolLifecycleRules.length === 0 ? (
                <View className="px-4 py-8 text-center">
                  <Text className="text-text-secondary text-center text-sm">No tool lifecycle rules configured</Text>
                </View>
              ) : (
                <View>
                  {toolLifecycleRules.map((rule, index) => (
                    <View
                      key={rule.rule_id}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-text-primary flex-1 mr-2">
                          {rule.rule_name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteToolLifecycleRule(rule.rule_id!)}
                          className="p-1 active:opacity-80"
                        >
                          <MaterialIcons name="delete" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      
                      <View className="space-y-1">
                        <View className="flex-row">
                          <Text className="text-xs text-text-secondary w-16">Tool:</Text>
                          <Text className="text-xs text-text-primary flex-1">{rule.tool_name}</Text>
                        </View>
                        
                        <View className="flex-row">
                          <Text className="text-xs text-text-secondary w-16">Start:</Text>
                          <Text className="text-xs text-text-primary flex-1">{formatDate(rule.start_date)}</Text>
                        </View>
                        
                        <View className="flex-row">
                          <Text className="text-xs text-text-secondary w-16">End:</Text>
                          <Text className="text-xs text-text-primary flex-1">{formatDate(rule.end_date)}</Text>
                        </View>
                        
                        <View className="flex-row">
                          <Text className="text-xs text-text-secondary w-16">Duration:</Text>
                          <Text className="text-xs text-primary font-semibold flex-1">
                            {calculateDuration(rule.start_date, rule.end_date)} days
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Add New Button */}
            {!showAddForm && (
              <View className="flex-row justify-center">
                <TouchableOpacity
                  onPress={() => setShowAddForm(true)}
                  className="active:opacity-80"
                >
                  <LinearGradient
                    colors={['#409CFF', '#0A84FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-lg px-6 py-3 min-h-[40px] items-center justify-center"
                  >
                    <Text className="text-sm font-semibold text-white">Add New Tool Lifecycle Rule</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Add New Form */}
            {showAddForm && (
              <View className="bg-white rounded-lg shadow-sm border border-gray-200">
                <View className="px-4 py-3 border-b border-gray-200">
                  <Text className="text-base font-bold text-text-primary">Add New Tool Lifecycle Rule</Text>
                </View>
                
                <View className="px-4 py-4 space-y-4">
                  <View>
                    <Text className="text-xs font-semibold text-text-primary mb-2">Rule Name</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px]">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        placeholder="Enter rule name"
                        value={ruleName}
                        onChangeText={setRuleName}
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-semibold text-text-primary mb-2">Tool Name</Text>
                    <View className="relative">
                      <TouchableOpacity
                        onPress={() => setShowToolDropdown(!showToolDropdown)}
                        className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px]"
                      >
                        <Text className={`flex-1 text-sm ${toolName ? 'text-text-primary' : 'text-gray-400'}`}>
                          {toolName || 'Select tool'}
                        </Text>
                        <MaterialIcons 
                          name={showToolDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                          size={16} 
                          color="#8A8A8E" 
                        />
                      </TouchableOpacity>
                      
                      {showToolDropdown && (
                        <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-40">
                          <ScrollView showsVerticalScrollIndicator={true}>
                            {availableTools.map((tool, index) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() => handleToolSelect(tool)}
                                className="px-3 py-2 border-b border-gray-100 active:bg-gray-50"
                              >
                                <Text className="text-sm text-text-primary">{tool}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-semibold text-text-primary mb-2">Start Date (YYYY-MM-DD)</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px]">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        placeholder="2024-01-01"
                        value={startDate}
                        onChangeText={setStartDate}
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-semibold text-text-primary mb-2">End Date (YYYY-MM-DD)</Text>
                    <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-3 py-2 min-h-[36px]">
                      <TextInput
                        className="flex-1 text-sm text-text-primary"
                        placeholder="2024-12-31"
                        value={endDate}
                        onChangeText={setEndDate}
                        placeholderTextColor="#8A8A8E"
                      />
                    </View>
                  </View>

                  <View className="flex-row space-x-3 pt-3">
                    <TouchableOpacity
                      onPress={() => {
                        setShowAddForm(false);
                        setRuleName('');
                        setToolName('');
                        setStartDate('');
                        setEndDate('');
                        setShowToolDropdown(false);
                      }}
                      className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 min-h-[36px] items-center justify-center active:opacity-80"
                    >
                      <Text className="text-sm font-semibold text-gray-600">Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleAddToolLifecycleRule}
                      disabled={loading}
                      className="flex-1 active:opacity-80"
                    >
                      <LinearGradient
                        colors={['#409CFF', '#0A84FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-lg px-3 py-2 min-h-[36px] items-center justify-center"
                      >
                        <Text className="text-sm font-semibold text-white">
                          {loading ? "Adding..." : "Add Rule"}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
