import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

interface Bus {
  id: string;
  operator: string;
  route: string;
  busNumber: string;
  currentLocation: string;
  nextStop: string;
  eta: string;
  status: "active" | "arriving" | "boarding";
}

export default function ChooseBusScreen() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  // Mock nearby/active buses
  const nearbyBuses = [
    {
      id: "1",
      operator: "Premium Express",
      route: "Metro Station → Airport Terminal",
      busNumber: "KL-07-AB-1234",
      currentLocation: "City Mall",
      nextStop: "Tech Park",
      eta: "5 min",
      status: "active" as const,
    },
    {
      id: "2",
      operator: "City Comfort",
      route: "Railway Station → Business District",
      busNumber: "KL-09-CD-5678",
      currentLocation: "Central Square",
      nextStop: "Metro Station",
      eta: "2 min",
      status: "arriving" as const,
    },
    {
      id: "3",
      operator: "Luxury Lines",
      route: "Airport Terminal → City Center",
      busNumber: "KL-08-EF-9012",
      currentLocation: "Airport Terminal",
      nextStop: "Highway Junction",
      eta: "Just started",
      status: "boarding" as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "arriving":
        return "#F59E0B";
      case "boarding":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "On Route";
      case "arriving":
        return "Arriving";
      case "boarding":
        return "Boarding";
      default:
        return "Unknown";
    }
  };

  const handleBusSelect = (bus: Bus) => {
    setSelectedBus(bus.id);
  };

  const handleContinue = () => {
    if (!selectedBus) {
      Alert.alert(
        "Select Bus",
        "Please choose a bus to send your song request to"
      );
      return;
    }

    const bus = nearbyBuses.find((b) => b.id === selectedBus);

    // Navigate to song request page with bus info
    router.push({
      pathname: "/(tabs)/song-request",
      params: {
        busId: bus?.id,
        busOperator: bus?.operator,
        busNumber: bus?.busNumber,
        route: bus?.route,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Bus</Text>
        <Text style={styles.headerSubtitle}>
          Select a bus to send your song request
        </Text>
      </View>

      {/* Bus List */}
      <ScrollView style={styles.busList} showsVerticalScrollIndicator={false}>
        {nearbyBuses.map((bus) => (
          <TouchableOpacity
            key={bus.id}
            style={[
              styles.busCard,
              selectedBus === bus.id && styles.busCardSelected,
            ]}
            onPress={() => handleBusSelect(bus)}
          >
            <View style={styles.busHeader}>
              <View style={styles.busInfo}>
                <Text style={styles.busOperator}>{bus.operator}</Text>
                <Text style={styles.busNumber}>{bus.busNumber}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(bus.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(bus.status)}
                </Text>
              </View>
            </View>

            <Text style={styles.busRoute}>{bus.route}</Text>

            <View style={styles.busLocation}>
              <Text style={styles.locationLabel}>
                Current: {bus.currentLocation}
              </Text>
              <Text style={styles.locationLabel}>
                Next: {bus.nextStop} • {bus.eta}
              </Text>
            </View>

            {selectedBus === bus.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {nearbyBuses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No buses nearby</Text>
            <Text style={styles.emptySubtitle}>
              No active buses found in your area right now
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedBus && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedBus}
        >
          <Text
            style={[
              styles.continueButtonText,
              !selectedBus && styles.continueButtonTextDisabled,
            ]}
          >
            Continue to Request
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  busList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  busCard: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  busCardSelected: {
    borderColor: "#000",
    borderWidth: 2,
  },
  busHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  busInfo: {
    flex: 1,
  },
  busOperator: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 14,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  busRoute: {
    fontSize: 16,
    color: "#000",
    marginBottom: 12,
    fontWeight: "500",
  },
  busLocation: {
    gap: 4,
  },
  locationLabel: {
    fontSize: 14,
    color: "#666",
  },
  selectedIndicator: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  selectedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueButtonTextDisabled: {
    color: "#999",
  },
});
