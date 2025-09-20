import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { JourneyLeg as JourneyLegType } from "../types/JourneyTypes";

interface JourneyLegProps {
  leg: JourneyLegType;
  legNumber: number;
  isLastLeg: boolean;
}

export default function JourneyLegComponent({ 
  leg, 
  legNumber, 
  isLastLeg 
}: JourneyLegProps) {
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Private":
        return "#8B5CF6";
      case "Limited Stop":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return "📶";
      case "ac":
        return "❄️";
      case "usb charging":
        return "🔌";
      case "leather seats":
        return "🪑";
      case "reclining seats":
        return "🛋️";
      case "snacks":
        return "🍿";
      case "entertainment":
        return "🎵";
      case "refreshments":
        return "☕";
      default:
        return "✨";
    }
  };

  return (
    <View style={styles.legContainer}>
      {/* Leg Header */}
      <View style={styles.legHeader}>
        <View style={styles.legNumberContainer}>
          <View style={[styles.legNumber, { backgroundColor: getTypeColor(leg.type) }]}>
            <Text style={styles.legNumberText}>{legNumber}</Text>
          </View>
        </View>
        <View style={styles.legInfo}>
          <View style={styles.busInfo}>
            <Text style={styles.busNumber}>{leg.busNumber}</Text>
            <Text style={styles.operator}>{leg.operator}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {leg.rating}</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(leg.type) + "20" }]}>
          <Text style={[styles.typeText, { color: getTypeColor(leg.type) }]}>
            {leg.type}
          </Text>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.routeContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{leg.departureTime}</Text>
            <Text style={styles.stopName}>{leg.fromStop.name}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{leg.duration}</Text>
            <View style={styles.durationLine} />
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{leg.arrivalTime}</Text>
            <Text style={styles.stopName}>{leg.toStop.name}</Text>
          </View>
        </View>
      </View>

      {/* Stops Information */}
      {leg.stops && leg.stops.length > 0 && (
        <View style={styles.stopsContainer}>
          <Text style={styles.stopsLabel}>
            {leg.stops.length} stops • ${leg.price}
          </Text>
          <View style={styles.stopsList}>
            {leg.stops.slice(0, 3).map((stop, index) => (
              <Text key={stop.id} style={styles.stopItem}>
                {stop.name}{index < Math.min(leg.stops.length, 3) - 1 ? " → " : ""}
              </Text>
            ))}
            {leg.stops.length > 3 && (
              <Text style={styles.moreStops}>
                +{leg.stops.length - 3} more stops
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Amenities */}
      {leg.amenities && leg.amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          <View style={styles.amenitiesList}>
            {leg.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>
                  {getAmenityIcon(amenity)}
                </Text>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Transfer Instructions */}
      {leg.isTransfer && leg.transferInstructions && (
        <View style={styles.transferInstructions}>
          <Text style={styles.transferInstructionsText}>
            📍 {leg.transferInstructions}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  legContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  legHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  legNumberContainer: {
    marginRight: 12,
  },
  legNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  legNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  legInfo: {
    flex: 1,
  },
  busInfo: {
    marginBottom: 4,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  operator: {
    fontSize: 14,
    color: "#6B7280",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#6B7280",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInfo: {
    alignItems: "center",
    minWidth: 70,
  },
  time: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  stopName: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 60,
  },
  durationContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
  },
  duration: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
  },
  durationLine: {
    height: 1,
    backgroundColor: "#D1D5DB",
    width: "100%",
  },
  stopsContainer: {
    marginBottom: 12,
  },
  stopsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  stopsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  stopItem: {
    fontSize: 11,
    color: "#6B7280",
  },
  moreStops: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  amenitiesContainer: {
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  amenityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  amenityText: {
    fontSize: 11,
    color: "#6B7280",
  },
  transferInstructions: {
    backgroundColor: "#FEF3C7",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  transferInstructionsText: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "500",
  },
});
