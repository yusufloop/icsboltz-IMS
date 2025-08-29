import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// IMPROVEMENT: Removed the Sidebar import
// import { Sidebar } from '../ui/Sidebar';

// Data structures
interface Request {
  id: string;
  itemName: string;
  date: string;
  status: 'Approved' | 'In Progress' | 'Disapproved';
}

interface Loan {
  id: string;
  itemName: string;
  loanDate: string;
  returnDueDate: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

// Mock data arrays
const mockRequests: Request[] = [
  { id: '1', itemName: 'Torque Wrench', date: '2024-01-15', status: 'Approved' },
  { id: '2', itemName: 'Specialized Boxed Set Wrench Sets For Aviation', date: '2024-01-14', status: 'In Progress' },
  { id: '3', itemName: 'Portable Power Genset', date: '2024-01-13', status: 'Disapproved' },
  { id: '4', itemName: 'USB-C Hub', date: '2024-01-12', status: 'Approved' },
  { id: '5', itemName: 'Webcam HD', date: '2024-01-11', status: 'In Progress' }
];

const mockLoans: Loan[] = [
  { id: '1', itemName: 'Projector Epson', loanDate: '2024-01-10', returnDueDate: '2024-01-20' },
  { id: '2', itemName: 'Digital Camera', loanDate: '2024-01-08', returnDueDate: '2024-01-25' },
  { id: '3', itemName: 'Tablet iPad Pro', loanDate: '2024-01-05', returnDueDate: '2024-01-15' },
  { id: '4', itemName: 'Bluetooth Speaker', loanDate: '2024-01-03', returnDueDate: '2024-01-18' }
];

const mockNotifications: Notification[] = [
  { id: '1', message: 'Your request for Laptop Dell XPS 13 has been approved', timestamp: '2024-01-15 10:30 AM' },
  { id: '2', message: 'Reminder: Projector Epson is due for return tomorrow', timestamp: '2024-01-14 2:15 PM' },
  { id: '3', message: 'Your request for Monitor 24 inch requires additional information', timestamp: '2024-01-13 9:45 AM' },
  { id: '4', message: 'New equipment available in inventory', timestamp: '2024-01-12 4:20 PM' },
  { id: '5', message: 'System maintenance scheduled for this weekend', timestamp: '2024-01-11 11:00 AM' }
];

const RequesterDashboard: React.FC = () => {
  const getStatusBadgeClasses = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full";
    switch (status) {
      case 'Approved':
        return { container: `${baseClasses} bg-green-100`, text: 'text-green-800 text-xs font-bold' };
      case 'In Progress':
        return { container: `${baseClasses} bg-yellow-100`, text: 'text-yellow-800 text-xs font-bold' };
      case 'Disapproved':
        return { container: `${baseClasses} bg-red-100`, text: 'text-red-800 text-xs font-bold' };
      default:
        return { container: baseClasses, text: 'text-xs font-bold' };
    }
  };

  const handleNewTools = () => {
      router.push('/new-request');
    };
  const handleNewLoan = () => {
      router.push('/new-loan');
    };

    const Request = () => {
      router.push('/requests');
    };

    const Loan = () => {
      router.push('/loan');
    };

  return (
    // IMPROVEMENT: Changed to SafeAreaView and removed `flex-row` as the sidebar is gone
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      {/* 
        IMPROVEMENT: Removed the Sidebar component and its container View.
        The ScrollView is now the direct child of the SafeAreaView.
      */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header for Requester Dashboard */}
        <View className="bg-white px-4 py-6 sm:px-6 lg:px-8 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Dashboard</Text>
          <Text className="text-gray-600">Manage your tool requests and track their status</Text>
        </View>
        
        <View className="p-4 sm:p-6 lg:p-8">
          <View className="flex-col lg:flex-row gap-6">
            
            {/* Main Content - Requests and Loans */}
            <View className="lg:w-2/3 flex flex-col gap-6 ">
              {/* My Recent Requests Widget */}
              <View className="bg-white p-6 rounded-xl shadow-md">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-800">My Recent Tools</Text>
                  <TouchableOpacity onPress={Request} className="flex-row items-center gap-1">
                    <Text className="text-sm font-semibold text-blue-600">View All</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
                <View className="flex flex-col gap-3">
                  {mockRequests.map((request) => {
                    const statusStyle = getStatusBadgeClasses(request.status);
                    return (
                      <View key={request.id} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View>
                          <Text className="font-semibold text-gray-900">{request.itemName}</Text>
                          <Text className="text-sm text-gray-500">{request.date}</Text>
                        </View>
                        <View className={statusStyle.container}>
                           <Text className={statusStyle.text}>{request.status}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* My Active Loans Widget */}
              <View className="bg-white p-6 rounded-xl shadow-md">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-800">My Active Loans</Text>
                  <TouchableOpacity onPress={Loan} className="flex-row items-center gap-1">
                    <Text className="text-sm font-semibold text-blue-600">View All</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
                <View className="flex flex-col gap-3">
                  {mockLoans.map((loan) => {
                    const isOverdue = new Date(loan.returnDueDate) < new Date();
                    return (
                      <View key={loan.id} className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <View>
                          <Text className="font-semibold text-gray-900">{loan.itemName}</Text>
                        </View>
                        <View className="items-end">
                          <Text className={`text-sm ${isOverdue ? 'font-bold text-red-600' : 'text-gray-600'}`}>
                            {isOverdue ? 'Overdue' : `Due: ${loan.returnDueDate}`}
                          </Text>
                          <Text className="text-xs text-gray-400">Loaned: {loan.loanDate}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Sidebar Content - Actions and Notifications */}
            <View className="lg:w-1/3 flex flex-col gap-6 pr-10">
              {/* Quick Actions Widget */}
              <View className="bg-white p-6 rounded-xl shadow-md">
                <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
                <View className="flex flex-col gap-4">
                  <TouchableOpacity onPress={handleNewTools} className="w-full flex-row items-center justify-center gap-2 bg-blue-600 active:bg-blue-700 py-3 px-4 rounded-lg">
                    <MaterialIcons name="add" size={22} color="#ffffff" />
                    <Text className="text-white font-semibold">New Tools</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNewLoan} className="w-full flex-row items-center justify-center gap-2 bg-green-600 active:bg-green-700 py-3 px-4 rounded-lg">
                    <MaterialIcons name="card-giftcard" size={22} color="#ffffff" />
                    <Text className="text-white font-semibold">New Loan</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notifications Widget */}
              <View className="bg-white p-6 rounded-xl shadow-md">
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="notifications" size={24} color="#6b7280" />
                  <Text className="text-xl font-bold text-gray-800">Notifications</Text>
                </View>
                <View className="flex flex-col">
                  {mockNotifications.map((notification, index) => (
                    <TouchableOpacity key={notification.id} className={`py-3 ${index !== 0 ? 'border-t border-gray-200' : ''} active:bg-gray-50`}>
                      <Text className="text-sm text-gray-700">{notification.message}</Text>
                      <Text className="text-xs text-gray-400 mt-1">{notification.timestamp}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequesterDashboard;
