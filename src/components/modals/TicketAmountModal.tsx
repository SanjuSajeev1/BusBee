import React from "react";
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
  amount: number;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export default function TicketAmountModal({
  visible,
  fromStop,
  toStop,
  amount,
  onClose,
  onProceedToPayment,
}: TicketAmountModalProps) {
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

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Ticket Amount</Text>
              <Text style={styles.amount}>${amount}</Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>Today</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Passenger</Text>
                <Text style={styles.detailValue}>1 Adult</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bus Type</Text>
                <Text style={styles.detailValue}>Premium</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={onProceedToPayment}
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
