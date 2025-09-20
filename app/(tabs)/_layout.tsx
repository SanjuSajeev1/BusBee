import React from "react";
import { Tabs } from "expo-router";
import { Platform, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1A73E8",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 25 : 8,
          height: Platform.OS === "ios" ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: "#1A73E8",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
          headerTitle: "BusBee",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="search" focused={focused} color={color} />
          ),
          headerTitle: "Find Buses",
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="bookings" focused={focused} color={color} />
          ),
          headerTitle: "My Bookings",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="profile" focused={focused} color={color} />
          ),
          headerTitle: "Profile",
        }}
      />
      <Tabs.Screen
        name="choose-bus"
        options={{
          href: null, // Hide from tab bar
          headerTitle: "Choose Bus",
        }}
      />
      <Tabs.Screen
        name="song-request"
        options={{
          href: null, // Hide from tab bar
          headerTitle: "Song Request",
        }}
      />
    </Tabs>
  );
}

// Simple icon component (you can replace with actual icons later)
function TabIcon({
  name,
  focused,
  color,
}: {
  name: string;
  focused: boolean;
  color: string;
}) {
  const getIcon = () => {
    switch (name) {
      case "home":
        return focused ? "🏠" : "🏡";
      case "search":
        return focused ? "🔍" : "🔎";
      case "bookings":
        return focused ? "🎫" : "🎟️";
      case "profile":
        return focused ? "👤" : "👥";
      default:
        return "📱";
    }
  };

  return <Text style={{ fontSize: 20, color }}>{getIcon()}</Text>;
}
