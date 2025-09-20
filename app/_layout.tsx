import React, { useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import SplashScreen from "../src/components/SplashScreen";
import OnboardingCarousel from "../src/components/onboarding/OnboardingCarousel";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { BookingProvider } from "../src/context/BookingContext";

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoading, isAuthenticated, hasSeenOnboarding } = useAuth();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  // Show onboarding if user hasn't seen it yet
  if (!hasSeenOnboarding) {
    return <OnboardingCarousel />;
  }

  // Show main app navigation
  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(search)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
