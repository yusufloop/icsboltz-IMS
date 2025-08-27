import { DesignSystem } from '@/constants/DesignSystem';
import { UserRole, getCurrentUserRole, getRoleConfig, ICSBOLTZ_CURRENT_USER_ROLE } from '@/constants/UserRoles';
import { useAuth } from '@/lib/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native';

const AnimatedMaterialIcons = Animated.createAnimatedComponent(MaterialIcons);

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>(ICSBOLTZ_CURRENT_USER_ROLE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, user } = useAuth();

  // Animation setup
  const animation = useRef(new Animated.Value(isCollapsed ? 0 : 1)).current;

  useEffect(() => {
    // Run the animation whenever isCollapsed changes
    Animated.timing(animation, {
      toValue: isCollapsed ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [isCollapsed, animation]);

  // Interpolated styles
  const animatedWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 280],
  });

  const iconMarginRight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const contentOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const logoIconOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const getRoleBasedNavigation = (): NavigationItem[] => {
    // --- IMPROVEMENT: Added "My Loans" to the base navigation ---
    const baseNavigation: NavigationItem[] = [
      { id: 'dashboard', title: 'Dashboard', icon: 'dashboard', route: '/' },
      { id: 'requests', title: 'My Requests', icon: 'assignment', route: '/requests' },
      { id: 'loans', title: 'My Loans', icon: 'card-giftcard', route: '/loan' }, // Added this line
    ];

    const roleSpecificItems: NavigationItem[] = [];
    switch (currentRole) {
      case 'REQUESTER':
        roleSpecificItems.push({ id: 'scan', title: 'QR Scan', icon: 'qr-code-scanner', route: '/scan' });
        break;
      case 'HEAD_OF_DEPARTMENT':
      case 'GENERAL_MANAGER':
        roleSpecificItems.push({ id: 'notifications', title: 'Notifications', icon: 'notifications', route: '/notifications' });
        break;
      case 'ADMIN':
        roleSpecificItems.push(
          { id: 'users', title: 'Users', icon: 'people', route: '/user' },
          { id: 'notifications', title: 'Notifications', icon: 'notifications', route: '/notifications' }
        );
        break;
      default:
        roleSpecificItems.push({ id: 'scan', title: 'QR Scan', icon: 'qr-code-scanner', route: '/scan' });
    }

    return [...baseNavigation, ...roleSpecificItems, { id: 'more', title: 'Settings', icon: 'more-horiz', route: '/more' }];
  };

  const userNavigation: NavigationItem[] = [
    { id: 'logout', title: 'Log Out', icon: 'logout', route: '/logout' },
  ];

  const isActiveRoute = (route: string) => {
    if (route === '/' && pathname === '/') return true;
    if (route !== '/' && pathname.startsWith(route)) return true;
    return false;
  };

  const handleNavigation = (route: string, id: string) => {
    if (id === 'logout') {
      signOut();
      return;
    }
    router.push(route as any);
  };

  // Mock unread notifications count - in real app this would come from a service/context
  const getUnreadNotificationsCount = () => {
    // This would typically come from a notifications service or context
    return 3; // Mock count for demonstration
  };

  const renderNavigationItem = (item: NavigationItem, isActive: boolean) => {
    const unreadCount = item.id === 'notifications' ? getUnreadNotificationsCount() : 0;
    
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleNavigation(item.route, item.id)}
        className={`flex-row items-center px-4 py-3 mx-3 rounded-lg transition-all duration-200 ${
          isActive ? 'bg-blue-50 border border-blue-100' : 'hover:bg-white active:bg-gray-100'
        }`}
        style={{
          shadowColor: isActive ? DesignSystem.colors.primary[500] : 'transparent',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isActive ? 0.1 : 0,
          shadowRadius: 2,
          elevation: isActive ? 1 : 0,
        }}
      >
        <AnimatedMaterialIcons
          name={item.icon}
          size={20}
          color={isActive ? DesignSystem.colors.primary[500] : DesignSystem.colors.text.secondary}
          style={{ marginRight: iconMarginRight }}
        />
        <Animated.View style={{ opacity: contentOpacity, flex: 1, overflow: 'hidden' }}>
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-700'}`}
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {item.title}
            </Text>
            {unreadCount > 0 && (
              <View className="bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center ml-2">
                <Text className="text-white text-xs font-bold" style={{ fontSize: 10 }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const mainNavigation = getRoleBasedNavigation();

  return (
    <Animated.View className={`bg-gray-50 border-r border-gray-200 ${className}`} style={{ width: animatedWidth }}>
      {/* Logo Section */}
      <View className="px-6 py-6 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setIsCollapsed(!isCollapsed)}
          className="flex-row items-center justify-center active:opacity-80"
          style={{ height: 40 }}
        >
          <Animated.Image
            source={require('@/assets/images/icon-kecik.png')}
            style={{ width: 32, height: 32, opacity: logoIconOpacity, position: 'absolute' }}
            resizeMode="contain"
          />
          <Animated.Image
            source={require('@/assets/images/logo-besar.png')}
            style={{ width: 120, height: 32, opacity: contentOpacity, position: 'absolute' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <Animated.View style={{ opacity: contentOpacity, flex: 1 }}>
        {/* Main Navigation */}
        <View className="flex-1 py-4">
          <View className="px-3 mb-2">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
              Navigation
            </Text>
            {mainNavigation.map((item) => renderNavigationItem(item, isActiveRoute(item.route)))}
          </View>
        </View>

        {/* User Navigation */}
        <View className="border-t border-gray-100 py-4">
          <View className="px-3">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
              Account
            </Text>
            
            {/* Profile Section with Avatar */}
            <TouchableOpacity
              onPress={() => router.push('/user-profile')}
              className="flex-row items-center px-4 py-3 mx-3 rounded-lg hover:bg-white active:bg-gray-100"
            >
              <View className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center mr-3">
                <MaterialIcons name="person" size={16} color={DesignSystem.colors.text.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                  {user?.user_metadata?.full_name || 'Ahmad Zulkifli'}
                </Text>
                <Text className="text-xs text-gray-500" numberOfLines={1}>
                  {getRoleConfig(currentRole).name}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={16} color={DesignSystem.colors.text.tertiary} />
            </TouchableOpacity>

            {/* Other User Navigation */}
            {userNavigation.map((item) => 
              renderNavigationItem(item, isActiveRoute(item.route))
            )}
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
