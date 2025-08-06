import { Dashboard } from '@/components/dashboard/Dashboard';
import RequesterDashboard from '@/components/dashboard/RequesterDashboard';
import { ICSBOLTZ_CURRENT_USER_ROLE } from '@/constants/UserRoles';
import React from 'react';

export default function DashboardScreen() {
  // Show RequesterDashboard for Requester users, regular Dashboard for others
  const isRequester = ICSBOLTZ_CURRENT_USER_ROLE === 'REQUESTER';
  
  if (isRequester) {
    return <RequesterDashboard />;
  }
  
  return <Dashboard />;
}
