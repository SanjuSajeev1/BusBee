import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handlePhoneLogin = () => {
    router.push("/(auth)/phone-login");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🚌</Text>
          </View>
          <Text style={styles.brandText}>BusBee</Text>
          <Text style={styles.taglineText}>Premium bus travel, simplified</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.welcomeTitle}>Get started</Text>
          <Text style={styles.welcomeSubtitle}>
            Join thousands of commuters who choose BusBee for their daily
            commute
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handlePhoneLogin}
          >
            <Text style={styles.primaryButtonText}>
              Continue with phone number
            </Text>
          </TouchableOpacity>

          <Text style={styles.phoneInfo}>
            We'll send you a verification code via SMS
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 80,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logo: {
    fontSize: 32,
  },
  brandText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -1,
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  phoneInfo: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingTop: 32,
  },
  footerText: {
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
