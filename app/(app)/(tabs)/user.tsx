import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { UserRole } from '@/constants/UserRoles';
import { UserCard } from '@/components/ui/UserCard';
import { router } from 'expo-router';
import { UserManagementService, UserWithRoles } from '@/services/userManagementService';

// Dummy names for fallback
const dummyNames = [
  'Ahmad Rahman', 'Ali bin Hassan', 'Abu Bakar', 'Muhammad Faiz',
  'Sarah Lim', 'Priya Sharma', 'David Tan', 'Lisa Wong',
  'Raj Kumar', 'Emily Chen', 'Siti Nurhaliza', 'Zafri bin Idris',
  'Nur Aina binti Khalid', 'Wong Jia Yi', 'Kumaravel a/l Muthu'
];

// Map Supabase roles to UserRole enum
const mapRole = (roleName: string): UserRole => {
  switch (roleName.toUpperCase()) {
    case 'ADMINISTRATOR':
      return 'ADMIN';
    case 'GENERAL_MANAGER':
      return 'GENERAL_MANAGER';
    case 'HEAD_OF_DEPARTMENT':
      return 'HEAD_OF_DEPARTMENT';
    default:
      return 'REQUESTER';
  }
};

// Generate random status for users
const getRandomStatus = (): 'online' | 'active' | 'suspended' | 'terminated' => {
  const statuses = ['online', 'active', 'suspended', 'terminated'] as const;
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export default function UserScreen() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'active' | 'suspended' | 'terminated'>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        const transformedUsers = usersData.map((user: UserWithRoles, index: number) => ({
          id: user.id,
          name: user.user_metadata?.full_name || dummyNames[index % dummyNames.length],
          phoneNumber: '+60 12-345 6789', // Default phone number as it's not in Supabase user data
          profilePicture: undefined,
          status: getRandomStatus(),
          role: user.roles.length > 0 ? mapRole(user.roles[0].role_name) : 'REQUESTER',
          department: user.roles.length > 0 ? 'General' : 'Operations', // Default department
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

  const handleCardToggle = (userId: string) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(userId)) {
      newExpandedCards.delete(userId);
    } else {
      newExpandedCards.add(userId);
    }
    setExpandedCards(newExpandedCards);
  };

  const getFilteredUsers = () => {
    if (filterStatus === 'all') {
      return users;
    }
    return users.filter(user => user.status === filterStatus);
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') {
      return users.length;
    }
    return users.filter(user => user.status === status).length;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-text-primary">Users</Text>
          <TouchableOpacity 
            onPress={() => router.push('/new-user')} 
            className="bg-primary rounded-full p-2"
          >
            <MaterialIcons name="person-add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {[
            { key: 'all', label: 'All', count: getStatusCount('all') },
            { key: 'online', label: 'Online', count: getStatusCount('online') },
            { key: 'active', label: 'Active', count: getStatusCount('active') },
            { key: 'suspended', label: 'Suspended', count: getStatusCount('suspended') },
            { key: 'terminated', label: 'Terminated', count: getStatusCount('terminated') },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setFilterStatus(filter.key as any)}
              className={`mr-4 px-4 py-2 rounded-full border ${
                filterStatus === filter.key
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-200'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`font-semibold ${
                  filterStatus === filter.key
                    ? 'text-white'
                    : 'text-text-secondary'
                }`}
              >
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* User List */}
      <ScrollView 
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="person" size={64} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-text-secondary mt-4">
              Loading users...
            </Text>
          </View>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              id={user.id}
              name={user.name}
              phoneNumber={user.phoneNumber}
              profilePicture={user.profilePicture}
              status={user.status}
              role={user.role}
              department={user.department}
              isExpanded={expandedCards.has(user.id)}
              onToggle={() => handleCardToggle(user.id)}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="people-outline" size={64} color="#D1D5DB" />
            <Text className="text-lg font-semibold text-text-secondary mt-4">
              No users found
            </Text>
            <Text className="text-text-tertiary text-center mt-2">
              No users match the selected filter criteria
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}