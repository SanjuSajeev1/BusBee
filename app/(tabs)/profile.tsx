import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "BusBee User",
    email: user?.email || "",
    phone: user?.phone || "+1 (555) 123-4567",
    emergencyContact: "+1 (555) 987-6543",
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Success", "Your profile has been updated successfully!");
  };

  const profileStats = [
    { label: "Total Trips", value: "24", icon: "🚌" },
    { label: "Miles Traveled", value: "1,250", icon: "📍" },
    { label: "Money Saved", value: "$340", icon: "💰" },
    { label: "Carbon Offset", value: "45 kg", icon: "🌱" },
  ];

  const menuItems = [
    {
      id: 1,
      title: "Payment Methods",
      icon: "💳",
      subtitle: "Manage cards & payments",
    },
    {
      id: 2,
      title: "Notifications",
      icon: "🔔",
      subtitle: "Push & email preferences",
    },
    {
      id: 3,
      title: "Travel History",
      icon: "📊",
      subtitle: "View all your trips",
    },
    {
      id: 4,
      title: "Favorite Routes",
      icon: "⭐",
      subtitle: "Quick access routes",
    },
    {
      id: 5,
      title: "Help & Support",
      icon: "❓",
      subtitle: "Get help or contact us",
    },
    {
      id: 6,
      title: "Privacy & Security",
      icon: "🔒",
      subtitle: "Account security settings",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={["#1A73E8", "#4285F4"]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={userData.name}
                  onChangeText={(text) =>
                    setUserData((prev) => ({ ...prev, name: text }))
                  }
                  placeholder="Full Name"
                />
                <TextInput
                  style={styles.editInput}
                  value={userData.email}
                  onChangeText={(text) =>
                    setUserData((prev) => ({ ...prev, email: text }))
                  }
                  placeholder="Email Address"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.editInput}
                  value={userData.phone}
                  onChangeText={(text) =>
                    setUserData((prev) => ({ ...prev, phone: text }))
                  }
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profilePhone}>{userData.phone}</Text>
                {userData.email ? (
                  <Text style={styles.profileEmail}>{userData.email}</Text>
                ) : null}
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Profile Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Journey Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account & Settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyLabel}>Emergency Contact</Text>
              {isEditing ? (
                <TextInput
                  style={styles.emergencyInput}
                  value={userData.emergencyContact}
                  onChangeText={(text) =>
                    setUserData((prev) => ({ ...prev, emergencyContact: text }))
                  }
                  placeholder="Emergency Contact Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.emergencyNumber}>
                  {userData.emergencyContact}
                </Text>
              )}
            </View>
            {!isEditing && (
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Logout",
                  style: "destructive",
                  onPress: async () => {
                    await logout();
                    router.replace("/(auth)/welcome");
                  },
                },
              ])
            }
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  editInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    fontSize: 16,
    color: "#333333",
    minWidth: 200,
    textAlign: "center",
  },
  editButton: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A73E8",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666666",
  },
  menuArrow: {
    fontSize: 20,
    color: "#CCCCCC",
  },
  emergencySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emergencyCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: 4,
  },
  emergencyNumber: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "500",
  },
  emergencyInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  callButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
  },
});
