import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  StyleSheet 
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function DemurrageChargeScreen() {
  const [demurrageCharge, setDemurrageCharge] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleAdd = () => {
    // Handle add functionality
    console.log('Demurrage Charge:', demurrageCharge);
    // You can add your logic here to save the demurrage charge
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBack}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Demurrage Charge</Text>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Fill in the information below</Text>
      </View>

      {/* Form Content */}
      <View style={styles.formContainer}>
        {/* Demurrage Charge Label */}
        <Text style={styles.inputLabel}>Demurrage Charge</Text>
        
        {/* Input Field */}
        <TextInput
          style={styles.input}
          value={demurrageCharge}
          onChangeText={setDemurrageCharge}
          placeholder=""
          placeholderTextColor="#999"
        />
      </View>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAdd}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  subtitleContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 52,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});