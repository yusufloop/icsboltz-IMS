import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Animated, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UserManagementService, UserWithRoles } from '@/services/userManagementService';

// --- DATA AND INTERFACES ---

// IMPROVEMENT: Added 'status' to the UserData interface
interface UserData {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  role: 'Admin' | 'General Manager' | 'HoD' | 'User';
  department: string;
  status: 'Active' | 'Suspended' | 'Terminated' | 'On Leave' | 'Pending';
}

// IMPROVEMENT: Added a status color mapping for the indicator dot
const STATUS_COLORS: { [key in UserData['status']]: string } = {
  Active: 'bg-green-500',
  Suspended: 'bg-orange-500',
  Terminated: 'bg-red-600',
  'On Leave': 'bg-blue-500',
  Pending: 'bg-gray-400',
};


// Dummy names for fallback when user has no name
const dummyNames = [
  'Ahmad bin Rahman', 'Siti Nurhaliza binti Ishak', 'Tan Chin Ho',
  'Kumaravel a/l Muthu', 'Lee Wei Shen', 'Zafri bin Idris',
  'Nur Aina binti Khalid', 'Rajendran a/l Suresh', 'Wong Jia Yi',
  'Muhammad Faiz bin Salleh', 'Priya d/o Subramaniam', 'Amirul bin Hafiz',
  'Aisyah binti Hassan', 'Ali bin Hassan', 'Abu Bakar'
];

// Map Supabase roles to web interface roles
const mapRole = (roleName: string): UserData['role'] => {
  switch (roleName.toUpperCase()) {
    case 'ADMINISTRATOR':
      return 'Admin';
    case 'GENERAL_MANAGER':
      return 'General Manager';
    case 'HEAD_OF_DEPARTMENT':
      return 'HoD';
    default:
      return 'User';
  }
};

// Generate random status for users
const getRandomStatus = (): UserData['status'] => {
  const statuses: UserData['status'][] = ['Active', 'Suspended', 'Terminated', 'On Leave', 'Pending'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export default function UsersWebScreen() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: usersData, error } = await UserManagementService.getAllUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        return;
      }

      if (usersData) {
        // Transform Supabase users to match the expected format
        const transformedUsers: UserData[] = usersData.map((user: UserWithRoles, index: number) => ({
          id: user.id,
          name: user.user_metadata?.full_name || dummyNames[index % dummyNames.length],
          contactNumber: '0123456789', // Default contact number as it's not in Supabase user data
          email: user.email,
          role: user.roles.length > 0 ? mapRole(user.roles[0].role_name) : 'User',
          department: 'General', // Default department
          status: getRandomStatus(),
        }));
        setUsers(transformedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

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
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map(user => user.id)));
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

  // Get role text color
  const getRoleTextColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'text-blue-600';
      case 'General Manager':
        return 'text-orange-500';
      case 'HoD':
        return 'text-purple-600';
      case 'User':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  // Handle navigation to new user
  const handleNewUser = () => {
    console.log('Navigate to new user page');
    router.push('/new-user');
  };

  // Handle user actions
  const handleUserDetails = (user: UserData) => {
    console.log('View user details:', user);
    router.push('/view-user');
  };

  const handleEditUser = (user: UserData) => {
    console.log('Edit user:', user);
    router.push('/view-user');
  };

  const handleDeleteUser = (user: UserData) => {
    console.log('Delete user:', user);
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
            onPress={handleNewUser}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-medium">New User</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 p-6">
        <View className="bg-white rounded-lg border border-gray-200 shadow-sm flex-1">
          {/* Card Title */}
          <View className="border-b border-gray-200 px-6 py-4">
            <Text className="text-xl font-semibold text-gray-900">Users</Text>
          </View>

          {/* Table Container */}
          <ScrollView className="flex-1">
            {/* Table Header */}
            <View className="bg-gray-50 border-b border-gray-200 flex-row items-center px-6 py-3">
              <TouchableOpacity 
                className={`w-6 h-6 border rounded mr-4 items-center justify-center ${
                  selectedRows.size === users.length && users.length > 0 ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
                onPress={handleSelectAll}
              >
                {selectedRows.size === users.length && users.length > 0 && (
                  <MaterialIcons name="check" size={16} color="white" />
                )}
              </TouchableOpacity>
              
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0" style={{ flex: 2 }}>
                User Name
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                Contact Number
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0" style={{ flex: 3 }}>
                Email
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                Role
              </Text>
              <Text className="text-sm font-semibold text-gray-700 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                Department
              </Text>
            </View>

            {/* Table Rows */}
            {loading ? (
              <View className="py-20 items-center justify-center">
                <MaterialIcons name="person" size={64} color="#D1D5DB" />
                <Text className="text-lg font-semibold text-gray-600 mt-4">
                  Loading users...
                </Text>
              </View>
            ) : users.length === 0 ? (
              <View className="py-20 items-center justify-center">
                <MaterialIcons name="people-outline" size={64} color="#D1D5DB" />
                <Text className="text-lg font-semibold text-gray-600 mt-4">
                  No users found
                </Text>
              </View>
            ) : users.map((user, index) => {
              const isExpanded = expandedRow === user.id;
              const isSelected = selectedRows.has(user.id);

              return (
                <View key={user.id} className={isExpanded ? 'bg-white rounded-lg shadow-lg shadow-blue-50 my-1 mx-2' : ''}>
                  <TouchableOpacity
                    className={`flex-row items-center px-6 py-4 ${
                      !isExpanded ? `border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}` : ''
                    }`}
                    onPress={() => handleRowClick(user.id)}
                  >
                    <TouchableOpacity 
                      className={`w-6 h-6 border rounded mr-4 items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRowSelect(user.id);
                      }}
                    >
                      {isSelected && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </TouchableOpacity>

                    {/* IMPROVEMENT: Replaced simple Text with an Icon + Name + Status component */}
                    <View className="flex-1 min-w-0 flex-row items-center" style={{ flex: 2 }}>
                      <View className="relative mr-3">
                        <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                          <MaterialIcons name="person" size={24} color="#A1A1AA" />
                        </View>
                        <View 
                          className={`w-3.5 h-3.5 rounded-full absolute top-0 right-0 border-2 border-white ${
                            STATUS_COLORS[user.status] || 'bg-gray-400'
                          }`} 
                        />
                      </View>
                      <Text className="text-sm text-gray-900 font-medium">
                        {user.name}
                      </Text>
                    </View>

                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                      {user.contactNumber}
                    </Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0" style={{ flex: 3 }}>
                      {user.email}
                    </Text>
                    <Text className={`text-sm font-medium flex-1 min-w-0 text-center ${getRoleTextColor(user.role)}`} style={{ flex: 2 }}>
                      {user.role}
                    </Text>
                    <Text className="text-sm text-gray-600 flex-1 min-w-0 text-center" style={{ flex: 2 }}>
                      {user.department}
                    </Text>
                  </TouchableOpacity>

                  {/* Expandable Action Panel */}
                  {isExpanded && (
                    <Animated.View className="px-6 pt-2 pb-8]">
                      <View className="flex-row justify-center space-x-3">
                        <TouchableOpacity 
                          className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-4"
                          onPress={() => handleUserDetails(user)}
                        >
                          <Text className="text-gray-800 font-medium">Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="bg-blue-600 rounded-lg px-4 py-2 mb-4"
                          onPress={() => handleEditUser(user)}
                        >
                          <Text className="text-white font-medium">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="bg-red-600 rounded-lg px-4 py-2 mb-4"
                          onPress={() => handleDeleteUser(user)}
                        >
                          <Text className="text-white font-medium">Delete</Text>
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