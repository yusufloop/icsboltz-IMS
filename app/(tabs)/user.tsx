import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, LocationEdit as Edit, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

interface Charge {
  id: string;
  amount: string;
  date: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  description: string;
}

export default function ChargesScreen() {
  const [charges, setCharges] = useState<Charge[]>([
    {
      id: '1',
      amount: '$250.00',
      date: '2024-01-15',
      status: 'Paid',
      description: 'Container delay - Port of Lagos'
    },
    {
      id: '2',
      amount: '$180.00',
      date: '2024-01-20',
      status: 'Pending',
      description: 'Equipment detention - Terminal A'
    },
    {
      id: '3',
      amount: '$320.00',
      date: '2024-01-22',
      status: 'Overdue',
      description: 'Storage fees - Warehouse B'
    },
  ]);

  const handleAddCharge = () => {
    router.push('/(tabs)/demurrage/charge');
  };

  const handleEditCharge = (id: string) => {
    // Navigate to edit charge page
    console.log('Edit charge:', id);
  };

  const handleDeleteCharge = (id: string) => {
    setCharges(charges.filter(charge => charge.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return '#10b981';
      case 'Pending':
        return '#f59e0b';
      case 'Overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Charges</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCharge}>
          <Plus size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Table */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.amountColumn]}>Amount</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn]}>Date</Text>
            <Text style={[styles.tableHeaderText, styles.statusColumn]}>Status</Text>
            <Text style={[styles.tableHeaderText, styles.actionsColumn]}>Actions</Text>
          </View>

          {/* Table Rows */}
          {charges.map((charge) => (
            <View key={charge.id} style={styles.tableRow}>
              <View style={styles.amountColumn}>
                <Text style={styles.amountText}>{charge.amount}</Text>
                <Text style={styles.descriptionText}>{charge.description}</Text>
              </View>
              
              <View style={styles.dateColumn}>
                <Text style={styles.cellText}>{charge.date}</Text>
              </View>
              
              <View style={styles.statusColumn}>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(charge.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(charge.status) }]}>
                    {charge.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.actionsColumn}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditCharge(charge.id)}
                >
                  <Edit size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteCharge(charge.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {charges.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No charges found</Text>
            <Text style={styles.emptyStateSubtext}>Add your first demurrage charge to get started</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddCharge}>
              <Plus size={20} color="#3b82f6" />
              <Text style={styles.emptyStateButtonText}>Add Charge</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    fontFamily: 'Inter-SemiBold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'center',
  },
  amountColumn: {
    flex: 2,
  },
  dateColumn: {
    flex: 1,
    alignItems: 'center',
  },
  statusColumn: {
    flex: 1,
    alignItems: 'center',
  },
  actionsColumn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Inter-Regular',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  emptyStateButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
});