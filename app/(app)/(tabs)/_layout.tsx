import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, View } from "react-native";
import { Slot } from "expo-router";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ICSBOLTZ_CURRENT_USER_ROLE } from "@/constants/UserRoles";
import { Sidebar } from "@/components/ui/Sidebar";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentRole = ICSBOLTZ_CURRENT_USER_ROLE;

  // For web, use sidebar layout
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 flex-row bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="h-full" />
        
        {/* Main Content Area */}
        <View className="flex-1">
          <Slot />
        </View>
      </View>
    );
  }

  // For mobile, use tab navigation
  const getRoleBasedTabs = () => {
    const baseTabs = [
      {
        name: "index",
        title: "Dashboard",
        icon: "home",
      },
      {
        name: "requests",
        title: "My Requests",
        icon: "assignment",
      },
    ];

    // Role-specific third tab
    let roleSpecificTab;
    switch (currentRole) {
      case "REQUESTER":
        roleSpecificTab = {
          name: "scan",
          title: "Scan",
          icon: "qr-code-scanner",
        };
        break;
      case "HEAD_OF_DEPARTMENT":
      case "GENERAL_MANAGER":
        roleSpecificTab = {
          name: "notifications",
          title: "Notifications",
          icon: "notifications",
        };
        break;
      case "ADMINISTRATOR":
        roleSpecificTab = {
          name: "user",
          title: "Users",
          icon: "people",
        };
        break;
      default:
        roleSpecificTab = {
          name: "scan",
          title: "Scan",
          icon: "qr-code-scanner",
        };
    }

    return [
      ...baseTabs,
      roleSpecificTab,
      {
        name: "more",
        title: "More",
        icon: "more-horiz",
      },
    ];
  };

  const tabs = getRoleBasedTabs();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name={tab.icon as any} size={24} color={color} />
            ),
          }}
        />
      ))}

      {/* Hidden tabs that shouldn't appear in navigation but need to exist for routing */}
      {currentRole !== "REQUESTER" && (
        <Tabs.Screen
          name="scan"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
      )}
      {(currentRole === "REQUESTER" || currentRole === "ADMINISTRATOR") && (
        <Tabs.Screen
          name="notifications"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
      )}
      {currentRole !== "ADMINISTRATOR" && (
        <Tabs.Screen
          name="user"
          options={{
            href: null, // This hides the tab from navigation
          }}
        />
      )}
      
    </Tabs>
  );
}
