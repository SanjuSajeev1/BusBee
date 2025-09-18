import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  const quickActions = [
    { id: 1, title: "Book Now", icon: "🚌", color: ["#1A73E8", "#4285F4"] },
    { id: 2, title: "Track Bus", icon: "📍", color: ["#34A853", "#0F9D58"] },
    { id: 3, title: "My Tickets", icon: "🎫", color: ["#FBBC04", "#F9AB00"] },
    { id: 4, title: "Support", icon: "💬", color: ["#EA4335", "#D33B2C"] },
  ];

  const recentRoutes = [
    { id: 1, from: "Downtown", to: "Airport", time: "45 min", price: "$12" },
    { id: 2, from: "Mall", to: "University", time: "25 min", price: "$8" },
    {
      id: 3,
      from: "Station",
      to: "Business District",
      time: "35 min",
      price: "$10",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#1A73E8", "#4285F4", "#34A853"]}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeText}>Welcome to BusBee!</Text>
          <Text style={styles.heroSubtext}>
            Your premium bus experience starts here
          </Text>

          {/* Search Card */}
          <View style={styles.searchCard}>
            <Text style={styles.searchTitle}>Where are you going?</Text>

            <View style={styles.searchInputs}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>From</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Current location"
                  placeholderTextColor="#A0A0A0"
                  value={fromLocation}
                  onChangeText={setFromLocation}
                />
              </View>

              <TouchableOpacity style={styles.swapButton}>
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>To</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Where to?"
                  placeholderTextColor="#A0A0A0"
                  value={toLocation}
                  onChangeText={setToLocation}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.searchButton}>
              <LinearGradient
                colors={["#1A73E8", "#4285F4"]}
                style={styles.searchButtonGradient}
              >
                <Text style={styles.searchButtonText}>Find Buses</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} style={styles.quickActionItem}>
                <LinearGradient
                  colors={action.color}
                  style={styles.quickActionGradient}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Routes</Text>
          <View style={styles.recentRoutes}>
            {recentRoutes.map((route) => (
              <TouchableOpacity key={route.id} style={styles.routeCard}>
                <View style={styles.routeInfo}>
                  <View style={styles.routeDestinations}>
                    <Text style={styles.routeFrom}>{route.from}</Text>
                    <Text style={styles.routeArrow}>→</Text>
                    <Text style={styles.routeTo}>{route.to}</Text>
                  </View>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routeTime}>{route.time}</Text>
                    <Text style={styles.routePrice}>{route.price}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.bookAgainButton}>
                  <Text style={styles.bookAgainText}>Book Again</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose BusBee?</Text>
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureTitle}>Real-time Tracking</Text>
              <Text style={styles.featureDescription}>
                Track your bus location and get accurate arrival times
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💎</Text>
              <Text style={styles.featureTitle}>Premium Comfort</Text>
              <Text style={styles.featureDescription}>
                Enjoy comfortable seating and premium amenities
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureTitle}>Safe & Secure</Text>
              <Text style={styles.featureDescription}>
                Secure payments and verified drivers for your safety
              </Text>
            </View>
          </View>
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
  scrollContent: {
    paddingBottom: 20,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtext: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 30,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInputs: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#1A73E8",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  swapIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  searchButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  quickActionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  recentRoutes: {
    gap: 12,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  routeInfo: {
    flex: 1,
  },
  routeDestinations: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  routeFrom: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  routeArrow: {
    fontSize: 16,
    color: "#1A73E8",
    marginHorizontal: 8,
  },
  routeTo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  routeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeTime: {
    fontSize: 14,
    color: "#666666",
    marginRight: 16,
  },
  routePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A73E8",
  },
  bookAgainButton: {
    backgroundColor: "#1A73E8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookAgainText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  featuresContainer: {
    gap: 20,
  },
  featureItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
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
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
});
