import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface Stop {
  id: string;
  name: string;
  time: string;
}

interface RouteSelectionModalProps {
  visible: boolean;
  stops: Stop[];
  onClose: () => void;
  onConfirm: (fromStop: Stop, toStop: Stop) => void;
}

export default function RouteSelectionModal({
  visible,
  stops,
  onClose,
  onConfirm,
}: RouteSelectionModalProps) {
  const [selectedFrom, setSelectedFrom] = useState<Stop | null>(null);
  const [selectedTo, setSelectedTo] = useState<Stop | null>(null);

  const handleConfirm = () => {
    if (selectedFrom && selectedTo) {
      onConfirm(selectedFrom, selectedTo);
      setSelectedFrom(null);
      setSelectedTo(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFrom(null);
    setSelectedTo(null);
    onClose();
  };

  const isValidSelection = selectedFrom && selectedTo && selectedFrom.id !== selectedTo.id;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Select Your Route</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text style={styles.instruction}>
              Choose your boarding and destination stops
            </Text>

            {/* From Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stops.map((stop) => (
                  <TouchableOpacity
                    key={`from-${stop.id}`}
                    style={[
                      styles.stopChip,
                      selectedFrom?.id === stop.id && styles.selectedChip,
                    ]}
                    onPress={() => setSelectedFrom(stop)}
                  >
                    <Text
                      style={[
                        styles.stopChipText,
                        selectedFrom?.id === stop.id && styles.selectedChipText,
                      ]}
                    >
                      {stop.name}
                    </Text>
                    <Text
                      style={[
                        styles.stopChipTime,
                        selectedFrom?.id === stop.id && styles.selectedChipTime,
                      ]}
                    >
                      {stop.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* To Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>To</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stops.map((stop) => (
                  <TouchableOpacity
                    key={`to-${stop.id}`}
                    style={[
                      styles.stopChip,
                      selectedTo?.id === stop.id && styles.selectedChip,
                      selectedFrom?.id === stop.id && styles.disabledChip,
                    ]}
                    onPress={() => setSelectedTo(stop)}
                    disabled={selectedFrom?.id === stop.id}
                  >
                    <Text
                      style={[
                        styles.stopChipText,
                        selectedTo?.id === stop.id && styles.selectedChipText,
                        selectedFrom?.id === stop.id && styles.disabledChipText,
                      ]}
                    >
                      {stop.name}
                    </Text>
                    <Text
                      style={[
                        styles.stopChipTime,
                        selectedTo?.id === stop.id && styles.selectedChipTime,
                        selectedFrom?.id === stop.id && styles.disabledChipText,
                      ]}
                    >
                      {stop.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Selected Route Summary */}
            {selectedFrom && selectedTo && (
              <View style={styles.routeSummary}>
                <Text style={styles.routeText}>
                  {selectedFrom.name} → {selectedTo.name}
                </Text>
                <Text style={styles.routeTime}>
                  {selectedFrom.time} - {selectedTo.time}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !isValidSelection && styles.disabledButton,
            ]}
            onPress={handleConfirm}
            disabled={!isValidSelection}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !isValidSelection && styles.disabledButtonText,
              ]}
            >
              Continue
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
    maxHeight: "80%",
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
  instruction: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  stopChip: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 120,
  },
  selectedChip: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  disabledChip: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
    opacity: 0.5,
  },
  stopChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  disabledChipText: {
    color: "#9CA3AF",
  },
  stopChipTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  selectedChipTime: {
    color: "#D1D5DB",
  },
  routeSummary: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 14,
    color: "#16A34A",
  },
  confirmButton: {
    backgroundColor: "#111827",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
});
