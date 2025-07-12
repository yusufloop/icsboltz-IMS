import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BookingCard } from '@/components/BookingCard';
import { CircularProgress } from '@/components/CircularProgress';
import { InvoiceItem } from '@/components/InvoiceItem';

export default function DashboardScreen() {
  const invoices = [
    { id: '#ITEM 2', route: 'PNG - KLG', status: 'Paid', statusColor: 'text-green-500' },
    { id: '#ITEM 2', route: 'PNG - KLG', status: 'Paid', statusColor: 'text-green-500' },
    { id: '#ITEM 2', route: 'PNG - KLG', status: 'Overdue', statusColor: 'text-red-500' },
  ];

  const bookingStats = [
    { label: 'In Transit', value: 64, color: '#3b82f6' },
    { label: 'New', value: 10, color: '#f59e0b' },
    { label: 'Delivered', value: 85, color: '#f59e0b' },
  ];

  const recentBookings = [
    { id: '#ITEM 2', status: 'Picked Up' },
    { id: '#ITEM 2', status: 'Picked Up' },
    { id: '#ITEM 2', status: 'Picked Up' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-white">
          <Ionicons name="star" size={24} color="#000" />
          <Text className="text-xl font-bold text-gray-900 ml-3">Dashboard</Text>
        </View>

        {/* Invoices Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-blue-600 mb-4">Invoices</Text>
          <View className="space-y-3">
            {invoices.map((invoice, index) => (
              <InvoiceItem
                key={index}
                id={invoice.id}
                route={invoice.route}
                status={invoice.status}
                statusColor={invoice.statusColor}
              />
            ))}
          </View>
        </View>

        {/* Booking Summary Section */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 text-center mb-6">Booking Summary</Text>
          
          {/* Circular Progress */}
          <View className="items-center mb-8">
            <CircularProgress 
              size={160}
              strokeWidth={12}
              progress={75}
              centerText="159"
              centerSubtext="Bookings this year"
            />
          </View>

          {/* Stats */}
          <View className="flex-row justify-between">
            {bookingStats.map((stat, index) => (
              <View key={index} className="flex-row items-center">
                <View 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: stat.color }}
                />
                <Text className="text-gray-700 text-sm mr-1">{stat.label}</Text>
                <Text className="font-semibold text-gray-900">{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        <View className="mx-4 mt-4 mb-6">
          <View className="flex-row justify-between space-x-3">
            {recentBookings.map((booking, index) => (
              <BookingCard
                key={index}
                id={booking.id}
                status={booking.status}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}