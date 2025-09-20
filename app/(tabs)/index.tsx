import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import LocationPickerModal from "../../src/components/modals/LocationPickerModal";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { selectedLocation } = useLocalSearchParams<{ selectedLocation?: string }>();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const handleFromLocationSelect = (location: any) => {
    if (location?.coordinates?.lat && location?.coordinates?.lng) {
      const { lat, lng } = location.coordinates;
      const coordString = `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
      setFromLocation(coordString);
      return;
    }
    setFromLocation(location.name);
  };

  // Handle location selection from user-location screen
  useEffect(() => {
    if (selectedLocation) {
      try {
        const location = JSON.parse(selectedLocation);
        handleFromLocationSelect(location);
        // Clear the parameter to avoid re-processing
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Error parsing selected location:", error);
      }
    }
  }, [selectedLocation]);

  const quickActions = [
    { id: 1, title: "Book Now", icon: "🚌", color: ["#1A73E8", "#4285F4"] },
    { id: 2, title: "Track Bus", icon: "📍", color: ["#34A853", "#0F9D58"] },
    { id: 3, title: "My Tickets", icon: "🎫", color: ["#FBBC04", "#F9AB00"] },
    { id: 4, title: "Request Song", icon: "🎵", color: ["#9C27B0", "#E91E63"] },
  ] as const;

  const recentRoutes = [
    {
      id: 1,
      from: "Metro Station",
      to: "Airport Terminal",
      time: "45 min",
      price: "₹16",
    },
    {
      id: 2,
      from: "City Mall",
      to: "University Campus",
      time: "25 min",
      price: "₹12",
    },
    {
      id: 3,
      from: "Railway Station",
      to: "Business District",
      time: "35 min",
      price: "₹14",
    },
  ];

  const handleToLocationSelect = (location: any) => {
    setToLocation(location.name);
  };

  const handleFindBuses = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert(
        "Missing Information",
        "Please select both departure and destination locations"
      );
      return;
    }

    if (fromLocation === toLocation) {
      Alert.alert(
        "Invalid Route",
        "Departure and destination cannot be the same"
      );
      return;
    }

    // Navigate to bus results screen
    router.push({
      pathname: "/(search)/results",
      params: {
        from: fromLocation,
        to: toLocation,
      },
    });
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

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
                <TouchableOpacity
                  style={styles.searchInput}
                  onPress={() => setShowFromPicker(true)}
                >
                  <Text
                    style={[
                      styles.searchInputText,
                      !fromLocation && styles.placeholderText,
                    ]}
                  >
                    {fromLocation || "Select departure location"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapLocations}
              >
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>To</Text>
                <TouchableOpacity
                  style={styles.searchInput}
                  onPress={() => setShowToPicker(true)}
                >
                  <Text
                    style={[
                      styles.searchInputText,
                      !toLocation && styles.placeholderText,
                    ]}
                  >
                    {toLocation || "Select destination"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleFindBuses}
            >
              <Text style={styles.searchButtonText}>Find Buses</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => {
                  if (action.title === "My Tickets") {
                    router.push("/(tabs)/bookings");
                  } else if (action.title === "Request Song") {
                    router.push("/(tabs)/choose-bus");
                  } else if (action.title === "Track Bus") {
                    router.push("/(search)/user-location");
                  }
                }}
              >
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
                <View style={styles.routeHeader}>
                  <Text style={styles.routeFrom}>{route.from}</Text>
                  <Text style={styles.routeArrow}>→</Text>
                  <Text style={styles.routeTo}>{route.to}</Text>
                </View>
                <View style={styles.routeFooter}>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routeTime}>{route.time}</Text>
                    <Text style={styles.routePrice}>{route.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookAgainButton}>
                    <Text style={styles.bookAgainText}>Book</Text>
                  </TouchableOpacity>
                </View>
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

      {/* Location Picker Modals */}
      <LocationPickerModal
        visible={showFromPicker}
        title="Select departure location"
        onClose={() => setShowFromPicker(false)}
        onSelectLocation={handleFromLocationSelect}
      />

      <LocationPickerModal
        visible={showToPicker}
        title="Select destination"
        onClose={() => setShowToPicker(false)}
        onSelectLocation={handleToLocationSelect}
      />
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
  searchInputText: {
    fontSize: 16,
    color: "#333333",
  },
  placeholderText: {
    color: "#A0A0A0",
  },
  searchButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
    gap: 8,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  routeFrom: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  routeArrow: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 8,
  },
  routeTo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    textAlign: "right",
  },
  routeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  routeTime: {
    fontSize: 12,
    color: "#666",
  },
  routePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  bookAgainButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bookAgainText: {
    fontSize: 12,
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
