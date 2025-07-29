import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DemurrageChargeScreen() {
  const [demurrageCharge, setDemurrageCharge] = useState('');
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;

  const handleGoBack = () => {
    router.back();
  };

  const handleAdd = () => {
    if (!demurrageCharge.trim()) {
      Alert.alert('Error', 'Please enter a demurrage charge amount');
      return;
    }
    
    const action = isEditing ? 'updated' : 'added';
    Alert.alert('Success', `Demurrage charge of ${demurrageCharge} has been ${action}`);
    
    // Navigate back to charges page
    router.push('/(tabs)/user');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <ChevronLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demurrage Charge</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          {isEditing ? 'Edit the information below' : 'Fill in the information below'}
        </Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Demurrage Charge</Text>
          <TextInput
            style={styles.input}
            value={demurrageCharge}
            onChangeText={setDemurrageCharge}
            placeholder="Enter amount"
            placeholderTextColor="#C7C7CC"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Compensate for back button width
    fontFamily: 'Inter-SemiBold',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 40,
    fontFamily: 'Inter-Regular',
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});