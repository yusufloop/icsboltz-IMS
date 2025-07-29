import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

// --- INTERFACES AND CONSTANTS ---
interface UserFormData {
  name: string;
  email: string;
  phoneNo: string;
  role: string;
  department: string;
  rank: string;
}

const ROLE_OPTIONS = [
  'Admin',
  'Manager', 
  'Employee',
  'Supervisor'
];

const DEPARTMENT_OPTIONS = [
  'Marketing',
  'Sales',
  'IT',
  'HR',
  'Finance',
  'Operations'
];

const RANK_OPTIONS = [
  'CEO',
  'Director',
  'Manager',
  'Senior',
  'Junior',
  'Intern'
];

// --- MAIN COMPONENT ---
export default function NewUserScreen() {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phoneNo: '',
    role: '',
    department: '',
    rank: '',
  });

  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
  const [showRankPicker, setShowRankPicker] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const updateField = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter the user name');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter the email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!formData.phoneNo.trim()) {
      Alert.alert('Error', 'Please enter the phone number');
      return;
    }

    if (!formData.role) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    if (!formData.department) {
      Alert.alert('Error', 'Please select a department');
      return;
    }

    if (!formData.rank) {
      Alert.alert('Error', 'Please select a rank');
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log('New user created:', formData);
    
    // Show success message and navigate back
    Alert.alert(
      'Success', 
      'User has been created successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  // --- RENDER ---
  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          className="flex-row items-center px-4 py-3"
        >
          <TouchableOpacity 
            onPress={handleBack}
            className="p-2 -ml-2 mr-2 active:opacity-70"
          >
            <MaterialIcons name="arrow-back" size={28} color="#1C1C1E" />
          </TouchableOpacity>
          
          <View>
            <Text className="text-xl font-bold text-text-primary">
              New Users
            </Text>
          </View>
        </Animated.View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Animated.View 
            entering={SlideInUp.delay(200).duration(400)}
            className="pt-4 space-y-6"
          >
            {/* Name */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2">Name</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => updateField('name', text)}
                placeholder="Johny boi"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Email */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="john.doe@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Phone No */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Phone No</Text>
              <TextInput
                value={formData.phoneNo}
                onChangeText={(text) => updateField('phoneNo', text)}
                placeholder="0123456789"
                keyboardType="phone-pad"
                className="bg-bg-secondary rounded-lg text-base text-text-primary font-system shadow-sm border border-gray-200 px-4 py-3"
              />
            </View>

            {/* Role */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Role</Text>
              <TouchableOpacity onPress={() => setShowRolePicker(true)}>
                <PremiumCard padding="">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.role ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.role || 'Admin'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>

            {/* Department */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Department</Text>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(true)}>
                <PremiumCard padding="">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.department ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.department || 'Marketing'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>

            {/* Rank */}
            <View>
              <Text className="text-sm font-medium text-text-secondary mb-2 pt-4">Rank</Text>
              <TouchableOpacity onPress={() => setShowRankPicker(true)}>
                <PremiumCard padding="">
                  <View className="flex-row items-center justify-between px-4 py-3">
                    <Text className={`text-base font-system ${formData.rank ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.rank || 'CEO'}
                    </Text>
                    <MaterialIcons name="unfold-more" size={24} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>

            {/* Advanced Section */}
            <TouchableOpacity className="flex-row items-center justify-between py-4">
              <Text className="text-base text-text-secondary">Advanced</Text>
              <MaterialIcons name="chevron-right" size={24} color="#8A8A8E" />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Sticky Add Button */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(300)}
          className="absolute bottom-0 left-0 right-0 bg-bg-primary pt-3 pb-6 px-6 border-t border-gray-200"
        >
          <PremiumButton title="Add" onPress={handleSubmit} variant="gradient" size="lg" />
        </Animated.View>

        {/* PICKER MODALS */}
        <Modal visible={showRolePicker} transparent animationType="fade" onRequestClose={() => setShowRolePicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <PremiumCard style={{ width: '100%', maxWidth: 300 }}>
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Role</Text>
              {ROLE_OPTIONS.map((role) => (
                <TouchableOpacity 
                  key={role} 
                  onPress={() => { 
                    updateField('role', role); 
                    setShowRolePicker(false); 
                  }} 
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <Text className="text-base text-text-primary text-center">{role}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowRolePicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </PremiumCard>
          </View>
        </Modal>

        <Modal visible={showDepartmentPicker} transparent animationType="fade" onRequestClose={() => setShowDepartmentPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <PremiumCard style={{ width: '100%', maxWidth: 300, maxHeight: 400 }}>
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Department</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {DEPARTMENT_OPTIONS.map((department) => (
                  <TouchableOpacity 
                    key={department} 
                    onPress={() => { 
                      updateField('department', department); 
                      setShowDepartmentPicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center">{department}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowDepartmentPicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </PremiumCard>
          </View>
        </Modal>

        <Modal visible={showRankPicker} transparent animationType="fade" onRequestClose={() => setShowRankPicker(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center px-4">
            <PremiumCard style={{ width: '100%', maxWidth: 300, maxHeight: 400 }}>
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">Select Rank</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {RANK_OPTIONS.map((rank) => (
                  <TouchableOpacity 
                    key={rank} 
                    onPress={() => { 
                      updateField('rank', rank); 
                      setShowRankPicker(false); 
                    }} 
                    className="py-3 border-b border-gray-200 last:border-b-0"
                  >
                    <Text className="text-base text-text-primary text-center">{rank}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowRankPicker(false)} className="mt-4">
                <Text className="text-base text-text-secondary text-center">Cancel</Text>
              </TouchableOpacity>
            </PremiumCard>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
