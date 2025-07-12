import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumStatusBadge } from '@/components/ui/PremiumStatusBadge';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { DesignSystem } from '@/constants/DesignSystem';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookingsScreen() {
  const bookings = [
    { id: '#ITEM 2', status: 'In Transit', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'New', statusType: 'info' as const },
    { id: '#ITEM 2', status: 'Picked Up', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'In Transit', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'Delivered', statusType: 'success' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DesignSystem.colors.background.primary }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: DesignSystem.layout.screenPadding,
          paddingVertical: DesignSystem.spacing.lg,
          backgroundColor: DesignSystem.colors.background.secondary,
          ...DesignSystem.components.shadows.sm,
        }}>
          <MaterialIcons 
            name="star" 
            size={DesignSystem.components.iconSizes.md} 
            color={DesignSystem.colors.primary[500]} 
          />
          <Text style={{
            fontSize: DesignSystem.typography.sizes['2xl'],
            fontFamily: 'Inter-Bold',
            color: DesignSystem.colors.text.primary,
            marginLeft: DesignSystem.spacing.md,
          }}>
            Bookings
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{
          paddingHorizontal: DesignSystem.layout.screenPadding,
          paddingTop: DesignSystem.spacing.lg,
        }}>
          <PremiumCard variant="default" padding="none">
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: DesignSystem.spacing.lg,
              paddingVertical: DesignSystem.spacing.md,
            }}>
              <MaterialIcons 
                name="search" 
                size={DesignSystem.components.iconSizes.sm} 
                color={DesignSystem.colors.text.tertiary}
                style={{ marginRight: DesignSystem.spacing.sm }}
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor={DesignSystem.colors.text.tertiary}
                style={{
                  flex: 1,
                  fontSize: DesignSystem.typography.sizes.base,
                  fontFamily: 'Inter-Regular',
                  color: DesignSystem.colors.text.primary,
                }}
              />
            </View>
          </PremiumCard>
        </View>

        {/* Filter Controls */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: DesignSystem.layout.screenPadding,
          paddingTop: DesignSystem.spacing.lg,
          marginBottom: DesignSystem.spacing.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: DesignSystem.spacing.lg }}>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: DesignSystem.spacing.sm,
            }}>
              <MaterialIcons 
                name="sort" 
                size={DesignSystem.components.iconSizes.sm} 
                color={DesignSystem.colors.text.secondary}
                style={{ marginRight: DesignSystem.spacing.xs }}
              />
              <Text style={{
                fontSize: DesignSystem.typography.sizes.sm,
                fontFamily: 'Inter-Regular',
                color: DesignSystem.colors.text.secondary,
              }}>
                Sort
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={DesignSystem.components.iconSizes.sm} 
                color={DesignSystem.colors.text.secondary}
                style={{ marginLeft: DesignSystem.spacing.xs }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: DesignSystem.spacing.sm,
            }}>
              <MaterialIcons 
                name="filter-list" 
                size={DesignSystem.components.iconSizes.sm} 
                color={DesignSystem.colors.text.secondary}
                style={{ marginRight: DesignSystem.spacing.xs }}
              />
              <Text style={{
                fontSize: DesignSystem.typography.sizes.sm,
                fontFamily: 'Inter-Regular',
                color: DesignSystem.colors.text.secondary,
              }}>
                Filter
              </Text>
              <View style={{
                backgroundColor: DesignSystem.colors.primary[500],
                borderRadius: DesignSystem.components.borderRadius.full,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: DesignSystem.spacing.xs,
              }}>
                <Text style={{
                  fontSize: DesignSystem.typography.sizes.xs,
                  fontFamily: 'Inter-SemiBold',
                  color: DesignSystem.colors.text.inverse,
                }}>
                  2
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{
            backgroundColor: DesignSystem.colors.primary[500],
            borderRadius: DesignSystem.components.borderRadius.full,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            ...DesignSystem.components.shadows.md,
          }}>
            <MaterialIcons 
              name="add" 
              size={DesignSystem.components.iconSizes.md} 
              color={DesignSystem.colors.text.inverse}
            />
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <View style={{
          paddingHorizontal: DesignSystem.layout.screenPadding,
          gap: DesignSystem.spacing.md,
        }}>
          {bookings.map((booking, index) => (
            <Animated.View
              key={`${booking.id}-${index}`}
              entering={FadeInDown.delay(index * 100).duration(300)}
            >
              <PremiumCard variant="elevated" padding="md">
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <Text style={{
                    fontSize: DesignSystem.typography.sizes.lg,
                    fontFamily: 'Inter-SemiBold',
                    color: DesignSystem.colors.text.primary,
                  }}>
                    {booking.id}
                  </Text>
                  
                  <PremiumStatusBadge
                    status={booking.statusType}
                    text={booking.status}
                    size="sm"
                    variant="soft"
                  />
                </View>
              </PremiumCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}