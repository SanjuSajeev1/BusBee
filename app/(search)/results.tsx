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
  type: "Private" | "Limited Stop";
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
    type: "Private",
    seatsAvailable: 8,
    amenities: ["WiFi", "AC", "USB Charging", "Leather Seats"],
    rating: 4.8,
  },
  {
    id: "2",
    operator: "Luxury Lines",
    departureTime: "11:00 AM",
    arrivalTime: "11:50 AM",
    duration: "50 min",
    price: 18,
    type: "Private",
    seatsAvailable: 4,
    amenities: [
      "WiFi",
      "AC",
      "Reclining Seats",
      "Snacks",
      "USB Charging",
      "Entertainment",
    ],
    rating: 4.9,
  },
  {
    id: "3",
    operator: "City Transit",
    departureTime: "11:30 AM",
    arrivalTime: "12:45 PM",
    duration: "1h 15min",
    price: 8,
    type: "Limited Stop",
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
    price: 15,
    type: "Private",
    seatsAvailable: 6,
    amenities: ["WiFi", "AC", "USB Charging", "Refreshments"],
    rating: 4.6,
  },
  {
    id: "5",
    operator: "Metro Express",
    departureTime: "12:30 PM",
    arrivalTime: "2:00 PM",
    duration: "1h 30min",
    price: 6,
    type: "Limited Stop",
    seatsAvailable: 18,
    amenities: ["AC", "USB Charging"],
    rating: 4.3,
  },
  {
    id: "6",
    operator: "Elite Coach",
    departureTime: "1:00 PM",
    arrivalTime: "1:55 PM",
    duration: "55 min",
    price: 22,
    type: "Private",
    seatsAvailable: 2,
    amenities: [
      "WiFi",
      "AC",
      "Reclining Seats",
      "Entertainment",
      "Snacks",
      "USB Charging",
    ],
    rating: 4.9,
  },
  {
    id: "7",
    operator: "Morning Express",
    departureTime: "7:30 AM",
    arrivalTime: "8:15 AM",
    duration: "45 min",
    price: 10,
    type: "Private",
    seatsAvailable: 10,
    amenities: ["WiFi", "AC", "USB Charging"],
    rating: 4.7,
  },
  {
    id: "8",
    operator: "Evening Shuttle",
    departureTime: "6:00 PM",
    arrivalTime: "6:45 PM",
    duration: "45 min",
    price: 12,
    type: "Limited Stop",
    seatsAvailable: 8,
    amenities: ["AC", "USB Charging"],
    rating: 4.4,
  },
  {
    id: "9",
    operator: "Night Rider",
    departureTime: "8:30 PM",
    arrivalTime: "9:20 PM",
    duration: "50 min",
    price: 14,
    type: "Private",
    seatsAvailable: 5,
    amenities: ["WiFi", "AC", "USB Charging"],
    rating: 4.6,
  },
];

export default function BusResultsScreen() {
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All Times");
  const [hasDirectRoutes, setHasDirectRoutes] = useState(true);

  const filters = ["All", "Private", "Limited Stop"];
  const timeFilters = ["All Times", "Morning", "Afternoon", "Evening"];

  const getTimeCategory = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    const isPM = time.includes("PM");
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

    if (hour24 >= 6 && hour24 < 12) return "Morning";
    if (hour24 >= 12 && hour24 < 17) return "Afternoon";
    if (hour24 >= 17 && hour24 < 24) return "Evening";
    return "Morning"; // Default
  };

  const filteredBuses = dummyBusData
    .filter((bus) => selectedFilter === "All" || bus.type === selectedFilter)
    .filter(
      (bus) =>
        selectedTimeFilter === "All Times" ||
        getTimeCategory(bus.departureTime) === selectedTimeFilter
    );

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

  const handleFindMultiLegRoutes = () => {
    // Navigate to multi-leg routes screen
    router.push({
      pathname: "/(search)/multi-leg-routes",
      params: {
        from,
        to,
      },
    });
  };

  // Simulate checking for direct routes availability
  // In a real app, this would come from your API
  const checkDirectRoutesAvailability = () => {
    // For demo purposes, simulate no direct routes for certain routes
    const noDirectRoutes = [
      "Edavanakkad → TVM",
      "Edavanakkad → Trivandrum",
      "Edavanakkad → Thiruvananthapuram",
      "Edavanakkad → TVM",
      "Kochi → Trivandrum",
      "Kochi → TVM",
      "Calicut → Thiruvananthapuram",
      "Calicut → TVM",
    ];

    // Create variations of the current route for better matching
    const currentRouteVariations = [
      `${from} → ${to}`,
      `${from?.toLowerCase()} → ${to?.toLowerCase()}`,
      `${from?.toUpperCase()} → ${to?.toUpperCase()}`,
    ];

    // Check if any variation matches the no-direct-routes list
    const hasNoDirectRoute = noDirectRoutes.some((route) =>
      currentRouteVariations.some((variation) => {
        const variationLower = variation.toLowerCase();
        const routeLower = route.toLowerCase();

        // Exact match
        if (variationLower === routeLower) return true;

        // Partial match - check if from/to locations match
        const variationParts = variationLower.split(" → ");
        const routeParts = routeLower.split(" → ");

        if (variationParts.length === 2 && routeParts.length === 2) {
          const [fromVar, toVar] = variationParts;
          const [fromRoute, toRoute] = routeParts;

          // Check if locations match (case-insensitive)
          return fromVar.includes(fromRoute) && toVar.includes(toRoute);
        }

        return false;
      })
    );

    return !hasNoDirectRoute;
  };

  React.useEffect(() => {
    // Debug logging to help troubleshoot
    console.log("Search params:", { from, to });
    const currentRoute = `${from} → ${to}`;
    console.log("Current route:", currentRoute);
    const hasDirect = checkDirectRoutesAvailability();
    console.log("Has direct routes:", hasDirect);
    setHasDirectRoutes(hasDirect);
  }, [from, to]);

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
            Today • {filteredBuses.length} buses
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Type Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Bus Type</Text>
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
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Departure Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {timeFilters.map((timeFilter) => (
            <TouchableOpacity
              key={timeFilter}
              style={[
                styles.filterChip,
                selectedTimeFilter === timeFilter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedTimeFilter(timeFilter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTimeFilter === timeFilter && styles.filterTextActive,
                ]}
              >
                {timeFilter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Multi-leg Routes Button - Show when no direct routes */}
      {!hasDirectRoutes && (
        <View style={styles.multiLegContainer}>
          <View style={styles.multiLegCard}>
            <View style={styles.multiLegHeader}>
              <Text style={styles.multiLegTitle}>
                No Direct Routes Available
              </Text>
              <Text style={styles.multiLegSubtitle}>
                Try multi-leg journeys with transfers
              </Text>
            </View>
            <TouchableOpacity
              style={styles.multiLegButton}
              onPress={handleFindMultiLegRoutes}
            >
              <Text style={styles.multiLegButtonText}>
                Find Multi-leg Routes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bus Results */}
      <ScrollView
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
      >
        {hasDirectRoutes && (
          <>
            {/* Show direct routes */}
            {filteredBuses.map((bus) => (
              <TouchableOpacity
                key={bus.id}
                style={styles.busCard}
                onPress={() =>
                  router.push({
                    pathname: "/(search)/bus-tracking",
                    params: {
                      busId: bus.id,
                      operator: bus.operator,
                      from,
                      to,
                      price: bus.price.toString(),
                    },
                  })
                }
                activeOpacity={0.7}
              >
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

                {/* Price - Commented out for now */}
                {/* <View style={styles.priceSection}>
              <Text style={styles.price}>${bus.price}</Text>
            </View> */}
              </TouchableOpacity>
            ))}

            {/* Multi-leg Routes Option */}
            <View style={styles.alternativeRoutesCard}>
              <View style={styles.alternativeRoutesHeader}>
                <Text style={styles.alternativeRoutesTitle}>
                  Looking for alternatives?
                </Text>
                <Text style={styles.alternativeRoutesSubtitle}>
                  Explore multi-leg routes with transfers
                </Text>
              </View>
              <TouchableOpacity
                style={styles.alternativeRoutesButton}
                onPress={handleFindMultiLegRoutes}
              >
                <Text style={styles.alternativeRoutesButtonText}>
                  Find Multi-leg Routes
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
  priceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  multiLegContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  multiLegCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  multiLegHeader: {
    marginBottom: 16,
  },
  multiLegTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  multiLegSubtitle: {
    fontSize: 14,
    color: "#A16207",
    lineHeight: 20,
  },
  multiLegButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  multiLegButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  alternativeRoutesCard: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  alternativeRoutesHeader: {
    marginBottom: 16,
  },
  alternativeRoutesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0C4A6E",
    marginBottom: 4,
  },
  alternativeRoutesSubtitle: {
    fontSize: 14,
    color: "#0369A1",
    lineHeight: 20,
  },
  alternativeRoutesButton: {
    backgroundColor: "#0284C7",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  alternativeRoutesButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  findMultiLegButton: {
    backgroundColor: "#1A73E8",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  findMultiLegButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
