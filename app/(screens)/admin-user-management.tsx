import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useAuth } from '@/lib/auth';
import { 
  UserManagementService, 
  type UserWithRoles, 
  type CreateUserData, 
  type UpdateUserData 
} from '@/services/userManagementService';

interface Role {
  role_id: number;
  role_name: string;
}

export default function AdminUserManagementScreen() {
  const { user, hasRole } = useAuth();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role_ids: [] as number[]
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    email: '',
    full_name: '',
    role_ids: [] as number[]
  });

  const [formLoading, setFormLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        Alert.alert('Access Denied', 'Please log in first.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      // Use the service to check admin status instead of hasRole
      const isAdmin = await UserManagementService.isCurrentUserAdmin();
      if (!isAdmin) {
        Alert.alert('Access Denied', 'You do not have permission to access this page.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }
      
      loadData();
    };

    checkPermissions();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    
    // Load users and roles in parallel
    const [usersResult, rolesResult] = await Promise.all([
      UserManagementService.getAllUsers(),
      UserManagementService.getAllRoles()
    ]);

    if (usersResult.error) {
      Alert.alert('Error', `Failed to load users: ${usersResult.error}`);
    } else {
      setUsers(usersResult.data || []);
    }

    if (rolesResult.error) {
      Alert.alert('Error', `Failed to load roles: ${rolesResult.error}`);
    } else {
      setRoles(rolesResult.data || []);
    }

    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!createForm.email.trim() || !createForm.password.trim() || !createForm.full_name.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (createForm.role_ids.length === 0) {
      Alert.alert('Error', 'Please select at least one role');
      return;
    }

    setFormLoading(true);

    const result = await UserManagementService.createUser({
      email: createForm.email.trim(),
      password: createForm.password,
      full_name: createForm.full_name.trim(),
      role_ids: createForm.role_ids
    });

    setFormLoading(false);

    if (result.error) {
      Alert.alert('Error', `Failed to create user: ${result.error}`);
    } else {
      Alert.alert('Success', 'User created successfully!');
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', full_name: '', role_ids: [] });
      loadData();
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !editForm.email.trim() || !editForm.full_name.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setFormLoading(true);

    const updateData: UpdateUserData = {
      email: editForm.email.trim(),
      full_name: editForm.full_name.trim(),
      role_ids: editForm.role_ids
    };

    const result = await UserManagementService.updateUser(selectedUser.id, updateData);

    setFormLoading(false);

    if (result.error) {
      Alert.alert('Error', `Failed to update user: ${result.error}`);
    } else {
      Alert.alert('Success', 'User updated successfully!');
      setShowEditModal(false);
      setSelectedUser(null);
      loadData();
    }
  };

  const handleDeleteUser = (userToDelete: UserWithRoles) => {
    // Prevent self-deletion
    if (userToDelete.id === user?.id) {
      Alert.alert('Error', 'You cannot delete your own account');
      return;
    }

    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${userToDelete.user_metadata?.full_name || userToDelete.email}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await UserManagementService.deleteUser(userToDelete.id);
            
            if (result.error) {
              Alert.alert('Error', `Failed to delete user: ${result.error}`);
            } else {
              Alert.alert('Success', 'User deleted successfully!');
              loadData();
            }
          }
        }
      ]
    );
  };

  const openEditModal = (userToEdit: UserWithRoles) => {
    setSelectedUser(userToEdit);
    setEditForm({
      email: userToEdit.email,
      full_name: userToEdit.user_metadata?.full_name || '',
      role_ids: userToEdit.roles.map(r => r.role_id)
    });
    setShowEditModal(true);
  };

  const toggleRole = (roleId: number, isCreate: boolean = true) => {
    if (isCreate) {
      setCreateForm(prev => ({
        ...prev,
        role_ids: prev.role_ids.includes(roleId)
          ? prev.role_ids.filter(id => id !== roleId)
          : [...prev.role_ids, roleId]
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        role_ids: prev.role_ids.includes(roleId)
          ? prev.role_ids.filter(id => id !== roleId)
          : [...prev.role_ids, roleId]
      }));
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.user_metadata?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-text-secondary">Loading users...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).duration(300)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-2 mr-2 active:opacity-70"
          >
            <MaterialIcons name="arrow-back" size={28} color="#1C1C1E" />
          </TouchableOpacity>
          
          <View>
            <Text className="text-xl font-bold text-text-primary">
              User Management
            </Text>
            <Text className="text-sm text-text-secondary">
              {filteredUsers.length} users
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          className="bg-blue-500 px-4 py-2 rounded-lg active:opacity-80"
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        entering={SlideInUp.delay(200).duration(400)}
        className="px-4 pb-4"
      >
        <View className="bg-bg-secondary rounded-lg flex-row items-center px-4 py-3 border border-gray-200">
          <MaterialIcons name="search" size={20} color="#8A8A8E" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search users by name or email..."
            className="flex-1 ml-3 text-text-primary"
            placeholderTextColor="#8A8A8E"
          />
        </View>
      </Animated.View>

      {/* Users List */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredUsers.map((user, index) => (
          <Animated.View
            key={user.id}
            entering={FadeInDown.delay(300 + index * 100).duration(300)}
            className="mb-4"
          >
            <PremiumCard>
              <View className="p-4">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text-primary">
                      {user.user_metadata?.full_name || 'No Name'}
                    </Text>
                    <Text className="text-text-secondary">
                      {user.email}
                    </Text>
                    <Text className="text-xs text-text-secondary mt-1">
                      Created: {new Date(user.created_at || '').toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => openEditModal(user)}
                      className="p-2 bg-blue-50 rounded-lg mr-2 active:opacity-70"
                    >
                      <MaterialIcons name="edit" size={16} color="#3B82F6" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleDeleteUser(user)}
                      className="p-2 bg-red-50 rounded-lg active:opacity-70"
                    >
                      <MaterialIcons name="delete" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* User Roles */}
                <View className="flex-row flex-wrap">
                  {user.roles.length > 0 ? (
                    user.roles.map(role => (
                      <View
                        key={role.role_id}
                        className="bg-green-100 px-2 py-1 rounded mr-2 mb-1"
                      >
                        <Text className="text-xs text-green-700 font-medium">
                          {role.role_name}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View className="bg-gray-100 px-2 py-1 rounded">
                      <Text className="text-xs text-gray-500">No roles assigned</Text>
                    </View>
                  )}
                </View>
              </View>
            </PremiumCard>
          </Animated.View>
        ))}

        {filteredUsers.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <MaterialIcons name="people" size={64} color="#E5E5E5" />
            <Text className="text-text-secondary text-center mt-4">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create User Modal */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full max-w-md"
          >
            <PremiumCard>
              <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                  Create New User
                </Text>

                <TextInput
                  value={createForm.full_name}
                  onChangeText={(text) => setCreateForm(prev => ({ ...prev, full_name: text }))}
                  placeholder="Full Name"
                  className="bg-bg-secondary rounded-lg px-4 py-3 mb-3 text-text-primary border border-gray-200"
                />

                <TextInput
                  value={createForm.email}
                  onChangeText={(text) => setCreateForm(prev => ({ ...prev, email: text }))}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-bg-secondary rounded-lg px-4 py-3 mb-3 text-text-primary border border-gray-200"
                />

                <TextInput
                  value={createForm.password}
                  onChangeText={(text) => setCreateForm(prev => ({ ...prev, password: text }))}
                  placeholder="Password"
                  secureTextEntry
                  className="bg-bg-secondary rounded-lg px-4 py-3 mb-3 text-text-primary border border-gray-200"
                />

                <Text className="text-sm font-medium text-text-secondary mb-2">Roles:</Text>
                <View className="flex-row flex-wrap mb-4">
                  {roles.map(role => (
                    <TouchableOpacity
                      key={role.role_id}
                      onPress={() => toggleRole(role.role_id, true)}
                      className={`px-3 py-2 rounded-lg mr-2 mb-2 border ${
                        createForm.role_ids.includes(role.role_id)
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <Text className={`text-sm ${
                        createForm.role_ids.includes(role.role_id)
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}>
                        {role.role_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 py-3 rounded-lg"
                  >
                    <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleCreateUser}
                    disabled={formLoading}
                    className="flex-1 bg-blue-500 py-3 rounded-lg opacity-90 active:opacity-70"
                  >
                    {formLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-medium">Create User</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </PremiumCard>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="w-full max-w-md"
          >
            <PremiumCard>
              <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                  Edit User
                </Text>

                <TextInput
                  value={editForm.full_name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, full_name: text }))}
                  placeholder="Full Name"
                  className="bg-bg-secondary rounded-lg px-4 py-3 mb-3 text-text-primary border border-gray-200"
                />

                <TextInput
                  value={editForm.email}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-bg-secondary rounded-lg px-4 py-3 mb-3 text-text-primary border border-gray-200"
                />

                <Text className="text-sm font-medium text-text-secondary mb-2">Roles:</Text>
                <View className="flex-row flex-wrap mb-4">
                  {roles.map(role => (
                    <TouchableOpacity
                      key={role.role_id}
                      onPress={() => toggleRole(role.role_id, false)}
                      className={`px-3 py-2 rounded-lg mr-2 mb-2 border ${
                        editForm.role_ids.includes(role.role_id)
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <Text className={`text-sm ${
                        editForm.role_ids.includes(role.role_id)
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}>
                        {role.role_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 py-3 rounded-lg"
                  >
                    <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleEditUser}
                    disabled={formLoading}
                    className="flex-1 bg-blue-500 py-3 rounded-lg opacity-90 active:opacity-70"
                  >
                    {formLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-medium">Update User</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </PremiumCard>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}