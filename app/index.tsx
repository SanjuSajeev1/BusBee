import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuth();

  // Don't redirect while loading
  if (isLoading) {
    return null;
  }

  // If user is authenticated, go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If user has seen onboarding, go to auth
  if (hasSeenOnboarding) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // This should not happen as onboarding is handled in _layout
  // But fallback to auth welcome
  return <Redirect href="/(auth)/welcome" />;
}
