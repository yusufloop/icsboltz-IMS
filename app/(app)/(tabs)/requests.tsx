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
      case 'Successfully':
        return {
          container: 'bg-green-100',
          text: 'text-green-800',
        };
      case 'Unsuccessfully':
        return {
          container: 'bg-red-100',
          text: 'text-red-800',
        };
      case 'Pending':
        return {
          container: 'bg-yellow-100',
          text: 'text-yellow-800',
        };
      default:
        return {
          container: 'bg-gray-100',
          text: 'text-gray-800',
        };
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
export default function RequestsScreen() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const requests = [
    { 
      id: '#ITEM 1', 
      date: '30/10/2019',
      status: 'Unsuccessfully', 
      itemRequested: 'Torque Wrench',
      priority: 'High',
      amount: 'RM 200',
      company: 'Capi Telecom'
    },
    { 
      id: '#ITEM 2', 
      date: '30/10/2019',
      status: 'Successfully', 
      itemRequested: 'Specialized Boxed Set Wrench Sets For Aviation',
      priority: 'Medium',
      amount: '$50',
      company: 'Capi Telecom'
    },
    { 
      id: '#ITEM 3', 
      date: '29/10/2019',
      status: 'Successfully', 
      itemRequested: 'Portable Power Genset',
      priority: 'Low',
      amount: '$150',
      company: 'Tech Solutions'
    },
    { 
      id: '#ITEM 4', 
      date: '28/10/2019',
      status: 'Pending', 
      itemRequested: 'Equipment Maintenance',
      priority: 'High',
      amount: '$300',
      company: 'Service Pro'
    },
    { 
      id: '#ITEM 5', 
      date: '27/10/2019',
      status: 'Successfully', 
      itemRequested: 'Training Materials',
      priority: 'Low',
      amount: '$75',
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

  const handleCreateRequest = () => {
    router.push('/new-request');
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
            name="assignment" 
            size={28} 
            color="#0A84FF" 
          />
          <Text className="text-3xl font-bold text-text-primary ml-4 leading-tight">
            My Tools
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
                placeholder="Search requests..."
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
            onPress={handleCreateRequest}
          >
            <MaterialIcons 
              name="add" 
              size={36} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <View className="px-6">
          {requests.map((request, index) => {
            const isExpanded = expandedCards.has(request.id);
            return (
              <Animated.View
                key={request.id}
                entering={FadeInDown.delay(index * 100).duration(300)}
                className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCardToggle(request.id)}
                  className="p-4"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-sm font-semibold text-text-primary">{request.id}</Text>
                    <StatusBadge status={request.status} />
                  </View>
                  <Text className="text-lg font-bold text-text-primary mb-2">{request.itemRequested}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary">{request.company}</Text>
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
                        <Text className="text-sm font-medium text-text-primary">{request.date}</Text>
                      </View>
                      <View className="w-1/2 mb-2">
                        <Text className="text-xs text-text-secondary mb-1">Amount</Text>
                        <Text className="text-sm font-medium text-text-primary">{request.amount}</Text>
                      </View>
                      <View className="w-1/2">
                        <Text className="text-xs text-text-secondary mb-1">Priority</Text>
                        <Text className="text-sm font-medium text-text-primary">{request.priority}</Text>
                      </View>
                    </View>
                    <View className="border-t border-gray-200 pt-2 flex-row justify-around">
                        <TouchableOpacity 
                          onPress={() => router.push({
                            pathname: '/tool-detail',
                            params: {
                              id: request.id,
                              itemRequested: request.itemRequested,
                              priority: request.priority,
                              amount: request.amount,
                              company: request.company,
                              status: request.status,
                              date: request.date
                            }
                          })}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="build" size={20} color="#0A84FF" />
                          <Text className="text-sm font-semibold text-blue-500 ml-2">Tool Detail</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          onPress={() => router.push('/view-request')}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="visibility" size={20} color="#0A84FF" />
                          <Text className="text-sm font-semibold text-blue-500 ml-2">View Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          onPress={() => router.push('/status-history')}
                          className="flex-row items-center py-2 px-4 rounded-lg active:bg-gray-100"
                        >
                          <MaterialIcons name="history" size={20} color="#0A84FF" />
                          <Text className="text-sm font-semibold text-blue-500 ml-2">Status History</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Animated.View>
            )
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}