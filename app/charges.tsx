import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, ListFilter as Filter, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface ChargeItem {
  id: string;
  location: string;
  charges: string;
}

export default function ChargesScreen() {
  const [charges, setCharges] = useState<ChargeItem[]>([
    {
      id: '1',
      location: 'Port of Lagos',
      charges: '$250.00',
    },
    {
      id: '2',
      location: 'Terminal A',
      charges: '$180.00',
    },
    {
      id: '3',
      location: 'Warehouse B',
      charges: '$320.00',
    },
    {
      id: '4',
      location: 'Port of Abuja',
      charges: '$150.00',
    },
    {
      id: '5',
      location: 'Terminal C',
      charges: '$275.00',
    },
  ]);

  const [searchText, setSearchText] = useState('');

  const handleGoBack = () => {
    router.back();
  };

  const handleAddCharge = () => {
    router.push('/edit-charge');
  };

  const handleEditCharge = (id: string) => {
    router.push(`/edit-charge?id=${id}`);
  };

  const filteredCharges = charges.filter(charge =>
    charge.location.toLowerCase().includes(searchText.toLowerCase()) ||
    charge.charges.toLowerCase().includes(searchText.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Charges</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCharge}>
          <Plus size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter and Sort */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort</Text>
          <View style={styles.sortIcon}>
            <Text style={styles.sortArrow}>↕</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#FFFFFF" />
          <Text style={styles.filterText}>Filter</Text>
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Charges List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {filteredCharges.map((charge) => (
            <TouchableOpacity 
              key={charge.id} 
              style={styles.listItem}
              onPress={() => handleEditCharge(charge.id)}
            >
              <View style={styles.itemContent}>
                <View style={styles.itemLeft}>
                  <Text style={styles.locationText}>{charge.location}</Text>
                </View>
                <Text style={styles.chargesText}>{charge.charges}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {filteredCharges.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No charges found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText ? 'Try adjusting your search' : 'Add your first charge to get started'}
            </Text>
            {!searchText && (
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddCharge}>
                <Plus size={20} color="#007AFF" />
                <Text style={styles.emptyStateButtonText}>Add Charge</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
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
    marginRight: 32,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sortText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
    fontFamily: 'Inter-Regular',
  },
  sortIcon: {
    marginLeft: 4,
  },
  sortArrow: {
    fontSize: 12,
    color: '#8E8E93',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  filterText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemLeft: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  chargesText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Inter-Regular',
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
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
});