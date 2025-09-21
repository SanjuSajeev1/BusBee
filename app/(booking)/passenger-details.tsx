import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

interface Passenger {
  seatNumber: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  email?: string;
  phone?: string;
}

const genderOptions = ["Male", "Female", "Other"];

export default function PassengerDetailsScreen() {
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
  }>();

  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    const seatNumbers = params.seatNumbers?.split(",") || [];
    return seatNumbers.map((seatNumber) => ({
      seatNumber,
      name: "",
      age: 0,
      gender: "Male" as const,
      email: "",
      phone: "",
    }));
  });

  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState<
    number | null
  >(null);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: string | number
  ) => {
    setPassengers((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const validatePassengerDetails = () => {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (!passenger.name.trim()) {
        Alert.alert(
          "Validation Error",
          `Please enter name for passenger in seat ${passenger.seatNumber}`
        );
        return false;
      }

      if (passenger.age < 1 || passenger.age > 120) {
        Alert.alert(
          "Validation Error",
          `Please enter valid age for passenger in seat ${passenger.seatNumber}`
        );
        return false;
      }

      if (!passenger.gender) {
        Alert.alert(
          "Validation Error",
          `Please select gender for passenger in seat ${passenger.seatNumber}`
        );
        return false;
      }
    }

    return true;
  };

  const handleContinue = () => {
    if (!validatePassengerDetails()) {
      return;
    }

    // Navigate to booking confirmation
    router.push({
      pathname: "/(booking)/booking-confirmation",
      params: {
        ...params,
        passengerDetails: JSON.stringify(passengers),
      },
    });
  };

  const renderPassengerForm = (passenger: Passenger, index: number) => (
    <View key={index} style={styles.passengerCard}>
      <View style={styles.passengerHeader}>
        <Text style={styles.passengerTitle}>Passenger {index + 1}</Text>
        <View style={styles.seatBadge}>
          <Text style={styles.seatBadgeText}>Seat {passenger.seatNumber}</Text>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name *</Text>
          <TextInput
            style={styles.textInput}
            value={passenger.name}
            onChangeText={(text) => updatePassenger(index, "name", text)}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Age *</Text>
          <TextInput
            style={styles.textInput}
            value={passenger.age.toString()}
            onChangeText={(text) => {
              const age = parseInt(text) || 0;
              updatePassenger(index, "age", age);
            }}
            placeholder="Age"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>Gender *</Text>
          <TouchableOpacity
            style={styles.genderButton}
            onPress={() => {
              setSelectedPassengerIndex(index);
              setShowGenderModal(true);
            }}
          >
            <Text style={styles.genderButtonText}>{passenger.gender}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={passenger.email || ""}
            onChangeText={(text) => updatePassenger(index, "email", text)}
            placeholder="Enter email address"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone (Optional)</Text>
          <TextInput
            style={styles.textInput}
            value={passenger.phone || ""}
            onChangeText={(text) => updatePassenger(index, "phone", text)}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
        </View>
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
          <Text style={styles.headerTitle}>Passenger Details</Text>
          <Text style={styles.headerSubtitle}>
            {params.from} → {params.to}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Bus Info Summary */}
        <View style={styles.busInfoSummary}>
          <View style={styles.busDetails}>
            <Text style={styles.operatorName}>{params.operator}</Text>
            <Text style={styles.busNumber}>{params.busNumber}</Text>
          </View>
          <View style={styles.journeyInfo}>
            <Text style={styles.departureTime}>{params.departureTime}</Text>
            <Text style={styles.duration}>{params.duration}</Text>
            <Text style={styles.arrivalTime}>{params.arrivalTime}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.totalPrice}>₹{params.totalPrice}</Text>
          </View>
        </View>

        {/* Passengers List */}
        <ScrollView
          style={styles.passengersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.passengersContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>
            Passenger Information ({passengers.length} passenger
            {passengers.length !== 1 ? "s" : ""})
          </Text>

          {passengers.map((passenger, index) =>
            renderPassengerForm(passenger, index)
          )}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.priceSummary}>
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>
                Seats ({passengers.length})
              </Text>
              <Text style={styles.priceRowValue}>₹{params.totalPrice}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Convenience Fee</Text>
              <Text style={styles.priceRowValue}>₹5</Text>
            </View>
            <View style={[styles.priceRow, styles.totalPriceRow]}>
              <Text style={styles.totalPriceLabel}>Total Amount</Text>
              <Text style={styles.totalPriceValue}>
                ₹{parseInt(params.totalPrice || "0") + 5}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={["#111827", "#374151"]}
              style={styles.continueButtonGradient}
            >
              <Text style={styles.continueButtonText}>Proceed to Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>

            {genderOptions.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={styles.genderOption}
                onPress={() => {
                  if (selectedPassengerIndex !== null) {
                    updatePassenger(
                      selectedPassengerIndex,
                      "gender",
                      gender as "Male" | "Female" | "Other"
                    );
                  }
                  setShowGenderModal(false);
                  setSelectedPassengerIndex(null);
                }}
              >
                <Text style={styles.genderOptionText}>{gender}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowGenderModal(false);
                setSelectedPassengerIndex(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardContainer: {
    flex: 1,
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
  busInfoSummary: {
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
  },
  journeyInfo: {
    alignItems: "center",
    flex: 1,
  },
  departureTime: {
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  passengersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  passengersContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  passengerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
  passengerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  seatBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seatBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  genderButton: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#6B7280",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  priceSummary: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceRowLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  priceRowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalPriceRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 8,
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
  continueButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  genderOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F9FAFB",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#EF4444",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
});
