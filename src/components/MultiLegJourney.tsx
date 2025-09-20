import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MultiLegJourney as MultiLegJourneyType, JourneyLeg } from "../types/JourneyTypes";
import JourneyLegComponent from "./JourneyLeg";

interface MultiLegJourneyProps {
  journey: MultiLegJourneyType;
  fromLocation: string;
  toLocation: string;
}

export default function MultiLegJourneyComponent({ 
  journey, 
  fromLocation, 
  toLocation 
}: MultiLegJourneyProps) {
  
  const handleBookJourney = () => {
    // Navigate to booking screen with multi-leg journey data
    router.push({
      pathname: "/(search)/bus-tracking",
      params: {
        journeyId: journey.id,
        from: fromLocation,
        to: toLocation,
        isMultiLeg: "true",
        totalPrice: journey.totalPrice.toString(),
        totalDuration: journey.totalDuration,
        legsCount: journey.legs.length.toString(),
      },
    });
  };

  const getJourneyTypeColor = () => {
    return journey.isDirect ? "#10B981" : "#F59E0B";
  };

  return (
    <TouchableOpacity
      style={styles.journeyCard}
      onPress={handleBookJourney}
      activeOpacity={0.7}
    >
      {/* Journey Header */}
      <View style={styles.journeyHeader}>
        <View style={styles.journeyInfo}>
          <Text style={styles.journeyType}>
            {journey.isDirect ? "Direct Route" : `${journey.totalTransfers} Transfer${journey.totalTransfers > 1 ? 's' : ''}`}
          </Text>
          <Text style={styles.totalDuration}>
            Total: {journey.totalDuration}
          </Text>
        </View>
        <View style={[styles.journeyBadge, { backgroundColor: getJourneyTypeColor() + "20" }]}>
          <Text style={[styles.journeyBadgeText, { color: getJourneyTypeColor() }]}>
            {journey.isDirect ? "DIRECT" : "MULTI-LEG"}
          </Text>
        </View>
      </View>

      {/* Journey Overview */}
      <View style={styles.journeyOverview}>
        <View style={styles.timeContainer}>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{journey.departureTime}</Text>
            <Text style={styles.location}>{fromLocation}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{journey.totalDuration}</Text>
            <View style={styles.durationLine} />
            {!journey.isDirect && (
              <View style={styles.transferIndicator}>
                <Text style={styles.transferText}>
                  {journey.totalTransfers} transfer{journey.totalTransfers > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.time}>{journey.arrivalTime}</Text>
            <Text style={styles.location}>{toLocation}</Text>
          </View>
        </View>
      </View>

      {/* Journey Legs */}
      <View style={styles.legsContainer}>
        {journey.legs.map((leg, index) => (
          <View key={leg.id}>
            <JourneyLegComponent 
              leg={leg} 
              legNumber={index + 1}
              isLastLeg={index === journey.legs.length - 1}
            />
            {index < journey.legs.length - 1 && (
              <View style={styles.transferConnection}>
                <View style={styles.transferDot} />
                <Text style={styles.transferLabel}>
                  Transfer • {leg.transferTime || "5 min wait"}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Journey Summary */}
      <View style={styles.journeySummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Price</Text>
          <Text style={styles.summaryValue}>${journey.totalPrice}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Journey Time</Text>
          <Text style={styles.summaryValue}>{journey.totalDuration}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Transfers</Text>
          <Text style={styles.summaryValue}>{journey.totalTransfers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  journeyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  journeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  journeyInfo: {
    flex: 1,
  },
  journeyType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  totalDuration: {
    fontSize: 14,
    color: "#6B7280",
  },
  journeyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  journeyBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  journeyOverview: {
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeInfo: {
    alignItems: "center",
    minWidth: 80,
  },
  time: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  durationContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 16,
  },
  duration: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  durationLine: {
    height: 1,
    backgroundColor: "#D1D5DB",
    width: "100%",
    marginBottom: 8,
  },
  transferIndicator: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  transferText: {
    fontSize: 10,
    color: "#D97706",
    fontWeight: "600",
  },
  legsContainer: {
    marginBottom: 16,
  },
  transferConnection: {
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  transferDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
    marginBottom: 4,
  },
  transferLabel: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  journeySummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
});
