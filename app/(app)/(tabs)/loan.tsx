import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// --- HELPER COMPONENT FOR STATUS ---
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Returned':
        return { container: 'bg-green-100', text: 'text-green-800' };
      case 'Active':
        return { container: 'bg-blue-100', text: 'text-blue-800' };
      case 'Overdue':
        return { container: 'bg-red-100', text: 'text-red-800' };
      default:
        return { container: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const styles = getStatusStyles();

  return (
    <View className={`px-3 py-1 rounded-full ${styles.container}`}>
      <Text className={`text-xs font-bold ${styles.text}`}>{status}</Text>
    </View>
  );
};

// --- MAIN SCREEN ---
export default function LoansScreen() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const loans = [
    { 
      id: '#LOAN 1', 
      date: '30/10/2024',
      status: 'Returned', 
      itemLoaned: 'Projector Epson',
      priority: 'High',
      returnDueDate: '15/11/2024',
      company: 'Capi Telecom'
    },
    { 
      id: '#LOAN 2', 
      date: '25/10/2024',
      status: 'Active', 
      itemLoaned: 'Digital Camera',
      priority: 'Medium',
      returnDueDate: '20/11/2024',
      company: 'Capi Telecom'
    },
    { 
      id: '#LOAN 3', 
      date: '22/10/2024',
      status: 'Overdue', 
      itemLoaned: 'Tablet iPad Pro',
      priority: 'High',
      returnDueDate: '01/11/2024',
      company: 'Tech Solutions'
    },
    { 
      id: '#LOAN 4', 
      date: '20/10/2024',
      status: 'Active', 
      itemLoaned: 'Bluetooth Speaker',
      priority: 'Low',
      returnDueDate: '30/11/2024',
      company: 'Service Pro'
    },
    { 
      id: '#LOAN 5', 
      date: '15/10/2024',
      status: 'Returned', 
      itemLoaned: 'Conference Mic',
      priority: 'Low',
      returnDueDate: '01/11/2024',
      company: 'EduTech'
    },
  ];

  const handleCardToggle = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleCreateLoan = () => {
    router.push('/new-loan');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-6 bg-bg-secondary shadow-lg">
          <MaterialIcons 
            name="card-giftcard" 
            size={28} 
            color="#30D158"
          />
          <Text className="text-3xl font-bold text-text-primary ml-4 leading-tight">
            My Loans
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 pt-8">
          <View className="bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row items-center">
              <MaterialIcons 
                name="search" 
                size={22} 
                color="#8A8A8E"
                style={{ marginRight: 14 }}
              />
              <TextInput
                placeholder="Search loans..."
                placeholderTextColor="#AEAEB2"
                className="flex-1 text-base text-text-primary leading-relaxed"
                style={{ fontFamily: 'System' }}
              />
            </View>
          </View>
        </View>

        {/* Filter Controls */}
        <View className="flex-row items-center justify-between px-6 pt-2 mb-4">
          <View className="flex-row items-center space-x-8">
            <TouchableOpacity className="flex-row items-center py-3 px-2 active:opacity-80 active:scale-95">
              <MaterialIcons 
                name="sort" 
                size={22} 
                color="#8A8A8E"
                style={{ marginRight: 6 }}
              />
              <Text className="text-base text-text-secondary font-medium">
                Sort
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={22} 
                color="#8A8A8E"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-3 px-2 active:opacity-80 active:scale-95">
              <MaterialIcons 
                name="tune" 
                size={22} 
                color="#8A8A8E"
                style={{ marginRight: 6 }}
              />
              <Text className="text-base text-text-secondary font-medium">
                Filter
              </Text>
              <View className="bg-primary rounded-full w-6 h-6 items-center justify-center ml-3 shadow-sm">
                <Text className="text-white text-xs font-bold">
                  2
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            className="bg-gradient-to-br from-[#409CFF] to-[#0A84FF] rounded-xl w-12 h-12 items-center justify-center shadow-lg active:opacity-90 active:scale-95"
            onPress={handleCreateLoan}
          >
            <MaterialIcons 
              name="add" 
              size={36} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Loans List */}
        <View className="px-6">
          {loans.map((loan, index) => {
            const isExpanded = expandedCards.has(loan.id);
            return (
              <Animated.View
                key={loan.id}
                entering={FadeInDown.delay(index * 100).duration(300)}
                className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCardToggle(loan.id)}
                  className="p-4"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm font-semibold text-text-primary">{loan.id}</Text>
                    <StatusBadge status={loan.status} />
                  </View>
                  <Text className="text-lg font-bold text-text-primary mb-2">{loan.itemLoaned}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary">{loan.company}</Text>
                    <MaterialIcons 
                      name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                      size={24} 
                      color="#8A8A8E" 
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View className="px-4 pb-4">
                    <View className="border-t border-gray-200 my-2" />
                    <View className="flex-row flex-wrap mb-4">
                      <View className="w-1/2 mb-2">
                        <Text className="text-xs text-text-secondary mb-1">Date</Text>
                        <Text className="text-sm font-medium text-text-primary">{loan.date}</Text>
                      </View>
                      <View className="w-1/2 mb-2">
                        <Text className="text-xs text-text-secondary mb-1">Return Due Date</Text>
                        <Text className="text-sm font-medium text-text-primary">{loan.returnDueDate}</Text>
                      </View>
                      <View className="w-1/2">
                        <Text className="text-xs text-text-secondary mb-1">Priority</Text>
                        <Text className="text-sm font-medium text-text-primary">{loan.priority}</Text>
                      </View>
                    </View>
                    <View className="border-t border-gray-200 pt-2 flex-row justify-around">
                        <TouchableOpacity 
                          onPress={() => router.push('/tool-detail')}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="build" size={20} color="#0A84FF" />
                          <Text className="text-sm font-semibold text-blue-500 ml-2">Tool Detail</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          onPress={() => router.push('/view-loan')}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="visibility" size={20} color="#0A84FF" />
                          <Text className="text-sm font-semibold text-blue-500 ml-2">View Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          onPress={() => router.push('/status-history')}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="history" size={20} color="#f59e0b" />
                          <Text className="text-sm font-semibold text-amber-500 ml-2">Status History</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}