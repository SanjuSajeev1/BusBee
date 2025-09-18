import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";

interface SongRequest {
  id: string;
  message: string;
  timestamp: Date;
  status: "sent" | "seen" | "playing";
}

export default function SongRequestScreen() {
  const params = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // Bus information from params
  const busOperator = (params.busOperator as string) || "Unknown Bus";
  const busNumber = (params.busNumber as string) || "";
  const route = (params.route as string) || "";

  // Load previous requests (in real app, this would be from AsyncStorage)
  useEffect(() => {
    // Mock previous requests
    const mockRequests: SongRequest[] = [
      {
        id: "1",
        message: "Can you play some Bollywood songs? 🎵",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        status: "playing",
      },
      {
        id: "2",
        message: "Request: Tum Hi Ho by Aashiqui 2",
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        status: "seen",
      },
    ];
    setRequests(mockRequests);
  }, []);

  // Timer for cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!canSendMessage && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanSendMessage(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [canSendMessage, timeLeft]);

  const handleSendRequest = () => {
    if (!message.trim()) {
      Alert.alert("Empty Message", "Please enter a song request");
      return;
    }

    if (!canSendMessage) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      Alert.alert(
        "Please Wait",
        `You can send another request in ${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
      return;
    }

    // Create new request
    const newRequest: SongRequest = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date(),
      status: "sent",
    };

    // Add to requests
    setRequests((prev) => [newRequest, ...prev]);
    setMessage("");

    // Start cooldown (5 minutes = 300 seconds)
    setCanSendMessage(false);
    setTimeLeft(300);

    // Show success message
    Alert.alert(
      "Request Sent! 🎵",
      "Your song request has been sent to the driver. You can send another request in 5 minutes."
    );

    // Simulate driver seeing the message after 30 seconds
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === newRequest.id ? { ...req, status: "seen" } : req
        )
      );
    }, 30000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "#9CA3AF";
      case "seen":
        return "#3B82F6";
      case "playing":
        return "#10B981";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Sent";
      case "seen":
        return "Seen by driver";
      case "playing":
        return "Now playing! 🎵";
      default:
        return "Sent";
    }
  };

  const formatCooldownTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Request Song</Text>
        <View style={styles.busInfo}>
          <Text style={styles.busOperator}>{busOperator}</Text>
          {busNumber && <Text style={styles.busNumber}>{busNumber}</Text>}
          {route && <Text style={styles.busRoute}>{route}</Text>}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Messages List */}
        <ScrollView
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {requests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No requests yet</Text>
            </View>
          ) : (
            requests.map((request) => (
              <View key={request.id} style={styles.messageCard}>
                <Text style={styles.messageText}>{request.message}</Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>
                    {formatTime(request.timestamp)}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(request.status) },
                    ]}
                  >
                    {getStatusText(request.status)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.textInput}
            placeholder="Request a song..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={200}
            editable={canSendMessage}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!canSendMessage || !message.trim()) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendRequest}
            disabled={!canSendMessage || !message.trim()}
          >
            <Text style={styles.sendButtonText}>
              {canSendMessage ? "Send" : `Wait ${formatCooldownTime()}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  busInfo: {
    gap: 2,
  },
  busOperator: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  busNumber: {
    fontSize: 14,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  busRoute: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#666",
  },
  messageCard: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 44,
    maxHeight: 100,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
