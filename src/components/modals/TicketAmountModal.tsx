import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface TicketAmountModalProps {
  visible: boolean;
  fromStop: string;
  toStop: string;
  baseAmount: number;
  onClose: () => void;
  onProceedToPayment: (passengers: number, totalAmount: number) => void;
}

export default function TicketAmountModal({
  visible,
  fromStop,
  toStop,
  baseAmount,
  onClose,
  onProceedToPayment,
}: TicketAmountModalProps) {
  const [passengers, setPassengers] = useState(1);
  const totalAmount = baseAmount * passengers;

  const increasePassengers = () => {
    if (passengers < 6) {
      setPassengers(passengers + 1);
    }
  };

  const decreasePassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  const handleProceed = () => {
    onProceedToPayment(passengers, totalAmount);
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Ticket Details</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeLabel}>Route</Text>
              <Text style={styles.routeText}>
                {fromStop} → {toStop}
              </Text>
            </View>

            {/* Passenger Selection */}
            <View style={styles.passengerSection}>
              <Text style={styles.sectionTitle}>Number of Passengers</Text>
              <View style={styles.passengerControl}>
                <TouchableOpacity
                  style={[
                    styles.passengerButton,
                    passengers <= 1 && styles.disabledButton,
                  ]}
                  onPress={decreasePassengers}
                  disabled={passengers <= 1}
                >
                  <Text
                    style={[
                      styles.passengerButtonText,
                      passengers <= 1 && styles.disabledButtonText,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <View style={styles.passengerDisplay}>
                  <Text style={styles.passengerCount}>{passengers}</Text>
                  <Text style={styles.passengerLabel}>
                    {passengers === 1 ? "Passenger" : "Passengers"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.passengerButton,
                    passengers >= 6 && styles.disabledButton,
                  ]}
                  onPress={increasePassengers}
                  disabled={passengers >= 6}
                >
                  <Text
                    style={[
                      styles.passengerButtonText,
                      passengers >= 6 && styles.disabledButtonText,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <View style={styles.amountBreakdown}>
                <Text style={styles.breakdown}>
                  ${baseAmount} × {passengers} passenger
                  {passengers > 1 ? "s" : ""}
                </Text>
                <Text style={styles.amount}>${totalAmount}</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>Today</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bus Type</Text>
                <Text style={styles.detailValue}>Premium</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceed}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.9,
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeButton: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 18,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  routeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  routeLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  routeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  passengerSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  passengerControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  passengerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
  passengerButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
  passengerDisplay: {
    alignItems: "center",
    minWidth: 80,
  },
  passengerCount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  passengerLabel: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  amountBreakdown: {
    alignItems: "center",
  },
  breakdown: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  proceedButton: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
