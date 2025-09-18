import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Location {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
}

interface LocationPickerModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSelectLocation: (location: Location) => void;
}

const dummyLocations: Location[] = [
  {
    id: "1",
    name: "Downtown Terminal",
    subtitle: "Main bus station",
    icon: "🏢",
  },
  { id: "2", name: "Airport", subtitle: "International Airport", icon: "✈️" },
  {
    id: "3",
    name: "University Campus",
    subtitle: "State University",
    icon: "🎓",
  },
  { id: "4", name: "Shopping Mall", subtitle: "City Center Mall", icon: "🛍️" },
  {
    id: "5",
    name: "Business District",
    subtitle: "Financial Center",
    icon: "🏦",
  },
  { id: "6", name: "Train Station", subtitle: "Central Railway", icon: "🚂" },
  { id: "7", name: "Hospital", subtitle: "General Hospital", icon: "🏥" },
  { id: "8", name: "Beach Resort", subtitle: "Coastal Area", icon: "🏖️" },
  { id: "9", name: "Tech Park", subtitle: "IT Hub", icon: "💻" },
  { id: "10", name: "Sports Complex", subtitle: "Stadium Area", icon: "⚽" },
  { id: "11", name: "Residential Area", subtitle: "Green Valley", icon: "🏘️" },
  {
    id: "12",
    name: "Industrial Zone",
    subtitle: "Manufacturing Hub",
    icon: "🏭",
  },
];

export default function LocationPickerModal({
  visible,
  title,
  onClose,
  onSelectLocation,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = dummyLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </View>

        {/* Locations List */}
        <ScrollView
          style={styles.locationsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredLocations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationItem}
              onPress={() => handleLocationSelect(location)}
              activeOpacity={0.7}
            >
              <View style={styles.locationIcon}>
                <Text style={styles.iconText}>{location.icon}</Text>
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
              </View>
              <Text style={styles.selectArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Current Location Option */}
        <View style={styles.currentLocationContainer}>
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={() =>
              handleLocationSelect({
                id: "current",
                name: "Current Location",
                subtitle: "Use GPS location",
                icon: "📍",
              })
            }
          >
            <View style={styles.currentLocationIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.currentLocationText}>
                Use Current Location
              </Text>
              <Text style={styles.currentLocationSubtitle}>GPS location</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  locationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectArrow: {
    fontSize: 20,
    color: "#D1D5DB",
  },
  currentLocationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D4ED8",
    marginBottom: 2,
  },
  currentLocationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});
