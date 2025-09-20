import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MultiLegJourney, JourneyLeg } from "../../src/types/JourneyTypes";
import MultiLegJourneyComponent from "../../src/components/MultiLegJourney";

export default function MultiLegRoutesScreen() {
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();

  // Mock multi-leg journey data - in a real app, this would come from your API
  const mockMultiLegJourneys: MultiLegJourney[] = [
    {
      id: "ml-1",
      totalDuration: "3h 45min",
      totalPrice: 45,
      totalTransfers: 2,
      fromLocation: from || "Edavanakkad",
      toLocation: to || "TVM",
      departureTime: "10:30 AM",
      arrivalTime: "2:15 PM",
      isDirect: false,
      legs: [
        {
          id: "leg-1",
          busNumber: "KL-07-AB-1234",
          operator: "Premium Express",
          fromStop: { id: "1", name: "Edavanakkad" },
          toStop: { id: "2", name: "Ernakulam" },
          departureTime: "10:30 AM",
          arrivalTime: "11:45 AM",
          duration: "1h 15min",
          price: 15,
          type: "Private",
          seatsAvailable: 8,
          amenities: ["WiFi", "AC", "USB Charging"],
          rating: 4.8,
          stops: [
            { id: "1", name: "Edavanakkad" },
            { id: "2", name: "Cherai" },
            { id: "3", name: "North Paravur" },
            { id: "4", name: "Ernakulam" },
          ],
          isTransfer: false,
          transferTime: "15 min",
          transferInstructions: "Walk to Platform 2 for connecting bus",
        },
        {
          id: "leg-2",
          busNumber: "KL-09-CD-5678",
          operator: "City Comfort",
          fromStop: { id: "5", name: "Ernakulam" },
          toStop: { id: "6", name: "Vytilla" },
          departureTime: "12:00 PM",
          arrivalTime: "1:30 PM",
          duration: "1h 30min",
          price: 20,
          type: "Limited Stop",
          seatsAvailable: 12,
          amenities: ["AC", "USB Charging"],
          rating: 4.5,
          stops: [
            { id: "5", name: "Ernakulam" },
            { id: "6", name: "Aluva" },
            { id: "7", name: "Vytilla" },
          ],
          isTransfer: true,
          transferTime: "20 min",
          transferInstructions: "Board bus from Platform 1",
        },
        {
          id: "leg-3",
          busNumber: "KL-08-EF-9012",
          operator: "Luxury Lines",
          fromStop: { id: "8", name: "Vytilla" },
          toStop: { id: "9", name: "TVM" },
          departureTime: "1:50 PM",
          arrivalTime: "2:15 PM",
          duration: "25 min",
          price: 10,
          type: "Private",
          seatsAvailable: 4,
          amenities: ["WiFi", "AC", "Reclining Seats"],
          rating: 4.9,
          stops: [
            { id: "8", name: "Vytilla" },
            { id: "9", name: "TVM" },
          ],
          isTransfer: false,
        },
      ],
    },
    {
      id: "ml-2",
      totalDuration: "4h 20min",
      totalPrice: 38,
      totalTransfers: 3,
      fromLocation: from || "Edavanakkad",
      toLocation: to || "TVM",
      departureTime: "9:15 AM",
      arrivalTime: "1:35 PM",
      isDirect: false,
      legs: [
        {
          id: "leg-4",
          busNumber: "KL-05-GH-3456",
          operator: "Swift Transit",
          fromStop: { id: "1", name: "Edavanakkad" },
          toStop: { id: "3", name: "Cherai" },
          departureTime: "9:15 AM",
          arrivalTime: "10:00 AM",
          duration: "45 min",
          price: 8,
          type: "Limited Stop",
          seatsAvailable: 18,
          amenities: ["AC"],
          rating: 4.3,
          stops: [
            { id: "1", name: "Edavanakkad" },
            { id: "3", name: "Cherai" },
          ],
          isTransfer: false,
          transferTime: "10 min",
          transferInstructions: "Transfer at Cherai Bus Stand",
        },
        {
          id: "leg-5",
          busNumber: "KL-07-IJ-7890",
          operator: "Metro Express",
          fromStop: { id: "3", name: "Cherai" },
          toStop: { id: "2", name: "Ernakulam" },
          departureTime: "10:10 AM",
          arrivalTime: "11:30 AM",
          duration: "1h 20min",
          price: 12,
          type: "Limited Stop",
          seatsAvailable: 15,
          amenities: ["AC", "USB Charging"],
          rating: 4.4,
          stops: [
            { id: "3", name: "Cherai" },
            { id: "10", name: "North Paravur" },
            { id: "2", name: "Ernakulam" },
          ],
          isTransfer: true,
          transferTime: "25 min",
          transferInstructions: "Wait at Ernakulam Bus Terminal",
        },
        {
          id: "leg-6",
          busNumber: "KL-09-KL-2468",
          operator: "City Transit",
          fromStop: { id: "2", name: "Ernakulam" },
          toStop: { id: "7", name: "Aluva" },
          departureTime: "11:55 AM",
          arrivalTime: "12:40 PM",
          duration: "45 min",
          price: 8,
          type: "Limited Stop",
          seatsAvailable: 20,
          amenities: ["AC"],
          rating: 4.2,
          stops: [
            { id: "2", name: "Ernakulam" },
            { id: "7", name: "Aluva" },
          ],
          isTransfer: true,
          transferTime: "15 min",
          transferInstructions: "Transfer to Vytilla bus",
        },
        {
          id: "leg-7",
          busNumber: "KL-08-MN-1357",
          operator: "Evening Shuttle",
          fromStop: { id: "7", name: "Aluva" },
          toStop: { id: "9", name: "TVM" },
          departureTime: "12:55 PM",
          arrivalTime: "1:35 PM",
          duration: "40 min",
          price: 10,
          type: "Private",
          seatsAvailable: 6,
          amenities: ["WiFi", "AC", "USB Charging"],
          rating: 4.6,
          stops: [
            { id: "7", name: "Aluva" },
            { id: "6", name: "Vytilla" },
            { id: "9", name: "TVM" },
          ],
          isTransfer: false,
        },
      ],
    },
  ];

  const handleLegPress = (leg: JourneyLeg, journey: MultiLegJourney) => {
    // Navigate to existing results screen for this specific leg
    router.push({
      pathname: "/(search)/results",
      params: {
        from: leg.fromStop.name,
        to: leg.toStop.name,
      },
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
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            {from} → {to}
          </Text>
          <Text style={styles.routeSubtext}>
            Multi-leg Routes • {mockMultiLegJourneys.length} options
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Journey Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Multi-leg Journey Options</Text>
        <Text style={styles.summarySubtitle}>
          No direct buses available. Choose from these multi-leg routes:
        </Text>
      </View>

      {/* Multi-leg Journeys */}
      <ScrollView
        style={styles.journeysList}
        showsVerticalScrollIndicator={false}
      >
        {mockMultiLegJourneys.map((journey) => (
          <View key={journey.id} style={styles.journeyCard}>
            {/* Journey Header */}
            <View style={styles.journeyHeader}>
              <View style={styles.journeyInfo}>
                <Text style={styles.journeyType}>
                  {journey.totalTransfers} Transfer
                  {journey.totalTransfers > 1 ? "s" : ""}
                </Text>
                <Text style={styles.totalDuration}>
                  Total: {journey.totalDuration}
                </Text>
              </View>
              <View
                style={[styles.journeyBadge, { backgroundColor: "#F59E0B20" }]}
              >
                <Text style={[styles.journeyBadgeText, { color: "#F59E0B" }]}>
                  MULTI-LEG
                </Text>
              </View>
            </View>

            {/* Journey Overview */}
            <View style={styles.journeyOverview}>
              <View style={styles.timeContainer}>
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{journey.departureTime}</Text>
                  <Text style={styles.location}>{journey.fromLocation}</Text>
                </View>
                <View style={styles.durationContainer}>
                  <Text style={styles.duration}>{journey.totalDuration}</Text>
                  <View style={styles.durationLine} />
                  <View style={styles.transferIndicator}>
                    <Text style={styles.transferText}>
                      {journey.totalTransfers} transfer
                      {journey.totalTransfers > 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{journey.arrivalTime}</Text>
                  <Text style={styles.location}>{journey.toLocation}</Text>
                </View>
              </View>
            </View>

            {/* Journey Legs */}
            <View style={styles.legsContainer}>
              {journey.legs.map((leg, index) => (
                <View key={leg.id}>
                  <TouchableOpacity
                    style={styles.legItem}
                    onPress={() => handleLegPress(leg, journey)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.legHeader}>
                      <View style={styles.legNumberContainer}>
                        <View
                          style={[
                            styles.legNumber,
                            { backgroundColor: "#3B82F6" },
                          ]}
                        >
                          <Text style={styles.legNumberText}>{index + 1}</Text>
                        </View>
                      </View>
                      <View style={styles.legInfo}>
                        <Text style={styles.busNumber}>{leg.busNumber}</Text>
                        <Text style={styles.operator}>{leg.operator}</Text>
                      </View>
                      <View style={styles.legArrow}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </View>
                    <View style={styles.legRoute}>
                      <Text style={styles.legRouteText}>
                        {leg.fromStop.name} → {leg.toStop.name}
                      </Text>
                      <Text style={styles.legTime}>
                        {leg.departureTime} - {leg.arrivalTime} • {leg.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
                <Text style={styles.summaryValue}>
                  {journey.totalTransfers}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  routeInfo: {
    alignItems: "center",
  },
  routeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  routeSubtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholder: {
    width: 40,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  journeysList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
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
  legItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 8,
  },
  legHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  busNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  operator: {
    fontSize: 14,
    color: "#6B7280",
  },
  legArrow: {
    paddingHorizontal: 8,
  },
  arrowText: {
    fontSize: 16,
    color: "#6B7280",
  },
  legRoute: {
    marginLeft: 36,
  },
  legRouteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  legTime: {
    fontSize: 12,
    color: "#6B7280",
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
    marginBottom: 16,
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
