import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import LocationPickerModal from "../../src/components/modals/LocationPickerModal";

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
  busNumber: string;
}

const dummyBusData: BusRoute[] = [
  {
    id: "1",
    operator: "Premium Express",
    busNumber: "KL-07-AB-1234",
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
    busNumber: "KL-09-CD-5678",
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
    busNumber: "KL-08-EF-9012",
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
    busNumber: "KL-06-GH-3456",
    departureTime: "12:00 PM",
    arrivalTime: "12:45 PM",
    duration: "45 min",
    price: 15,
    type: "Private",
    seatsAvailable: 6,
    amenities: ["WiFi", "AC", "USB Charging", "Refreshments"],
    rating: 4.6,
  },
];

export default function BusSelectionScreen() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All Times");

  const filters = ["All", "Private", "Limited Stop"];
  const timeFilters = ["All Times", "Morning", "Afternoon", "Evening"];

  const handleFromLocationSelect = (location: any) => {
    setFromLocation(location.name);
  };

  const handleToLocationSelect = (location: any) => {
    setToLocation(location.name);
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearchBuses = () => {
    if (!fromLocation || !toLocation) {
      Alert.alert(
        "Missing Information",
        "Please select both departure and destination locations"
      );
      return;
    }

    if (fromLocation === toLocation) {
      Alert.alert(
        "Invalid Route",
        "Departure and destination cannot be the same"
      );
      return;
    }
  };

  const getTimeCategory = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    const isPM = time.includes("PM");
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

    if (hour24 >= 6 && hour24 < 12) return "Morning";
    if (hour24 >= 12 && hour24 < 17) return "Afternoon";
    if (hour24 >= 17 && hour24 < 24) return "Evening";
    return "Morning";
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

  const handleSelectBus = (bus: BusRoute) => {
    if (!fromLocation || !toLocation) {
      Alert.alert(
        "Missing Information",
        "Please select both departure and destination locations"
      );
      return;
    }

    router.push({
      pathname: "/(booking)/seat-selection",
      params: {
        busId: bus.id,
        operator: bus.operator,
        busNumber: bus.busNumber,
        from: fromLocation,
        to: toLocation,
        price: bus.price.toString(),
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        duration: bus.duration,
        type: bus.type,
        rating: bus.rating.toString(),
        amenities: bus.amenities.join(","),
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Book Your Journey</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Section */}
        <LinearGradient
          colors={["#1A73E8", "#4285F4", "#34A853"]}
          style={styles.searchSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.searchCard}>
            <Text style={styles.searchTitle}>Where are you going?</Text>

            <View style={styles.searchInputs}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>From</Text>
                <TouchableOpacity
                  style={styles.searchInput}
                  onPress={() => setShowFromPicker(true)}
                >
                  <Text
                    style={[
                      styles.searchInputText,
                      !fromLocation && styles.placeholderText,
                    ]}
                  >
                    {fromLocation || "Select departure location"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapLocations}
              >
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>To</Text>
                <TouchableOpacity
                  style={styles.searchInput}
                  onPress={() => setShowToPicker(true)}
                >
                  <Text
                    style={[
                      styles.searchInputText,
                      !toLocation && styles.placeholderText,
                    ]}
                  >
                    {toLocation || "Select destination"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.searchInput}>
                  <Text style={styles.searchInputText}>
                    {formatDate(travelDate)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchBuses}
            >
              <Text style={styles.searchButtonText}>Search Buses</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Bus Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
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

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Departure Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {timeFilters.map((timeFilter) => (
                <TouchableOpacity
                  key={timeFilter}
                  style={[
                    styles.filterChip,
                    selectedTimeFilter === timeFilter &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedTimeFilter(timeFilter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedTimeFilter === timeFilter &&
                        styles.filterTextActive,
                    ]}
                  >
                    {timeFilter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Bus Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            Available Buses ({filteredBuses.length})
          </Text>

          {filteredBuses.map((bus) => (
            <TouchableOpacity
              key={bus.id}
              style={styles.busCard}
              onPress={() => handleSelectBus(bus)}
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
                    style={[styles.typeText, { color: getTypeColor(bus.type) }]}
                  >
                    {bus.type}
                  </Text>
                </View>
              </View>

              {/* Time and Duration */}
              <View style={styles.timeContainer}>
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{bus.departureTime}</Text>
                  <Text style={styles.location}>
                    {fromLocation || "Departure"}
                  </Text>
                </View>
                <View style={styles.durationContainer}>
                  <Text style={styles.duration}>{bus.duration}</Text>
                  <View style={styles.durationLine} />
                </View>
                <View style={styles.timeInfo}>
                  <Text style={styles.time}>{bus.arrivalTime}</Text>
                  <Text style={styles.location}>{toLocation || "Arrival"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {filteredBuses.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No buses found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your filters or search criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Location Picker Modals */}
      <LocationPickerModal
        visible={showFromPicker}
        title="Select departure location"
        onClose={() => setShowFromPicker(false)}
        onSelectLocation={handleFromLocationSelect}
      />

      <LocationPickerModal
        visible={showToPicker}
        title="Select destination"
        onClose={() => setShowToPicker(false)}
        onSelectLocation={handleToLocationSelect}
      />
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
  headerInfo: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  searchInputs: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333333",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  swapButton: {
    alignSelf: "center",
    backgroundColor: "#1A73E8",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  swapIcon: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchInputText: {
    fontSize: 16,
    color: "#333333",
  },
  placeholderText: {
    color: "#A0A0A0",
  },
  searchButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  filtersContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterSection: {
    marginBottom: 12,
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
  filterScrollContent: {
    paddingRight: 20,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
