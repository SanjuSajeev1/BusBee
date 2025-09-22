import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import RouteSelectionModal from "../../src/components/modals/RouteSelectionModal";
import TicketAmountModal from "../../src/components/modals/TicketAmountModal";
import UPIPaymentModal from "../../src/components/modals/UPIPaymentModal";

interface BusStop {
  id: string;
  name: string;
  estimatedTime: string;
  status: "completed" | "current" | "upcoming";
  isUserStop?: boolean;
}

const dummyBusStops: BusStop[] = [
  {
    id: "1",
    name: "Downtown Terminal",
    estimatedTime: "10:30 AM",
    status: "completed",
  },
  {
    id: "2",
    name: "Central Park",
    estimatedTime: "10:35 AM",
    status: "completed",
  },
  {
    id: "3",
    name: "City Center Mall",
    estimatedTime: "10:38 AM",
    status: "completed",
  },
  {
    id: "4",
    name: "Metro Station",
    estimatedTime: "10:42 AM",
    status: "current",
  },
  {
    id: "5",
    name: "University Campus",
    estimatedTime: "10:45 AM",
    status: "upcoming",
  },
  {
    id: "6",
    name: "Medical Center",
    estimatedTime: "10:48 AM",
    status: "upcoming",
  },
  {
    id: "7",
    name: "Business District",
    estimatedTime: "10:52 AM",
    status: "upcoming",
  },
  {
    id: "8",
    name: "Sports Complex",
    estimatedTime: "10:56 AM",
    status: "upcoming",
  },
  {
    id: "9",
    name: "Train Station",
    estimatedTime: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "10",
    name: "Tech Park",
    estimatedTime: "11:05 AM",
    status: "upcoming",
  },
  {
    id: "11",
    name: "Residential Area",
    estimatedTime: "11:10 AM",
    status: "upcoming",
  },
  {
    id: "12",
    name: "Airport Terminal",
    estimatedTime: "11:15 AM",
    status: "upcoming",
    isUserStop: true,
  },
];

export default function BusTrackingScreen() {
  const { busId, operator, from, to, price } = useLocalSearchParams<{
    busId: string;
    operator: string;
    from: string;
    to: string;
    price?: string;
  }>();

  const [busStops] = useState(dummyBusStops);
  const [currentProgress, setCurrentProgress] = useState(3); // Bus is at stop 4 (index 3)
  const [isBooked, setIsBooked] = useState(false);
  const [showRouteSelection, setShowRouteSelection] = useState(false);
  const [showTicketAmount, setShowTicketAmount] = useState(false);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: any;
    to: any;
    amount: number;
    passengers?: number;
    totalAmount?: number;
  } | null>(null);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animate the current location indicator
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handlePayForTicket = () => {
    setShowRouteSelection(true);
  };

  const handleRouteSelection = (fromStop: any, toStop: any) => {
    const distance = Math.abs(parseInt(fromStop.id) - parseInt(toStop.id));
    const basePrice = 3;
    const amount = basePrice + distance * 1.5; // Calculate based on distance

    setSelectedRoute({
      from: fromStop,
      to: toStop,
      amount: Math.round(amount),
    });
    setShowTicketAmount(true);
  };

  const handleProceedToPayment = (passengers: number, totalAmount: number) => {
    setSelectedRoute((prev) =>
      prev ? { ...prev, passengers, totalAmount } : null
    );
    setShowTicketAmount(false);
    setShowUPIPayment(true);
  };

  const handlePaymentSuccess = () => {
    setIsBooked(true);
    setSelectedRoute(null);
  };

  const getStopIcon = (stop: BusStop, index: number) => {
    if (stop.status === "completed") return "✅";
    if (stop.status === "current") return "🚌";
    if (stop.isUserStop) return "📍";
    return "⭕";
  };

  const getStopColor = (stop: BusStop) => {
    switch (stop.status) {
      case "completed":
        return "#10B981";
      case "current":
        return "#3B82F6";
      case "upcoming":
        return stop.isUserStop ? "#EF4444" : "#9CA3AF";
      default:
        return "#9CA3AF";
    }
  };

  const getTimeColor = (stop: BusStop) => {
    switch (stop.status) {
      case "completed":
        return "#6B7280";
      case "current":
        return "#3B82F6";
      case "upcoming":
        return stop.isUserStop ? "#EF4444" : "#9CA3AF";
      default:
        return "#9CA3AF";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.busInfo}>
          <Text style={styles.operatorName}>{operator}</Text>
          <Text style={styles.routeText}>
            {from} → {to}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Minimal Status */}
      <View style={styles.statusContainer}>
        <Animated.View
          style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]}
        />
        <Text style={styles.statusText}>
          Currently at{" "}
          {busStops.find((stop) => stop.status === "current")?.name}
        </Text>
      </View>

      {/* Bus Stops List */}
      <ScrollView
        style={styles.stopsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.stopsContent}
      >
        <Text style={styles.stopsTitle}>Route & Schedule</Text>

        {busStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopItem}>
            <View style={styles.stopIndicator}>
              <View
                style={[
                  styles.stopDot,
                  { backgroundColor: getStopColor(stop) },
                ]}
              >
                <Text style={styles.stopIcon}>{getStopIcon(stop, index)}</Text>
              </View>
              {index < busStops.length - 1 && (
                <View
                  style={[
                    styles.stopLine,
                    {
                      backgroundColor:
                        index < currentProgress ? "#10B981" : "#E5E7EB",
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.stopDetails}>
              <Text
                style={[
                  styles.stopName,
                  stop.status === "current" && styles.currentStopName,
                  stop.isUserStop && styles.userStopName,
                ]}
              >
                {stop.name}
                {stop.isUserStop && " (Your Stop)"}
              </Text>
              <Text style={[styles.stopTime, { color: getTimeColor(stop) }]}>
                {stop.estimatedTime}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Ticket Booking Section */}
      {!isBooked ? (
        <View style={styles.bookingSection}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayForTicket}
          >
            <Text style={styles.payButtonText}>
              {isBooked ? "Processing..." : "Pay for Ticket"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bookedSection}>
          <View style={styles.bookedInfo}>
            <Text style={styles.bookedIcon}>✅</Text>
            <Text style={styles.bookedText}>Ticket Booked!</Text>
          </View>
          <TouchableOpacity style={styles.viewTicketButton}>
            <Text style={styles.viewTicketText}>View Ticket</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <RouteSelectionModal
        visible={showRouteSelection}
        stops={busStops.map((stop) => ({
          id: stop.id,
          name: stop.name,
          time: stop.estimatedTime,
          status: stop.status,
        }))}
        onClose={() => setShowRouteSelection(false)}
        onConfirm={handleRouteSelection}
      />

      <TicketAmountModal
        visible={showTicketAmount}
        fromStop={selectedRoute?.from?.name || ""}
        toStop={selectedRoute?.to?.name || ""}
        baseAmount={selectedRoute?.amount || 0}
        onClose={() => setShowTicketAmount(false)}
        onProceedToPayment={handleProceedToPayment}
      />

      <UPIPaymentModal
        visible={showUPIPayment}
        amount={selectedRoute?.totalAmount || selectedRoute?.amount || 0}
        onClose={() => setShowUPIPayment(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "400",
  },
  busInfo: {
    alignItems: "center",
  },
  operatorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  routeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholder: {
    width: 40,
  },
  statusContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  stopsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stopsContent: {
    paddingBottom: 120, // Increased padding to prevent overlap with payment section
  },
  stopsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 4,
  },
  stopIndicator: {
    alignItems: "center",
    marginRight: 12,
  },
  stopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stopLine: {
    width: 1,
    height: 24,
    marginTop: 2,
  },
  stopIcon: {
    fontSize: 12,
    textAlign: "center",
  },
  stopDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stopName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
  },
  currentStopName: {
    fontWeight: "600",
    color: "#3B82F6",
  },
  userStopName: {
    fontWeight: "600",
    color: "#EF4444",
  },
  stopTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  bookingSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  payButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bookedSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#BBF7D0",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bookedInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookedIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  bookedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
  },
  viewTicketButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewTicketText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
