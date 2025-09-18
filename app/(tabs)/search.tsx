import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = [
    { id: "all", title: "All Buses", count: 24 },
    { id: "express", title: "Express", count: 8 },
    { id: "luxury", title: "Luxury", count: 6 },
    { id: "economy", title: "Economy", count: 10 },
  ];

  const busRoutes = [
    {
      id: 1,
      route: "Downtown → Airport",
      operator: "Premium Express",
      nextDeparture: "10:30 AM",
      duration: "45 min",
      price: "$12",
      type: "express",
      seats: 8,
    },
    {
      id: 2,
      route: "Mall → University",
      operator: "City Comfort",
      nextDeparture: "11:15 AM",
      duration: "25 min",
      price: "$8",
      type: "economy",
      seats: 12,
    },
    {
      id: 3,
      route: "Station → Business District",
      operator: "Luxury Lines",
      nextDeparture: "11:45 AM",
      duration: "35 min",
      price: "$15",
      type: "luxury",
      seats: 4,
    },
  ];

  const filteredRoutes =
    selectedFilter === "all"
      ? busRoutes
      : busRoutes.filter((route) => route.type === selectedFilter);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search routes, destinations..."
              placeholderTextColor="#A0A0A0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filtersTitle}>Filter by Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilter === filter.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.id && styles.filterTextActive,
                  ]}
                >
                  {filter.title} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            Available Buses ({filteredRoutes.length})
          </Text>

          {filteredRoutes.map((route) => (
            <TouchableOpacity key={route.id} style={styles.routeCard}>
              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.route}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{route.price}</Text>
                </View>
              </View>

              <Text style={styles.operator}>{route.operator}</Text>

              <View style={styles.routeDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>🕒</Text>
                  <Text style={styles.detailText}>{route.nextDeparture}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>⏱️</Text>
                  <Text style={styles.detailText}>{route.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailIcon}>💺</Text>
                  <Text style={styles.detailText}>
                    {route.seats} seats left
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.bookButton}>
                <LinearGradient
                  colors={["#1A73E8", "#4285F4"]}
                  style={styles.bookButtonGradient}
                >
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
  },
  filtersScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  filterChipActive: {
    backgroundColor: "#1A73E8",
    borderColor: "#1A73E8",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
  },
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  priceContainer: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  operator: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  routeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#666666",
  },
  bookButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  bookButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
