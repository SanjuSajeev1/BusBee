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

interface BusRoute {
  id: string;
  operator: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  type: "Express" | "Luxury" | "Economy";
  seatsAvailable: number;
  amenities: string[];
  rating: number;
}

const dummyBusData: BusRoute[] = [
  {
    id: "1",
    operator: "Premium Express",
    departureTime: "10:30 AM",
    arrivalTime: "11:15 AM",
    duration: "45 min",
    price: 12,
    type: "Express",
    seatsAvailable: 8,
    amenities: ["WiFi", "AC", "USB Charging"],
    rating: 4.8,
  },
  {
    id: "2",
    operator: "Luxury Lines",
    departureTime: "11:00 AM",
    arrivalTime: "11:50 AM",
    duration: "50 min",
    price: 18,
    type: "Luxury",
    seatsAvailable: 4,
    amenities: ["WiFi", "AC", "Reclining Seats", "Snacks", "USB Charging"],
    rating: 4.9,
  },
  {
    id: "3",
    operator: "City Comfort",
    departureTime: "11:30 AM",
    arrivalTime: "12:10 PM",
    duration: "40 min",
    price: 8,
    type: "Economy",
    seatsAvailable: 12,
    amenities: ["AC", "USB Charging"],
    rating: 4.5,
  },
  {
    id: "4",
    operator: "Swift Transit",
    departureTime: "12:00 PM",
    arrivalTime: "12:45 PM",
    duration: "45 min",
    price: 10,
    type: "Express",
    seatsAvailable: 6,
    amenities: ["WiFi", "AC", "USB Charging"],
    rating: 4.6,
  },
  {
    id: "5",
    operator: "Elite Coach",
    departureTime: "12:30 PM",
    arrivalTime: "1:25 PM",
    duration: "55 min",
    price: 22,
    type: "Luxury",
    seatsAvailable: 2,
    amenities: ["WiFi", "AC", "Reclining Seats", "Entertainment", "Snacks", "USB Charging"],
    rating: 4.9,
  },
  {
    id: "6",
    operator: "Budget Bus",
    departureTime: "1:00 PM",
    arrivalTime: "1:40 PM",
    duration: "40 min",
    price: 6,
    type: "Economy",
    seatsAvailable: 15,
    amenities: ["AC"],
    rating: 4.2,
  },
];

export default function BusResultsScreen() {
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = ["all", "Express", "Luxury", "Economy"];

  const filteredBuses = selectedFilter === "all" 
    ? dummyBusData 
    : dummyBusData.filter(bus => bus.type === selectedFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Express":
        return "#3B82F6";
      case "Luxury":
        return "#8B5CF6";
      case "Economy":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const handleBookBus = (bus: BusRoute) => {
    // Navigate to booking screen (would be implemented later)
    router.push({
      pathname: "/(booking)/details",
      params: {
        busId: bus.id,
        from,
        to,
        operator: bus.operator,
        price: bus.price.toString(),
        departureTime: bus.departureTime,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>{from} → {to}</Text>
          <Text style={styles.routeSubtext}>Today • {filteredBuses.length} buses</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter === "all" ? "All" : filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bus Results */}
      <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
        {filteredBuses.map((bus) => (
          <View key={bus.id} style={styles.busCard}>
            {/* Bus Header */}
            <View style={styles.busHeader}>
              <View style={styles.operatorInfo}>
                <Text style={styles.operatorName}>{bus.operator}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>⭐ {bus.rating}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(bus.type) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: getTypeColor(bus.type) },
                  ]}
                >
                  {bus.type}
                </Text>
              </View>
            </View>

            {/* Time and Duration */}
            <View style={styles.timeContainer}>
              <View style={styles.timeInfo}>
                <Text style={styles.time}>{bus.departureTime}</Text>
                <Text style={styles.location}>{from}</Text>
              </View>
              <View style={styles.durationContainer}>
                <Text style={styles.duration}>{bus.duration}</Text>
                <View style={styles.durationLine} />
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.time}>{bus.arrivalTime}</Text>
                <Text style={styles.location}>{to}</Text>
              </View>
            </View>

            {/* Amenities */}
            <View style={styles.amenitiesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bus.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Price and Book Button */}
            <View style={styles.bookingContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${bus.price}</Text>
                <Text style={styles.seatsLeft}>{bus.seatsAvailable} seats left</Text>
              </View>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBookBus(bus)}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  busCard: {
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
  busHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  operatorInfo: {
    flex: 1,
  },
  operatorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeInfo: {
    alignItems: "center",
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
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    marginRight: 8,
  },
  amenityText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  bookingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  seatsLeft: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
