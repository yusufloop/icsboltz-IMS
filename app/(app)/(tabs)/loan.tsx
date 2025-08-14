import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
// The new page will use a LoanCard component, assuming it has a similar structure to RequestCard
//import { LoanCard } from '@/components/ui/LoanCard'; 
import { PremiumCard } from '@/components/ui/PremiumCard';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Renamed the component to LoansScreen
export default function LoansScreen() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Changed the data to reflect loans instead of requests
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

  // Renamed the handler to reflect creating a loan
  const handleCreateLoan = () => {
    // Updated router push to the new loan page
    router.push('/new-loan');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header - Updated icon and title */}
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

        {/* Search Bar - Updated placeholder text */}
        <View className="px-6 pt-8">
          <PremiumCard className="shadow-lg">
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
          </PremiumCard>
        </View>

        {/* Filter Controls - Functionality remains the same, button now calls handleCreateLoan */}
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

        {/* Loans List - Mapped from the new 'loans' array and uses 'LoanCard' */}
        {/* <View className="px-6">
          {loans.map((loan, index) => (
            <Animated.View
              key={loan.id}
              entering={FadeInDown.delay(index * 100).duration(300)}
            >
              <LoanCard
                id={loan.id}
                date={loan.date}
                status={loan.status}
                itemLoaned={loan.itemLoaned}
                priority={loan.priority}
                returnDueDate={loan.returnDueDate}
                company={loan.company}
                isExpanded={expandedCards.has(loan.id)}
                onToggle={() => handleCardToggle(loan.id)}
              />
            </Animated.View>
          ))}
        </View> */}
      </ScrollView>

    </SafeAreaView>
  );
}