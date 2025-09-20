import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingBookings = [
    {
      id: 1,
      route: "Metro Station → Airport Terminal",
      fromStop: "Metro Station",
      toStop: "Airport Terminal",
      date: "Today",
      time: "2:30 PM",
      departureTime: "2:30 PM",
      arrivalTime: "3:15 PM",
      duration: "45 min",
      passengers: 2,
      price: "₹32",
      totalPrice: "₹32",
      operator: "Premium Express",
      status: "confirmed",
      bookingId: "BB001234",
      bookingDate: "18/09/2025",
      busNumber: "KL-07-AB-1234",
      platform: "Gate 3",
      qrCode: "BB001234QR",
    },
    {
      id: 2,
      route: "City Mall → University Campus",
      fromStop: "City Mall",
      toStop: "University Campus",
      date: "Tomorrow",
      time: "9:15 AM",
      departureTime: "9:15 AM",
      arrivalTime: "10:00 AM",
      duration: "45 min",
      passengers: 1,
      price: "₹16",
      totalPrice: "₹16",
      operator: "City Comfort",
      status: "confirmed",
      bookingId: "BB001235",
      bookingDate: "19/09/2025",
      busNumber: "KL-09-CD-5678",
      platform: "Gate 1",
      qrCode: "BB001235QR",
    },
  ];

  const pastBookings = [
    {
      id: 3,
      route: "Railway Station → Business District",
      fromStop: "Railway Station",
      toStop: "Business District",
      date: "Yesterday",
      time: "11:45 AM",
      departureTime: "11:45 AM",
      arrivalTime: "12:30 PM",
      duration: "45 min",
      passengers: 1,
      price: "₹18",
      totalPrice: "₹18",
      operator: "Luxury Lines",
      status: "completed",
      bookingId: "BB001232",
      bookingDate: "17/09/2025",
      busNumber: "KL-08-EF-9012",
      platform: "Gate 2",
      qrCode: "BB001232QR",
    },
    {
      id: 4,
      route: "Airport Terminal → City Center",
      fromStop: "Airport Terminal",
      toStop: "City Center",
      date: "16 Sep 2025",
      time: "6:20 PM",
      departureTime: "6:20 PM",
      arrivalTime: "7:05 PM",
      duration: "45 min",
      passengers: 3,
      price: "₹48",
      totalPrice: "₹48",
      operator: "Premium Express",
      status: "completed",
      bookingId: "BB001231",
      bookingDate: "16/09/2025",
      busNumber: "KL-07-AB-1234",
      platform: "Gate 4",
      qrCode: "BB001231QR",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#2E7D32";
      case "completed":
        return "#1565C0";
      case "cancelled":
        return "#D32F2F";
      default:
        return "#666666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const bookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "upcoming"
                ? "Book your first bus ticket to get started!"
                : "Your completed bookings will appear here."}
            </Text>
            {activeTab === "upcoming" && (
              <TouchableOpacity style={styles.bookNowButton}>
                <LinearGradient
                  colors={["#1A73E8", "#4285F4"]}
                  style={styles.bookNowGradient}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {bookings.map((booking) => (
              <TouchableOpacity key={booking.id} style={styles.ticketCard}>
                {/* Ticket Header */}
                <LinearGradient
                  colors={
                    getStatusColor(booking.status) === "#2E7D32"
                      ? ["#4CAF50", "#2E7D32"]
                      : getStatusColor(booking.status) === "#1565C0"
                      ? ["#2196F3", "#1565C0"]
                      : ["#F44336", "#D32F2F"]
                  }
                  style={styles.ticketHeader}
                >
                  <View style={styles.ticketHeaderContent}>
                    <View style={styles.ticketOperatorInfo}>
                      <Text style={styles.ticketOperator}>
                        {booking.operator}
                      </Text>
                      <Text style={styles.ticketBusNumber}>
                        {booking.busNumber}
                      </Text>
                    </View>
                    <View style={styles.statusBadgeNew}>
                      <Text style={styles.statusTextNew}>
                        {getStatusText(booking.status)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Ticket Body */}
                <View style={styles.ticketBody}>
                  {/* Route Section */}
                  <View style={styles.routeSection}>
                    <View style={styles.routePoint}>
                      <View style={styles.routeDot} />
                      <View>
                        <Text style={styles.routeStopName}>
                          {booking.fromStop}
                        </Text>
                        <Text style={styles.routeTime}>
                          {booking.departureTime}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.routeLine}>
                      <View style={styles.dottedLine} />
                      <Text style={styles.routeDuration}>
                        {booking.duration}
                      </Text>
                    </View>

                    <View style={styles.routePoint}>
                      <View style={[styles.routeDot, styles.routeDotEnd]} />
                      <View>
                        <Text style={styles.routeStopName}>
                          {booking.toStop}
                        </Text>
                        <Text style={styles.routeTime}>
                          {booking.arrivalTime}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Ticket Details */}
                  <View style={styles.ticketDetailsGrid}>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>Date</Text>
                      <Text style={styles.ticketDetailValue}>
                        {booking.bookingDate}
                      </Text>
                    </View>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>Platform</Text>
                      <Text style={styles.ticketDetailValue}>
                        {booking.platform}
                      </Text>
                    </View>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>Passengers</Text>
                      <Text style={styles.ticketDetailValue}>
                        {booking.passengers}
                      </Text>
                    </View>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>Total</Text>
                      <Text style={styles.ticketDetailPrice}>
                        {booking.totalPrice}
                      </Text>
                    </View>
                  </View>

                  {/* QR Code Section */}
                  <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                      <Text style={styles.qrIcon}>⬛</Text>
                      <Text style={styles.qrText}>Scan at boarding</Text>
                    </View>
                    <Text style={styles.bookingIdNew}>
                      ID: {booking.bookingId}
                    </Text>
                  </View>
                </View>

                {/* Ticket Footer */}
                <View style={styles.ticketFooter}>
                  <View style={styles.actionButtons}>
                    {activeTab === "upcoming" ? (
                      <>
                        <TouchableOpacity style={styles.secondaryButtonNew}>
                          <Text style={styles.secondaryButtonTextNew}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryButtonNew}>
                          <Text style={styles.primaryButtonTextNew}>
                            View Details
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity style={styles.secondaryButtonNew}>
                          <Text style={styles.secondaryButtonTextNew}>
                            Download
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryButtonNew}>
                          <Text style={styles.primaryButtonTextNew}>
                            Book Again
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
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
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#1A73E8",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  bookNowButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  bookNowGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bookingCard: {
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
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  route: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  operator: {
    fontSize: 14,
    color: "#666666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
  },
  bookingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  bookingId: {
    fontSize: 12,
    color: "#999999",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1A73E8",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // New BookMyShow-style ticket design
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  ticketHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  ticketHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ticketOperatorInfo: {
    flex: 1,
  },

  ticketOperator: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },

  ticketBusNumber: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },

  statusBadgeNew: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusTextNew: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },

  ticketBody: {
    padding: 20,
  },

  routeSection: {
    marginBottom: 24,
  },

  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    marginRight: 16,
  },

  routeDotEnd: {
    backgroundColor: "#FF5722",
  },

  routeStopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },

  routeTime: {
    fontSize: 14,
    color: "#666666",
  },

  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    marginBottom: 8,
  },

  dottedLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginRight: 16,
  },

  routeDuration: {
    fontSize: 12,
    color: "#999999",
    fontStyle: "italic",
  },

  ticketDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  ticketDetailItem: {
    width: "48%",
    marginBottom: 16,
  },

  ticketDetailLabel: {
    fontSize: 12,
    color: "#999999",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "600",
  },

  ticketDetailValue: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
  },

  ticketDetailPrice: {
    fontSize: 18,
    color: "#4CAF50",
    fontWeight: "bold",
  },

  qrSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    borderStyle: "dashed",
  },

  qrPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
  },

  qrIcon: {
    fontSize: 24,
    marginRight: 12,
    opacity: 0.7,
  },

  qrText: {
    fontSize: 14,
    color: "#666666",
  },

  bookingIdNew: {
    fontSize: 12,
    color: "#999999",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  ticketFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  secondaryButtonNew: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },

  secondaryButtonTextNew: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },

  primaryButtonNew: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1A73E8",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },

  primaryButtonTextNew: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
