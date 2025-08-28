import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ICSBOLTZ_CURRENT_USER_ROLE } from '@/constants/UserRoles';

export default function MoreScreen() {
  // Check if current user is a requester - hide View Request for requesters
  const isRequester = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER';
  const isGeneralManager = ICSBOLTZ_CURRENT_USER_ROLE === 'GENERAL_MANAGER';
  const isAdmin = ICSBOLTZ_CURRENT_USER_ROLE === 'ADMINISTRATOR';

  const handleNewRequest = () => {
    router.push('/new-request');
  };

  const handleviewLoan = () => {
    router.push('/view-loan');
  };

  const handleviewUser = () => {
    router.push('/view-user');
  };

  const handleResubmitRequest = () => {
    router.push('/resubmit-request');
  };

  const handleViewRequest = () => {
    router.push('/view-request');
  };

  const handleGMReview = () => {
    router.push('/gm-view-request-step1');
  };

  const handleToolLifecycleRules = () => {
    router.push('/tool-lifecycle-rules');
  };

  const handleToolShelflifeRules = () => {
    router.push('/tool-shelflife-rules');
  };

  const handleWarranty = () => {
    router.push('/warranty');
  };

  const handleStatusHistory = () => {
    router.push('/status-history');
  };

  const handleRequesterDashboard = () => {
    router.push('/requester-dashboard');
  };

  const handleUserProfile = () => {
    router.push('/user-profile');
  };

  const handleUserManagement = () => {
    //router.push('admin');
  };

    const handleToolDetail = () => {
    router.push('/tool-detail');
  };

  const handleHelpSupport = () => {
    console.log('Navigate to Help & Support');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="star" size={24} color="#000" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Menu Items Container */}
        <View style={styles.menuContainer}>
          {/* User Profile */}
          <TouchableOpacity style={styles.menuItem} onPress={handleUserProfile}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>User Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Tool Detail */}
          <TouchableOpacity style={styles.menuItem} onPress={handleToolDetail}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="build-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Tool Detail</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* View Loan */}
          <TouchableOpacity style={styles.menuItem} onPress={handleviewLoan}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="build-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>View Loan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* View User */}
          <TouchableOpacity style={styles.menuItem} onPress={handleviewUser}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="build-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>View User</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* New Request */}
          <TouchableOpacity style={styles.menuItem} onPress={handleResubmitRequest}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="refresh-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Resubmit Request</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Conditional separator and View Request - only show for non-requesters */}
          {!isRequester && (
            <>
              {/* Separator Line */}
              <View style={styles.separator} />

              {/* View Request */}
              <TouchableOpacity style={styles.menuItem} onPress={handleViewRequest}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="eye-outline" size={20} color="#666" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>View Request</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </>
          )}

          {/* GM Review - only show for General Manager */}
        
            <>
              {/* Separator Line */}
              <View style={styles.separator} />

              {/* GM Review */}
              <TouchableOpacity style={styles.menuItem} onPress={handleGMReview}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#666" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>GM Review</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </>
         

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Tool Life Cycle Rules */}
          <TouchableOpacity style={styles.menuItem} onPress={handleToolLifecycleRules}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Tool Life Cycle Rules</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Tool Shelf Life Rules */}
          <TouchableOpacity style={styles.menuItem} onPress={handleToolShelflifeRules}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="library-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Tool Shelf Life Rules</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Tool Warranties */}
          <TouchableOpacity style={styles.menuItem} onPress={handleWarranty}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Tool Warranties</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Status History */}
          <TouchableOpacity style={styles.menuItem} onPress={handleStatusHistory}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Status History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Admin Features - only show for Admin */}
          {isAdmin && (
            <>
              {/* Separator Line */}
              <View style={styles.separator} />

              {/* User Management */}
              <TouchableOpacity style={styles.menuItem} onPress={handleUserManagement}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="people-outline" size={20} color="#666" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>User Management</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>

              {/* Separator Line */}
              <View style={styles.separator} />

              {/* Requester Dashboard */}
              <TouchableOpacity style={styles.menuItem} onPress={handleRequesterDashboard}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="grid-outline" size={20} color="#666" style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Requester Dashboard</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Large spacing between sections */}
        <View style={styles.largeSpacer} />

        {/* Help & Support Section */}
        {/* <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpSupport}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbubble-outline" size={20} color="#666" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 12,
    color: '#000',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
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
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginLeft: 20,
  },
  largeSpacer: {
    height: 200, // Large spacing to match the image layout
  },
});