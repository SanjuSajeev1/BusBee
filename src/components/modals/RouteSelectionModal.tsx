import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface Stop {
  id: string;
  name: string;
  time: string;
  status?: "completed" | "current" | "upcoming";
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
  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const [toSearchQuery, setToSearchQuery] = useState("");

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
    setFromSearchQuery("");
    setToSearchQuery("");
    onClose();
  };

  const filteredFromStops = stops.filter((stop) =>
    stop.name.toLowerCase().includes(fromSearchQuery.toLowerCase())
  );

  const filteredToStops = stops.filter((stop) =>
    stop.name.toLowerCase().includes(toSearchQuery.toLowerCase())
  );

  const isStopSelectable = (stop: Stop, isFromSelection: boolean) => {
    // Can't select completed stops for boarding
    if (isFromSelection && stop.status === "completed") {
      return false;
    }
    // Can select current stop for boarding
    // Can select current and upcoming stops for destination
    return true;
  };

  const isValidSelection =
    selectedFrom && selectedTo && selectedFrom.id !== selectedTo.id;

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
            {/* From Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>From</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search boarding stop..."
                placeholderTextColor="#9CA3AF"
                value={fromSearchQuery}
                onChangeText={setFromSearchQuery}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stopsScroll}
              >
                {filteredFromStops.map((stop) => (
                  <TouchableOpacity
                    key={`from-${stop.id}`}
                    style={[
                      styles.stopChip,
                      selectedFrom?.id === stop.id && styles.selectedChip,
                      !isStopSelectable(stop, true) && styles.disabledChip,
                    ]}
                    onPress={() =>
                      isStopSelectable(stop, true) && setSelectedFrom(stop)
                    }
                    disabled={!isStopSelectable(stop, true)}
                  >
                    <Text
                      style={[
                        styles.stopChipText,
                        selectedFrom?.id === stop.id && styles.selectedChipText,
                        !isStopSelectable(stop, true) &&
                          styles.disabledChipText,
                      ]}
                    >
                      {stop.name}
                      {stop.status === "completed" && " (Passed)"}
                    </Text>
                    <Text
                      style={[
                        styles.stopChipTime,
                        selectedFrom?.id === stop.id && styles.selectedChipTime,
                        !isStopSelectable(stop, true) &&
                          styles.disabledChipText,
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
              <TextInput
                style={styles.searchInput}
                placeholder="Search destination stop..."
                placeholderTextColor="#9CA3AF"
                value={toSearchQuery}
                onChangeText={setToSearchQuery}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.stopsScroll}
              >
                {filteredToStops.map((stop) => (
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
    maxHeight: "85%",
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
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
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },
  stopsScroll: {
    marginTop: 4,
  },
  stopChip: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    minWidth: 100,
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
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 8,
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
    marginTop: 16,
    paddingVertical: 14,
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
