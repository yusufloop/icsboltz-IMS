import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ICSBOLTZ_CURRENT_USER_ROLE } from '@/constants/UserRoles';

// Data structure interface
interface RequestData {
  id: string;
  name: string;
  reasonsForRequests: string;
  quantity: number;
  chargeToDepartment: string;
  status: 'Successful' | 'Unsuccessful' | 'Pending';
  image: string;
}

// Static data array
const staticRequestsData: RequestData[] = [
  {
    id: '1',
    name: 'Macbook Pro',
    reasonsForRequests: 'For the two new designers starting next month',
    quantity: 2,
    chargeToDepartment: 'Design Department',
    status: 'Successful',
    image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=MacBook'
  },
  {
    id: '2',
    name: 'Office Chairs',
    reasonsForRequests: 'Ergonomic chairs for the development team',
    quantity: 5,
    chargeToDepartment: 'IT Department',
    status: 'Pending',
    image: 'https://placehold.co/100x100/059669/FFFFFF?text=Chair'
  },
  {
    id: '3',
    name: 'Standing Desks',
    reasonsForRequests: 'Health and productivity improvement for staff',
    quantity: 3,
    chargeToDepartment: 'HR Department',
    status: 'Unsuccessful',
    image: 'https://placehold.co/100x100/DC2626/FFFFFF?text=Desk'
  },
  {
    id: '4',
    name: 'Monitor Displays',
    reasonsForRequests: 'Dual monitor setup for developers',
    quantity: 8,
    chargeToDepartment: 'IT Department',
    status: 'Successful',
    image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Monitor'
  },
  {
    id: '5',
    name: 'Wireless Keyboards',
    reasonsForRequests: 'Replacement for old keyboards',
    quantity: 10,
    chargeToDepartment: 'IT Department',
    status: 'Pending',
    image: 'https://placehold.co/100x100/059669/FFFFFF?text=Keyboard'
  },
  {
    id: '6',
    name: 'Conference Room Camera',
    reasonsForRequests: 'Video conferencing equipment upgrade',
    quantity: 1,
    chargeToDepartment: 'Operations',
    status: 'Successful',
    image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=Camera'
  },
  {
    id: '7',
    name: 'Printer Paper',
    reasonsForRequests: 'Monthly office supplies restocking',
    quantity: 20,
    chargeToDepartment: 'Administration',
    status: 'Unsuccessful',
    image: 'https://placehold.co/100x100/DC2626/FFFFFF?text=Paper'
  }
];

export default function RequestsWebScreen() {
  const [requests] = useState<RequestData[]>(staticRequestsData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Handle row selection
  const handleRowSelect = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === requests.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(requests.map(req => req.id)));
    }
  };

  // Handle row expansion
  const handleRowClick = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'text-green-600';
      case 'Unsuccessful':
        return 'text-red-600';
      case 'Pending':
        return 'text-orange-500';
      default:
        return 'text-gray-600';
    }
  };

  // Handle navigation to new request
  const handleNewRequest = () => {
    router.push('/new-request');
  };

  // Handle view details with role-based navigation
  const handleViewDetails = (request: RequestData) => {
    // Navigate to appropriate view page based on user role
    if (ICSBOLTZ_CURRENT_USER_ROLE === 'GENERAL_MANAGER') {
      // Navigate to GM view for General Managers
      router.push({
        pathname: '/gm-view-request-step1',
        params: {
          id: request.id,
          itemRequested: request.name,
          priority: 'Medium', // Default priority since not in web data
          amount: '0', // Default amount since not in web data
          company: request.chargeToDepartment,
          status: request.status,
          date: new Date().toLocaleDateString(), // Default date
          quantity: request.quantity.toString(),
          reasonsForRequests: request.reasonsForRequests,
        },
      });
    } else {
      // Navigate to regular view for other roles
      router.push({
        pathname: '/view-request',
        params: {
          id: request.id,
          itemRequested: request.name,
          priority: 'Medium', // Default priority since not in web data
          amount: '0', // Default amount since not in web data
          company: request.chargeToDepartment,
          status: request.status,
          date: new Date().toLocaleDateString(), // Default date
          quantity: request.quantity.toString(),
          reasonsForRequests: request.reasonsForRequests,
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Top Header Bar */}
      <View className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex-row items-center justify-between">
        {/* Search Input (Left side) */}
        <View className="relative flex-1 max-w-md">
          <MaterialIcons 
            name="search" 
            size={20} 
            color="#6B7280" 
            style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
          />
          <TextInput
            placeholder="Search product, supplier, order"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900"
          />
        </View>

        {/* Action Buttons (Right side) */}
        <View className="flex-row items-center space-x-3 ml-6">
          <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-lg px-4 py-3">
            <MaterialIcons name="tune" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text className="text-gray-700 font-medium">Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-blue-600 rounded-lg px-5 py-3 flex-row items-center"
            onPress={handleNewRequest}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-medium">New Requests</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 p-6">
        <View className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1">
          {/* Card Title */}
          <View className="border-b border-gray-200 px-6 py-4">
            <Text className="text-xl font-semibold text-gray-900">Request List</Text>
          </View>

          {/* Table Container */}
          <ScrollView className="flex-1">
            {/* Table Header */}
            <View className="bg-gray-50 border-b border-gray-200 flex-row items-center px-6 py-3">
              <TouchableOpacity 
                className={`w-6 h-6 border rounded mr-4 items-center justify-center ${
                  selectedRows.size === requests.length && requests.length > 0 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
                onPress={handleSelectAll}
              >
                {selectedRows.size === requests.length && requests.length > 0 && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </TouchableOpacity>
              
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                Name
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 3 }}>
                Reasons for Requests
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 1 }}>
                Quantity
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                Charge to Department
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 1 }}>
                Status
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 1 }}>
                File/Image
              </Text>
            </View>

            {/* Table Rows */}
            {requests.map((request, index) => {
              const isExpanded = expandedRow === request.id;
              const isSelected = selectedRows.has(request.id);

              return (
                <View key={request.id} className={isExpanded ? 'bg-white rounded-lg shadow-lg shadow-blue-50 my-1 mx-2 pb-4' : ''}>
                  <TouchableOpacity
                    className={`flex-row items-center px-6 py-4 ${
                      !isExpanded ? `border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}` : ''
                    }`}
                    onPress={() => handleRowClick(request.id)}
                  >
                    <TouchableOpacity 
                      className={`w-6 h-6 border rounded mr-4 items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRowSelect(request.id);
                      }}
                    >
                      {isSelected && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </TouchableOpacity>

                    <Text className="text-sm text-gray-900 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                      {request.name}
                    </Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 3 }}>
                      {request.reasonsForRequests}
                    </Text>
                    <Text className="text-sm text-gray-900 flex-1 min-w-0 text-center" style={{ flex: 1 }}>
                      {request.quantity}
                    </Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                      {request.chargeToDepartment}
                    </Text>
                    <Text className={`text-sm font-medium flex-1 min-w-0 text-center ${getStatusTextColor(request.status)}`} style={{ flex: 1 }}>
                      {request.status}
                    </Text>
                    <View className="flex-1 min-w-0 items-center justify-center" style={{ flex: 1 }}>
                      <Image 
                        source={{ uri: request.image }}
                        className="w-10 h-10 rounded "
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>

                  {/* Expandable Action Panel */}
                  {isExpanded && (
                    <Animated.View className="px-6 pt-2 pb-6">
                      <View className="flex-row justify-center space-x-3">
                        <TouchableOpacity 
                          className="bg-blue-600 rounded-lg px-4 py-2"
                          onPress={() => handleViewDetails(request)}
                        >
                          <Text className="text-white font-medium">View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-green-600 rounded-lg px-4 py-2">
                          <Text className="text-white font-medium">Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-600 rounded-lg px-4 py-2">
                          <Text className="text-white font-medium">Reject</Text>
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
