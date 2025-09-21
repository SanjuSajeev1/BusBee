import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface Seat {
  id: string;
  number: string;
  type: "window" | "aisle" | "middle";
  status: "available" | "occupied" | "selected";
  row: number;
  column: number;
}

interface Passenger {
  seatNumber: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
}

// Generate seat layout (2-2 configuration)
const generateSeatLayout = (): Seat[] => {
  const seats: Seat[] = [];
  let seatNumber = 1;

  for (let row = 1; row <= 15; row++) {
    for (let col = 1; col <= 4; col++) {
      let type: "window" | "aisle" | "middle" = "middle";

      if (col === 1 || col === 4) {
        type = "window";
      } else if (col === 2 || col === 3) {
        type = "aisle";
      }

      // Randomly occupy some seats
      const isOccupied = Math.random() < 0.3;

      seats.push({
        id: `seat-${row}-${col}`,
        number: seatNumber.toString().padStart(2, "0"),
        type,
        status: isOccupied ? "occupied" : "available",
        row,
        column: col,
      });

      seatNumber++;
    }
  }

  return seats;
};

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams<{
    busId: string;
    operator: string;
    busNumber: string;
    from: string;
    to: string;
    price: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    type: string;
    rating: string;
    amenities: string;
  }>();

  const [seats, setSeats] = useState<Seat[]>(generateSeatLayout());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const getSeatStatusColor = (seat: Seat) => {
    switch (seat.status) {
      case "available":
        return selectedSeats.includes(seat.id) ? "#10B981" : "#E5E7EB";
      case "occupied":
        return "#EF4444";
      case "selected":
        return "#10B981";
      default:
        return "#E5E7EB";
    }
  };

  const getSeatTextColor = (seat: Seat) => {
    if (seat.status === "occupied") {
      return "#FFFFFF";
    }
    if (selectedSeats.includes(seat.id)) {
      return "#FFFFFF";
    }
    return "#374151";
  };

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === "occupied") {
      Alert.alert("Seat Occupied", "This seat is already booked");
      return;
    }

    const isSelected = selectedSeats.includes(seat.id);

    if (isSelected) {
      // Deselect seat
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
      setPassengers((prev) => prev.filter((p) => p.seatNumber !== seat.number));
    } else {
      // Select seat
      if (selectedSeats.length >= 6) {
        Alert.alert("Maximum Seats", "You can select maximum 6 seats");
        return;
      }

      setSelectedSeats((prev) => [...prev, seat.id]);
      setPassengers((prev) => [
        ...prev,
        {
          seatNumber: seat.number,
          name: "",
          age: 0,
          gender: "Male" as const,
        },
      ]);
    }
  };

  const getSeatTypeIcon = (seat: Seat) => {
    if (seat.status === "occupied") {
      return "✕";
    }
    if (selectedSeats.includes(seat.id)) {
      return "✓";
    }
    return seat.number;
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(params.price || "0");
    return selectedSeats.length * basePrice;
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat");
      return;
    }

    router.push({
      pathname: "/(booking)/passenger-details",
      params: {
        ...params,
        selectedSeats: selectedSeats.join(","),
        seatNumbers: passengers.map((p) => p.seatNumber).join(","),
        totalPrice: calculateTotalPrice().toString(),
      },
    });
  };

  const renderSeatLayout = () => {
    const seatRows: { [key: number]: Seat[] } = {};

    seats.forEach((seat) => {
      if (!seatRows[seat.row]) {
        seatRows[seat.row] = [];
      }
      seatRows[seat.row].push(seat);
    });

    return Object.keys(seatRows).map((rowNum) => {
      const row = parseInt(rowNum);
      const rowSeats = seatRows[row];

      return (
        <View key={row} style={styles.seatRow}>
          <Text style={styles.rowLabel}>{row}</Text>

          {/* Left side seats (columns 1-2) */}
          <View style={styles.seatGroup}>
            {rowSeats
              .filter((seat) => seat.column <= 2)
              .map((seat) => (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seat,
                    { backgroundColor: getSeatStatusColor(seat) },
                    seat.column === 2 && styles.seatSpacing,
                  ]}
                  onPress={() => handleSeatPress(seat)}
                  disabled={seat.status === "occupied"}
                >
                  <Text
                    style={[styles.seatText, { color: getSeatTextColor(seat) }]}
                  >
                    {getSeatTypeIcon(seat)}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Aisle */}
          <View style={styles.aisle} />

          {/* Right side seats (columns 3-4) */}
          <View style={styles.seatGroup}>
            {rowSeats
              .filter((seat) => seat.column >= 3)
              .map((seat) => (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seat,
                    { backgroundColor: getSeatStatusColor(seat) },
                    seat.column === 3 && styles.seatSpacing,
                  ]}
                  onPress={() => handleSeatPress(seat)}
                  disabled={seat.status === "occupied"}
                >
                  <Text
                    style={[styles.seatText, { color: getSeatTextColor(seat) }]}
                  >
                    {getSeatTypeIcon(seat)}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      );
    });
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <Text style={styles.headerSubtitle}>
            {params.from} → {params.to}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Bus Info */}
      <View style={styles.busInfo}>
        <View style={styles.busDetails}>
          <Text style={styles.operatorName}>{params.operator}</Text>
          <Text style={styles.busNumber}>{params.busNumber}</Text>
          <Text style={styles.busType}>{params.type}</Text>
        </View>
        <View style={styles.journeyInfo}>
          <Text style={styles.departureTime}>{params.departureTime}</Text>
          <Text style={styles.duration}>{params.duration}</Text>
          <Text style={styles.arrivalTime}>{params.arrivalTime}</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: "#E5E7EB" }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, { backgroundColor: "#10B981" }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Seat Layout */}
      <ScrollView
        style={styles.seatLayoutContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.seatLayoutContent}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View style={styles.seatLayout}>
          {/* Driver's cabin indicator */}
          <View style={styles.driverSection}>
            <Text style={styles.driverText}>🚌 Driver</Text>
          </View>

          {renderSeatLayout()}

          {/* Back of bus indicator */}
          <View style={styles.backSection}>
            <Text style={styles.backText}>Back of Bus</Text>
          </View>
        </View>
      </ScrollView>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <View style={styles.selectionSummary}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Selected Seats</Text>
            <Text style={styles.seatCount}>{selectedSeats.length} seat(s)</Text>
          </View>
          <View style={styles.selectedSeatsList}>
            {selectedSeats.map((seatId) => {
              const seat = seats.find((s) => s.id === seatId);
              return (
                <View key={seatId} style={styles.selectedSeatItem}>
                  <Text style={styles.selectedSeatNumber}>{seat?.number}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.totalPrice}>₹{calculateTotalPrice()}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedSeats.length === 0}
        >
          <LinearGradient
            colors={
              selectedSeats.length === 0
                ? ["#E5E7EB", "#E5E7EB"]
                : ["#111827", "#374151"]
            }
            style={styles.continueButtonGradient}
          >
            <Text
              style={[
                styles.continueButtonText,
                selectedSeats.length === 0 && styles.continueButtonTextDisabled,
              ]}
            >
              Continue to Passenger Details
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholder: {
    width: 40,
  },
  busInfo: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  busDetails: {
    flex: 1,
  },
  operatorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  busNumber: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 2,
  },
  busType: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  journeyInfo: {
    alignItems: "flex-end",
  },
  departureTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  seatLayoutContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  seatLayoutContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  seatLayout: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    minHeight: 400,
  },
  driverSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  driverText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    width: 20,
    textAlign: "center",
    marginRight: 16,
  },
  seatGroup: {
    flexDirection: "row",
    gap: 8,
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  seatSpacing: {
    marginRight: 16,
  },
  seatText: {
    fontSize: 12,
    fontWeight: "600",
  },
  aisle: {
    width: 24,
    height: 32,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backSection: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  backText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  selectionSummary: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  seatCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedSeatsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedSeatItem: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedSeatNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  continueButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  continueButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
