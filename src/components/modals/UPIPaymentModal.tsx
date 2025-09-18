import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window");

interface UPIPaymentModalProps {
  visible: boolean;
  amount: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const upiOptions = [
  { id: "gpay", name: "Google Pay", icon: "🟢" },
  { id: "phonepe", name: "PhonePe", icon: "🟣" },
  { id: "paytm", name: "Paytm", icon: "🔵" },
  { id: "amazonpay", name: "Amazon Pay", icon: "🟠" },
  { id: "other", name: "Other UPI Apps", icon: "💳" },
];

export default function UPIPaymentModal({
  visible,
  amount,
  onClose,
  onPaymentSuccess,
}: UPIPaymentModalProps) {
  const [selectedUPI, setSelectedUPI] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedUPI) {
      Alert.alert(
        "Select Payment Method",
        "Please choose a UPI app to proceed"
      );
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onPaymentSuccess();
      setSelectedUPI(null);
      onClose();
    } catch (error) {
      Alert.alert("Payment Failed", "Please try again");
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedUPI(null);
    setProcessing(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} disabled={processing}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Pay via UPI</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount to Pay</Text>
              <Text style={styles.amount}>${amount}</Text>
            </View>

            <Text style={styles.sectionTitle}>Choose Payment Method</Text>

            <View style={styles.upiOptions}>
              {upiOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.upiOption,
                    selectedUPI === option.id && styles.selectedUpiOption,
                  ]}
                  onPress={() => setSelectedUPI(option.id)}
                  disabled={processing}
                >
                  <View style={styles.upiInfo}>
                    <Text style={styles.upiIcon}>{option.icon}</Text>
                    <Text
                      style={[
                        styles.upiName,
                        selectedUPI === option.id && styles.selectedUpiName,
                      ]}
                    >
                      {option.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      selectedUPI === option.id && styles.selectedRadio,
                    ]}
                  >
                    {selectedUPI === option.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.payButton,
              (!selectedUPI || processing) && styles.disabledButton,
            ]}
            onPress={handlePayment}
            disabled={!selectedUPI || processing}
          >
            <Text
              style={[
                styles.payButtonText,
                (!selectedUPI || processing) && styles.disabledButtonText,
              ]}
            >
              {processing ? "Processing Payment..." : `Pay $${amount}`}
            </Text>
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
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
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
    paddingVertical: 20,
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
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  upiOptions: {
    gap: 12,
  },
  upiOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedUpiOption: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  upiInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  upiIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  upiName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  selectedUpiName: {
    fontWeight: "600",
    color: "#3B82F6",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadio: {
    borderColor: "#3B82F6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
  },
  payButton: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
});
