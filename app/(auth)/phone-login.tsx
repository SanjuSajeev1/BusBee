import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validatePhoneNumber()) return;

    setLoading(true);
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to OTP verification screen
      router.push({
        pathname: "/(auth)/otp-verify",
        params: { phoneNumber: phoneNumber },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, "");

    // Format as XXX XXX XXXX (to match placeholder)
    if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
        10
      )}`;
    } else if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else {
      return cleaned;
    }
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9\s]/g, "");
    const formatted = formatPhoneNumber(numericText);
    setPhoneNumber(formatted);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Enter your phone</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+1</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="555 123 4567"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={12}
                autoFocus
                autoComplete="tel"
                textContentType="telephoneNumber"
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.disabledButton]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>
                {loading ? "Sending..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.linkText}>Terms</Text> and{" "}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 20,
    color: "#374151",
    fontWeight: "400",
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 32,
    paddingHorizontal: 16,
    height: 56,
  },
  countryCode: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    fontWeight: "400",
  },
  sendButton: {
    backgroundColor: "#111827",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
  },
  termsText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  linkText: {
    color: "#111827",
    fontWeight: "500",
  },
});
