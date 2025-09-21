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
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useBooking } from "../../src/context/BookingContext";

interface Passenger {
  seatNumber: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email?: string;
  phone?: string;
}

export default function BookingConfirmationScreen() {
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
    selectedSeats: string;
    seatNumbers: string;
    totalPrice: string;
    passengerDetails: string;
  }>();

  const { addBooking } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);

  const passengers: Passenger[] = JSON.parse(params.passengerDetails || "[]");
  const selectedSeats = params.selectedSeats?.split(",") || [];
  const seatNumbers = params.seatNumbers?.split(",") || [];
  const totalAmount = parseInt(params.totalPrice || "0") + 5; // Including convenience fee

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create booking data
      const bookingData = {
        route: `${params.from} → ${params.to}`,
        fromStop: params.from || "",
        toStop: params.to || "",
        date: new Date().toLocaleDateString(),
        time: params.departureTime || "",
        departureTime: params.departureTime || "",
        arrivalTime: params.arrivalTime || "",
        duration: params.duration || "",
        passengers: passengers.length,
        price: params.price || "0",
        totalPrice: totalAmount.toString(),
        operator: params.operator || "",
        busNumber: params.busNumber || "",
        platform: "Platform 1", // Default platform
        bookingDate: new Date().toISOString(),
      };

      // Add booking to context
      await addBooking(bookingData);

      // Show success message
      Alert.alert(
        "Booking Confirmed!",
        "Your bus tickets have been booked successfully. You will receive a confirmation email shortly.",
        [
          {
            text: "View My Tickets",
            onPress: () => router.push("/(tabs)/bookings"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderPassengerCard = (passenger: Passenger, index: number) => (
    <View key={index} style={styles.passengerCard}>
      <View style={styles.passengerHeader}>
        <Text style={styles.passengerName}>{passenger.name}</Text>
        <View style={styles.seatBadge}>
          <Text style={styles.seatBadgeText}>Seat {passenger.seatNumber}</Text>
        </View>
      </View>
      <View style={styles.passengerDetails}>
        <Text style={styles.passengerDetail}>
          {passenger.age} years • {passenger.gender}
        </Text>
        {passenger.email && (
          <Text style={styles.passengerDetail}>{passenger.email}</Text>
        )}
        {passenger.phone && (
          <Text style={styles.passengerDetail}>{passenger.phone}</Text>
        )}
      </View>
    </View>
  );

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
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <Text style={styles.headerSubtitle}>Review your details</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Journey Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Journey Details</Text>
          <View style={styles.journeyCard}>
            <View style={styles.journeyHeader}>
              <Text style={styles.operatorName}>{params.operator}</Text>
              <Text style={styles.busNumber}>{params.busNumber}</Text>
              <View style={styles.busTypeBadge}>
                <Text style={styles.busTypeText}>{params.type}</Text>
              </View>
            </View>

            <View style={styles.routeInfo}>
              <View style={styles.routePoint}>
                <View style={styles.routeDot} />
                <View style={styles.routeDetails}>
                  <Text style={styles.routeTime}>{params.departureTime}</Text>
                  <Text style={styles.routeLocation}>{params.from}</Text>
                </View>
              </View>

              <View style={styles.routeLine}>
                <View style={styles.routeDuration}>
                  <Text style={styles.durationText}>{params.duration}</Text>
                </View>
              </View>

              <View style={styles.routePoint}>
                <View style={[styles.routeDot, styles.arrivalDot]} />
                <View style={styles.routeDetails}>
                  <Text style={styles.routeTime}>{params.arrivalTime}</Text>
                  <Text style={styles.routeLocation}>{params.to}</Text>
                </View>
              </View>
            </View>

            <View style={styles.journeyDate}>
              <Text style={styles.dateText}>
                {formatDate(new Date().toISOString())}
              </Text>
            </View>
          </View>
        </View>

        {/* Passengers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Passengers ({passengers.length})
          </Text>
          {passengers.map((passenger, index) =>
            renderPassengerCard(passenger, index)
          )}
        </View>

        {/* Selected Seats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Seats</Text>
          <View style={styles.seatsContainer}>
            {seatNumbers.map((seatNumber, index) => (
              <View key={index} style={styles.seatChip}>
                <Text style={styles.seatChipText}>{seatNumber}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Amenities */}
        {params.amenities && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bus Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {params.amenities.split(",").map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Base Fare ({passengers.length} passenger
                {passengers.length !== 1 ? "s" : ""})
              </Text>
              <Text style={styles.priceValue}>₹{params.totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Convenience Fee</Text>
              <Text style={styles.priceValue}>₹5</Text>
            </View>
            <View style={[styles.priceRow, styles.totalPriceRow]}>
              <Text style={styles.totalPriceLabel}>Total Amount</Text>
              <Text style={styles.totalPriceValue}>₹{totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Information</Text>
          <View style={styles.termsCard}>
            <Text style={styles.termsText}>
              • Please arrive at the bus stop 15 minutes before departure time
            </Text>
            <Text style={styles.termsText}>
              • Show your booking confirmation to the conductor
            </Text>
            <Text style={styles.termsText}>
              • Seats are subject to availability at the time of boarding
            </Text>
            <Text style={styles.termsText}>
              • Cancellation policy: Free cancellation up to 2 hours before
              departure
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.totalAmount}>
          <Text style={styles.totalAmountLabel}>Total Amount</Text>
          <Text style={styles.totalAmountValue}>₹{totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={
              isProcessing ? ["#9CA3AF", "#6B7280"] : ["#10B981", "#059669"]
            }
            style={styles.payButtonGradient}
          >
            <Text style={styles.payButtonText}>
              {isProcessing ? "Processing..." : "Pay & Confirm Booking"}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  journeyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
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
  journeyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  busNumber: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  busTypeBadge: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  busTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  routeInfo: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    marginRight: 16,
  },
  arrivalDot: {
    backgroundColor: "#EF4444",
  },
  routeDetails: {
    flex: 1,
  },
  routeTime: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 14,
    color: "#6B7280",
  },
  routeLine: {
    paddingLeft: 6,
    marginBottom: 12,
  },
  routeDuration: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  durationText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  journeyDate: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dateText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  passengerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  seatBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seatBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  passengerDetails: {
    gap: 4,
  },
  passengerDetail: {
    fontSize: 14,
    color: "#6B7280",
  },
  seatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  seatChip: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  seatChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalPriceRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 8,
    marginBottom: 0,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  termsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  termsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
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
  totalAmount: {
    flex: 1,
  },
  totalAmountLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  totalAmountValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  payButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 16,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
