import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
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

export default function AdminUserManagementWebScreen() {
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

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userToDelete.user_metadata?.full_name || userToDelete.email}? This action cannot be undone.`
    );

    if (confirmDelete) {
      UserManagementService.deleteUser(userToDelete.id).then(result => {
        if (result.error) {
          Alert.alert('Error', `Failed to delete user: ${result.error}`);
        } else {
          Alert.alert('Success', 'User deleted successfully!');
          loadData();
        }
      });
    }
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
      <View className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          className="flex-row items-center justify-between mb-8"
        >
          <View>
            <Text className="text-3xl font-bold text-text-primary">
              User Management
            </Text>
            <Text className="text-text-secondary mt-1">
              Manage system users and their permissions
            </Text>
          </View>

          <PremiumButton
            title="Create User"
            onPress={() => setShowCreateModal(true)}
            variant="gradient"
            size="md"
          />
        </Animated.View>

        {/* Search and Stats */}
        <Animated.View 
          entering={SlideInUp.delay(200).duration(400)}
          className="flex-row items-center gap-4 mb-6"
        >
          <View className="flex-1 bg-bg-secondary rounded-xl flex-row items-center px-4 py-3 border border-gray-200">
            <MaterialIcons name="search" size={20} color="#8A8A8E" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search users by name or email..."
              className="flex-1 ml-3 text-text-primary"
              placeholderTextColor="#8A8A8E"
            />
          </View>

          <View className="bg-blue-50 px-4 py-3 rounded-xl">
            <Text className="text-blue-600 font-semibold">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
            </Text>
          </View>
        </Animated.View>

        {/* Users Table */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          className="flex-1"
        >
          <PremiumCard className="flex-1">
            <View className="p-6">
              {/* Table Header */}
              <View className="flex-row items-center py-3 border-b border-gray-200 mb-4">
                <Text className="flex-1 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  User
                </Text>
                <Text className="w-32 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Roles
                </Text>
                <Text className="w-32 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Created
                </Text>
                <Text className="w-24 text-sm font-semibold text-text-secondary uppercase tracking-wide">
                  Actions
                </Text>
              </View>

              {/* Table Body */}
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {filteredUsers.map((user, index) => (
                  <Animated.View
                    key={user.id}
                    entering={FadeInDown.delay(400 + index * 50).duration(300)}
                    className="flex-row items-center py-4 border-b border-gray-100 hover:bg-gray-50"
                  >
                    {/* User Info */}
                    <View className="flex-1">
                      <Text className="text-text-primary font-medium">
                        {user.user_metadata?.full_name || 'No Name'}
                      </Text>
                      <Text className="text-text-secondary text-sm">
                        {user.email}
                      </Text>
                      {user.email_confirmed_at && (
                        <View className="flex-row items-center mt-1">
                          <MaterialIcons name="verified" size={12} color="#10B981" />
                          <Text className="text-xs text-green-600 ml-1">Verified</Text>
                        </View>
                      )}
                    </View>

                    {/* Roles */}
                    <View className="w-32">
                      {user.roles.length > 0 ? (
                        <View className="flex-row flex-wrap">
                          {user.roles.slice(0, 2).map(role => (
                            <View
                              key={role.role_id}
                              className="bg-green-100 px-2 py-1 rounded mr-1 mb-1"
                            >
                              <Text className="text-xs text-green-700 font-medium">
                                {role.role_name}
                              </Text>
                            </View>
                          ))}
                          {user.roles.length > 2 && (
                            <Text className="text-xs text-text-secondary">
                              +{user.roles.length - 2} more
                            </Text>
                          )}
                        </View>
                      ) : (
                        <Text className="text-xs text-gray-400">No roles</Text>
                      )}
                    </View>

                    {/* Created Date */}
                    <View className="w-32">
                      <Text className="text-sm text-text-secondary">
                        {new Date(user.created_at || '').toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Actions */}
                    <View className="w-24 flex-row">
                      <TouchableOpacity
                        onPress={() => openEditModal(user)}
                        className="p-2 hover:bg-blue-50 rounded-lg mr-1"
                      >
                        <MaterialIcons name="edit" size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => handleDeleteUser(user)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <MaterialIcons name="delete" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ))}

                {filteredUsers.length === 0 && (
                  <View className="flex-1 justify-center items-center py-20">
                    <MaterialIcons name="people" size={64} color="#E5E5E5" />
                    <Text className="text-text-secondary text-center mt-4 text-lg">
                      {searchQuery ? 'No users found matching your search' : 'No users found'}
                    </Text>
                    {!searchQuery && (
                      <Text className="text-text-secondary text-center mt-2">
                        Create your first user to get started
                      </Text>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Create User Modal */}
        <Modal visible={showCreateModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="w-full max-w-md bg-white rounded-2xl shadow-xl">
              <PremiumCard>
                <ScrollView className="max-h-96 p-6" showsVerticalScrollIndicator={false}>
                  <Text className="text-xl font-bold text-text-primary mb-6 text-center">
                    Create New User
                  </Text>

                  <View className="space-y-4">
                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-2">Full Name</Text>
                      <TextInput
                        value={createForm.full_name}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, full_name: text }))}
                        placeholder="Enter full name"
                        className="bg-bg-secondary rounded-xl px-4 py-3 text-text-primary border border-gray-200"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-2">Email</Text>
                      <TextInput
                        value={createForm.email}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, email: text }))}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-bg-secondary rounded-xl px-4 py-3 text-text-primary border border-gray-200"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-2">Password</Text>
                      <TextInput
                        value={createForm.password}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, password: text }))}
                        placeholder="Enter password"
                        secureTextEntry
                        className="bg-bg-secondary rounded-xl px-4 py-3 text-text-primary border border-gray-200"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-3">Assign Roles</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {roles.map(role => (
                          <TouchableOpacity
                            key={role.role_id}
                            onPress={() => toggleRole(role.role_id, true)}
                            className={`px-4 py-2 rounded-xl border transition-colors ${
                              createForm.role_ids.includes(role.role_id)
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            <Text className={`text-sm font-medium ${
                              createForm.role_ids.includes(role.role_id)
                                ? 'text-blue-700'
                                : 'text-gray-700'
                            }`}>
                              {role.role_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mt-8">
                    <TouchableOpacity
                      onPress={() => setShowCreateModal(false)}
                      className="flex-1 bg-gray-200 py-3 rounded-xl"
                    >
                      <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleCreateUser}
                      disabled={formLoading}
                      className="flex-1 bg-blue-500 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      {formLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text className="text-white text-center font-medium">Create User</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </PremiumCard>
            </View>
          </View>
        </Modal>

        {/* Edit User Modal */}
        <Modal visible={showEditModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <View className="w-full max-w-md bg-white rounded-2xl shadow-xl">
              <PremiumCard>
                <ScrollView className="max-h-96 p-6" showsVerticalScrollIndicator={false}>
                  <Text className="text-xl font-bold text-text-primary mb-6 text-center">
                    Edit User
                  </Text>

                  <View className="space-y-4">
                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-2">Full Name</Text>
                      <TextInput
                        value={editForm.full_name}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, full_name: text }))}
                        placeholder="Enter full name"
                        className="bg-bg-secondary rounded-xl px-4 py-3 text-text-primary border border-gray-200"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-2">Email</Text>
                      <TextInput
                        value={editForm.email}
                        onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-bg-secondary rounded-xl px-4 py-3 text-text-primary border border-gray-200"
                      />
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-text-secondary mb-3">Assign Roles</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {roles.map(role => (
                          <TouchableOpacity
                            key={role.role_id}
                            onPress={() => toggleRole(role.role_id, false)}
                            className={`px-4 py-2 rounded-xl border transition-colors ${
                              editForm.role_ids.includes(role.role_id)
                                ? 'bg-blue-100 border-blue-500'
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            <Text className={`text-sm font-medium ${
                              editForm.role_ids.includes(role.role_id)
                                ? 'text-blue-700'
                                : 'text-gray-700'
                            }`}>
                              {role.role_name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mt-8">
                    <TouchableOpacity
                      onPress={() => setShowEditModal(false)}
                      className="flex-1 bg-gray-200 py-3 rounded-xl"
                    >
                      <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleEditUser}
                      disabled={formLoading}
                      className="flex-1 bg-blue-500 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      {formLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text className="text-white text-center font-medium">Update User</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </PremiumCard>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}