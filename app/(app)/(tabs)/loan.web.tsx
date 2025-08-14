import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ICSBOLTZ_CURRENT_USER_ROLE } from '@/constants/UserRoles';

// Data structure interface for Loans
interface LoanData {
  id: string;
  itemName: string;
  reasonForLoan: string;
  quantity: number;
  chargeToDepartment: string;
  status: 'Active' | 'Returned' | 'Overdue';
  loanDate: string;
  returnDueDate: string;
  image: string;
}

// Static data array for Loans
const staticLoansData: LoanData[] = [
  {
    id: '1',
    itemName: 'Projector Epson',
    reasonForLoan: 'Client presentation in main conference room',
    quantity: 1,
    chargeToDepartment: 'Sales Department',
    status: 'Returned',
    loanDate: '15 Oct, 2024',
    returnDueDate: '20 Oct, 2024',
    image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Projector'
  },
  {
    id: '2',
    itemName: 'Digital Camera',
    reasonForLoan: 'Photoshoot for the new marketing campaign',
    quantity: 1,
    chargeToDepartment: 'Marketing Department',
    status: 'Active',
    loanDate: '28 Oct, 2024',
    returnDueDate: '05 Nov, 2024',
    image: 'https://placehold.co/100x100/059669/FFFFFF?text=Camera'
  },
  {
    id: '3',
    itemName: 'High-Speed Scanner',
    reasonForLoan: 'Digitizing financial records for audit',
    quantity: 1,
    chargeToDepartment: 'Finance Department',
    status: 'Overdue',
    loanDate: '10 Oct, 2024',
    returnDueDate: '25 Oct, 2024',
    image: 'https://placehold.co/100x100/DC2626/FFFFFF?text=Scanner'
  },
  {
    id: '4',
    itemName: 'Dev Test Server',
    reasonForLoan: 'Staging environment for the new app release',
    quantity: 1,
    chargeToDepartment: 'IT Department',
    status: 'Active',
    loanDate: '01 Nov, 2024',
    returnDueDate: '01 Dec, 2024',
    image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Server'
  },
];

// Renamed component to LoansWebScreen
export default function LoansWebScreen() {
  const [loans, setLoans] = useState<LoanData[]>(staticLoansData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Row selection logic remains the same
  const handleRowSelect = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) newSelectedRows.delete(id);
    else newSelectedRows.add(id);
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === loans.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(loans.map(loan => loan.id)));
  };

  const handleRowClick = (id: string) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  // Get status text color for Loan statuses
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Returned': return 'text-blue-600';
      case 'Overdue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Handle navigation to new loan page
  const handleNewLoan = () => {
    router.push('/new-loan');
  };

  // Handle view loan details
  const handleViewLoanDetails = (loan: LoanData) => {
    router.push({
      pathname: '/view-loan', // Assumes a '/view-loan' route exists
      params: { ...loan, quantity: loan.quantity.toString() },
    });
  };
  
  // Handle navigation to status history page for a loan
  const handleStatusHistory = (loan: LoanData) => {
    router.push('/status-history'); // This can remain the same or be a loan-specific history page
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top Header Bar - Updated button to handleNewLoan */}
      <View className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex-row items-center justify-between">
        <View className="relative flex-1 max-w-md">
          <MaterialIcons name="search" size={20} color="#6B7280" style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }} />
          <TextInput
            placeholder="Search item, department, status"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900"
          />
        </View>
        <View className="flex-row items-center space-x-3 ml-6">
          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
            <MaterialIcons name="tune" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text className="text-gray-700 font-medium">Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-blue-600 rounded-lg px-5 py-3 flex-row items-center"
            onPress={handleNewLoan}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-medium">New Loan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 p-6">
        <View className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1">
          {/* Card Title - Updated to "Loan List" */}
          <View className="border-b border-gray-200 px-6 py-4">
            <Text className="text-xl font-semibold text-gray-900">Loan List</Text>
          </View>

          {/* Table Container */}
          <ScrollView className="flex-1">
            {/* Table Header - Updated for loan data */}
            <View className="bg-gray-50 border-b border-gray-200 flex-row items-center px-6 py-3">
              <TouchableOpacity 
                className={`w-6 h-6 border rounded mr-4 items-center justify-center ${selectedRows.size === loans.length && loans.length > 0 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                onPress={handleSelectAll}
              >
                {selectedRows.size === loans.length && loans.length > 0 && (<MaterialIcons name="check" size={16} color="white" />)}
              </TouchableOpacity>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>Item Name</Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>Loan Date</Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>Return Due Date</Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>Charge to</Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 1 }}>Status</Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 1 }}>Image</Text>
            </View>

            {/* Table Rows - Updated to map 'loans' and use loan properties */}
            {loans.map((loan, index) => {
              const isExpanded = expandedRow === loan.id;
              const isSelected = selectedRows.has(loan.id);

              return (
                <View key={loan.id} className={isExpanded ? 'bg-white rounded-lg shadow-lg shadow-blue-50 my-1 mx-2 pb-4' : ''}>
                  <TouchableOpacity
                    className={`flex-row items-center px-6 py-4 ${!isExpanded ? `border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}` : ''}`}
                    onPress={() => handleRowClick(loan.id)}
                  >
                    <TouchableOpacity 
                      className={`w-6 h-6 border rounded mr-4 items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                      onPress={(e) => { e.stopPropagation(); handleRowSelect(loan.id); }}
                    >
                      {isSelected && (<MaterialIcons name="check" size={16} color="white" />)}
                    </TouchableOpacity>
                    <Text className="text-sm text-gray-900 flex-1 min-w-0 text-center" style={{ flex: 2 }}>{loan.itemName}</Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>{loan.loanDate}</Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>{loan.returnDueDate}</Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>{loan.chargeToDepartment}</Text>
                    <Text className={`text-sm font-medium flex-1 min-w-0 text-center ${getStatusTextColor(loan.status)}`} style={{ flex: 1 }}>{loan.status}</Text>
                    <View className="flex-1 min-w-0 items-center justify-center" style={{ flex: 1 }}>
                      <Image source={{ uri: loan.image }} className="w-10 h-10 rounded" resizeMode="cover" />
                    </View>
                  </TouchableOpacity>

                  {/* Expandable Action Panel - Functions now operate on the 'loan' object */}
                  {isExpanded && (
                    <Animated.View className="px-6 pt-4 pb-2">
                      {/* <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-800">Reason for Loan:</Text>
                        <Text className="text-sm text-gray-600 mt-1">{loan.reasonForLoan}</Text>
                      </View> */}
                      <View className="flex-row justify-center space-x-3 border-t border-gray-200 pt-4">
                        <TouchableOpacity 
                          className="bg-blue-600 rounded-lg px-4 py-2"
                          onPress={() => handleViewLoanDetails(loan)}
                        >
                          <Text className="text-white font-medium">View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="bg-gray-600 rounded-lg px-4 py-2"
                          onPress={() => handleStatusHistory(loan)}
                        >
                          <Text className="text-white font-medium">Status History</Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}