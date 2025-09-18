import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

interface BusStop {
  id: string;
  name: string;
  estimatedTime: string;
  status: "completed" | "current" | "upcoming";
  isUserStop?: boolean;
}

const dummyBusStops: BusStop[] = [
  {
    id: "1",
    name: "Downtown Terminal",
    estimatedTime: "10:30 AM",
    status: "completed",
  },
  {
    id: "2",
    name: "City Center Mall",
    estimatedTime: "10:38 AM",
    status: "completed",
  },
  {
    id: "3",
    name: "University Campus",
    estimatedTime: "10:45 AM",
    status: "current",
  },
  {
    id: "4",
    name: "Business District",
    estimatedTime: "10:52 AM",
    status: "upcoming",
  },
  {
    id: "5",
    name: "Train Station",
    estimatedTime: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "6",
    name: "Airport Terminal",
    estimatedTime: "11:15 AM",
    status: "upcoming",
    isUserStop: true,
  },
];

export default function BusTrackingScreen() {
  const { busId, operator, from, to } = useLocalSearchParams<{
    busId: string;
    operator: string;
    from: string;
    to: string;
  }>();

  const [busStops] = useState(dummyBusStops);
  const [currentProgress, setCurrentProgress] = useState(2); // Bus is at stop 3 (index 2)
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animate the current location indicator
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const getStopIcon = (stop: BusStop, index: number) => {
    if (stop.status === "completed") return "✅";
    if (stop.status === "current") return "🚌";
    if (stop.isUserStop) return "📍";
    return "⭕";
  };

  const getStopColor = (stop: BusStop) => {
    switch (stop.status) {
      case "completed":
        return "#10B981";
      case "current":
        return "#3B82F6";
      case "upcoming":
        return stop.isUserStop ? "#EF4444" : "#9CA3AF";
      default:
        return "#9CA3AF";
    }
  };

  const getTimeColor = (stop: BusStop) => {
    switch (stop.status) {
      case "completed":
        return "#6B7280";
      case "current":
        return "#3B82F6";
      case "upcoming":
        return stop.isUserStop ? "#EF4444" : "#9CA3AF";
      default:
        return "#9CA3AF";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.busInfo}>
          <Text style={styles.operatorName}>{operator}</Text>
          <Text style={styles.routeText}>{from} → {to}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Live Status */}
      <View style={styles.liveStatusContainer}>
        <View style={styles.liveIndicator}>
          <Animated.View
            style={[
              styles.liveDot,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Text style={styles.liveText}>Live Tracking</Text>
        </View>
        <Text style={styles.statusText}>
          Currently at: {busStops.find(stop => stop.status === "current")?.name}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentProgress + 1) / busStops.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Stop {currentProgress + 1} of {busStops.length}
        </Text>
      </View>

      {/* Bus Stops List */}
      <ScrollView style={styles.stopsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.stopsTitle}>Route & Schedule</Text>
        
        {busStops.map((stop, index) => (
          <View key={stop.id} style={styles.stopItem}>
            <View style={styles.stopIndicator}>
              <View
                style={[
                  styles.stopDot,
                  { backgroundColor: getStopColor(stop) },
                ]}
              >
                <Text style={styles.stopIcon}>{getStopIcon(stop, index)}</Text>
              </View>
              {index < busStops.length - 1 && (
                <View
                  style={[
                    styles.stopLine,
                    {
                      backgroundColor:
                        index < currentProgress ? "#10B981" : "#E5E7EB",
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.stopDetails}>
              <View style={styles.stopHeader}>
                <Text
                  style={[
                    styles.stopName,
                    stop.status === "current" && styles.currentStopName,
                    stop.isUserStop && styles.userStopName,
                  ]}
                >
                  {stop.name}
                  {stop.isUserStop && " (Your Stop)"}
                </Text>
                <Text
                  style={[
                    styles.stopTime,
                    { color: getTimeColor(stop) },
                  ]}
                >
                  {stop.estimatedTime}
                </Text>
              </View>
              
              {stop.status === "current" && (
                <Text style={styles.currentStatus}>Bus is currently here</Text>
              )}
              {stop.status === "completed" && (
                <Text style={styles.completedStatus}>Departed</Text>
              )}
              {stop.isUserStop && stop.status === "upcoming" && (
                <Text style={styles.userStopStatus}>Your destination</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>🔔 Notify on Arrival</Text>
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
  busInfo: {
    alignItems: "center",
  },
  operatorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  routeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  placeholder: {
    width: 40,
  },
  liveStatusContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
  },
  statusText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  progressContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  stopsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stopsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  stopItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  stopIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  stopDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  stopIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  stopLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  stopDetails: {
    flex: 1,
    paddingVertical: 4,
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },
  currentStopName: {
    fontWeight: "700",
    color: "#3B82F6",
  },
  userStopName: {
    fontWeight: "700",
    color: "#EF4444",
  },
  stopTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  currentStatus: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  completedStatus: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  userStopStatus: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  refreshButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  notifyButton: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  notifyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
