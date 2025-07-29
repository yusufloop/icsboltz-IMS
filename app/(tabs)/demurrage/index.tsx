import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ChevronRight, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DemurrageScreen() {
  const handleDemurrageCharge = () => {
    router.push('/(tabs)/demurrage/charge');
  };

  const handleHelpSupport = () => {
    // Navigate to help & support
    console.log('Navigate to Help & Support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Star size={24} color="#000" />
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Demurrage Charge Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleDemurrageCharge}>
              <Text style={styles.menuItemText}>Demurrage Charge</Text>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>

          {/* Help & Support Section */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleHelpSupport}>
              <View style={styles.menuItemLeft}>
                <MessageCircle size={20} color="#8E8E93" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 12,
    color: '#000',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
  },
});