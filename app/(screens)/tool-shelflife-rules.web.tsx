import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    getToolShelflifeRules,
    addToolShelflifeRule,
    deleteToolShelflifeRule,
    ToolShelflifeRule,
    availableTools
} from '../../services/toolShelflifeService';

export default function ToolShelflifeRulesWebScreen() {
    const [toolShelflifeRules, setToolShelflifeRules] = useState<ToolShelflifeRule[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [ruleName, setRuleName] = useState('');
    const [toolName, setToolName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showToolDropdown, setShowToolDropdown] = useState(false);

    useEffect(() => {
        fetchToolShelflifeRules();
    }, []);

    const fetchToolShelflifeRules = async () => {
        try {
            setFetchLoading(true);
            const data = await getToolShelflifeRules();
            setToolShelflifeRules(data);
        } catch (error) {
            console.error('Error fetching tool shelflife rules:', error);
            Alert.alert('Error', 'Failed to fetch tool shelflife rules');
        } finally {
            setFetchLoading(false);
        }
    };

    const handleAddToolShelflifeRule = async () => {
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

            await addToolShelflifeRule(newRule);

            // Refresh the list
            await fetchToolShelflifeRules();

            // Reset form
            setRuleName('');
            setToolName('');
            setStartDate('');
            setEndDate('');
            setShowAddForm(false);
            setShowToolDropdown(false);

            Alert.alert('Success', 'Tool shelflife rule added successfully');
        } catch (error) {
            console.error('Error adding tool shelflife rule:', error);
            Alert.alert('Error', 'Failed to add tool shelflife rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteToolShelflifeRule = async (ruleId: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this tool shelflife rule?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteToolShelflifeRule(ruleId);
                            await fetchToolShelflifeRules(); // Refresh the list
                            Alert.alert('Success', 'Tool shelflife rule deleted successfully');
                        } catch (error) {
                            console.error('Error deleting tool shelflife rule:', error);
                            Alert.alert('Error', 'Failed to delete tool shelflife rule');
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
                            Tool Shelf Life Rules
                        </Text>
                        <Text className="text-sm text-text-secondary mt-1">
                            Manage tool shelf life rules and maintenance schedules
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
                        {/* Current Tool Shelflife Rules Table */}
                        <View className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <View className="px-6 py-4 border-b border-gray-200">
                                <Text className="text-xl font-bold text-text-primary">Current Tool Shelflife Rules</Text>
                            </View>

                            {fetchLoading ? (
                                <View className="px-6 py-12 text-center">
                                    <Text className="text-text-secondary text-center">Loading...</Text>
                                </View>
                            ) : toolShelflifeRules.length === 0 ? (
                                <View className="px-6 py-12 text-center">
                                    <Text className="text-text-secondary text-center">No tool shelflife rules configured</Text>
                                </View>
                            ) : (
                                <View className="overflow-hidden">
                                    {/* Table Header */}
                                    <View className="bg-gray-50 flex-row py-3 px-6 border-b border-gray-200">
                                        <Text className="text-text-primary font-semibold flex-1">Rule Name</Text>
                                        <Text className="text-text-primary font-semibold w-32 text-center">Tool Name</Text>
                                        <Text className="text-text-primary font-semibold w-28 text-center">Start Date</Text>
                                        <Text className="text-text-primary font-semibold w-28 text-center">End Date</Text>
                                        <Text className="text-text-primary font-semibold w-24 text-center">Duration</Text>
                                        <Text className="text-text-primary font-semibold w-20 text-center">Action</Text>
                                    </View>

                                    {/* Table Rows */}
                                    {toolShelflifeRules.map((rule, index) => (
                                        <View
                                            key={rule.rule_id}
                                            className={`flex-row py-4 px-6 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <Text className="text-text-primary flex-1 font-medium">{rule.rule_name}</Text>
                                            <Text className="text-text-primary w-32 text-center">
                                                {rule.tool_name}
                                            </Text>
                                            <Text className="text-text-primary w-28 text-center text-sm">
                                                {formatDate(rule.start_date)}
                                            </Text>
                                            <Text className="text-text-primary w-28 text-center text-sm">
                                                {formatDate(rule.end_date)}
                                            </Text>
                                            <Text className="text-primary w-24 text-center font-semibold">
                                                {calculateDuration(rule.start_date, rule.end_date)} days
                                            </Text>
                                            <View className="w-20 flex-row justify-center">
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteToolShelflifeRule(rule.rule_id!)}
                                                    className="p-2 active:opacity-80"
                                                >
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
                                <TouchableOpacity
                                    onPress={() => setShowAddForm(true)}
                                    className="active:opacity-80"
                                >
                                    <LinearGradient
                                        colors={['#409CFF', '#0A84FF']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="rounded-lg px-8 py-3 min-h-[44px] items-center justify-center"
                                    >
                                        <Text className="text-base font-semibold text-white">Add New Tool Shelflife Rule</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Add New Form */}
                        {showAddForm && (
                            <View className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <View className="px-6 py-4 border-b border-gray-200">
                                    <Text className="text-xl font-bold text-text-primary">Add New Tool Shelflife Rule</Text>
                                </View>

                                <View className="px-6 py-6 space-y-6">
                                    <View>
                                        <Text className="text-sm font-semibold text-text-primary mb-2">Rule Name</Text>
                                        <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                                            <TextInput
                                                className="flex-1 text-base text-text-primary"
                                                placeholder="Enter rule name"
                                                value={ruleName}
                                                onChangeText={setRuleName}
                                                placeholderTextColor="#8A8A8E"
                                            />
                                        </View>
                                    </View>

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

                                    <View>
                                        <Text className="text-sm font-semibold text-text-primary mb-2">Start Date (YYYY-MM-DD)</Text>
                                        <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                                            <TextInput
                                                className="flex-1 text-base text-text-primary"
                                                placeholder="2024-01-01"
                                                value={startDate}
                                                onChangeText={setStartDate}
                                                placeholderTextColor="#8A8A8E"
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-sm font-semibold text-text-primary mb-2">End Date (YYYY-MM-DD)</Text>
                                        <View className="rounded-lg bg-bg-secondary border border-gray-300 flex-row items-center px-4 py-3 min-h-[44px]">
                                            <TextInput
                                                className="flex-1 text-base text-text-primary"
                                                placeholder="2024-12-31"
                                                value={endDate}
                                                onChangeText={setEndDate}
                                                placeholderTextColor="#8A8A8E"
                                            />
                                        </View>
                                    </View>

                                    <View className="flex-row space-x-4 pt-4">
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowAddForm(false);
                                                setRuleName('');
                                                setToolName('');
                                                setStartDate('');
                                                setEndDate('');
                                                setShowToolDropdown(false);
                                            }}
                                            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 min-h-[44px] items-center justify-center active:opacity-80"
                                        >
                                            <Text className="text-base font-semibold text-gray-600">Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleAddToolShelflifeRule}
                                            disabled={loading}
                                            className="flex-1 active:opacity-80"
                                        >
                                            <LinearGradient
                                                colors={['#409CFF', '#0A84FF']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                className="rounded-lg px-4 py-3 min-h-[44px] items-center justify-center"
                                            >
                                                <Text className="text-base font-semibold text-white">
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
        </View>
    );
}