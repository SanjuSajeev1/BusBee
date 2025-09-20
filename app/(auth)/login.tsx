import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate user data (in real app, this would come from API)
      const userData = {
        id: `user_${Date.now()}`,
        name: "John Doe", // In real app, get from API response
        email: formData.email,
        phone: "+1 (555) 123-4567", // In real app, get from API response
      };

      // Login user
      await login(userData);

      Alert.alert(
        "Welcome Back!",
        "You have successfully logged in to BusBee.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    router.push("/(auth)/signup");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon.",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient colors={["#1A73E8", "#4285F4"]} style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your BusBee account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#A0A0A0"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#A0A0A0"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={
                  loading ? ["#CCCCCC", "#AAAAAA"] : ["#FFFFFF", "#F8F9FA"]
                }
                style={styles.buttonGradient}
              >
                <Text
                  style={[
                    styles.loginButtonText,
                    loading && styles.disabledButtonText,
                  ]}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.2)",
                  "rgba(255, 255, 255, 0.1)",
                ]}
                style={styles.socialButtonGradient}
              >
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={goToSignup}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333333",
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    textDecorationLine: "underline",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A73E8",
  },
  disabledButtonText: {
    color: "#666666",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
    marginHorizontal: 16,
  },
  socialButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  socialButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupPromptText: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
});
